import angular from 'angular'
import router from 'angular-route'
import material from 'angular-material'


const app = angular.module('willdo', [router, material]);
app.service('$httpController', ['$http', require('./services/httpController')])

app.controller('project' , ['$scope', '$http', '$httpController', require('./controllers/project')])
app.controller('calendar', ['$scope', '$httpController', require('./controllers/calendar')])
app.controller('task', ['$scope', '$httpController', require('./controllers/task')])
app.controller('projectTasks', ['$scope', '$routeParams', '$httpController', require('./controllers/projectTasks')])


app.config(['$routeProvider', require('./routes')]);
