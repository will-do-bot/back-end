module.exports = function ($routeProvider) {
  $routeProvider
      .when("/project", {
          template: require('./template/project.html'),
          controller: 'project',
          resolve: {
              'check': () => console.log('ha')
          }
      })
      .when("/task", {
          template: require('./template/task.html'),
          controller: 'task',
          resolve: {
              'check': () => console.log('ha')
          }
      })
      .when("/chart", {
          template: require('./template/chart.html'),
          controller: 'chart',
          resolve: {
              'check': () => console.log('ha')
          }
      })
      .when("/calendar", {
          template: require('./template/calendar.html'),
          controller: 'calendar',
          resolve: {
              'check': () => console.log('ha')
          }
      })
      .when("/project/:id", {
          template: require('./template/projectTasks.html'),
          controller: 'projectTasks',
          resolve: {
              'check': () => console.log('ha')
          }
      })
}