/*自定义--出席*/
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import * as LoginService from '../services/basics';

export default {
  namespace: 'attendance',
  state: {
    data: [],
  },

  effects: {
  	//考勤记录
  	//查询考勤
    *fetch_attendanceList({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/attendance/getAttendanceList',payload);
      yield put({type: 'save',payload: response.data.obj });
    },
    //Id 查询
    *findId_attendance({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/attendance/getAttendance');
    	callback(response.data.res,response.data.obj);
    },
    //新增考勤
    *add_attendance({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/attendance/insertAttendance',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_attendanceList'});
    },
    //编辑考勤
    *edit_attendance({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/attendance/updateAttendance',payload);
    	yield put({type:'fetch_attendanceList'});
    },
    //删除考勤
     *remove_attendance({ payload }, { call, put }) {
      const response = yield call(LoginService.get,'/api/attendance/deleteAttendances',payload);
    	yield put({type:'fetch_attendanceList'});
    },
    
     //上课记录
     //查询 
    *fetch_classRecords({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/classRecord/getClassRecordList',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },
    //Id 查询
    *findId_classRecords({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/classRecord/getClassRecord');
    	callback(response.data.res,response.data.obj);
    },
    
    //预约
    //查询
    *fetch_orderCourse({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/orderCourse/getOrderCourseList',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },
    //Id查询
    *findId_orderCourse({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/orderCourse/getOrderCourse',payload);
    	callback(response.data.res,response.data.obj);
    },
    //班级查询预约孩子信息
    *fetch_orderCourse2({ payload ,callback}, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/orderCourse/getOrderCourseList',payload); 
    		callback(response.data.res,response.data.obj);
    },
    
    
    //网络课程
   
    //活动规则
    *fetch_activityRule({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/activityRule/getBySlfActivityRule',payload); 
    		console.log(response);
    		yield put({type: 'save',payload: response.data.obj});
    },
    //新增活动规则
    *add_activityRule({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/activityRule/insertSlfActivityRule',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_activityRule'});
    },
    //修改活动规则
    *edit_activityRule({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/activityRule/updateSlfActivityRule',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_activityRule'});
    },
    //删除活动规则
    *remove_activityRule({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/activityRule/deleteSlfactivityRule',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_activityRule'});
    },
    
    //活动
    //查询活动
    *fetch_activity({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/activity/getBySlfactivity',payload); 
      	console.log(response);
    		yield put({type: 'save',payload: response.data.obj});
    },
    //新增活动
    *add_activity({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/activity/insertSlfactivity',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_activity'});
    },
    //修改活动
    *edit_activity({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/activity/updateSlfactivity',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_activity'});
    },
    //删除活动
    *remove_activity({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/activity/deleteSlfactivity',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_activity'});
    },
    //补课信息
    // 查询所有孩子
    *fetch_children_select({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/childrenController/getChildrenIdName',payload);
    	callback(response.data.res,response.data.data);
    },
    //查询补课  后台只查询
    *fetch_makeupCourse({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/mkeupCourse/getMakeupCourse',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },
    
    //活动
    //查询文章
    *fetch_article({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/article/getBySlfArticle',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },
    //新增文章
    *add_article({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/article/insertSlfArticle',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_article'});
    },
    //编辑文章
    *edit_article({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/article/updateSlfArticle',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_article'});
    },
    //删除文章
    *remove_article({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/article/deleteSlfArticle',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_article'});
    },
    //视频
    //查询视频
    *fetch_video({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/video/getVideo',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },  
    //新增视频
    *add_video({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/video/insertVideo',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_video'});
    },
    //编辑 视频
    *edit_video({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/video/updateVideo',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_video'});
    },
    //删除 视频
    *remove_video({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/video/deleteVideos',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_video'});
    },
    
    //系统消息
    //查询客户端-管理端 用户
    *fetch_getUserDtoList({ payload,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/common/getUserDtoList',payload); 
    		callback(response.data.res,response.data.obj);
    },
    //查询 系统消息
    *fetch_msg({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/systemMessage/getSystemMessage',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },
    //新增 系统消息
    *add_msg({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/systemMessage/insertSystemMessage',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_msg'});
    },
    //编辑 系统消息 
    *edit_msg({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/systemMessage/updateSystemMessage',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_msg'});
    },
    //删除 系统消息
    *remove_msg({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/systemMessage/deleteSystemMessage',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_msg'});
    },
    //消费记录
    *fetch_slfPriceHistory({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/priceHistory/getBySlfPriceHistory',payload); 
    		yield put({type: 'save',payload: response.data.obj});
    },  
    //充值记录
    *fetch_slfRecharge({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/recharge/getBySlfRecharge',payload); 
    		yield put({type: 'save',payload: response.data.obj});
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
