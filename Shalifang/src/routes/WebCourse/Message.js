import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import moment from 'moment';
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//系统消息
const Option = Select.Option;
const { TextArea } = Input;
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
//人员查询
var table2=[];
var table2col=[];
const columns2 = [{
	title: '序号',
	dataIndex: 'userId',
	key: 'userId',
}, {
	title: '用户名',
	dataIndex: 'userName',
	key: 'userName',
}, {
	title: '手机号',
	dataIndex: 'phone',
	key: 'phone',
}, {
	title: '机构名称',
	dataIndex: 'orgName',
	key: 'orgName',
}, {
	title: '学校名称',
	dataIndex: 'schoolName',
	key: 'schoolName',
}];

//table 列表
const columns = [{
	title: '序号',
	dataIndex: 'messageId',
	key: 'messageId',
	width:'10%',
	render: (text, record, index) =>{return index+1}
}, {
	title: '消息',
	dataIndex: 'content',
	key: 'content',
	width:'30%',
}, {
	title: '已读',
	dataIndex: 'isRead',
	key: 'isRead',
	width:'10%',
	render: (text, record, index) =>{
		if(record.isRead==1){
			return "已读"
		}else if(record.isRead==0){
			return "未读"
		}
	}
},{
	title: '发送时间',
	dataIndex: 'sendDate',
	key: 'sendDate',
	width:'25%',
	sorter: (a, b) => a.sendDate - b.sendDate,
	render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
	
}, {
	title: '类型',
	dataIndex: 'type',
	key: 'type',
	width:'10%',
	render: (text, record, index) =>{
		if(record.type==1){
			return "系统"
		}else if(record.type==2){
			return "活动"
		}
	}
}, {
	title: '接收者',
	dataIndex:'userName',
	key: 'userName',
	width:'15%',
}];

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


//table复选框选中
// rowSelection objects indicates the need for row selection
var rowSelections2 = "";
const rowSelection2 = {
 	/*getCheckboxProps(record) {
   		return {
  			defaultChecked: record.userId== table2col[0],// 配置默认勾选的列
		};
	},*/
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
		const {	visible,title,onCancel,onCreate,form,showModal,dispatch,objs,onChangetree} = props;
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
		      	<FormItem label="类型" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('type', {
		            	initialValue:objs.type,
		            	rules: [{ required: true, message: '消息类型不能为空!' }],
		            })(
		               <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">系统消息</Option>
						    <Option value="2">活动消息</Option>
						</Select>
		            )}
	          	</FormItem>
	          	<FormItem  label="内容" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('content', {
		            	initialValue:objs.content,
		            	rules: [{ required: true, message: '活动规则名称不能为空!' }],
		            })(
		              <TextArea rows={3} />
		            )}
	          	</FormItem>
	        </Form>
	        <Select showSearch style={{ width: '50%'}} placeholder="请选择"  
	           onChange={onChangetree}>
			    <Option value="1">管理端</Option>
			    <Option value="2">客户端</Option>
			</Select>
    		<Table rowkey={table2.userId} dataSource={table2} columns={columns2}  rowSelection={rowSelection2} size="small" pagination={{ pageSize: 10 }} />
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
					rowSelections.selectedRows[0].activityRuleId+=''
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
	//删除
	deleteModal=(title)=>{
		const {	dispatch,form} = this.props;
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].messageId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].messageId);
				}
			}
			if(title == "删除") {
			Modal.confirm({
				title: '是否删除选中项?',
				content: '删除后不可还原',
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() { //调取批量删除组织机构
					dispatch({
						type: 'attendance/remove_msg',
						payload: {
							messageIds: Id
						},
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
				if(!rowSelections2 || rowSelections2.selected == false) {
					message.warning('还未选择用户,无操作');
				}else{
					var Id2 = [];
					if(rowSelections2.selected==true){//人员id
						if(rowSelections2.selectedRows.length == 1) {
							Id2.push(rowSelections2.selectedRows[0].userId);
						} else {
							for(var i = 0; i < rowSelections2.selectedRows.length; i++) {
								Id2.push(rowSelections2.selectedRows[i].userId);
							}
						}
					}
					console.log(Id2)
					this.props.dispatch({
						type: 'attendance/add_msg',
						payload: {
							...values,
							userIds:Id2,
						},
						callback: (res,resMsg) => {
							if(res == 1) message.success(resMsg);
							else message.error(resMsg);
						},
					});
					this.setState({
						visible: false,
					});
				}
			}
			
		});
	}
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'attendance/fetch_msg'});
		//默认查询所有人员
		this.props.dispatch({
			type: 'attendance/fetch_getUserDtoList',
			callback: (res,data) => {
				console.log(data);
				table2=[];
				table2=data;
				//table2col=data.roleEmployee;
	  		}
		});
	}
	//点击userType 查询用户
  	onChangetree = (value) => {
  		console.log(value)
    	this.props.dispatch({
			type: 'attendance/fetch_getUserDtoList',
			payload: {userType:value},
			callback: (res, data) => {
				console.log(data);
				
					table2=[];
					table2=data;
					//table2col=data.roleEmployee;
				
			}
	    });
	  }
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/fetch_msg',});
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
				type: 'attendance/fetch_msg',
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
			            <FormItem label="内容">
			              {getFieldDecorator('content')(
			                <Input />
			              )}
			            </FormItem>
		          	</Col>
		           <Col md={8} sm={24}>
			            <FormItem label="类型">
			              {getFieldDecorator('type ')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">满减</Option>
							    <Option value="2">秒杀</Option>
							    <Option value="3">优惠券</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
			            <FormItem label="是否已读">
			              {getFieldDecorator('employeeId')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">已读</Option>
							    <Option value="0">未读</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          	<Col md={24} sm={24}>
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
		/*<Button type="primary"  onClick={() => this.showModal('查看')}>查看</Button>*/
	}
	render() {
		const {	visible,title,confirmLoading} = this.state;
		const { attendance: { data=[] }, loading } = this.props;
		const rowKey = function(data) {return data.messageId ;/*主键id*/};
		return(
			<PageHeaderLayout >
        		<Card bordered={false}>
	        		<div className={styles.tableList}>
			            <div className={styles.tableListForm}>
			              {this.renderAdvancedForm()}
			            </div>
						<div className={styles.table_operations} >
					      	<Button type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
					      	<Button type="primary"  onClick={() => this.deleteModal('删除')}>删除</Button>
					    </div>
					    <CollectionCreateForm
				          	ref={this.saveFormRef}
				         	title={this.state.title}
				          	objs={this.state.objs}
				          	onChangetree={this.onChangetree} 
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