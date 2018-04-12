import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//上课记录
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
		dataIndex: 'sequence',
		key: 'sequence',
	},
	{
	title: '考勤状态',
		dataIndex: 'attendance',
		key: 'attendance',
	},{
		title: '孩子名称',
		dataIndex: 'childrenName',
		key: 'childrenName',
	},{
		title: '班级名称',
		dataIndex: 'className',
		key: 'className',
	},{
		title: '教室名称',
		dataIndex: 'classroomName',
		key: 'classroomName',
	},{
		title: '学校名称',
		dataIndex: 'compusName',
		key: 'compusName',
	},{
		title: '课程名称',
		dataIndex: 'courseName',
		key: 'courseName',
	},{
		title: '预约时间',
		dataIndex: 'orderDate',
		key: 'orderDate',
	},{
		title: '用户名',
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
		return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	      >
	        <Form layout="horizontal">
	          <FormItem label="开始时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('startDate', {
	            	 initialValue:objs.startDate,
	              rules: [{ required: true, message: '开始时间不能为空!' }],
	            })(
	            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
	            )}
          	</FormItem>
            <FormItem label="结束时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('endDate', {
	            	initialValue:objs.endDate,
	              rules: [{ required: true, message: '结束时间不能为空!' }],
	            })(
	              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
	            )}
          	</FormItem>
          	<FormItem label="时间状态" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('dateStatus', {
	            	initialValue:objs.dateStatus,
	            })(
	              <Select showSearch    style={{ width: '100%' }} placeholder="请选择">
				    <Option value="1">有效</Option>
				    <Option value="0">无效</Option>
				  </Select>
	            )}
          	</FormItem>
          	<FormItem label="是否默认" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('isDefault', {
	            	initialValue:objs.isDefault,
	            })(
	              <Select showSearch    style={{ width: '100%' }} placeholder="请选择">
				    <Option value="1">是</Option>
				    <Option value="0">否</Option>
				  </Select>
	            )}
          	</FormItem>
          	<FormItem label="备注" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('remark', {
	            	initialValue:objs.remark,
	            })(
	               <Input />
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
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		}else{
			if(rowSelections.selectedRows.length > 1) {
				message.warning('只能选择一项进行操作');
			}else{
				dispatch({
					type: 'attendance/findId_classRecords',
					payload:{classRecordId:rowSelections.selectedRows.classRecordId},
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
	//点击取消
	handleCancel = () => {this.setState({visible: false});}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'attendance/getClassRecordList'});
	}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/getClassRecordList',});
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
				type: 'attendance/getClassRecordList',
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
		            <FormItem label="开始时间">
		              {getFieldDecorator('startDate')(
		               <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <FormItem label="结束时间">
		              {getFieldDecorator('endDate')(
		               <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
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
		            <FormItem label="备注">
		              {getFieldDecorator('remark')(
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
		const rowKey = function(data) {return data.recordId;/*主键id*/};
		return(
			<PageHeaderLayout title="">
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
		            </div>
					<div className={styles.table_operations} >
				      	<Button icon="edit" type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
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
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}  pagination={{ pageSize: 10 }}/>
				</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)