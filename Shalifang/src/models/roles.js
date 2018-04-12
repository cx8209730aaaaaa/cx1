import { routerRedux } from 'dva/router';
import * as LoginService from '../services/roles';

var roles=[];

export default {
  namespace: 'roles',
  state: {
    list: [],
    currentUser: {},
  },

  effects: {
  	//角色
    *fetch_roles({ payload }, { call, put }) {
      roles = yield call(LoginService.get,'/api/role/getRoleName'); /*api/testData/antd/queryAntd  */
      yield put({
        type: 'saveCurrentUser',
        payload: response,
			});
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
      	console.log(pathname);
      	  dispatch({
						type: 'fetch_roles',
					});
      });
    },
  },
};






