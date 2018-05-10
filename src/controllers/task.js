
module.exports = function ($scope, $httpController) {
  getTask()
  function getTask() {
    console.log('getting tasks')
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
    let c = 'task';
    if (x.finished) c += ' finished';
    if ($scope.chosenTask.name == x.name) c += ' selected'
    return c;
  }

  $scope.deleteTask = function (id) {
    $httpController.deleteTask(id, response => {
      getTask()
    })

  }

  $scope.showCreateTask = function () {
    $scope.showAddTask = true
    $scope.updateButton = false
    $scope.createButton = true
    $scope.subTitleTask = 'Create Task'
    $scope.selectProject = true
  }
  $scope.showUpdateTask = function (task) {
    $scope.showAddTask = true
    $scope.updateButton = true
    $scope.createButton = false
    $scope.subTitleTask = 'Update Task'
    $scope.selectProject = false
  }


  $scope.cancelTask = function () {
    $scope.showAddTask = !$scope.showAddTask
  }

  $scope.addTask = function (task) {
    if (task.startDate) {
      task.startDate.setHours(0);
      task.startDate.setMinutes(1);
    }
    if (task.deadline) {
      task.deadline.setHours(23);
      task.deadline.setMinutes(59);
    }
    console.log(task);
    $httpController.setTask(task, response => {
      console.alert("Tarefa " + response.name + " criada com sucesso!");
    })
    $scope.showAddTask = !$scope.showAddTask
  }

  $scope.updateTask = function (task, taskId) {
    $httpController.updateTask(task, taskId, response => {
      console.log(response)
    })
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

}
