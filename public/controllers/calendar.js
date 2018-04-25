app.controller('calendar', function ($scope, $httpController) {
    console.log('calendar');

    $scope.pad = function (number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    };

    let today = new Date();
    let dd = today.getDate();
    let mm =  $scope.pad(today.getMonth()+1, 2);
    let yyyy = today.getFullYear();

    $httpController.getTasks(tasks => {
        $scope.tasks = tasks;
        $scope.chosenTask = $scope.tasks[0];
    });

    $scope.diaAtual = dd+"/"+mm.padStart(2, '0')+"/"+yyyy;

    $scope.changeContent = function (task) {
        $scope.chosenTask = task
    };

    $scope.getPriority = function () {
        let resultado = "";
        if($scope.chosenTask)
            resultado = "priority " + $scope.chosenTask.priority.toLowerCase();
        return resultado;
    };

    $scope.getChosen = function(x){
        if($scope.chosenTask.name === x.name) return 'task selected'
        else return 'task'
    };

    $scope.changeContent = function (task) {
        $scope.chosenTask = task
    };

});
