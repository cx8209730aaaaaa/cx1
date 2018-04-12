import React, {	Component} from 'react';
import { connect } from 'dva'; 
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//课程包管理 -admin  单独
const RangePicker = DatePicker.RangePicker;
var school_select=[];//学校
var coursePage_select=[];//父级课程
const Option = Select.Option;

var data2=[];
var data3=[];
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
//已添加
var columns2 = [{
	title: '序号',
	dataIndex: 'courseId',
	key: 'courseId',
	fixed:'left',
	render: (text, record, index) => {
		return index + 1
	}
}, {
	title: '课程名称',
	dataIndex: 'name',
	key: 'name',
	fixed:'left',
}, {
	title: '描述',
	dataIndex: 'description',
	key: 'description',
}, {
	title: '价格',
	dataIndex: 'price',
	key: 'price',
}, {
	title: '折扣价',
	dataIndex: 'discountPrice',
	key: 'discountPrice',
}, {
	title: '状态',
	dataIndex: 'state',
	key: 'state',
	render: (text, record, index) => {
		if(record.state == 1) return "有效"
		else if(record.state == 0) return "无效"
	}
},{
      title: '操作',
      dataIndex: 'courseId',
      fixed:'right',
      render: (text, record) => {
        return (
         
            <a href="javascript:;" onClick={() => this.onremove(record.key)}>-</a>
          
        );
      }
    }
]

//已添加
var columns3 = [{
	title: '序号',
	dataIndex: 'courseId',
	key: 'courseId',
	fixed:'left',
	render: (text, record, index) => {
		return index + 1
	}
}, {
	title: '课程名称',
	dataIndex: 'name',
	key: 'name',
	fixed:'left'
}, {
	title: '描述',
	dataIndex: 'description',
	key: 'description',
}, {
	title: '价格',
	dataIndex: 'price',
	key: 'price',
}, {
	title: '折扣价',
	dataIndex: 'discountPrice',
	key: 'discountPrice',
}, {
	title: '状态',
	dataIndex: 'state',
	key: 'state',
	render: (text, record, index) => {
		if(record.state == 1) return "有效"
		else if(record.state == 0) return "无效"
	}
},{
      title: '操作',
      dataIndex: 'name',
      fixed:'right',
      render: (text, record) => {
        return (
            <a href="javascript:;" onClick={() => this.onadd(record.key)}>+</a>
          
        );
      }
    }
]


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
		if(title=="课程"){
			return(
			<Modal
			width="800px"
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      	>
				<Row>
			      <Col span={12} style={{padding:'0px 5px'}}>
			      <h4>已添加课程</h4>
			      <Table  columns={columns2}  dataSource={data2} pagination={{ pageSize: 10 }} scroll={{ x: '200%'}}/></Col>
			      <Col span={12} style={{padding:'0px 5px'}}>
			       <h4>未添加课程</h4>
			      <Table  columns={columns3}  dataSource={data3} pagination={{ pageSize: 10 }} scroll={{ x: '200%'}}/></Col>
			    </Row>
			</Modal>
			)
		}
		return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      >
	        <Form layout="horizontal">
	          	<FormItem label="课程包" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('name', {
		            	initialValue:objs.name,
		              	rules: [{ required: true, message: '课程名称不能为空!' }],
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="学校" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('schoolId', {
		            	initialValue:objs.schoolId,
		            })(
		            <Select  mode="tags"  mode="multiple" allowClear placeholder="通用型" >
						{school_select}
					</Select> 
		            )}
	          	</FormItem>
	          	<FormItem label="销售时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            	{getFieldDecorator('salesDate', {
	            		initialValue:objs.salesDate,
	            		rules: [{ required: true, message: '销售时间不能为空!' }],
	            	})(
	            		<RangePicker showTime  format="YYYY-MM-DD HH:mm:ss" style={{width:'100%'}} />
	  				)}
	          	</FormItem>
	          	<FormItem label="有效时间" labelCol={{span: 4}}  wrapperCol={{span: 18}} >
	            	{getFieldDecorator('effectiveDate', {
	            		initialValue:objs.effectiveDate,
	            		rules: [{ required: true, message: '有效时间不能为空!' }],
	            	})(
	            		<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'100%'}}/>
	  				)}
	          	</FormItem>
	          	<FormItem label="是否长期有效" labelCol={{span: 6}}  wrapperCol={{span: 16}} >
	            	{getFieldDecorator('validity', {
	            		initialValue:objs.validity,
	            	})(
	            		<Select placeholder="请选择">
	             			<Option value="1">是</Option>
				            <Option value="0">否</Option>
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
	          	<FormItem label="类型" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('type', {
		            	initialValue:objs.type,
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
	          	<FormItem label="父级" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('parentId',{
	            		initialValue:objs.parentId,
	            	})(
				    	<Select allowClear searchPlaceholder="请选择"  >
							{coursePage_select}
						</Select> 
	            	)}
	          	</FormItem>
	          	<FormItem label="排序" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('sequence', {
	            		initialValue:objs.sequence,
	            	})(
	            		<Input />
	  				)}
	          	</FormItem>
	          	<FormItem label="有效次数" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('activeNumber', {
	            		initialValue:objs.activeNumber,
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
		}else{ //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					 if(title == "课程"){
					 	//查询已有的课程
						this.props.dispatch({
							type: 'campus/fetch_coursePagese_courselect',
							payload: {coursePageId:rowSelections.selectedRows[0].coursePageId},
							callback: (res, data) => {
								data2=[];
								data2=data;
							},
						});
						//查询所有课程包 未加入课程包
						this.props.dispatch({
							type: 'campus/fetch_coursePagese_courselect2',
							payload: {coursePageId:rowSelections.selectedRows[0].coursePageId},
							callback: (res, data) => {
								data3=[];
								data3=data;
							},
						});
						this.setState({visible: true,title: title,objs: ""});
						
					}else{
				var data=rowSelections.selectedRows[0];
						data.effectiveDate=[moment(data.effectiveStartDate),moment(data.effectiveEndDate)]
						data.salesDate=[moment(data.salesStartDate),moment(data.salesEndDate)]
						if(data.schoolId!=0&&data.schoolId!=undefined&&data.schoolId.length>1){
							data.schoolId=data.schoolId.split(",");
						}else if(data.schoolId==0){
							data.schoolId=undefined
						}
						if(data.type!=undefined){//课程类型
							data.type+=''
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
						if(data.validity!=undefined){//是否长期有效
							data.validity+=''
						}
						
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
	
	onadd = (key) => {
		console.log(key);
	    const dataSource = [...this.state.dataSource];
	    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
	}
	onremove = (key) => {
		console.log(key);
	    const dataSource = [...this.state.dataSource];
	    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
	 }
	//新增  编辑
	handleCreate = (title) => {
		if(title == "课程"){
			
		}else{
			const form = this.form;
			form.validateFields((err, values) => {
				if(err) {return;}
				console.log('Received values of form: ', values);
				if(values.parentId == undefined)	 values.parentId="" //父级
				if(values.state == undefined)	 values.state="1" //状态
				if(values.upDownState == undefined) values.upDownState="0"//上下架状态
				if(values.type == undefined) values.type="1" //课程类型
				if(values.hotState == undefined) values.hotState="0" //热门
				if(values.newState == undefined) values.newState="0" //最新
				if(values.sequence == undefined) values.sequence=""//
				if(values.discountPrice == undefined) values.discountPrice=""//折扣价
				if(values.activeNumber == undefined) values.activeNumber=""//有效次数
				if(values.validity == undefined) values.validity=""//是否长期有效
				if(values.schoolId!=undefined){
					values.schoolId=values.schoolId.join(",");
				}else{
					values.schoolId=""
				}
				values.salesStartDate=timestampToTime(values.salesDate[0]);//销售开始时间
				values.salesEndDate=timestampToTime(values.salesDate[1]);//销售结束时间
				values.effectiveStartDate=timestampToTime(values.effectiveDate[0]);//有效开始时间
				values.effectiveEndDate=timestampToTime(values.effectiveDate[1]);//有效结束时间
				form.resetFields();
				if(title == "新增") { //新增
					this.props.dispatch({
						type: 'campus/add_coursePage',
						payload: {	...values},
						callback: (res, resMsg) => {
							if(res == 1) 	message.success(resMsg);
							else	message.error(resMsg);
						},
					});
				}else{ //编辑
					var Id = [];
					if(rowSelections.selectedRows.length == 1) {
						Id.push(rowSelections.selectedRows[0].coursePageId);
					} else {
						for(var i = 0; i < rowSelections.selectedRows.length; i++) {
							Id.push(rowSelections.selectedRows[i].coursePageId);
						}
					}
					this.props.dispatch({
						type: 'campus/edit_coursePage',
						payload: {	...values,coursePageId:Id,},
						callback: (res, resMsg) => {
							if(res == 1) 	message.success(resMsg);
							else message.error(resMsg);
						},
					});
				}
				
			});
		}
		this.setState({	visible: false});
	}
	//点击取消
	handleCancel = () => {this.setState({visible: false});}
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'campus/fetch_coursePage',});
		//默认查询 父级课程包 select
		this.props.dispatch({
			type: 'campus/fetch_coursePageselect',
			callback: (res,data) => {
				coursePage_select=[];
				for (let i = 0; i < data.length; i++) {
				  coursePage_select.push(<Option key={data[i].coursePageId}>{data[i].name}</Option>);
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
		const rowKey = function(data) {return data.coursePageId;  /*主键id*/};
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
				      	<Button icon="edit" type="primary"  onClick={() => this.showModal('课程')}>课程</Button>
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