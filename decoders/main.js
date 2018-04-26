const project = require('./project');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');
const decoderProject = require('./project');
const decoderTask = require('./task');

const actions = ['add', 'build', 'create', 'list', 'show', 'remove', 'delete', 'edit', 'update', 'start', 'pause', 'finish'];
const actors = ['project', 'projects', 'task', 'tasks'];
const attributes = ['name', 'named', 'called', 'priority', 'deadline', 'project', 'description', 'about', 'user', 'change', '_id', 'billable'];
const ignore = ['and', 'all', 'in', 'new', 'with', 'where', 'of', 'to', 'equal', 'equals', '=', 'is', 'the'];

var projects = [];

const user = "5ae07f69e0e69200143f9030";

/**
 * Atualiza lista de projetos. Esta lista é utilizada para verificar se existe projeto com determinado nome
 */

function updateProjectsArray(cb) {
    controllerProject.list(user, (err, obj) => {
        projects = obj;
        if (cb) cb();
    });
}

updateProjectsArray( function () {  } );

/**
 * Resolve aspas
 * Recebe por parâmetro um vetor de palavras e a posição em que começam as aspas
 * Retorna a posição em que termina, e uma string com as aspas resolvidas
 */
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

/**
 * Verifica se palavra é reservada para algum comando
 */
function isKeyword(word) {
    return actions.includes(word) || actors.includes(word) || attributes.includes(word);
}

/**
 * Verifica se existe um projeto com o nome passado por parâmetro
 */
function existsProject(name) {
    var found = false;
    if (!projects) return false;
    for(var i = 0; i < projects.length; i++) {
        if (projects[i]['name'] === name) {
            found = true;
            break;
        }
    }
    return found;
}

/**
 * Itera por objeto original gerado no decoder e cria um novo corrigindo nomes dos atributos
 */
function postProcess(obj) {
    let obj2 = { };  // Objeto que será retornado
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            // Aliases de name
            if (property === 'named' || property === 'called')
                obj2['name'] = obj[property];
            // Aliases de add
            else if (property === 'action' && (obj[property] === 'create' || obj[property] === 'build'))
                obj2['action'] = 'add';
            // Aliases de update
            else if (property === 'action' && obj[property] === 'edit')
                obj2['action'] = 'update';
            // Aliases de remove
            else if (property === 'action' && obj[property] === 'delete')
                obj2['action'] = 'remove';
            // Aliases de description
            else if (property === 'about')
                obj2['description'] = obj[property];
            // Aliases de id
            else if (property === '_id')
                obj2['id'] = obj[property];
            // Caso actor esteja no plural, remover último s
            else if (property === 'actor' && obj['actor'].endsWith('s'))
                obj2['actor'] = obj['actor'].substring(0, obj['actor'].length - 1); 
            // Caso tenha sido passado atributo name, mudar para o actor. Exemplo: actor: 'project', project: 'este nome'
            else if (property === 'name' && !obj[obj['actor']])
                obj2[obj['actor']] = obj['name'];
            else if (property === 'deadline' || property === 'startDate')
                obj2[property] = new Date(obj[property]);
            // No caso default, só inserir no novo objeto
            else obj2[property] = obj[property];
        }
    }
    return obj2;
}

/**
 * Recebe ação gerada pelo decoder e encontra responsável por realizá-la
 */
function apply(obj, cb) {
    let understood = false;  // Define se bot entendeu a entrada do usuário
    var obj2 = { };          // Objeto que será enviado criado/buscado/editado/removido
    
    // Obj é o que foi compreendido da mensagem do usuário, a ação a ser realizada
    // Enquanto Obj2 é o objeto enviado para ser criado ou comparado
    for (var property in obj) {
        if (obj.hasOwnProperty(property) && property != 'action' && property != 'actor' && property != obj['actor']) {
            obj2[property] = obj[property];
        }
    }
    
    // Usuário por enquanto é este
    obj2['user'] = user;
    
    // Verifica quem chamar para executar ação
    switch (obj['actor']) {
        case 'project':
            understood = decoderProject.apply(obj, obj2, cb);
            break;
        case 'task':
            understood = decoderTask.apply(obj, obj2, cb);
            break;
        default:
            cb('Fala direito o que você quer e para de encher o saco', null);
            break;
    }
}

const dec = {

    /**
     * Entender string e retornar objeto com a ação a ser realizada.
     */
    decode: (string, cb) => {
        console.log("Command: " + string);
        
        // Separando palavras em vetor de strings
        let words = string.toLowerCase().split(" ");
        
        // Definição de variáveis
        let obj = { };                               // Objeto que será retornado
        let expecting;                               // Atributo que se espera receber em seguida
        let temp;                                    // Conjunto de palavras não compreendidas
        let word;                                    // Recebe a palavra atual no comando de repetição
        let lendoName = false;                       // Define se está esperando pelo nome de um projeto
        
        // Iterando pelas palavras da string
        for (let i = 0; i < words.length; i++) {
            
            // Caso possua aspas
            if (words[i].startsWith('"')) {
                // Colocar todo o conteúdo das aspas dentro de word e avançar para quando elas acabam
                let x = solveQuot(i, words);
                i = x[0];
                word = x[1];
            }
            else { 
                // Se não, word será a palavra atual
                word = words[i]; 
            }
            
            // Remover vírgula da palavra, caso haja
            if (word.endsWith(','))
                word = word.substring(0, word.length-1);
                
            // Caso palavra atual seja uma palavra chave
            if (isKeyword(word)) {
                // Resetar variáveis temporárias
                temp = null;
                if (lendoName) lendoName = false;
            }
            
            // Caso esta palavra deva ser ignorada
            if (ignore.includes(word)) {
                // Resetar variáveis temporárias
                temp = null;
                if (lendoName) lendoName = false;
            }
            
            // Caso esteja esperando por algum atributo
            if (expecting) {
                var eraseTemp = false;  // Define se as variáveis temporárias devem ser resetadas
                var r = false;          // Define se deverá pular para próxima palavra
                
                // Caso seja palavra a ser ignorada ao final de um atributo
                if (ignore.includes(word) && obj[expecting]) {
                    // Parar de ler atributo e pular para próxima palavra
                    eraseTemp = true;
                    r = true;
                }
                else if (isKeyword(word)) {
                    // Parar de ler atributo, porém esperar para analisar essa palavra-chave
                    eraseTemp = true;
                }
                // Caso esta palavra esteja livre
                else {
                    // Atribuí-la e pular para próxima palavra
                    if (obj[expecting]) obj[expecting] += ' ' + word;
                    else obj[expecting] = word;
                    r = true;
                    
                    // Caso esta seja a última palavra, parar de esperar atributo
                    if (i === words.length - 1)
                        eraseTemp = true;
                }
                
                if (eraseTemp) {
                    temp = null;
                    expecting = null;
                }
                if (r) continue;
            }
            else {
                // Não está esperando por nenhum atributo
            
                // Se palavra atual for o nome de um projeto existente
                if (existsProject(word)) {
                    // Se ainda não tiver definido ator, ele será projeto
                    if (!obj['actor']) obj['actor'] = 'project';
                    // Projeto será a palavra atual
                    obj['project'] = word;
                    continue;
                }
                
                // Se valor temporário for o nome de um projeto existente
                if (existsProject(temp)) {
                    // Se ainda não tiver definido ator, ele será projeto
                    if (!obj['actor']) obj['actor'] = 'project';
                    // Projeto será o valor temporário
                    obj['project'] = temp;
                    continue;
                }
                
                // Se estiver esperando pelo nome
                if (lendoName) {
                    // Palavra atual irá se referir ao ator
                    // Exemplo:  actor: 'project', project: 'este nome'
                    // Exemplo2: actor: 'task',    task: 'este nome'
                    if (obj[obj['actor']]) obj[obj['actor']] += ' ' + word;
                    else obj[obj['actor']] = word;
                }
                
                // Se for palavra chave
                if (isKeyword(word)) {
                    // Resetar valor temporário
                    temp = null;
                }
                else if (!ignore.includes(word)){   
                    // Atribuir a valor temporário
                    if (temp) temp += ' ' + word;
                    else temp = word;
                }
            }
            // Caso palavra atual seja uma ação. Ex: 'create'
            if (actions.includes(word) && !obj['action']) {
                obj['action'] = word;
                continue;
            }
            
            // Caso palavra atual seja um ator. Ex: 'project'
            if (actors.includes(word) && !obj['actor']) {
                obj['actor'] = word;
                // Esperar por nome depois do ator
                if (!isKeyword(words[i+1]) && !ignore.includes(words[i+1]))
                    lendoName = true;
                continue;
            }
            
            // Se palavra atual for um atributo. Ex: 'description'
            if (attributes.includes(word)) {
                expecting = word;
                continue;
            }
            
        }
        
        if (expecting) obj[expecting] = temp;
        let result = postProcess(obj);
        console.log(result);
        console.log('----');
        apply(result, (err, result) => {
            updateProjectsArray();
            if (cb) {
                if (err) cb(err);
                else cb(result);
            }
        })
    }

}

module.exports = dec;