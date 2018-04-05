const project = require('./project');
const controller = require('./../controllers/project');

const actions = ['add', 'build', 'create', 'list', 'show', 'remove', 'delete', 'edit'];
const actors = ['project', 'projects', 'task', 'tasks'];
const attributes = ['name', 'named', 'called', 'priority', 'deadline', 'project', 'description', 'about', 'user', 'change'];
const ignore = ['and', 'all', 'new', 'with', 'my', 'where', 'a', 'of', 'to', 'me', 'equal', 'equals', '=', 'is', 'the'];
// NÃO é necessário colocar todas as palavras no ignore (nem recomendado), ele é importante em alguns casos específicos

var projects = [];

function updateProjectsArray(cb=function(){}) {
    controller.list(1636208479780756, (err, obj) => {
        projects = obj;
        cb();
    });
}

updateProjectsArray(function() {

});

function solveQuot (i, words) {
    let acumulator = [];
    if (words[i].endsWith('"')) return [i, words[i].substring(1, words[i].length-1)];
    else acumulator.push(words[i].substring(1, words[i].length));
    for (i = i + 1; i < words.length; i++) {
        if (words[i].endsWith('"')) {
            acumulator.push(words[i].substring(0, words[i].length - 1))
            break;
        }
        acumulator.push(words[i]);
    }
    return [i, acumulator.join(' ')];
}

function isKeyword(word) {
    return actions.includes(word) || actors.includes(word) || attributes.includes(word);
}

function postProcess(obj) {
    // Iterar por objeto original e criar um novo corrigindo nomes dos atributos
    let obj2 = { };
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            // Aliases de name
            if (property === 'named' || property === 'called')
                obj2['name'] = obj[property];
            // Caso actor esteja no plural, remover último s
            else if (property === 'actor' && obj['actor'].endsWith('s'))
                obj2['actor'] = obj['actor'].substring(0, obj['actor'].length - 1); 
            else if (property === 'action' && (obj[property] === 'create' || obj[property] === 'build'))
                obj2['action'] = 'add';
            else if (property === 'action' && obj[property] === 'delete')
                obj2['action'] = 'remove';
            else if (property === 'about')
                obj2['description'] = obj[property];
            // No caso default, só inserir no novo objeto
            else obj2[property] = obj[property];
        }
    }
    return obj2;
}

function apply(obj, cb) {
    let understood = false;
    var obj2 = { };
    for (var property in obj) {
        if (obj.hasOwnProperty(property) && property != 'action' && property != 'actor') {
            obj2[property] = obj[property];
        }
    }
    obj2['user'] = 1636208479780756;
    if (obj['action'] === 'add' && obj['actor'] === 'project') {
        understood = true;
        controller.create(obj2, (result) => cb(result));
    }
    else if (obj['action'] === 'remove' && obj['actor'] === 'project') {
        understood = true;
        controller.removeByCond(obj2, (err, result) => cb(result));
    }
    else if ((obj['action'] === 'show' || obj['action'] === 'show') && obj['actor'] === 'project') {
        understood = true;
        controller.getByCond(obj2, (err, result) => cb(result));
    }
    return understood;
}

function existsProject(name, cb) {
    var found = false;
    for(var i = 0; i < projects.length; i++) {
        if (projects[i]['name'] === name) {
            found = true;
            break;
        }
    }
    return found;
}

const dec = {

    decode: (string, cb=()=>{}) => {
        console.log("Command: " + string);
        // Percorrer string e gerar objeto com o que deverá ser acessado do banco
        let words = string.split(" ");                       // Vetor de palavras
        let obj = { };                                       // Objeto que será retornado
        let expecting, temp, word, w, virgula=false, ac='';  // Variáveis auxiliares
        for (let i = 0; i < words.length; i++) {
            if (words[i].startsWith('"')) {
                // Se começar com aspas, colocar todo o conteúdo delas dentro de word
                let x = solveQuot(i, words);
                i = x[0];
                word = x[1];
            }
            else word = words[i]; // Se não, word será a palavra atual
            if (word.endsWith(',')) {
                // Remover vírgula da palavra, caso haja
                word = word.substring(0, word.length-1); 
                virgula = true;
            }
            if (expecting) {
                // Caso esteja esperando por algum atributo
                var eraseTemp = true, r = true;
                if (isKeyword(word) && temp) {
                    // Se vier palavra chave ao invés de um atributo, então utilizar último valor temporário
                    if (temp) {
                        obj[expecting] = temp;
                        r = false;
                    }
                } else {
                    if (ignore.includes(word) || virgula) {
                        // Se for palavra que deve ser ignorada, utilizar último valor temporário
                        // Se não houver nenhum, esperar pela próxima palavra
                        if (temp) obj[expecting] = temp;
                        else { eraseTemp = false; virgula = false; }
                    }
                    else {
                        // Neste caso, simplesmente atribuir ao objeto
                        // w é utilizado para atributos com mais de uma palavra
                        obj[expecting] = word;
                        w = expecting;
                    }
                }
                if (eraseTemp) {
                    temp = null;
                    expecting = null;
                    virgula = false;
                    if (r) continue;
                }
            }
            if (isKeyword(word)) {
                temp = null;
                ac = '';
            }
            if (ignore.includes(word)) ac = '';
            else if (!isKeyword(word)) {
                if (ac) ac += ' ' + word;
                else ac = word;
            }
            if (actions.includes(word) && !obj['action']) {
                obj['action'] = word;
                continue;
            }
            if (actors.includes(word) && !obj['actor']) {
                obj['actor'] = word;
                continue;
            }
            if (attributes.includes(word)) {
                expecting = word;
                continue;
            }
            if (!obj['name'] && existsProject(word)) {
                obj['name'] = word;
                obj['actor'] = 'project';
                continue;
            }
            if (!obj['name'] && existsProject(temp)) {
                obj['name'] = temp;
                obj['actor'] = 'project';
                continue;
            }
            if (!obj['name'] && existsProject(ac)) {
                obj['name'] = ac;
                obj['actor'] = 'project';
                continue;
            }
            if (ignore.includes(word) || isKeyword(word)) w = '';
            if (w) obj[w] += ' ' + word;
            else if (!ignore.includes(word)) temp = word;
        }
        if (expecting) obj[expecting] = temp;
        let result = postProcess(obj);
        console.log(result);
        console.log('----');
        if (apply(result, (result) => {
            updateProjectsArray();
            cb(result);
        })) { }
        else cb('Sorry, I did not understand your message');
    }

}

module.exports = dec;