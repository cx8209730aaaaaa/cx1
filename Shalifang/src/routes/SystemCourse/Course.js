import React, {	Component} from 'react';
import { connect } from 'dva'; 
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//课程管理 -admin 单独
const RangePicker = DatePicker.RangePicker;
var school_select=[];//学校
var course_select=[];//父级课程
const Option = Select.Option;
//时间戳 转化为时间格式
var Y,M,D,h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = date.getDate() +' ';
    h = date.getHours() + ':';  m = date.getMinutes() + ':';  s = date.getSeconds();
    return Y+M+D+h+m+s;
}
//table 列表
const columns = [
	{
		title: '序号',
		dataIndex: 'courseId',
		key: 'courseId',
		render: (text, record, index) =>{return index+1}
	},{
		title: '课程名称',
		dataIndex: 'name',
		key: 'name',
	},{
		title: '描述',
		dataIndex: 'description',
		key: 'description',
	},{
		title: '价格',
		dataIndex: 'price',
		key: 'price',
	}, {
		title: '折扣价',
		dataIndex: 'discountPrice',
		key: 'discountPrice',
	},{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		render: (text, record, index) =>{
			if(record.state==1)	return "有效"
			else if(record.state==0)	return "无效"
		} 
	}
];

var rowSelections = "";
//table复选框选中
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
	          	<FormItem label="课程名称" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('name', {
		            	initialValue:objs.name,
		              	rules: [{ required: true, message: '课程名称不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="简称" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('nickName', {
		            	initialValue:objs.nickName,
		              	rules: [{ required: true, message: '简称不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          
	          	<FormItem label="课程类型" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('courseType', {
		            	initialValue:objs.courseType,
		            })(
		            	<Select placeholder="请选择" >
			              	<Option value="1">A类</Option>
			              	<Option value="2">B类</Option>
			              	<Option value="3">C类</Option>
			            </Select>
		            )}
	          	</FormItem>
	          	<FormItem label="状态" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('state', {
	            		initialValue:objs.state,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">有效</Option>
				            <Option value="0">无效</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="上下架" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('upDownState', {
	            		initialValue:objs.upDownState,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">上架</Option>
				            <Option value="0">下架</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="父级课程" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('parentId',{
	            		initialValue:objs.parentId,
	            	})(
				    	<Select allowClear searchPlaceholder="请选择"  >
							{course_select}
						</Select> 
	            	)}
	          	</FormItem>
	          		<FormItem label="描述" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('description', {
		            	initialValue:objs.description,
		              	rules: [{ required: true, message: '描述不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="学校" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('schoolId', {
		            	initialValue:objs.schoolId,
		              	rules: [{ required: true, message: '学校不能为空!' }],
		            })(
		            <Select  mode="tags"  mode="multiple" allowClear searchPlaceholder="请选择"  >
						{school_select}
					</Select> 
		            )}
	          	</FormItem>
	          	
	          	<FormItem label="学习周期" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('period', {
	            		initialValue:objs.period,
	            		rules: [{ required: true, message: '学习周期不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="排序" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('sequence', {
	            		initialValue:objs.sequence,
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="起始年龄" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('fitAge', {
	            		initialValue:objs.fitAge,
	            		rules: [{ required: true, message: '起始年龄不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="截止年龄" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('endAge', {
	            		initialValue:objs.endAge,
	            		rules: [{ required: true, message: '截止年龄不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="价格" labelCol={{span: 8}}  wrapperCol={{span: 12}}  className={styles.w50left}>
	            	{getFieldDecorator('price', {
	            		initialValue:objs.price,
	            		rules: [{ required: true, message: '价格不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="折扣价" labelCol={{span: 8}}  wrapperCol={{span: 12}}  className={styles.w50left}>
	            	{getFieldDecorator('discountPrice', {
	            		initialValue:objs.discountPrice,
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          
	          	<FormItem label="是否热门" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('hotState', {
	            		initialValue:objs.hotState,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">是</Option>
				            <Option value="0">否</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="是否最新" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('newState', {
	            		initialValue:objs.newState,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">是</Option>
				            <Option value="0">否</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="销售时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            	{getFieldDecorator('salesDate', {
	            		initialValue:objs.salesDate,
	            		rules: [{ required: true, message: '销售时间不能为空!' }],
	            	})(
	            		<RangePicker showTime  format="YYYY-MM-DD HH:mm:ss" />
	  				)}
	          	</FormItem>
	          	<FormItem label="有效时间" labelCol={{span: 4}}  wrapperCol={{span: 12}}>
	            	{getFieldDecorator('effectiveDate', {
	            		initialValue:objs.effectiveDate,
	            		rules: [{ required: true, message: '有效时间不能为空!' }],
	            	})(
	            		<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
	  				)}
	          	</FormItem>
	          	<FormItem label="备注" labelCol={{span: 4}}  wrapperCol={{span: 12}}>
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

@connect(({ campus, loading }) => ({  campus,  loading: loading.models.campus,}))
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
		} else { //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					this.props.dispatch({
						type: 'campus/fetchId_course',
						payload: {courseId : rowSelections.selectedRows[0].courseId,},
						callback: (res,resMsg,data) => {
							if(res == 1) { //成功
								//有效时间
								data.effectiveDate=[moment(data.effectiveStartDate),moment(data.effectiveEndDate)]
								data.salesDate=[moment(data.salesStartDate),moment(data.salesEndDate)]
								if(data.courseType!=undefined){//课程类型
									data.courseType+=''
								}
								if(data.state!=undefined){//状态
									data.state+=''
								}
								if(data.upDownState!=undefined){//上下架状态
									data.upDownState+=''
								}
								if(data.parentId!=undefined){//父级
									data.parentId+=''
								}
								if(data.hotState!=undefined){//是否热门
									data.hotState+=''
								}
								if(data.newState!=undefined){//是否最新
									data.newState+=''
								}
								data.schoolId=data.schoolId.split(",");
								this.setState({
									visible: true,
									title: title,
									objs: data,
								});
							}else{ //失败
								message.error(resMsg);
							}
						},
					});
				}
			}
		}
	}
	
	//新增  编辑
	handleCreate = (title) => {
		const form = this.form;
		form.validateFields((err, values) => {
			if(err) {return;}
			console.log('Received values of form: ', values);
			if(values.parentId == undefined)	 values.parentId="" //机构
			if(values.state == undefined)	 values.state="1" //状态
			if(values.upDownState == undefined) values.upDownState="0"//上下架状态
			if(values.courseType == undefined) values.courseType="1"//课程类型
			if(values.hotState == undefined) values.hotState="0" //热门
			if(values.newState == undefined) values.newState="0" //最新
			if(values.sequence == undefined) values.sequence=""//
			if(values.remark == undefined) values.remark=""//备注
			if(values.discountPrice == undefined) values.discountPrice=""//折扣价
			values.schoolId=values.schoolId.join(",");
			values.salesStartDate=timestampToTime(values.salesDate[0]);//销售开始时间
			values.salesEndDate=timestampToTime(values.salesDate[1]);//销售结束时间
			values.effectiveStartDate=timestampToTime(values.effectiveDate[0]);//有效开始时间
			values.effectiveEndDate=timestampToTime(values.effectiveDate[1]);//有效结束时间
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'campus/add_course',
					payload: {	...values},
					callback: (res, resMsg) => {
						if(res == 1) 	message.success(resMsg);
						else	message.error(resMsg);
					},
				});
			}else{ //编辑
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].courseId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].courseId);
					}
				}
				this.props.dispatch({
					type: 'campus/edit_course',
					payload: {	...values,	courseId:Id,},
					callback: (res, resMsg) => {
						if(res == 1) 	message.success(resMsg);
						else message.error(resMsg);
					},
				});
			}
			this.setState({	visible: false});
		});
	}
	//点击取消
	handleCancel = () => {this.setState({visible: false});}
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'campus/fetch_course',});
		//默认查询 父级课程 select
		this.props.dispatch({
			type: 'campus/fetch_courseselect',
			callback: (res,data) => {
				course_select=[];
				for (let i = 0; i < data.length; i++) {
				  course_select.push(<Option key={data[i].courseId}>{data[i].name}</Option>);
				}
			}
		});
		//默认查询 学校 select 
		this.props.dispatch({
			type: 'campus/fetch_ListByschoolselect',
			callback: (res,data) => {
				school_select=[];
				for (let i = 0; i < data.length; i++) {
				  school_select.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
		});
	}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({formValues: {}});
		dispatch({type: 'campus/fetch_course'});
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
			if(values.name==undefined)	values.name=""
			if(values.hotState==undefined)	values.hotState=""
			if(values.newState==undefined)	values.newState=""
			if(values.upDownState==undefined)	values.upDownState=""
			if(values.courseType==undefined)	values.courseType=""
			if(values.state==undefined)	values.state="1"
			if(values.updatedAt==undefined)	values.updatedAt=""
			dispatch({
				type: 'campus/fetch_course',
				payload:{	...values} 
			});
		});
	}
	saveFormRef = (form) => {this.form = form;}
	renderAdvancedForm() {
		const {	getFieldDecorator} = this.props.form;
		return(
			<Form onSubmit={this.handleSearch} layout="inline">
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		           <Col md={8} sm={24}>
			            <FormItem label="课程名称">
			              	{getFieldDecorator('name')(
			                <Input placeholder="请输入" />
			              )}
			            </FormItem>
		          	</Col>
		          	<Col md={8} sm={24}>
		            	<FormItem label="课程类型">
			              	{getFieldDecorator('courseType')(
		                	<Select placeholder="请选择" style={{ width: '100%' }}>
			                  	<Option value="1">A类</Option>
			                  	<Option value="2">B类</Option>
			                  	<Option value="3">C类</Option>
			                </Select>
		              		)}
		            	</FormItem>
		          	</Col>
		          	<Col md={8} sm={24}>
			            <FormItem label="上下架状态">
			              	{getFieldDecorator('upDownState')(
			                <Select placeholder="请选择" style={{ width: '100%' }}>
	             				<Option value="1">上架</Option>
				            	<Option value="0">下架</Option>
			                </Select>
			              )}
			            </FormItem>
		          	</Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
			        <Col md={8} sm={24}>
			            <FormItem label="是否最新">
				            {getFieldDecorator('newState')(
				                <Select placeholder="请选择" style={{ width: '100%' }}>
				                  <Option value="1">是</Option>
				                  <Option value="0">否</Option>
				                </Select>
				            )}
			            </FormItem>
		          	</Col>
		          	<Col md={8} sm={24}>
			            <FormItem label="是否热门">
			              	{getFieldDecorator('hotState')(
			                <Select placeholder="请选择" style={{ width: '100%' }}>
			                 	<Option value="1">是</Option>
		                  		<Option value="0">否</Option>
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
		console.log(data)
		const rowKey = function(data) {return data.courseId;  /*主键id*/};
		return(
			<PageHeaderLayout>
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
		            </div>
					<div className={styles.table_operations} >
				      	<Button icon="plus" type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
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
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data} pagination={{ pageSize: 10 }} />
				 </div>
	      	</Card>
	   	</PageHeaderLayout>
		)
	}
}
export default() => (<App />)