import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//班级

const { RangePicker } = DatePicker;
const Option = Select.Option;

var teacheruser = [];//上课老师
var data2=[];//预约课表孩子信息
var rowkey2="";
var data3=[];//班级孩子信息
var rowkey3="";
//时间戳 转化为时间格式
var Y,M,D,h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = (date.getDate()    <10 ? '0'+date.getDate(): date.getDate()) + ' ';
    h = (date.getHours()   <10 ? '0'+date.getHours(): date.getHours()) + ':'; 
    m = (date.getMinutes() <10 ? '0'+date.getMinutes(): date.getMinutes()) + ':'; 
    s = date.getSeconds()  <10 ? '0'+date.getSeconds(): date.getSeconds();
    return Y+M+D+h+m+s;
}
//table 列表
const columns = [
	{
		title: '序号',
		dataIndex: 'classId',
		key: 'classId',
		render: (text, record, index) => {
			return index + 1
		}
	},{
		title: '负责人姓名',
		dataIndex: 'employeeName',
		key: 'employeeName',
	}, {
		title: '班级名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '简称',
		dataIndex: 'nikeName',
		key: 'nikeName',
	},
	{
		title: '开班时间',
		dataIndex: 'upCourseDate',
		key: 'upCourseDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,

	}
];
//table 列表 预约的孩子信息
const columns2 = [
	{
		title: '序号',
		dataIndex: 'orderCourseId',
		key: 'orderCourseId',
		render: (text, record, index) => {
			return index + 1
		}
	},
	{
		title: '孩子',
		dataIndex: 'childrenName',
		key: 'childrenName',
	}, {
		title: '课程',
		dataIndex: 'courseName',
		key: 'courseName',

	}, {
		title: '课程包',
		dataIndex: 'coursePageName',
		key: 'coursePageName',
	}, {
		title: '课程类型',
		dataIndex: 'courseType',
		key: 'courseType',
		render: (text, record, index) => {
			if(record.state == 1) {
				return "A类"
			} else if(record.state == 2) {
				return "B类"
			} else {
				return "C类"
			}
		}
	}, {
		title: '预约状态',
		dataIndex: 'orderCourseStatus',
		key: 'orderCourseStatus',
		render: (text, record, index) => {
			if(record.orderCourseStatus == 1) {
				return "成功"
			} else if(record.orderCourseStatus == 2) {
				return "失败"
			} else if(record.orderCourseStatus == 3) {
				return "排队中"
			}
		}
	}, {
		title: '预约时间',
		dataIndex: 'orderDate',
		key: 'orderDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,

	}, {
		title: '用户',
		dataIndex: 'userName',
		key: 'userName',

	}
];
//孩子信息
const columns3 = [
	{
		title: '序号',
		dataIndex: 'childrenId',
		key: 'childrenId',
		render: (text, record, index) =>{return index+1}
	},
	{
		title: '学校名称',
		dataIndex: 'schoolName',
		key: 'schoolName',
	}, {
		title: '用户名',
		dataIndex: 'userName',
		key: 'userName',
	}, {
		title: '孩子名称',
		dataIndex: 'name',
		key: 'name',
	},
	 {
		title: '头像',
		dataIndex: 'headPortrait',
		key: 'headPortrait',
		render: val => <img src={val} style={{width:'40px'}} />,
	},
	{
		title: '性别',
		dataIndex: 'sex',
		key: 'sex',
		render: (text, record, index) =>{
			if(record.sex==1){
				return "男"
			}else if(record.sex==0){
				return "女"
			}
		} 
	},
	 {
		title: '生日',
		dataIndex: 'birthday',
		key: 'birthday',
		render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '爱好',
		dataIndex: 'hobby',
		key: 'hobby',
	}
];


var rowSelections = "";
//table复选框选中
// rowSelection objects indicates the need for row selection
const rowSelection = {
	onSelect: (record, selected, selectedRows) => {
		rowSelections = new Object(); //声明对象
		rowSelections.selected = selected;
		rowSelections.selectedRows = selectedRows;
	},
	onSelectAll: (selected, selectedRows, changeRows) => {
		rowSelections = new Object(); //声明对象
		rowSelections.selected = selected;
		rowSelections.selectedRows = selectedRows;
	},
};

var rowSelections2 = "";
//table复选框选中
// rowSelection objects indicates the need for row selection
const rowSelection2 = {
	onSelect: (record, selected, selectedRows) => {
		rowSelections2 = new Object(); //声明对象
		rowSelections2.selected = selected;
		rowSelections2.selectedRows = selectedRows;
	},
	onSelectAll: (selected, selectedRows, changeRows) => {
		rowSelections2 = new Object(); //声明对象
		rowSelections2.selected = selected;
		rowSelections2.selectedRows = selectedRows;
	},
};

//form 表单
const FormItem = Form.Item;
//表单内容
const CollectionCreateForm = Form.create()(
	(props) => {
		const {	visible,title,onCancel,onCreate,form,showModal,dispatch,objs} = props;
		const {getFieldDecorator} = form;
		if(title=="添加学生"){
			return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      	>
			<Table rowKey={rowkey2} columns={columns2} rowSelection={rowSelection2} dataSource={data2}  pagination={{ pageSize: 10 }} scroll={{ x: '850px'}}/>
			</Modal>
			)
		}else if(title=="查看学生"){
			return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      	>
			<Table rowKey={rowkey3} columns={columns3} dataSource={data3}  pagination={{ pageSize: 10 }} scroll={{ x: '850px'}}/>
			</Modal>
			)
		}else{
			return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      >
	        <Form layout="horizontal">
	          <FormItem label="负责人" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('employeeId', {
	            	initialValue:objs.employeeId,
	              	rules: [{ required: true, message: '负责人姓名不能为空!' }],
	            })(
	               <Select showSearch placeholder="请选择">
						{teacheruser}
					</Select>
	            )}
          	</FormItem>
            <FormItem label="班级名称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('name', {
	            	initialValue:objs.name,
	              rules: [{ required: true, message: '班级名称不能为空!' }],
	            })(
	               <Input />
	            )}
          	</FormItem>
          	<FormItem label="简称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('nikeName', {
	            	initialValue:objs.nikeName,
	              rules: [{ required: true, message: 'ico不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
          	<FormItem label="开班时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('upCourseDate', {
	            	initialValue:objs.upCourseDate,
	              rules: [{ required: true, message: 'ico不能为空!' }],
	            })(
	              <DatePicker  showTime   format="YYYY-MM-DD HH:mm:ss"/>
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
		if(title == "新增") {
			this.setState({visible: true,title: title,objs: "",});
		}else { //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				}else{
					if(title == "查看学生"||title == "添加学生"){
						if(title == "查看学生"){
							//查询班级孩子信息
							this.props.dispatch({
								type: 'campus/find_classChildren',
								payload: {classId:rowSelections.selectedRows[0].classId,},
								callback: (res,msg,data) => {
									data3=[];
									data3=data;
									rowkey3=data.childrenId;
									this.setState({visible: true,title: title,objs: "",});
								}
							});
						}else{
							this.setState({visible: true,title: title,objs: "",});
						}
					}else{
						rowSelections.selectedRows[0].employeeId+=''
						rowSelections.selectedRows[0].upCourseDate=moment(rowSelections.selectedRows[0].upCourseDate);
						this.setState({
							visible: true,
							title: title,
							objs: rowSelections.selectedRows[0],
						});
					}
				}
			}
		}
	}
	//点击取消
	handleCancel = () => {
		this.setState({
			visible: false
		});
	}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'campus/fetch_class'});
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
		//查询预约孩子信息
		this.props.dispatch({
			type: 'attendance/fetch_orderCourse2',
			callback: (res,data) => {
				data2=[];
				data2=data;
				rowkey2=data.orderCourseId;
			}
		});
	}
	//新增  编辑
	handleCreate = (title) => {
		const form = this.form;
		if(title=="添加学生"){
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].classId );
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].classId );
				}
			}
			var Id2 = [];
			if(rowSelections2.selectedRows.length == 1) {
				Id2.push(rowSelections2.selectedRows[0].childrenId);
			} else {
				for(var i = 0; i < rowSelections2.selectedRows.length; i++) {
					Id2.push(rowSelections2.selectedRows[i].childrenId);
				}
			}
			this.props.dispatch({
				type: 'campus/add_classChildren',
				payload: {classId : Id,childrenIds :Id2,},
				callback: (res, resMsg) => {
					if(res == 1) { //成功
						message.success(resMsg);
					} else { //失败
						message.error(resMsg);
					}
				},
			});
		}else{
			form.validateFields((err, values) => {
				if(err) {return;}
				values.upCourseDate=timestampToTime(values.upCourseDate);//开班时间
				form.resetFields();
				if(title == "新增"){ //新增
					this.props.dispatch({
						type: 'campus/add_class',
						payload: {...values},
						callback: (res, resMsg) => {
							if(res == 1) { //成功
								message.success(resMsg);
							} else { //失败
								message.error(resMsg);
							}
						},
					});
				}else if(title == "编辑"){ //编辑
					var Id = [];
					if(rowSelections.selectedRows.length == 1) {
						Id.push(rowSelections.selectedRows[0].classId );
					} else {
						for(var i = 0; i < rowSelections.selectedRows.length; i++) {
							Id.push(rowSelections.selectedRows[i].classId );
						}
					}
					this.props.dispatch({
						type: 'campus/edit_class',
						payload: {...values,classId : Id,},
						callback: (res, resMsg) => {
							if(res == 1) { //成功
								message.success(resMsg);
							} else { //失败
								message.error(resMsg);
							}
						},
					});
				}
				
			});
		}
		this.setState({	visible: false});
	}
	/*删除*/
	deleaitModel = (title) => {
		const {	dispatch,	form} = this.props;
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].classId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].classId);
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
							type: 'campus/remove_class',
							payload: {classIds:Id},
							callback: (res,resMsg) => {
								if(res==1){//成功
									message.success(resMsg);
								}else{//失败
									message.error(resMsg);
								}
					        },
						});
					}
				});
			}
		}
	}

	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({
			type: 'campus/fetch_class'
		});
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
			this.setState({
				formValues: values,
			});
			if(values.employeeId==undefined){
				values.employeeId=""
			}
			if(values.name==undefined){
				values.name=""
			}
			if(values.nikeName==undefined){
				values.nikeName=""
			}
			if(values.upCourseDate1==undefined){
				values.startUpCourseDate=""
				values.endUpCourseDate=""
			}else{
				values.startUpCourseDate=timestampToTime(values.upCourseDate1[0])
				values.endUpCourseDate=timestampToTime(values.upCourseDate1[1])
			}
			if(values.updatedAt==undefined){
				values.updatedAt=""
			}
			
			dispatch({
				type: 'campus/fetch_class',
				payload:{
					...values,
				} 
			});
		});
	}
	saveFormRef = (form) => {
		this.form = form;
	}
	renderAdvancedForm() {
		const {
			getFieldDecorator
		} = this.props.form;
		return(
			<Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
           <Col md={8} sm={24}>
            <FormItem label="负责人姓名">
              {getFieldDecorator('employeeId')(
                <Select showSearch placeholder="请选择">
					{teacheruser}
				</Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="班级名称">
              {getFieldDecorator('name')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
           <Col md={8} sm={24}>
            <FormItem label="简称">
              {getFieldDecorator('nikeName')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="开班时间">
              {getFieldDecorator('upCourseDate1')(
                <RangePicker  showTime={{ format: 'HH:mm:ss' }}  format="YYYY-MM-DD HH:mm:ss"/>
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
		const rowKey = function(data) {  return data.classId; /*主键id*/};
		
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
				      	<Button type="primary" onClick={() => this.showModal('添加学生')}>添加学生</Button>
				    	<Button type="primary" onClick={() => this.showModal('查看学生')}>查看学生</Button>
				    </div>
				    <CollectionCreateForm  alt="弹窗" 
				          ref={this.saveFormRef}
				          title={this.state.title}
				          objs={this.state.objs}
				          confirmLoading={confirmLoading}
				          visible={this.state.visible}
				          onCancel={this.handleCancel} 
				          onCreate={() => this.handleCreate(this.state.title)}
				    />
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data} pagination={{ pageSize: 10 }} scroll={{ x: '850px'}}/>
				    
	      		</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)