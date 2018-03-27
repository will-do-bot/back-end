const main = require('./main');

// const palavrasChave = ['proj', 'task', 'tasks', 'add', 'list', 'show', 'remove', 'nme', 'desc'];

// function findParams (words) {
//     let actualParam = '';
//     let params = [];
//     for (let i = 0; i < words.length; i++) {
//         if (!palavrasChave.includes(words[i])) {
//             let x = solveQuot(i, words);
//             i = x[0] - 1;
//             params[actualParam] = x[1];
//         }
//         else actualParam = words[i];
//     }
//     return params;
// }

// function solveQuot (i, words) {
//     let substring = [];
//     for (; i < words.length; i++) {
//         if (palavrasChave.includes(words[i]))
//             break;
//         substring.push(words[i]);
//     }
//     return [i, substring.join(' ')];
// }

// var myObj = {

//     decode: (words) => {
//         switch (words[0]) {
//             case 'add':
//                 obj = findParams(words);
//                 console.log("Adicionando projeto");
//                 console.log(obj);
//                 break;
//             case 'list':
//                 console.log("Listando projetos")
//                 break;
//             case 'show':
//                 obj = findParams(words);
//                 console.log("Exibindo projetos que satisfaçam condições: ");
//                 console.log(obj);
//             case 'delete':
//                 obj = findParams(words);
//                 console.log("Removendo projetos que satisfaçam condições: ");
//                 console.log(obj);
//         }
//     }

// };

module.exports = { };