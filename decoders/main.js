const project = require('./project');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

const actions = ['add', 'build', 'create', 'list', 'show', 'update', 'remove', 'delete', 'edit'];
const actors = ['project', 'projects', 'task', 'tasks'];
const attributes = ['name', 'named', 'called', 'priority', 'deadline', 'project', 'description', 'about', 'user', 'change', '_id'];
const ignore = ['and', 'all', 'in', 'new', 'with', 'my', 'where', 'a', 'of', 'to', 'me', 'equal', 'equals', '=', 'is', 'the'];
// NÃO é necessário colocar todas as palavras no ignore (nem recomendado), ele é importante em alguns casos específicos

var projects = [];

function updateProjectsArray(cb=function(){}) {
    controllerProject.list(1636208479780756, (err, obj) => {
        projects = obj;
        cb();
    });
}

updateProjectsArray(function() { dec.decode('create task update bot in willdo description "não usei aspas no update bot" priority high') });

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
            else if (property === '_id')
                obj2['id'] = obj[property];
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
    if (obj['action'] === 'add') {
        understood = true;
        if (obj['actor'] === 'project') controllerProject.create(obj2, (result) => cb(result));
        else if (obj['actor'] === 'task') {
            controllerProject.getByCond({'name' : obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['_id'];
                controllerTask.create(obj2, (result) => cb(result));
            })
        } else understood = false;
    }
    else if (obj['action'] === 'remove') {
        understood = true;
        if (obj['actor'] === 'project') controllerProject.removeByCond(obj2, (err, result) => cb(result));
        else if (obj['actor'] === 'task') {
            controllerProject.getByCond({'name': obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['_id'];
                controllerTask.remove(obj2, (result) => cb(result));
            })
        } else understood = false;
    }
    else if (obj['action'] === 'list' || obj['action'] === 'show') {
        understood = true;
        if (obj['actor'] === 'project') controllerProject.getByCond(obj2, (err, result) => cb(result));
        else if (obj['actor'] === 'task') {
            controllerProject.getByCond({'name': obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['_id'];
                controllerTask.getByCond(obj2, (result) => cb(result));
            })
        } else understood = false;
    }
    else if (obj['action'] === 'update') {
        understood = true;
        if (obj['actor'] === 'project') controllerProject.updateByCond({'name':obj['project']}, obj2, (err, result) => cb(result));
        else if (obj['actor'] === 'task') {
            controllerProject.getByCond({'name': obj['project'] }, (err, res) => {
                obj2['project'] = res[0]['_id'];
                controllerTask.updateByCond({'name':obj['task']}, obj2, (result) => cb(result));
            })
        } else understood = false;
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
        let words = string.toLowerCase().split(" ");         // Vetor de palavras
        let obj = { };                                       // Objeto que será retornado
        let expecting, temp, word, w, virgula=false, ac='';  // Variáveis auxiliares
        let lendoName = false;
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
            if (isKeyword(word)) {
                temp = null;
                ac = '';
                if (lendoName)
                    lendoName = false;
            }
            if (ignore.includes(word)) {
                ac = '';
                if (lendoName)
                    lendoName = false;
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
            else {
                if (lendoName) {
                    if (obj['action'] === 'update') {
                        if (obj[obj['actor']]) obj[obj['actor']] += ' ' + word;
                        else obj[obj['actor']] = word;
                    } else {
                        if (obj['name']) obj['name'] += ' ' + word;
                        else obj['name'] = word;
                    }
                }
                if (!isKeyword(word)) {
                    if (ac) ac += ' ' + word;
                    else ac = word;
                }
            }
            if (actions.includes(word) && !obj['action']) {
                obj['action'] = word;
                continue;
            }
            if (actors.includes(word) && !obj['actor']) {
                obj['actor'] = word;
                if (!isKeyword(words[i+1]) && !ignore.includes(words[i+1]))
                    lendoName = true;
                continue;
            }
            if (attributes.includes(word)) {
                expecting = word;
                continue;
            }
            if (existsProject(word)) {
                if (!obj['actor']) { 
                    obj['actor'] = 'project';
                    if (obj['action'] === 'update')
                        obj['project'] = word;
                    else obj['name'] = word;
                }
                else obj['project'] = word;
                continue;
            }
            if (existsProject(temp)) {
                if (!obj['name']) { 
                    obj['actor'] = 'project';
                    if (obj['action'] === 'update')
                        obj['project'] = temp;
                    else obj['name'] = temp;
                }
                else obj['project'] = temp;
                continue;
            }
            if (existsProject(ac)) {
                if (!obj['name']) { 
                    obj['actor'] = 'project';
                    if (obj['action'] === 'update')
                        obj['project'] = ac;
                    else obj['name'] = ac;
                }
                else obj['project'] = ac;
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