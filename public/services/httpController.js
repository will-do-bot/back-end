const auth_key = "eb016aa2-d250-47b1-b715-2714666fcb25";

app.service('$httpController', ['$http', function($http) {
  this.getProjects = function (cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/project'
    })
    .then(response => cb(response.data))
  }

  this.getTasksOfProject = function (id, cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/task/project/' + id
    })
    .then(response => cb(response.data))
  }

  this.getProjectById = function (id, cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/project/' + id
    })
    .then(response => cb(response.data))
  }

  this.getTasks = function (cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/task/'
    })
    .then(response => {
      cb(response.data)
    })
  }

  this.setTask = function(task, cb){
    $http({
      headers: {
        auth_key: auth_key,
        "Content-Type": "application/json"  
      },
      data: task,
      method: 'POST',
      url: '/task/'
    })
    .then(response => {
      task(response.data)
    })  
  }

  this.startTask = function(id){
    $http({
      headers: {
        auth_key: auth_key,
        "Content-Type": "application/json"  
      },
      method: 'POST',
      url: '/task/start/'+ id
    })
    .then(response => {
      task(response.data)
    })  
  }

  this.pauseTask = function(id){
    $http({
      headers: {
        auth_key: auth_key,
        "Content-Type": "application/json"  
      },
      method: 'POST',
      url: '/task/pause/'+ id
    })
    .then(response => {
      task(response.data)
    })  
  }

  this.finishTask = function(id){
    $http({
      headers: {
        auth_key: auth_key,
        "Content-Type": "application/json"  
      },
      method: 'POST',
      url: '/task/finish/'+ id
    })
    .then(response => {
      task(response.data)
    })  
  }

  this.deleteTask = function(id){
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'DELETE',
      url: '/task/' + id
    })
      .then(response => {
        response
      })
  }

  this.setProject = function(project, cb){
    $http({
      headers: {
        auth_key: auth_key,
        "Content-Type": "application/json"  
      },
      data: project,
      method: 'POST',
      url: '/project'
    })
    .then(response => {
      cb(response.data)
    })  
  }

  this.getDays = function (task, cb) {
    $http({
      headers: {
        auth_key: auth_key,
        "Content-Type": "application/json"  
      },
      data: { },
      method: 'POST',
      url: '/allTime'
    })
    .then(response => {
      cb(response.data)
    })  
  }
 }])