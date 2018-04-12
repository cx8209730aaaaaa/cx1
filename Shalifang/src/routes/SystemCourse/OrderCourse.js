import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//预约
//select
const Option = Select.Option;

//时间戳 转化为时间格式
var Y,M,D,h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';  m = date.getMinutes() + ':';  s = date.getSeconds();
    return Y+M+D+h+m+s;
}
//table 列表
const columns = [
	{
		title: '序号',
		dataIndex: 'orderCourseId',
		key: 'orderCourseId',
		render: (text, record, index) => {	return index + 1}
	},
	{
	title: '孩子',
		dataIndex: 'childrenName',
		key: 'childrenName',
	},{
		title: '课程',
		dataIndex: 'courseName',
		key: 'courseName',
		
	},{
		title: '课程包',
		dataIndex: 'coursePageName',
		key: 'coursePageName',
	},{
		title: '课程类型',
		dataIndex: 'courseType',
		key: 'courseType',
		render: (text, record, index) =>{
			if(record.state==1){
				return "A类"
			}else if(record.state==2){
				return "B类"
			}else{
				return "C类"
			}
		} 
	},{
		title: '预约状态',
		dataIndex: 'orderCourseStatus',
		key: 'orderCourseStatus',
		render: (text, record, index) =>{
			if(record.orderCourseStatus==1){
				return "成功"
			}else if(record.orderCourseStatus==2){
				return "失败"
			}else if(record.orderCourseStatus==3){
				return "排队中"
			}
		} 
	},{
		title: '预约时间',
		dataIndex: 'orderDate',
		key: 'orderDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
		
	},/*{
		title: '课表',
		dataIndex: 'syllabusId',
		key: 'syllabusId',
		
	},*/{
		title: '用户',
		dataIndex: 'userName',
		key: 'userName',
		
	}
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
		const {	visible,title,onCancel,onCreate,form,showModal,dispatch,objs} = props;
		const {getFieldDecorator} = form;
		if(title=="新增"){
			return(
				<Modal
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
		            	rules: [{ required: true, message: '孩子Id不能为空!' }],
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
		);
		}else if(title=="查看"){
			return(
				<Modal
		        visible={visible}
		        title={title}
		        okText="确定"
		        onCancel={onCancel}
		      > 
		      <Form layout="horizontal">
	          	<FormItem   wrapperCol={{span: 22}}>
		            {getFieldDecorator('childrenId', {
		            	initialValue:objs.childrenId,
		            	rules: [{ required: true, message: '孩子Id不能为空!' }],
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
		);
		}
		
	}
);

@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
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
			this.setState({visible: true,title: title,objs: ""});
		}else{ //查看
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			}else{
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				}else{
					dispatch({
						type: 'attendance/findId_orderCourse',
						payload:{orderCourseId:rowSelections.selectedRows[0].orderCourseId},
						callback: (res,data) => {
								this.setState({
								visible: true,
								title: title,
								objs: data,
							});
					    },
					});
				}
			}
		}
	}
	//点击取消
	handleCancel = () => {this.setState({visible: false})}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'attendance/fetch_orderCourse'});
	}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/fetch_orderCourse',});
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
			if(values.startDate==undefined){values.startDate=""}
			if(values.endDate==undefined){values.endDate=""}
			if(values.dateStatus==undefined){values.dateStatus="1"}
			if(values.isDefault==undefined){values.isDefault="1"}
			if(values.remark==undefined){values.remark=""}
			if(values.upCourseDate==undefined){values.upCourseDate=""}
			dispatch({
				type: 'attendance/fetch_orderCourse',
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
			            <FormItem label="打卡时间">
			              {getFieldDecorator('cardDate')(
			               <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
			              )}
			            </FormItem>
		          	</Col>
		           <Col md={8} sm={24}>
			            <FormItem label="预约状态">
			              {getFieldDecorator('orderCourseStatus')(
			                <Select showSearch    style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">成功</Option>
							    <Option value="2">失败</Option>
							    <Option value="3">排队中</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		           <Col md={8} sm={24}>
			            <FormItem label="学校">
			              {getFieldDecorator('compusName')(
			                <Input />
			              )}
			            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          	<Col md={8} sm={24}>
			            <FormItem label="用户">
			              {getFieldDecorator('userName')(
			                <Input />
			              )}
			            </FormItem>
		          	</Col>
		          	<Col md={16} sm={24}>
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
		const { attendance: { data=[] }, loading } = this.props;
		const rowKey = function(data) {return data.orderCourseId;/*主键id*/};
		return(
			<PageHeaderLayout >
        		<Card bordered={false}>
	        		<div className={styles.tableList}>
			            <div className={styles.tableListForm}>
			              {this.renderAdvancedForm()}
			            </div>
						<div className={styles.table_operations} >
					      	<Button icon="plus" type="primary"  onClick={() => this.showModal('查看')}>查看</Button>
					    </div>
					    <CollectionCreateForm
				          	ref={this.saveFormRef}
				         	title={this.state.title}
				          	objs={this.state.objs}
				          	confirmLoading={confirmLoading}
				          	visible={this.state.visible}
				          	onCancel={this.handleCancel} 
				          	onCreate={() => this.handleCreate(this.state.title)}
					    />
					    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}  pagination={{ pageSize: 10 }} scroll={{ x: '850px'}}/>
					</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)