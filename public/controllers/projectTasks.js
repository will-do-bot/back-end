app.controller('projectTasks', function ($scope, $routeParams, $httpController){
  $httpController.getTasksOfProject($routeParams.id, tasks => {
    $scope.tasks = tasks
    $scope.chosenTask = tasks[0]
    $httpController.getProjectById($routeParams.id, project => {
      $scope.project = project
    })
  })

  $scope.changeContent = function (x) {
    $scope.chosenTask = x
  }

  $scope.getChosen = function (x) {
    if ($scope.chosenTask.name == x.name) return 'task selected'
    else return 'task'
  }
})