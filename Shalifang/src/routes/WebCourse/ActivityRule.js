import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//活动规则
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
		dataIndex: 'activityRuleId',
		key: 'activityRuleId',
		width:'5%',
		render: (text, record, index) =>{return index+1}
	},
	{
	title: '规则名称',
		dataIndex: 'activityName',
		key: 'activityName',
	},{
		title: '范围',
		dataIndex: 'activityRange',
		key: 'activityRange',
		
	},{
		title: '规则类型',
		dataIndex: 'activityType',
		key: 'activityType',
	},{
		title: '奖励范围',
		dataIndex: 'rewardRange',
		key: 'rewardRange',
	},{
		title: '奖励总数',
		dataIndex: 'rewardTotal',
		key: 'rewardTotal',
	},{
		title: '奖励类型',
		dataIndex: 'rewardType',
		key: 'rewardType',
	},
	{
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
	          	<FormItem  label="规则名称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('activityName', {
		            	initialValue:objs.activityName,
		            	rules: [{ required: true, message: '活动规则名称不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="范围" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('activityRange', {
		            	initialValue:objs.activityRange,
		            	rules: [{ required: true, message: '活动范围不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="规则类型" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('activityType', {
		            	initialValue:objs.activityType,
		            	rules: [{ required: true, message: '活动规则类型不能为空!' }],
		            })(
		               <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">满减</Option>
						    <Option value="2">秒杀</Option>
						    <Option value="3">优惠券</Option>
						</Select>
		            )}
	          	</FormItem>
	          	<FormItem label="奖励范围" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('rewardRange', {
		            	initialValue:objs.rewardRange,
		            	rules: [{ required: true, message: '活动奖励范围不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="奖励总数" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('rewardTotal', {
		            	initialValue:objs.rewardTotal,
		            	rules: [{ required: true, message: '活动奖励总数不能为空!' }],
		            })(
		              <Input />
		            )}
	          	</FormItem>
	          	<FormItem label="奖励类型" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('rewardType', {
		            	initialValue:objs.rewardType,
		            	rules: [{ required: true, message: '活动奖励类型不能为空!' }],
		            })(
		               <Input />
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
					rowSelections.selectedRows[0].activityType+=''
					rowSelections.selectedRows[0].rewardType+=''
					rowSelections.selectedRows[0].state+=''
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
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'attendance/add_activityRule',
					payload: {...values},
					callback: (res,resMsg) => {
						if(res == 1) message.success(resMsg);
						else message.error(resMsg);
					},
				});
			}else{
				this.props.dispatch({
					type: 'attendance/edit_activityRule',
					payload: {...values,
					activityRuleId:rowSelections.selectedRows[0].activityRuleId,
					},
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
		this.props.dispatch({type: 'attendance/fetch_activityRule'});
	}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/fetch_activityRule',});
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
				type: 'attendance/fetch_activityRule',
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
			            <FormItem label="规则名称">
			              {getFieldDecorator('activityName')(
			                <Input />
			              )}
			            </FormItem>
		          	</Col>
		           <Col md={8} sm={24}>
			            <FormItem label="规则类型">
			              {getFieldDecorator('activityType')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">满减</Option>
							    <Option value="2">秒杀</Option>
							    <Option value="3">优惠券</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
			            <FormItem label="奖励类型">
			              {getFieldDecorator('rewardType')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">满减</Option>
							    <Option value="2">秒杀</Option>
							    <Option value="3">优惠券</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		          
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          	 <Col md={8} sm={24}>
			            <FormItem label="状态">
			              {getFieldDecorator('	rewardType')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">有效</Option>
							    <Option value="0">无效</Option>
							</Select>
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
		const rowKey = function(data) {return data.activityRuleId;/*主键id*/};
		return(
			<PageHeaderLayout >
        		<Card bordered={false}>
	        		<div className={styles.tableList}>
			            <div className={styles.tableListForm}>
			              {this.renderAdvancedForm()}
			            </div>
						<div className={styles.table_operations} >
					      	<Button type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
					      	<Button type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
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