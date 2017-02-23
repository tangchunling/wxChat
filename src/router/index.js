import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: require('views/Login')
    },{
      path: '/main',
      component: require('components/Main'),
      children: [
        {
          path: '/userlist',
          component: require('views/userlist')
        },
        {
          path: '/sourcelist',
          component: require('views/SourceList')
        },
        {
          path: '/addsource',
          component: require('views/AddSource')
        },
        {
          path: '/updatesource',
          component: require('views/UpdateSource')
        },
        {
          path: '/sendsetting',
          component: require('views/SendSetting')
        },
        {
          path: '/sendrecord',
          component: require('views/SendRecord')
        },
        {
          path: '/usermanage',
          component: require('views/UserManege')
        },
        {
          path: '/usersetting',
          component: require('views/UserSetting')
        },
        {
          path: '/addrobot',
          component: require('views/AddRobot')
        },
        {
          path: '/robotlist',
          component: require('views/RobotList')
        },
        {
          path: '/allrobotlist',
          component: require('views/AllRobotlist')
        },
        {
          path: '/lowerlist',
          component: require('views/LowerList')
        },
        {
          path: '/loginrobot',
          component: require('views/LoginRobot')
        },
        {
          path: '/taglist',
          component: require('views/TagList')
        },
        {
          path: '/taguserlist',
          component: require('views/TagUserlist')
        }
      ]
    },
    {
      path: '/sendmessage',
      component: require('views/SendMessage')
    }
  ]
})
