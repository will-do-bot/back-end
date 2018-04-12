app.controller('calendar', function ($scope) {
    console.log('calendar');

    $scope.tasks = {
        name : "Tasks",
        tasks : [
            {
                name: 'Talk to the boss',
                description: 'Talk to the boss about TIS',
                priority: 'High'
            }
        ]
    }

    $scope.chosenTask = $scope.tasks.tasks[0]

    $scope.changeContent = function (task) {
        $scope.chosenTask = task
    }

    $scope.getPriority = function () {
        return "priority " + $scope.chosenTask.priority.toLowerCase()
    }

    $scope.getChosen = function(x){
        if($scope.chosenTask.name == x.name) return 'task selected'
        else return 'task'
    }

});
