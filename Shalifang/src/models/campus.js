/*自定义--校区管理*/
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import * as LoginService from '../services/basics';

export default {
  namespace: 'campus',
  state: {
    data: [],
  },
  effects: {
     //单独课程  admin 查询
    *fetch_course({ payload }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getAloneCourse',payload); 
    	yield put({type: 'save',payload: response.data.obj});
    },
    //单独课程 admin 查询单个
    *fetchId_course({ payload ,callback}, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getAloneCourse',payload);
    	callback(response.data.res,response.data.resMsg,response.data.obj[0]);
    },
    //单独课程 admin 新增
    *add_course({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/system/insertAloneCourse', payload);
      	callback(response.data.res,response.data.resMsg);
     	yield put({type:'fetch_course'});
    },
    //单独课程 admin 编辑
    *edit_course({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.puts,'/api/system/updateAloneCourse', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({type:'fetch_course'});
    },
     //查询 单独课程 select 
	*fetch_courseselect({ payload,callback }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getAloneCourse',payload); 
      	callback(response.data.res,response.data.obj);
    },
    
    //课程包 -admin 
    //查询所有课程包
    *fetch_coursePage({ payload }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getAloneCoursePage',payload); 
    	yield put({type: 'save',payload: response.data.obj});
    },
    //课程包 admin 查询单个
    *fetchId_coursePage({ payload ,callback}, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getAloneCoursePage',payload);
    	callback(response.data.res,response.data.resMsg,response.data.obj[0]);
    },
    //课程包 admin 新增
    *add_coursePage({ payload ,callback}, { call, put }) {
      	const response = yield call(LoginService.post,'/api/system/insertAloneCoursePage',payload);
    	callback(response.data.res,response.data.resMsg,);
    	 yield put({type:'fetch_coursePage'});
    },
    //课程包 admin 编辑
    *edit_coursePage({ payload ,callback}, { call, put }) {
      	const response = yield call(LoginService.puts,'/api/system/updateAloneCoursePage',payload);
    	callback(response.data.res,response.data.resMsg);
    	yield put({type:'fetch_coursePage'});
    },
    //查询父级课程包
    *fetch_coursePageselect({ payload,callback }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getAloneCoursePage',payload); 
    	callback(response.data.res,response.data.obj);
    },
    //查询课程包下的课程
    *fetch_coursePagese_courselect({ payload,callback }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getCourseToPage',payload); 
    		callback(response.data.res,response.data.obj);
    },
    //查询未添加进课程包的课程
    
    *fetch_coursePagese_courselect2({ payload,callback }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getOtherCourseToPage',payload); 
    		callback(response.data.res,response.data.obj);
    },
     
     
     //课程管理  校长
     //单独课程 校长 查询
    *fetch_school_course({ payload }, { call, put }) {
      	const response = yield call(LoginService.get,'/api/system/getSchoolCourse',payload); 
    	yield put({type: 'save',payload: response.data.obj});
    	//callback(response.data.res,response.data.obj);
    },
     //单独课程 校长 查询单个
    *fetchId_school_course({ payload ,callback}, { call, put }) {
      const response = yield call(LoginService.get,'/api/system/getSchoolCourse',payload);
      callback(response.data.res,response.data.obj[0]);
    },
     //单独课程  校长查询  admin新增 的单独课程
    *fetch_course2({ payload,callback }, { call, put }) {
      const response = yield call(LoginService.get,'/api/system/getAloneCourse',payload); 
      callback(response.data.res,response.data.obj);
    },
    //新增单独课程 校长
    *add_school_course({ payload, callback }, { call, put }) {
      const response = yield call(LoginService.post,'/api/system/insertSchoolCourse', payload);
      callback(response.data.res,response.data.resMsg);
      yield put({type:'fetch_school_course'});
    },
    //编辑单独课程 校长
    *edit_school_course({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.puts,'/api/system/updateSchoolCourse', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({type:'fetch_school_course'});
    },
    //查看孩子
    *fetch_children({ payload }, { call, put }) {  //无返回值
      	const response = yield call(LoginService.post,'/api/childrenController/getChildren',payload); 
    		yield put({ type: 'save',payload: response.data.obj});
    },
     *fetchId_children({ payload ,callback}, { call, put }) {
      	const response = yield call(LoginService.get,'/api/childrenController/getChildren',payload);
      	callback(response.data.res,response.data.resMsg,response.data.obj[0]);
    },
    //查看班级
    *fetch_class({ payload }, { call, put }) {  //无返回值
      	const response = yield call(LoginService.post,'/api/classController/getClasses',payload); 
    		yield put({type: 'save',  payload: response.data.obj});
    },
    //新增班级
    *add_class({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/classController/insertClass', payload);
     	 	callback(response.data.res,response.data.resMsg);
     		yield put({type:'fetch_class',payload:{pageIndex: 1,pageSize: 10}});
    },
    *edit_class({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.puts,'/api/classController/updateClass', payload);
     		callback(response.data.res,response.data.resMsg);
     		yield put({type:'fetch_class'});
     },
     *remove_class({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.puts,'/api/classController/deleteClass', payload);
     		callback(response.data.res,response.data.resMsg);
     		yield put({type:'fetch_class'});
     },
     //班级里面 添加学生
     *add_classChildren({ payload,callback }, { call, put }) {  //无返回值
      	const response = yield call(LoginService.post,'/api/classChildrenController/batchInsertClassChildren',payload); 
    		callback(response.data.res,response.data.resMsg);
    		yield put({type:'fetch_class'});
    	}, 
    	//班级里面 查看学生
    	*find_classChildren({ payload,callback }, { call, put }) {  //无返回值
      	const response = yield call(LoginService.post,'/api/classChildrenController/batchGetChildrenByClassId',payload); 
    		console.log(response);
    		callback(response.data.res,response.data.resMsg,response.data.obj);
    		yield put({type:'fetch_class'});
    },
     
     
     //查看日志
    *getOperateLogList({ payload }, { call, put }) {  //无返回值
      const response = yield call(LoginService.post,'/api/log/getOperateLogList'); 
      console.log(response);
    	yield put({
	        type: 'save',
	        payload: response.data.obj,
	    });
    },
    
    //查看教室
    *fetch_classroom({ payload }, { call, put }) {  //无返回值
      	const response = yield call(LoginService.post,'/api/classroom/getClassroomList',payload); 
    	yield put({type: 'save',payload: response.data.obj});
    },
    //新增教室
    *add_classroom({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/classroom/insertClassroom', payload);
      	callback(response.data.res,response.data.resMsg,response.data.obj);
	 			//yield put({	type:'fetch_classroom'});
    },
    //查询学校 返回 id，name  教室新增-使用  接口无
    *find_schoolselect({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/classroom/insertClassroom', payload);
      	callback(response.data.res,response.data.resMsg);
	 	yield put({	type:'fetch_classroom'});
    },
    //教室 编辑
    *edit_classroom({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/classroom/updateClassroom', payload);
      	callback(response.data.res,response.data.resMsg,response.data.obj);
	 	yield put({	type:'fetch_classroom'});
    },
    //教室 删除
    *remove_classroom({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.puts,'/api/classroom/deleteClassrooms', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({type:'fetch_classroom',});
    },
    //教室 新增课程时间
     *add_classroomSyllabusDate({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/classroomSyllabusDate/insertClassroomSyllabusDate', payload);
      	callback(response.data.res,response.data.resMsg,response.data.obj);
	 			yield put({	type:'fetch_classroom'});
    },
    
    
    
    
    //查询  课程时间
    *fetch_course_time({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/syllabusDate/getSlfSyllabusDateList',payload); 
    	yield put({type: 'save',payload: response.data.obj});
    },
    //新增课程时间
    *add_course_time({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabusDate/insertSyllabusDate', payload);
      	callback(response.data.res,response.data.resMsg);
	 	yield put({	type:'fetch_course_time'});
    },
    //课程时间 编辑
    *edit_course_time({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabusDate/updateSyllabusDate', payload);
      	callback(response.data.res,response.data.resMsg);
	 	yield put({	type:'fetch_course_time'});
    },
    //课程时间 批量修改状态
    *edit_course_time_state({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabusDate/updateSyllabusDateStates', payload);
      	callback(response.data.res,response.data.resMsg);
	 	yield put({	type:'fetch_course_time'});
    },
    //课程时间 删除
    *remove_course_time({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.puts,'/api/syllabusDate/deleteSlfSyllabusDateByIds', payload);
     	callback(response.data.res,response.data.resMsg);
     	yield put({type:'fetch_course_time',});
    },
   
    //课表查询
    *fetch_syllabus({ payload }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/syllabus/getSyllabusList',payload); 
    	yield put({type: 'save',payload: response.data.obj});
    },
    //查询课表
    *fetchId_syllabus({ payload,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/syllabus/getSyllabus',payload); 
    		console.log(response)
    		callback(response.data.res,response.data.obj);
    },
    //新增课表
    *add_syllabus({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabus/insertSyllabus', payload);
      	callback(response.data.res,response.data.resMsg);
	 			yield put({	type:'fetch_syllabus'});
    },
     //编辑课表
    *edit_syllabus({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabus/updateSyllabus', payload);
      	callback(response.data.res,response.data.resMsg);
	 			yield put({	type:'fetch_syllabus'});
    }, 
    //删除 课表
    *remove_syllabus({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabus/deleteSyllabuss', payload);
      	callback(response.data.res,response.data.resMsg);
	 	yield put({	type:'fetch_syllabus'});
    },
    //根据教室选择 查询 课程时间
    *find_selectSyllabusDateList({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabusDate/getSelectSyllabusDateList', payload);
      	callback(response.data.res,response.data.obj);
    },
    //查询一共几周
    *fetch_selectweek({ payload, callback }, { call, put }) {
      	const response = yield call(LoginService.post,'/api/syllabus/getSelectWeek', payload);
      	callback(response.data.res,response.data.obj);
    },
    
    
    //查询 教师
    *fetch_EmployeeListByOrg({ payload ,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/employee/getEmployeeListByOrg',payload); 
    		callback(response.data.res,response.data.obj);
    },
    
    //查看班级 select
    *fetch_classselect({ payload,callback }, { call, put }) {  //无返回值
      const response = yield call(LoginService.post,'/api/classController/getClasses',payload); 
    	callback(response.data.res,response.data.obj);
    },
    
    //查询学校 select
    *fetch_ListByschoolselect({ payload,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/school/getSchoolListByOrg'); 
    	callback(response.data.res,response.data.obj);
    },
    //查询教室 select
    *fetch_ListByroomselect({ payload,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/classroom/getClassroomList'); 
    	callback(response.data.res,response.data.obj);
    },
    //查询课程 select
    *fetch_ListBycourseselect({ payload,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/system/getSchoolCourseListBySchool'); 
      	console.log(response);
    	callback(response.data.res,response.data.obj);
    },
    //查询课程时间 select
    *fetch_ListBycoursetimeselect({ payload,callback }, { call, put }) {  
      	const response = yield call(LoginService.post,'/api/syllabusDate/getSlfSyllabusDateList'); //syllabusDate/getSelectSyllabusDateList
      	callback(response.data.res,response.data.obj);
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
