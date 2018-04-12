import { isUrl } from '../utils/utils';
/*自定义--菜单*/
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import * as LoginService from '../services/menu';

var  menuData=[];
export default {
  namespace: 'menu',
  state: {},
  effects: {
  	//机构管理
    *fetch_organ({ payload }, { call, put }) {
       menuData = yield call(LoginService.get,'/api/menu/getEmployeeMenuList'); /*api/testData/antd/queryAntd  */
      console.log(menuData);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
      	console.log();
      	  dispatch({
						type: 'fetch_organ',
					});
      });
    },
  },
}


/*const menuData = [{
	name: '基础管理',
	icon: 'dashboard',
  	path: 'mana',
  	children: [{
   	 name: '角色管理',
   	 path: 'role',
   	 authority: 'user',
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
}];*/

function formatter(data, parentPath = '/', parentAuthority) {
	data=data.obj;
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
