/*import { query as queryUsers, queryCurrent } from '../services/user';*/
import { routerRedux } from 'dva/router';
import * as LoginService from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      //const response = yield call(queryUsers);
      const response =yield call(LoginService.get,'/api/employee/getOperator');//yield call(LoginService.get,'/api/maven/permission/user',payload);//读取用户信息接口
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ payload }, { call, put }) {
    	const  response1=yield call(LoginService.get,'/api/employee/getOperator');
    	 if(response1.res==234){
      	 yield put(routerRedux.push('/user/login'));
      }else{
      		const  response={
      		 	name: response1.obj.name,
			      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
			      userid: response1.obj.employeeId,
			      notifyCount: 12,
		      }
		      yield put({
			        type: 'saveCurrentUser',
			        payload: response,
			   	});
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
