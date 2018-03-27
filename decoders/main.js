const project = require('./project');

const actions = ['add', 'list', 'show', 'remove', 'change'];
const actors = ['project', 'projects', 'task', 'tasks'];
const attributes = ['name', 'named', 'called', 'priority', 'deadline', 'project'];
const ignore = ['and', 'with']

function isKeyword(word) {
    return actions.includes(word) || actors.includes(word) || attributes.includes(word);
}

function postProcess(obj) {
    let obj2 = { };
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (property === 'named' || property === 'called')
                obj2['name'] = obj[property];
            else if (property === 'actor' && obj[property] === 'projects')
                obj2['actor'] = 'project'; 
            else obj2[property] = obj[property];
        }
    }
    return obj2;
}

module.exports = {

    // decode: (string) => {
    //     let words = string.split(" ");
    //     switch (words[1]) {
    //         case 'proj':
    //             return project.decode(words);
    //         default:
    //             return 'Sorry... I\'m WillDo';
    //     }
    // }

    decode: (string) => {
        string = string;
        let words = string.split(" ");
        let obj = { };
        let expecting, temp;
        let w;
        words.forEach((word, index) => {
            if (word.endsWith(',')) word = word.substring(0, word.length-1);
            if (expecting) {
                if (isKeyword(word)) {
                    if (temp) {
                        obj[expecting] = temp;
                    }
                } else {
                    if (ignore.includes(word)) obj[expecting] = temp;
                    else {
                        obj[expecting] = word;
                        w = expecting;
                    }
                }
                temp = null;
                expecting = null;
                return;
            }
            if (actions.includes(word) && !obj['action']) {
                obj['action'] = word;
                return;
            }
            if (actors.includes(word) && !obj['actor']) {
                obj['actor'] = word;
                return;
            }
            if (attributes.includes(word)) {
                expecting = word;
                return;
            }
            if (ignore.includes(word) || isKeyword(word)) w = '';
            if (w) obj[w] += ' ' + word;
            else temp = word;
        });
        if (expecting) obj[expecting] = temp;
        return postProcess(obj);
    }

}