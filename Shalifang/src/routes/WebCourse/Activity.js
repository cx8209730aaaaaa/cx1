import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import moment from 'moment';
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//活动
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
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
		dataIndex: 'sequence',
		key: 'sequence',
		render: (text, record, index) =>{return index+1}
	},
	{
	title: '创建人',
		dataIndex: 'employeeId',
		key: 'employeeId',
	},{
		title: '类型',
		dataIndex: 'type',
		key: 'type',
		
	},{
		title: '开始时间',
		dataIndex: 'startDate',
		key: 'startDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
	},{
		title: '结束时间',
		dataIndex: 'endDate',
		key: 'endDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
	},{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		render: (text, record, index) =>{
			if(record.state==1){
				return "有效"
			}else if(record.state==0){
				return "无效"
			}
		}
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
		return(
			<Modal
		        visible={visible}
		        title={title}
		        okText="确定"
		        onCancel={onCancel}
		        onOk={onCreate}
		      > 
		      <Form layout="horizontal">
	          	<FormItem  label="规则编码" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('activityRuleId', {
		            	initialValue:objs.activityRuleId,
		            	rules: [{ required: true, message: '活动规则编码不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="活动名称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('name', {
		            	initialValue:objs.name,
		            	rules: [{ required: true, message: '活动名称不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="类型" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('type', {
		            	initialValue:objs.type,
		            	rules: [{ required: true, message: '活动时间不能为空!' }],
		            })(
		               <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">满减</Option>
						    <Option value="2">秒杀</Option>
						    <Option value="3">优惠券</Option>
						</Select>
		            )}
	          	</FormItem>
	          	<FormItem label="活动时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('Dates', {
		            	initialValue:objs.Dates,
		            	rules: [{ required: true, message: '活动时间不能为空!' }],
		            })(
		               <RangePicker showTime format="YYYY/MM/DD HH:mm:ss"/>
		            )}
	          	</FormItem>
	          	<FormItem label="状态" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('state', {
		            	initialValue:objs.state,
		            })(
		                <Select showSearch  style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">有效</Option>
						    <Option value="0">无效</Option>
						</Select>
		            )}
	          	</FormItem>
	          	<FormItem label="内容" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('content', {
		            	initialValue:objs.content,
		            	rules: [{ required: true, message: '内容不能为空!' }],
		            })(
		               <Input type="textarea"  rows="3"/>
		            )}
	          	</FormItem>
	        </Form>
	      </Modal>
		);
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
					rowSelections.selectedRows[0].syllabusDateId+=''
					rowSelections.selectedRows[0].dateStatus+=''
					rowSelections.selectedRows[0].isDefault+=''
					this.setState({
						visible: true,
						title: title,
						objs: rowSelections.selectedRows[0],
					});
				}
			}
		}
	}
	//点击取消
	handleCancel = () => {this.setState({visible: false})}
	
	
	//新增
	handleCreate = (title) => {
		const form = this.form;
		form.validateFields((err, values) => {
			if(err) {	return;}
			console.log('Received values of form: ', values);
			if(values.state==undefined) values.state="1"
			if(values.type==undefined) values.type="1"
			values.startDate=timestampToTime(values.Dates[0]);//开始时间
			values.endDate=timestampToTime(values.Dates[1]);//结束时间
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'attendance/add_activity',
					payload: {...values},
					callback: (res,resMsg) => {
						if(res == 1) message.success(resMsg);
						else message.error(resMsg);
					},
				});
			}
			this.setState({
				visible: false,
			});
		});
	}
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'attendance/fetch_activity'});
	}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/fetch_activity',});
	}
	//查询
	handleSearch = (e) => {
		e.preventDefault();
		const {	dispatch,form} = this.props;
		form.validateFields((err, fieldsValue) => {
			if(err) return;
			const values = {
				...fieldsValue,
				//updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
			};
			this.setState({	formValues: values});
			if(values.employeeId==undefined){values.employeeId=""}
			if(values.type==undefined){values.type="1"}
			if(values.state==undefined){values.state="1"}
			if(values.Datas==undefined){
				values.startDate="";//开始时间
				values.endDate="";//结束时间
			}else{
				values.startDate=timestampToTime(values.Dates[0]);//开始时间
				values.endDate=timestampToTime(values.Dates[1]);//结束时间
			}
			//if(values.updatedAt==undefined){values.updatedAt=""}
			dispatch({
				type: 'attendance/fetch_activity',
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
			            <FormItem label="创建人">
			              {getFieldDecorator('employeeId')(
			                <Input />
			              )}
			            </FormItem>
		          	</Col>
		           <Col md={8} sm={24}>
			            <FormItem label="类型">
			              {getFieldDecorator('type')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">满减</Option>
							    <Option value="2">秒杀</Option>
							    <Option value="3">优惠券</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		           <Col md={8} sm={24}>
			            <FormItem label="状态">
			              {getFieldDecorator('state')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">有效</Option>
							    <Option value="0">无效</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          	<Col md={16} sm={24}>
			            <FormItem label="活动时间">
			              {getFieldDecorator('Datas')(
			               <RangePicker showTime format="YYYY/MM/DD HH:mm:ss"/>
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
		const { attendance: { data=[] }, loading } = this.props;
		const rowKey = function(data) {return data.activityId;/*主键id*/};
		return(
			<PageHeaderLayout >
        		<Card bordered={false}>
	        		<div className={styles.tableList}>
			            <div className={styles.tableListForm}>
			              {this.renderAdvancedForm()}
			            </div>
						<div className={styles.table_operations} >
					      	<Button icon="plus" type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
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
					    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}  pagination={{ pageSize: 10 }}/>
					</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)