const project = require('./project');

const actions = ['add', 'list', 'show', 'remove', 'change'];
const actors = ['project', 'projects', 'task', 'tasks'];
const attributes = ['name', 'named', 'called', 'priority', 'deadline', 'project', 'description'];
const ignore = ['and', 'with', 'where', 'a', 'of', 'to', 'equal', 'equals', '=', 'is'];
// Não é necessário colocar todas as palavras no ignore, ele é importante em alguns casos específicos

function solveQuot (i, words) {
    let acumulator = [];
    acumulator.push(words[i].substring(1, words[i].length));
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
            // No caso default, só inserir no novo objeto
            else obj2[property] = obj[property];
        }
    }
    return obj2;
}

module.exports = {

    decode: (string) => {
        // Percorrer string e gerar objeto com o que deverá ser acessado do banco
        let words = string.split(" ");                 // Vetor de palavras
        let obj = { };                                 // Objeto que será retornado
        let expecting, temp, word, w, virgula=false;   // Variáveis auxiliares
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
                if (isKeyword(word)) {
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
                        else eraseTemp = false;
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
            if (ignore.includes(word) || isKeyword(word)) w = '';
            if (w) obj[w] += ' ' + word;
            else if (!ignore.includes(word)) temp = word;
        }
        if (expecting) obj[expecting] = temp;
        return postProcess(obj);
    }

}