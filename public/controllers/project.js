app.controller('project', function ($scope, $httpController, $http) {


  getProjects()

  function getProjects() {
    $httpController.getProjects(projects => {
      $scope.projects = projects;
      $scope.chosenProject = projects[0];
      $scope.getPriority = `priority ${$scope.chosenProject.priority.toLowerCase()}`
      for (let i = 0; i < $scope.projects.length; i++) $scope.getTasks(i);
    })
  }

  $scope.getTasks = function (i) {
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

  $scope.deleteProject = function (x) {
    $http({
      headers: {
        auth_key: 'a5f0d15d-cd12-4d33-8212-7ddd9f2cb6b8'
      },
      method: 'DELETE',
      url: '/project/' + x['_id']
    })
      .then(response => {
        getProjects()
      })
  }

})