app.controller('task', function ($scope, $httpController) {


  getTask()
  function getTask() {
    $httpController.getTasks(tasks => {
      console.log(tasks)
      $scope.tasks = tasks
      $scope.tasks.forEach(element => {
        $httpController.getDays(element._id, resp => {
          element.days = resp.diffDays
        })
      });
      $scope.chosenTask = $scope.tasks[0]
    })

  }

  $httpController.getProjects(projects => {
    $scope.projects = projects
  })




  $scope.changeContent = function (task) {
    $scope.chosenTask = task

  }

  $scope.getPriority = function () {
    return "priority " + $scope.chosenTask.priority.toLowerCase()
  }

  $scope.showAddTask = false

  $scope.getChosen = function (x) {
    if ($scope.chosenTask.name == x.name) return 'task selected'
    else return 'task'
  }

  $scope.deleteTask = function (id) {
    console.log(id)
    $httpController.deleteTask(id, response => {
      $httpController.getTasks(response => {
        getTask()
      })
    })

  }
  $scope.cancelTask = function () {
    $scope.showAddTask = !$scope.showAddTask
  }
  $scope.addTask = function (task) {
    $httpController.setTask(task, response => {
      console.alert("Tarefa " + response.name + " criada com sucesso!");
    })
    $scope.showAddTask = !$scope.showAddTask
  }

  $scope.startTask = function (id) {
    $httpController.startTask(id, response => {
      console.log(response)
    })
  }
  $scope.pauseTask = function (id) {
    $httpController.pauseTask(id, response => {
      console.log(response)
    })
  }
  $scope.finishTask = function (id) {
    $httpController.finishTask(id, response => {
      console.log(response)
    })
  }

})