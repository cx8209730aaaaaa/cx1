import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker,TimePicker  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//课表

//select
const Option = Select.Option;

var room_select = [];//教室
var course_select=[];//课程
var class_select=[];//班级
var room_select_times=[];//课程时间
var room_select_timess=[];//点击课程时间 获取的开始结束时间
var week_select=[];//第几周
var startDate="";
var endDate="";
var teacheruser = [];//上课老师


//时间戳 转化为时间格式
var Y,M,D,h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = (date.getDate() <10 ? '0'+date.getDate(): date.getDate()) + ' ';
    return Y+M+D;
}
function timestampToTime2(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    h = (date.getHours()   <10 ? '0'+date.getHours(): date.getHours()) + ':'; 
    m = (date.getMinutes() <10 ? '0'+date.getMinutes(): date.getMinutes()) + ':'; 
    s = date.getSeconds()  <10 ? '0'+date.getSeconds(): date.getSeconds();
    return h+m+s;
}
//table 列表
const columns = [
	{
		title: '序号',
		dataIndex: 'syllabusId',
		key: 'syllabusId',
		fixed: 'left',
		render: (text, record, index) => {	return index + 1}
	},
	{
	title: '班级名称',
		dataIndex: 'className',
		key: 'className',
		fixed: 'left',
	},{
		title: '教室名称',
		dataIndex: 'classroomName',
		key: 'classroomName',
	},{
		title: '课程名称',
		dataIndex: 'courseName',
		key: 'courseName',
	},{
		title: '上课老师',
		dataIndex: 'employeeName',
		key: 'employeeName',
	},{
		title: '补课老师',
		dataIndex: 'makeUpTeacherName',
		key: 'makeUpTeacherName',
	},{
		title: '第几周',
		dataIndex: 'week',
		key: 'week',
	},{
		title: '日期',
		dataIndex: 'ymdDate',
		key: 'ymdDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
	},{
		title: '教师状态',
		dataIndex: 'teacherStastus',
		key: 'teacherStastus',
		render: (text, record, index) =>{
			if(record.teacherStastus==1){
				return "有效"
			}else if(record.teacherStastus==0){
				return "无效"
			}
		} 
	},{
		title: '课表状态',
		dataIndex: 'state',
		key: 'state',
		render: (text, record, index) =>{
			if(record.state==0){
				return "待启用"
			}else if(record.state==1){
				return "预约中"
			}else if(record.state==2){
				return "已满"
			}else if(record.state==3){
				return "预约结束"
			}else if(record.state==4){
				return "上课中"
			}else if(record.state==5){
				return "上课结束"
			}
		} 
	},
];

var rowSelections = "";
//table复选框选中
// rowSelection objects indicates the need for row selection
const rowSelection = {
	onChange: (selectedRowKeys, selectedRows) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	onSelect: (record, selected, selectedRows) => {
		rowSelections = new Object(); //声明对象
		rowSelections.selected = selected;
		rowSelections.selectedRows = selectedRows;
		console.log(record, selected, selectedRows);
	},
	onSelectAll: (selected, selectedRows, changeRows) => {
		rowSelections = new Object(); //声明对象
		rowSelections.selected = selected;
		rowSelections.selectedRows = selectedRows;
		console.log(selected, selectedRows, changeRows);
	},
};
//form 表单
const FormItem = Form.Item;
//表单内容
const CollectionCreateForm = Form.create()(
	(props) => {
		const {	visible,title,onCancel,onCreate,form,showModal,dispatch,objs,roomselecttime,syllabusDate} = props;
		if(title=="打卡"){
			const {getFieldDecorator} = form;
			return(
			<Modal
			destroyOnClose={true}
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	     	>
			<Form layout="horizontal">
				<FormItem   wrapperCol={{span: 22}}>
		            {getFieldDecorator('childrenId', {
		            	initialValue:objs.childrenId,
		            	rules: [{ required: true, message: '孩子不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="具体原因" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('reason', {
		            	initialValue:objs.reason,
		            	rules: [{ required: true, message: '具体原因不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	</Form>
			</Modal>
			)
		}else{
			const {getFieldDecorator} = form;
			return(
			<Modal
			destroyOnClose={true}
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      >
	        <Form layout="horizontal">
            <FormItem label="教室"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('classroomId', {
	            	initialValue:objs.classroomId,
	              	rules: [{ required: true, message: '教室不能为空!' }],
	            })(
		            <Select showSearch placeholder="请选择" onChange={roomselecttime}>
									{room_select}
								</Select>
	            )}
          	</FormItem>
          	 <FormItem label="课程时间"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('syllabusDateId', {
	            	initialValue:objs.syllabusDateId,
	              rules: [{ required: true, message: '课程时间不能为空!' }],
	            })(
		            <Select showSearch placeholder="请选择" onChange={syllabusDate}>
						{room_select_times}
					</Select>
	            )}
          	</FormItem>
          	 <FormItem label="课程" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('courseId', {
	            	initialValue:objs.courseId,
	              rules: [{ required: true, message: '课程不能为空!' }],
	            })(
		            <Select showSearch placeholder="请选择">
						{course_select}
					</Select>
	            )}
          	</FormItem>
          	<FormItem label="上课老师"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('employeeId', {
	            	initialValue:objs.employeeId,
	              rules: [{ required: true, message: '人员不能为空!' }],
	            })(
		            <Select showSearch placeholder="请选择">
									{teacheruser}
								</Select>
	            )}
          	</FormItem>
          	<FormItem label="上课老师状态"  labelCol={{span: 11}}  wrapperCol={{span: 9}} className={styles.w50left}>
	            {getFieldDecorator('teacherStastus', {
	            	initialValue:"1",
	            	rules: [{ required: true, message: '上课老师状态不能为空!' }],
	            })(
	              <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
				    <Option value="1">正常</Option>
				    <Option value="0">缺席</Option>
				  </Select>
	            )}
          	</FormItem>
          	<FormItem label="补课老师" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('makeUpTeacherName', {
	            	initialValue:objs.makeUpTeacherName,
	            })(
		            <Input />
	            )}
          	</FormItem>
          	<FormItem label="日期" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('ymdDate', {
	            	initialValue:objs.ymdDate,
	              	rules: [{ required: true, message: '上课时间不能为空!' }],
	            })(
		           <DatePicker  format="YYYY-MM-DD" />
	            )}
          	</FormItem>
          	<FormItem label="上课开始时间" labelCol={{span: 10}}  wrapperCol={{span: 10}} className={styles.w50left}>
	            {getFieldDecorator('startDate', {
	            	initialValue:startDate,
	            })(
		            <TimePicker  disabled  style={{width:'100%'}} placeholder="开始时间"/>

	            )}
          	</FormItem>
          	<FormItem label="上课结束时间" labelCol={{span: 10}}  wrapperCol={{span: 10}} className={styles.w50left}>
	            {getFieldDecorator('endDate', {
	            	initialValue:endDate,
	            })(
		            <TimePicker  disabled style={{width:'100%'}} placeholder="结束始时间"/>

	            )}
          	</FormItem>
          	<FormItem label="班级" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('classId', {
	            	initialValue:objs.classId,
	            })(
	              	<Select showSearch placeholder="请选择" >
						{class_select}
					</Select>
	            )}
          	</FormItem>
          	<FormItem label="课表状态" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('state', {
	            	initialValue:objs.state,
	            })(
	               <Select showSearch placeholder="请选择" >
						<Option value="0">待启用</Option>
				    	<Option value="1">预约中</Option>
				    	<Option value="2">已满</Option>
				    	<Option value="3">预约结束</Option>
				    	<Option value="4">上课中</Option>
				    	<Option value="5">上课结束</Option>
					</Select>
	            )}
          	</FormItem>
        </Form>
      	</Modal>
		);
		}
	}
);

@connect(({ campus, loading }) => ({
  campus,
  loading: loading.models.campus,
}))
@Form.create()
class App extends React.Component {
	state = {
		confirmLoading: false,
		visible: false,
		title: "新增",
		objs: "", //编辑时赋值
	};
	//打开弹窗
	showModal = (title) => {
		this.form.resetFields();
		 startDate=undefined;
		 endDate=undefined;
		if(title == "新增") {
			this.setState({visible: true,title: title,objs: "",});
		}else{ //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			}else{
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					if(title=="打卡"){
						this.setState({visible: true,title: title,objs: "",});
					}else{
						var datas={};
						//查询接口
						this.props.dispatch({
							type: 'campus/fetchId_syllabus',
							payload: {syllabusId:rowSelections.selectedRows[0].syllabusId},
							callback: (res,data) => {
								datas.classroomId=data.classroomId+='';
								datas.syllabusDateId=data.syllabusDateId+='';
								datas.id=data.syllabusDateId;
								datas.value=data.remark;
						  		room_select_times.push(<Option key={datas.id}>{datas.value}</Option>);
								
								datas.courseId=data.courseId+='';
								datas.employeeId=data.employeeId+='';
								datas.teacherStastus=data.teacherStastus+='';
								datas.state=data.state+='';
								datas.makeUpTeacherName=data.makeUpTeacherName;
								datas.ymdDate=moment(data.ymdDate);
								
								//datas.startDate=data.start;
								//datas.endDate=data.end;
								startDate=moment(data.start,'HH:mm:ss');
								endDate=moment(data.end,'HH:mm:ss');
								datas.classId=data.classId+='';
								
							},
						});
						this.setState({
							visible: true,
							title: title,
							objs: datas,
						});
					}
				}
			}
		}
	}
	//点击取消
	handleCancel = () => {
		this.setState({visible: false});
	}
	
	
	//新增  编辑
	handleCreate = (title) => {
		if(title == "新增"||title == "编辑"){
			const form = this.form;
			form.validateFields((err, values) => {
				/*if(err) {	return;}*/
				console.log('Received values of form: ', values);
				if(values.classroomId!=undefined&&values.syllabusDateId!=undefined&&values.courseId!=undefined&&values.employeeId!=undefined&&values.ymdDate!=undefined){
					values.ymdDate=timestampToTime(values.ymdDate);//上课时间  年月日
					values.week=moment(values.ymdDate).format("w");//周
			    	values.ymdWeekDate=moment(values.ymdDate).format("YYYY")+moment(values.ymdDate).format("MM")+moment(values.ymdDate).format("w");//年月周
					values.startDate=values.ymdDate+" "+timestampToTime2(values.startDate);   //上课时间  年月日 +两个时间段
					values.endDate=values.ymdDate+" "+timestampToTime2(values.endDate);   //上课时间  年月日 +两个时间段
					if(values.teacherStastus==undefined){	values.teacherStastus=1}
					if(values.classId==undefined){	values.classId=""}
					if(values.state==undefined){	values.state=0}
					form.resetFields();
					if(title == "新增") { //新增
						this.props.dispatch({
							type: 'campus/add_syllabus',
							payload: {...values},
							callback: (res,resMsg) => {
								if(res == 1) message.success(resMsg);
								else message.error(resMsg);
							},
						});
					} else { //编辑
						var Id = [];
						if(rowSelections.selectedRows.length == 1) {
							Id.push(rowSelections.selectedRows[0].syllabusId);
						} else {
							for(var i = 0; i < rowSelections.selectedRows.length; i++) {
								Id.push(rowSelections.selectedRows[i].syllabusId);
							}
						}
						if(title == "编辑"){
							this.props.dispatch({
								type: 'campus/edit_syllabus',
								payload: {	...values,syllabusId: Id,},
								callback: (res, resMsg) => {
									if(res == 1)	message.success(resMsg); 
									else 	message.error(resMsg);
								},
							});
						}
					}
					this.setState({visible: false});
				}
				
				
			});
		}else{
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].syllabusId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].syllabusId);
				}
			}
			const form =  this.form;
			form.validateFields((err, values) => {
				console.log('Received values of form: ', values);
				if(values.childrenId!=undefined&&values.reason!=undefined){
					var reg=values.childrenId.split("+");
					reg=reg.join("$aoxin")
					this.props.dispatch({
						type: 'attendance/add_attendance',
						payload: {	
							aseChildrenId:reg,
							reason:values.reason,
							syllabusId: Id,
						},
						callback: (res, resMsg) => {
							if(res == 1)	message.success(resMsg); 
							else 	message.error(resMsg);
						},
					});
					this.setState({visible: false});
				}
				
			})
			
		}
		
		
	}
	/*删除*/
	deleaitModel = (title) => {
		const {	dispatch,	form} = this.props;
		console.log(rowSelections)
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].syllabusId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].syllabusId);
				}
			}
			if(title == "dele") { //删除
				Modal.confirm({
					title: '是否删除选中项?',
					content: '删除后不可还原',
					okText: '确定',
					okType: 'danger',
					cancelText: '取消',
					onOk() { //调取批量删除组织机构
						dispatch({
							type: 'campus/remove_syllabus',
							payload: {syllabusIds:Id},
							callback: (res,resMsg) => {
								if(res==1)	message.success(resMsg);
								else message.error(resMsg);
					        },
						});
					}
				});
			}
		}
	}
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'campus/fetch_syllabus'});
		//查询班级
		this.props.dispatch({
			type: 'campus/fetch_classselect',
			callback: (res,data) => {
				class_select=[];
				for (let i = 0; i < data.length; i++) {
					data[i].id=data[i].classId;
					data[i].value=data[i].name
				  class_select.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
		});
		//查询教室
		this.props.dispatch({
			type: 'campus/fetch_ListByroomselect',
			callback: (res,data) => {
				room_select=[];
				for (let i = 0; i < data.length; i++) {
					data[i].id=data[i].classroomId;
					data[i].value=data[i].name
				  room_select.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
		});
		//查询课程
		this.props.dispatch({
			type: 'campus/fetch_ListBycourseselect',
			callback: (res,data) => {
				course_select=[];
				for (let i = 0; i < data.length; i++) {
				  course_select.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
		});
		//查询 教师
		this.props.dispatch({
			type: 'campus/fetch_EmployeeListByOrg',
			callback: (res,data) => {
				teacheruser=[];
				for (let i = 0; i < data.length; i++) {
				  teacheruser.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
		});
		
		//查询一共有哪几周
		this.props.dispatch({
			type: 'campus/fetch_selectweek',
			callback: (res,data) => {
				week_select=[];
				for (let i = 0; i < data.length; i++) {
				  week_select.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
		});
	}
	
		//点击教室查询 课程时间 
  	roomselecttime = (value) => {
    	this.props.dispatch({
				type: 'campus/find_selectSyllabusDateList',
				payload: {classroomId:value},
				callback: (res,data) => {
					room_select_timess=[];
					room_select_times=[];
					for (let i = 0; i < data.length; i++) {
						var datas={};
						datas.id=data[i].syllabusDateId;
						datas.startDate=data[i].startDate;
						datas.endDate=data[i].endDate;
						room_select_timess.push(datas);
						
						data[i].id=data[i].syllabusDateId;
						data[i].value=data[i].remark;
						
					  room_select_times.push(<Option key={data[i].id}>{data[i].value}</Option>);
					}
					console.log(room_select_times);
				}
	    });
	  }
  	syllabusDate=(value)=>{
  		console.log(value);
  		for (let i = 0; i < room_select_timess.length; i++) {
  			if(room_select_timess[i].id==value){
  				console.log(room_select_timess[i]);
  				startDate=room_select_timess[i].startDate;
  				endDate=room_select_timess[i].endDate;
  				if(startDate!=undefined){
  					startDate=moment(startDate, 'HH:mm:ss')
  				}if(endDate!=undefined){
  					endDate=moment(endDate, 'HH:mm:ss')
  				}
  			}
  		}
  		//console.log(room_select_timess);
  	}
  	
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'campus/fetch_syllabus',});
	}
	//查询
	handleSearch = (e) => {
		e.preventDefault();
		const {	dispatch,form} = this.props;
		form.validateFields((err, fieldsValue) => {
			if(err) return;
			const values = {
				...fieldsValue,
				updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
			};
			this.setState({	formValues: values});
			if(values.classId==undefined){values.classId=""}
			if(values.employeeId==undefined){values.employeeId=""}
			if(values.classroomId==undefined){values.classroomId=""}
			
			if(values.dateStatus==undefined){values.dateStatus=""}
			if(values.remark==undefined){values.remark=""}
			if(values.updatedAt==undefined){values.updatedAt=""}
			dispatch({
				type: 'campus/fetch_syllabus',
				payload:{...values} 
			});
		});
	}
	saveFormRef = (form) => {this.form = form;}
	renderAdvancedForm() {
		const {getFieldDecorator} = this.props.form;
		return(
			<Form onSubmit={this.handleSearch} layout="inline">
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		           <Col md={8} sm={24}>
		            <FormItem label="班级">
		              {getFieldDecorator('classId')(
		               <Select showSearch  style={{ width: '100%' }} placeholder="请选择">
										{class_select}
									</Select>
		              )}
		            </FormItem>
		          </Col>
		         <Col md={8} sm={24}>
		            <FormItem label="上课老师">
		              {getFieldDecorator('employeeId')(
		                <Select showSearch placeholder="请选择">
							{teacheruser}
						</Select>
		              )}
		            </FormItem>
		          </Col>
		           <Col md={8} sm={24}>
		            <FormItem label="时间状态">
		              {getFieldDecorator('dateStatus')(
		                <Select showSearch    style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">有效</Option>
						    <Option value="0">无效</Option>
						</Select>
		              )}
		            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          <Col md={8} sm={24}>
		            <FormItem label="教室">
		              {getFieldDecorator('classroomId')(
		                 <Select showSearch placeholder="请选择">
							{room_select}
						</Select>
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <FormItem label="第几周">
		              {getFieldDecorator('week')(
		                 <Select showSearch placeholder="请选择">
							{week_select}
						</Select>
		              )}
		            </FormItem>
		          </Col>
		           <Col md={8} sm={24}>
		            <FormItem>
			            <span style={{ float: 'right', marginBottom: 24 }}>
			            <Button type="primary" htmlType="submit">查询</Button>
			            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
			            </span>
		            </FormItem>
		          </Col>
		        </Row>
		    </Form>
		);
	}
	render() {
		const {	visible,title,confirmLoading} = this.state;
		const { campus: { data=[] }, loading } = this.props;
		const rowKey = function(data) {return data.syllabusId;/*主键id*/};
		return(
			<PageHeaderLayout title="">
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
		            </div>
					<div className={styles.table_operations} >
				      	<Button type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
				      	<Button type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
				      	<Button type="primary" onClick={() => this.deleaitModel('dele')}>删除</Button>
				      	<Button type="primary" onClick={() => this.showModal('打卡')}>打卡</Button>
				      	
				    </div>
				    <CollectionCreateForm  alt="弹窗" 
				          ref={this.saveFormRef}
				          title={this.state.title}
				          objs={this.state.objs}
				          confirmLoading={confirmLoading}
				          visible={this.state.visible}
				          onCancel={this.handleCancel} 
				          roomselecttime={this.roomselecttime}
				          syllabusDate={this.syllabusDate}
				          onCreate={() => this.handleCreate(this.state.title)}
				    />
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}  pagination={{ pageSize: 10 }} scroll={{ x: '950px'}}/>
				</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)