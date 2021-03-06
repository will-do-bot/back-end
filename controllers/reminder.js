const schedule = require('node-schedule');
const horario = { hour: 11, minute:00 };
const taskController = require('./../controllers/task');

module.exports = function(userID) {
    console.log("The user " + userID + " will be reminded");

    var j = schedule.scheduleJob(horario, function(){
        taskController.getByCond({}, (err, tasks) => {
            if (tasks[0] && !tasks[0]['finished']) {
                let message = "Hello, user.. We suggest you to do now the task: " + tasks[0]['name'];
                require('./../controllers/facebook').sendMessage(userID, message);
            }
        })
        
    });
}