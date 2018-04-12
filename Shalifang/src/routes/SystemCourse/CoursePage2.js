import React, {	Component} from 'react';
import { connect } from 'dva'; 
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//课程包管理 校长 学校
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
var school_select=[];//学校
var course_select=[];//父级课程

const dateFormat ='YYYY-MM-dd HH:mm:ss';
//时间戳 转化为时间格式
var Y,M,D,h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';  m = date.getMinutes() + ':';  s = date.getSeconds();
    return Y+M+D+h+m+s;
}
//table 列表
var data1=[];
var data2=[];
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
const columns2 = [
	{
		title: '序号',
		dataIndex: 'sequence',
		key: 'sequence',
	},
	{
		title: '课程名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '父级编码',
		dataIndex: 'parentId',
		key: 'parentId',
	}, {
		title: '描述',
		dataIndex: 'description',
		key: 'description',
	},
	 {
		title: '价格',
		dataIndex: 'price',
		key: 'price',
	},{
		title: '课程类型',
		dataIndex: 'courseType',
		key: 'courseType',
		render: (text, record, index) =>{
			if(record.state==1){
				return "A类"
			}else if(record.state==0){
				return "B类"
			}else{
				return "C类"
			}
		} 
	},
];


var rowSelections = "";
//table复选框选中
// rowSelection objects indicates the need for row selection
const rowSelection = {
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
var rowSelections2 = "";
const rowSelection2 = {
	onSelect: (record, selected, selectedRows) => {
		rowSelections2 = new Object(); //声明对象
		rowSelections2.selected = selected;
		rowSelections2.selectedRows = selectedRows;
		console.log(record, selected, selectedRows);
	},
	onSelectAll: (selected, selectedRows, changeRows) => {
		rowSelections2 = new Object(); //声明对象
		rowSelections2.selected = selected;
		rowSelections2.selectedRows = selectedRows;
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
	          	<FormItem label="课程名称" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
		            {getFieldDecorator('name', {
		            	initialValue:objs.name,
		              	rules: [{ required: true, message: '课程名称不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="简称" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
		            {getFieldDecorator('nickName', {
		            	initialValue:objs.nickName,
		              	rules: [{ required: true, message: '简称不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          
	          	<FormItem label="课程类型" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
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
	          	<FormItem label="状态" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('state', {
	            		initialValue:objs.state,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">有效</Option>
				            <Option value="0">无效</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="上下架" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('upDownState', {
	            		initialValue:objs.upDownState,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">上架</Option>
				            <Option value="0">下架</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="父级课程" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('parentId',{
	            		initialValue:objs.parentId,
	            	})(
				    	<Select allowClear searchPlaceholder="请选择"  >
							{course_select}
						</Select> 
	            	)}
	          	</FormItem>
	          		<FormItem label="描述" labelCol={{span: 4}}  wrapperCol={{span: 19}}>
		            {getFieldDecorator('description', {
		            	initialValue:objs.description,
		              	rules: [{ required: true, message: '描述不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="学校" labelCol={{span: 4}}  wrapperCol={{span: 19}}>
		            {getFieldDecorator('schoolId', {
		            	initialValue:objs.schoolId,
		              	rules: [{ required: true, message: '学校不能为空!' }],
		            })(
		            <Select  mode="tags"  mode="multiple" allowClear searchPlaceholder="请选择"  >
						{school_select}
					</Select> 
		            )}
	          	</FormItem>
	          	
	          	<FormItem label="学习周期" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('period', {
	            		initialValue:objs.period,
	            		rules: [{ required: true, message: '学习周期不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="排序" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('sequence', {
	            		initialValue:objs.sequence,
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="起始年龄" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('fitAge', {
	            		initialValue:objs.fitAge,
	            		rules: [{ required: true, message: '起始年龄不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="截止年龄" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('endAge', {
	            		initialValue:objs.endAge,
	            		rules: [{ required: true, message: '截止年龄不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="价格" labelCol={{span: 8}}  wrapperCol={{span: 15}}  className={styles.w50left}>
	            	{getFieldDecorator('price', {
	            		initialValue:objs.price,
	            		rules: [{ required: true, message: '价格不能为空!' }],
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="折扣价" labelCol={{span: 8}}  wrapperCol={{span: 15}}  className={styles.w50left}>
	            	{getFieldDecorator('discountPrice', {
	            		initialValue:objs.discountPrice,
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          
	          	<FormItem label="是否热门" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('hotState', {
	            		initialValue:objs.hotState,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">是</Option>
				            <Option value="0">否</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="是否最新" labelCol={{span: 8}}  wrapperCol={{span: 15}} className={styles.w50left}>
	            	{getFieldDecorator('newState', {
	            		initialValue:objs.newState,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">是</Option>
				            <Option value="0">否</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="销售时间" labelCol={{span: 4}}  wrapperCol={{span: 19}}>
	            	{getFieldDecorator('salesDate', {
	            		initialValue:objs.salesDate,
	            		rules: [{ required: true, message: '销售时间不能为空!' }],
	            	})(
	            		<RangePicker showTime  format="YYYY-MM-DD HH:mm:ss" />
	  				)}
	          	</FormItem>
	          	<FormItem label="有效时间" labelCol={{span: 4}}  wrapperCol={{span: 19}}>
	            	{getFieldDecorator('effectiveDate', {
	            		initialValue:objs.effectiveDate,
	            		rules: [{ required: true, message: '有效时间不能为空!' }],
	            	})(
	            		<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
	  				)}
	          	</FormItem>
	          	<FormItem label="备注" labelCol={{span: 4}}  wrapperCol={{span: 19}}>
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
		const {	dispatch,	form} = this.props;
		if(title == "新增") {
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			}else{
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].courseId );
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].courseId );
					}
				}
				console.log(rowSelections);
				Modal.confirm({
					title: '是否对当前选中的课程加入自己的课程?',
					okText: '确定',
					cancelText: '取消',
					onOk() {
						dispatch({
							type: 'campus/add_school_course',
							payload: {courseIds:Id},
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
		} else { 
			this.form.resetFields();
			//编辑
			if(!rowSelections2 || rowSelections2.selected == false||!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections2.selectedRows.length > 1||rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					Modal.confirm({
						title: '是否对当前选中的课程进行编辑?',
						okText: '确定',
						cancelText: '取消',
						onOk() {
							dispatch({
								type: 'campus/edit_school_course',
								payload: {
									courseId:rowSelections.selectedRows[0].courseId,
									schoolCourseId:rowSelections2.selectedRows[0].schoolCourseId,
								},
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
	}
	
	//新增  编辑
	handleCreate = (title) => {
		if(title == "新增") { //新增
			this.props.dispatch({
				type: 'campus/add_school_course',
				payload: {
					...values,
					schoolId:1,
				},
				callback: (res, resMsg) => {
					if(res == 1) { //成功
						message.success(resMsg);
					} else { //失败
						message.error(resMsg);
					}
				},
			});
		} else { //编辑
			const form = this.form;
			form.validateFields((err, values) => {
				if(err) {
					return;
				}
				//机构
				(values.parentId == undefined) ? values.parentId="1" : values.parentId;
				//状态
				(values.state == undefined) ? values.state="1" : values.state;
				//上下架状态
				(values.upDownState == undefined) ? values.upDownState="1" : values.upDownState;
				//课程类型
				(values.courseType == undefined) ? values.courseType="1" : values.courseType;
				//热门
				(values.hotState == undefined) ? values.hotState="1" : values.hotState;
				//最新
				(values.newState == undefined) ? values.newState="1" : values.newState;
				//排序
				(values.sequence == undefined) ? values.sequence="1" : values.newState="";
				values.salesStartDate=timestampToTime(values.salesDate[0]);//销售开始时间
				values.salesEndDate=timestampToTime(values.salesDate[1]);//销售结束时间
				values.effectiveStartDate=timestampToTime(values.effectiveDate[0]);//有效开始时间
				values.effectiveEndDate=timestampToTime(values.effectiveDate[1]);//有效结束时间
				
				form.resetFields();
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].schoolCourseId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].schoolCourseId);
					}
				}
				//获取id
				console.log("..Id" + Id);
				this.props.dispatch({
					type: 'campus/edit_school_course',
					payload: {
						...values,
						schoolCourseId : Id,
					},
					callback: (res, resMsg) => {
						if(res == 1) { //成功
							message.success(resMsg);
						} else { //失败
							message.error(resMsg);
						}
					},
				});
				this.setState({
					visible: false,
				});
			});
		}
	}
	
	
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({	type: 'campus/fetch_course2',	callback: (res,data) => {data1=[];data1=data;}});
		//默认查询 父级课程 select
		/*this.props.dispatch({
			type: 'campus/fetch_courseselect',
			callback: (res,data) => {
				course_select=[];
				for (let i = 0; i < data.length; i++) {
				  course_select.push(<Option key={data[i].courseId}>{data[i].name}</Option>);
				}
			}
		});*/
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
		//默认查询table2 数据
		this.props.dispatch({
			type: 'campus/fetch_school_course',
			payload: {},
			//callback: (res,data) => {	data2=[];	data2=data;}
		});
	}
	//点击取消
	handleCancel = () => {this.setState({visible: false})}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({formValues: {},});
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
		const rowKey1 = function(data1) {return data1.courseId;  /*主键id*/};
		const rowKey2 = function(data) {return data.courseId;  /*主键id*/};
		return(
			<PageHeaderLayout title="">
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
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
				    <Table rowKey={rowKey1} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data1} pagination={{ pageSize: 10 }} />
					<div className={styles.table_operations} >
				   	 	<Button icon="plus" type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
				    	<Button icon="edit" type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
				    </div>
				     <Table rowKey={rowKey2} columns={columns2} rowSelection={rowSelection2} loading={loading}  dataSource={data} pagination={{ pageSize: 10 }}/>
				  </div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)