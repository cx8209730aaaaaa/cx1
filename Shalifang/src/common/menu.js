import { isUrl } from '../utils/utils';

const menuData = [{
	name: '基础管理',
	icon: 'dashboard',
  	path: 'mana',
  	children: [{
   	 name: '角色管理',
   	 path: 'role',
  	},{
   	 name: '组织机构',
   	 path: 'organization',
   	 
  	},{
   	 name: '菜单管理',
   	 path: 'menu',
  	},{
   	 name: '人员管理',
   	 path: 'user',
  	}]
},
{
	name: '校区管理',
	icon: 'dashboard',
  	path: 'campus',
  	children: [{
   	 name: '学校管理',
   	 path: 'school',
  	},{
   	 name: '课程时间',
   	 path: 'course_time',
  	},{
   	 name: '教室',
   	 path: 'classroom',
  	},/*{
   	 name: '日志',
   	 path: 'operateLogList',
  	}*/]
},{
	name: '出席',
	icon: 'dashboard',
  	path: 'Attendance',
  	children: [{
  		name: '考勤',
   		path: 'attendance',
  	},{
   	 name: '上课记录',
   	 path: 'classRecord',
  	}]
},{
	name: '系统课程',
	icon: 'dashboard',
  	path: 'sys',
  	children: [{
   	 name: '单独课程-管理员',
   	 path: 'course',
  	},{
   	 name: '课程包-管理员',
   	 path: 'coursePage',
  	},{
   	 name: '单独课程-校长',
   	 path: 'course2',
  	},{
   	 name: '课程包-校长',
   	 path: 'coursePage2',
  	},{
   	 name: '预约',
   	 path: 'orderCourse',
  	},{
   	 name: '课表',
   	 path: 'syllabus',
  	},]
},{
	name: '网络课程',
	icon: 'dashboard',
  	path: 'webCourse',
  	children: [{
  		name: '活动规则',
   	 	path: 'activityRule',
  	},{
   	 	name: '活动',
   	 	path: 'activity',
  	},{
   	 	name: '文章',
   	 	path: 'article',
  	},{
   	 	name: '视频',
   	 	path: 'vdeo',
  	},{
   	 name: '班级',
   	 path: 'class',
  	},{
   	 name: '孩子查看',
   	 path: 'children',
  	},{
   	 name: '补课',
   	 path: 'makeupCourse',
  	},{
   	 name: '系统消息',
   	 path: 'msg',
  	},{
   	 name: '消费记录',
   	 path: 'priceHistory',
  	},{
   	 name: '充值记录',
   	 path: 'recharge',
   	   
  	},]//
}, /*{
  name: '账户',
  icon: 'user',
  path: 'user',
  authority: 'guest',
  children: [{
    name: '登录',
    path: 'login',
  }, {
    name: '注册',
    path: 'register',
  }, {
    name: '注册结果',
    path: 'register-result',
  }],
}*/];

function formatter(data, parentPath = '/', parentAuthority) {
	/*console.log(data+".."+parentAuthority)*/
	return data.map((item) => {
	    let { path } = item;
	    if (!isUrl(path)) {
	      path = parentPath + item.path;
	    }
	    const result = {
	      ...item,
	      path,
	      authority: item.authority || parentAuthority,
	    };
	    if (item.children) {
	      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
	    }
	    return result;
	});
}

export const getMenuData = () => formatter(menuData);
