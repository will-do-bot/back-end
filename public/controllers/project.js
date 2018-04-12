app.controller('project', function ($scope, $httpController) {

  $httpController.getProjects(projects => {
    $scope.projects = projects;
    $scope.chosenProject = projects[0];
    $scope.getPriority = `priority ${$scope.chosenProject.priority.toLowerCase()}`
    for (let i = 0; i < $scope.projects.length; i++) $scope.getTasks(i);
    
  })

  $scope.getTasks = function (i){
    $httpController.getTasksOfProject($scope.projects[i]['_id'], tasks => {
      $scope.projects[i].tasks = tasks;
    })
  }

  $scope.changeContent = (x) => {
    $scope.chosenProject = x
    $scope.getPriority = `priority ${$scope.chosenProject.priority.toLowerCase()}`
  }

  $scope.getChosen = function (x) {
    if ($scope.chosenProject.name == x.name) return 'task selected'
    else return 'task'
  }
  }

  

})