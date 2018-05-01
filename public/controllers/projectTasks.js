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
    $scope.getPriority = `priority ${$scope.chosenProject.priority.toLowerCase()}`
  }

  $scope.getPriority = function () {
    return "priority " + $scope.chosenTask.priority.toLowerCase()
  }


  $scope.getChosen = function (x) {
    let c = 'task';
    if (x.finished) c += ' finished';
    if ($scope.chosenTask.name == x.name) c += ' selected'
    return c;
  }
})