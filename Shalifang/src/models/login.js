import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import * as LoginService from '../services/login';
export default {
  namespace: 'login',

  state: {
    status: undefined,
  },
	
  effects: {
    *login({ payload }, { call, put }) {
      // 发起请求
      const response = yield call(LoginService.get,'/api/manageLogin',payload);//fakeAccountLogin, payload
      console.log(response) ;
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if(response.status == "ok") {
//    	debugger;
        reloadAuthorized();
        yield put(routerRedux.push('/'));
        
        
      }else{
      	callback(response.data.res,response.data.resMsg);
      }
    },
    *logout(_, { call, put, select }) {
    	const response = yield call(LoginService.gets,'/api/manageLogout');
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
