/*自定义--基础管理*/
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import * as LoginService from '../services/basics';

export default {
  namespace: 'basics',
  state: {
    data: [],
  },

  effects: {
  	//机构管理
    *fetch_organ({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/org/slicedQueryOrg',payload); /*api/testData/antd/queryAntd  */
      yield put({
	        type: 'save',
	        payload: response.data.obj,
	    });
    },
    *fetch_organ_tree({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/org/getOrgTreeList');
    	callback(response.data.res,response.data.obj);
    },
    *fetchId_organ({ payload }, { call, put }) {//暂时无用
      const response = yield call(LoginService.get,'/api/org/getOrg',payload);
    	yield put({
	        type: 'save',
	       payload: response.data.obj,
	    });
    },
    *add_organ({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/org/insertOrg', payload);
      callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_organ',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
     *edit_organ({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/org/updateOrg', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_organ',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *edit_organ_state({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/org/updateOrgStates', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_organ',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
    *remove_organ({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/org/deleteOrgs', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({
      	type:'fetch_organ',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    
    //角色管理
    *fetch_role({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/role/slicedQueryRole',payload); 
    	yield put({
	        type: 'save',
	        payload: response.data.obj,
	    });
    },
    //角色管理 查询人员，选择机构 查询人员
    *getEmployeeListByRole({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/roleEmployee/getEmployeeListByRole', payload);
      callback(response.data.res,response.data.obj);
    },
    
    
    
    *add_role({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/role/insertRole', payload);
      callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_role',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    *edit_role({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/role/updateRole', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_role',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *edit_role_state({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/role/updateRoleStates', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_role',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *remove_role({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/role/deleteRoles', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({
      	type:'fetch_role',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    //配置权限
    *insertRoleMenu({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/roleMenu/insertRoleMenuList', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({
      	type:'fetch_role',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    //查看权限
    *insertRoleMenu({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/roleMenu/insertRoleMenuList', payload);//roleMenu/getMenuListByRoleId
   
      callback(response.data.res,response.data.resMsg);
      
    },
    
    //菜单管理
     *fetch_menu({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/menu/slicedQueryMenu',payload); 
    	yield put({
	        type: 'save',
	        payload: response.data.obj,
	    });
    },
    //菜单管理tree 上级菜单
    *fetch_menu_tree({ payload, callback }, { call, put }) {//菜单父级选择
      const response = yield call(LoginService.get,'/api/menu/getMenuTreeList');
      if(response.data.res==234){
        yield put(routerRedux.push('/user/login'));
      }else{
      	 callback(response.data.res,response.data.obj);
      }
    },
    //配置权限-查询菜单
    *fetch_menu_checktree({ payload, callback }, { call, put }) {//菜单父级选择
      const response = yield call(LoginService.get,'/api/menu/getMenuSelectTreeList',payload);
      if(response.data.res==234){
        yield put(routerRedux.push('/user/login'));
      }else{
      	 callback(response.data.res,response.data.obj);
      }
    },
    
    *add_menu({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/menu/insertMenu', payload);
      callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_menu',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    *edit_menu({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/menu/updateMenu', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_menu',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *edit_menu_state({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/menu/updateMenuStates', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_menu',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *remove_menu({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/menu/deleteMenus', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({
      	type:'fetch_menu',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    //人员管理
    //员工分页查询
    *fetch_user({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/getEmployeeList',payload); 
    	yield put({
	        type: 'save',
	        payload: response.data.obj,
	    });
    },
    //查询员工 id
    *fetchId_user({ payload ,callback}, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/getEmployee',payload);
    	callback(response.data.res,response.data.obj);
    },
    //根据组织机构查询人员
    *fetch_org_user({ payload,callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/getEmployeeList',payload); 
    	callback(response.data.res,response.data.obj);
    },
    //给角色分配员工 权限
    *fetch_org_userqx({ payload,callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/roleEmployee/insertRoleEmployeeList',payload); 
    	callback(response.data.res,response.data.resMsg);
    },
    
    //员工添加
    *add_user({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/insertEmployee', payload);
      callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_user',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    //员工信息修改
    *edit_user({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/updateEmployee', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_user',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *edit_user_state({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/updateStates', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_user',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     //员工批量删除
     *remove_user({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/employee/deleteEmployeeByIds', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({
      	type:'fetch_user',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    //上传附件
    *imgurl({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/attachment/upload', payload);
      callback(response.data.res,response.data.obj);
    },
    
    
    
     //学校管理
    *fetch_school({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/school/slicedQuerySchool',payload); 
    	yield put({
	        type: 'save',
	        payload: response.data.obj,
	    });
    },
    *fetchId_school({ payload ,callback}, { call, put }) {
      const response = yield call(LoginService.get,'/api/school/getSchool',payload);
    	callback(response.data.res,response.data.obj);
    },
    *add_school({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/school/insertSchool', payload);
      callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_school',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
    *edit_school({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/school/updateSchool', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_school',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *edit_school_state({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/school/updateSchoolStates', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({
      	type:'fetch_school',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
     },
     *remove_school({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/school/deleteSchools', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({
      	type:'fetch_school',
      	payload:{
     			pageIndex: 1,
					pageSize: 10
    		 }
     	});
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
