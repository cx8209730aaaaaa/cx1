import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    /*新建 
     * 
     * 基础 管理*/
   	//角色管理
 	 	'/mana/role': {
      component: dynamicWrapper(app, [], () => import('../routes/Mana/Role')),
    },
     //组织机构
    '/mana/organization': {
      component: dynamicWrapper(app, [], () => import('../routes/Mana/Organization')),
    },
    //菜单管理
    '/mana/menu': {
      component: dynamicWrapper(app, [], () => import('../routes/Mana/Menu')),
    },
    //人员管理
    '/mana/user': {
      component: dynamicWrapper(app, [], () => import('../routes/Mana/User')),
    },
    
    
    //校区管理
     //学校管理
    '/campus/school': {
      component: dynamicWrapper(app, [], () => import('../routes/Campus/School')),
    },
   
   
    
    //课程时间安排
    '/campus/course_time': {
      component: dynamicWrapper(app, [], () => import('../routes/Campus/Course_time')),
    },
    //教室
    '/campus/classroom': {
      component: dynamicWrapper(app, [], () => import('../routes/Campus/Classroom')),
    },
    
    
   /* //查询日志
    '/campus/operateLogList': {
      component: dynamicWrapper(app, [], () => import('../routes/Campus/OperateLogList')),
    },*/
    
    
    //出席
    //考勤记录
    '/attendance/attendance': {
      component: dynamicWrapper(app, [], () => import('../routes/Attendance/Attendance')),
    },
     //上课记录
    '/attendance/classRecord': {
      component: dynamicWrapper(app, [], () => import('../routes/Attendance/ClassRecord')),
    },
    
    //系统课程
     //课程-admin
    '/sys/course': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemCourse/Course')),
    },
    //课程包-admin
    '/sys/coursePage': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemCourse/CoursePage')),
    },
    //课程-校长  
    '/sys/course2': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemCourse/Course2')),
    },
    //课程包-校长  
    '/sys/coursePage2': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemCourse/CoursePage2')),
    },
    //预约
     '/sys/orderCourse': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemCourse/OrderCourse')),
    },
    //课表
    '/sys/syllabus': {
      component: dynamicWrapper(app, [], () => import('../routes/SystemCourse/Syllabus')),
    },
    
    //网络课程
    
    //活动规则
    '/webCourse/activityRule': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/ActivityRule')),
    },
    //活动
    '/webCourse/activity': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Activity')),
    },
     //文章
    '/webCourse/article': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Article')),
    },
     //视频
    '/webCourse/vdeo': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Video')),
    },
    //班级
    '/webCourse/class': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Class')),
    },
     //孩子
    '/webCourse/children': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Children')),
    },
     //补课信息
    '/webCourse/makeupCourse': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/MakeupCourse')),
    },
     //系统消息
    '/webCourse/msg': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Message')),
    },
    //消费记录
    '/webCourse/priceHistory': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/PriceHistory')),
    },
    //充值记录
    '/webCourse/recharge': {
      component: dynamicWrapper(app, [], () => import('../routes/WebCourse/Recharge')),
    },
   
   
    
    //用户
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
