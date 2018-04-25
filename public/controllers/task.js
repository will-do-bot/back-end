app.controller('task', function ($scope, $httpController) {

  $httpController.getTasks(tasks => {
    console.log(tasks)
    $scope.tasks = tasks
    $scope.chosenTask = $scope.tasks[0]
  })

  $scope.changeContent = function (task) {
    $scope.chosenTask = task
    
  }

  $scope.getPriority = function () {
    return "priority " + $scope.chosenTask.priority.toLowerCase()
  }
  
  $scope.teste = false

  $scope.getChosen = function (x) {
    if ($scope.chosenTask.name == x.name) return 'task selected'
    else return 'task'
  }

  $scope.addTask = function(){
    console.log("teste")
  }

})