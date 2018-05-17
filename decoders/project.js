const main = require('./main');
const controllerProject = require('./../controllers/project');
const controllerTask = require('./../controllers/task');

const facebook_id = "2234224289938329";

function fix_date(date) {
    if (date != undefined) return "Not defined";
    date = new Date(date);
    let dia, mes, ano;
    dia = date.getDate();
    mes = date.getMonth();
    ano = date.getFullYear();
    hora = date.getHours();
    minutos = date.getMinutes();
    return dia + "/" + mes + "/" + ano + " - " + hora + "h" + minutos;
}

module.exports = {

    /**
     * Realiza operação desejada pelo usuário
     * Recebe o objeto com a ação a ser realizada e o objeto a ser utilizado no controller
     */
    apply: function (obj, obj2, cb) {
        // Nome do projeto será igual ao atributo project, caso haja
        if (!obj2['name'] && obj['project']) obj2['name'] = obj['project'];

        // Identificando a ação que o usuário deseja realizar
        switch (obj['action']) {
            case 'add':
                controllerProject.create(obj2, { facebook_id: facebook_id }, (result, err) => {
                    if (!err) result = "Project created!";
                    cb(err, result);
                });
                break;
            case 'remove':
                controllerProject.remove(obj2['_id'],(result) => {
                    if (result.v == 1) {
                        cb(result.err, null)
                    } else {
                        cb(null, result.success)
                    }
                })
                break;
            case 'list':
            case 'show':
                controllerProject.getByCond(obj2, (err, result) => {
                    if (result && result.length === 0) err = "Project not found";
                    else if (result.length > 0) {
                        let num_registro = 1;

                        var dados = "Projects found (" + result.length + "):\r\n\r\n";
                        console.log("PROJECTS FOUND (" + result.length + ")")

                        // ARRUMAR MENSAGEM DE `FINISHED DATE` e `FINISH UNTIL`
                        for (let pos in result) {
                            console.log(result);
                            dados += "Project (" + (num_registro++) + ")\r\n"
                                + "Name: \'" + result[pos].name + "\'\r\n"
                                + "Description: " + ((result[pos].description == undefined || result[pos].description.length == 0) ? 'No description' : "\'" + result[pos].description + "\'") + "\r\n"
                                + "Priority: " + result[pos].priority + "\r\n"
                                + "Billable:  " + result[pos].billable + "\r\n"
                                + ((result[pos].billable) ? "Cost: " + result[pos].cost + "\r\n" : "");
                            var date = ""+result[pos].created
                            dados += "Created in: " + fix_date(date) + "\r\n"
                            date = ""+result[pos].deadline
                            dados += "Finish until: " + fix_date(date) + "\r\n\r\n";
                        }
                    }
                    cb(err, dados);
                });
                break;
            case 'update':
                controllerProject.updateByCond({ 'name': obj['project'] }, obj2, (err, result) => {
                    if (result && result.n === 0) err = "Project not found?";
                    else if (result.n > 0) result = "Project updated!";
                    cb(err, result);
                });
                break;
            default:
                cb("No action found!", null);
                break;
        }
    }
};
