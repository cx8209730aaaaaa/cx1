import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import moment from 'moment';
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker,TimePicker  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//课程时间

const { RangePicker } = DatePicker;
const Option = Select.Option;

//时间戳 转化为时间格式
var h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    h = (date.getHours()   <10 ? '0'+date.getHours(): date.getHours()) + ':'; 
    m = (date.getMinutes() <10 ? '0'+date.getMinutes(): date.getMinutes()) + ':'; 
    s = date.getSeconds()  <10 ? '0'+date.getSeconds(): date.getSeconds();
    return h+m+s;
}
//table 列表
const columns = [{
	title: '序号',
	dataIndex: 'syllabusDateId',
	key: 'syllabusDateId',
	width: '10%',
	render: (text, record, index) => {
		return index + 1
	}
}, {
	title: '开始时间',
	dataIndex: 'startDate',
	key: 'startDate',
	width: '25%',
}, {
	title: '结束时间',
	dataIndex: 'endDate',
	key: 'endDate',
	width: '25%',
}, {
	title: '时间状态',
	dataIndex: 'dateStatus',
	key: 'dateStatus',
	width: '15%',
	render: (text, record, index) => {
		if(record.dateStatus == 1) {
			return "有效"
		} else if(record.dateStatus == 0) {
			return "无效"
		}
	}
},/* {
	title: '是否默认',
	dataIndex: 'isDefault',
	key: 'isDefault',
	width: '15%',
	render: (text, record, index) => {
		if(record.isDefault == 1) {
			return "是"
		} else if(record.isDefault == 0) {
			return "否"
		}
	}
}, */{
	title: '备注',
	dataIndex: 'remark',
	key: 'remark',
	width: '25%',
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
            <FormItem label="开始时间"labelCol={{span: 10}}  wrapperCol={{span: 10}} className={styles.w50left}>
	            {getFieldDecorator('startDate', {
	            	initialValue:objs.startDate,
	              rules: [{ required: true, message: '课程时间不能为空!' }],
	            })(
	              <TimePicker  placeholder="请选择" style={{width:'100%'}} />
	            )}
          	</FormItem>
          	<FormItem label="结束时间" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('endDate', {
	            	initialValue:objs.endDate,
	              	rules: [{ required: true, message: '课程时间不能为空!' }],
	            })(
	              <TimePicker  placeholder="请选择" style={{width:'100%'}} />
	            )}
          	</FormItem>
          	<FormItem label="时间状态"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('dateStatus', {
	            	initialValue:objs.dateStatus,
	            })(
	              <Select showSearch    style={{ width: '100%' }} placeholder="请选择">
				    <Option value="1">有效</Option>
				    <Option value="0">无效</Option>
				  </Select>
	            )}
          	</FormItem>
          
          	<FormItem label="备注" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('remark', {
	            	initialValue:objs.remark,
	            	rules: [{ required: true, message: '备注不能为空!' }],
	            })(
	               <Input />
	            )}
          	</FormItem>
        </Form>
      </Modal>
		);
	}
);
/*<FormItem label="是否默认"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
    {getFieldDecorator('isDefault', {
    	initialValue:objs.isDefault,
    })(
      <Select showSearch    style={{ width: '100%' }} placeholder="请选择">
	    <Option value="1">是</Option>
	    <Option value="0">否</Option>
	  </Select>
    )}
</FormItem>*/
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
			this.setState({
				visible: true,
				title: title,
				objs: "",
			});
		}else{ //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			}else{
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					var objs=new Object();
					objs.syllabusDateId=rowSelections.selectedRows[0].syllabusDateId+=''
					objs.dateStatus=rowSelections.selectedRows[0].dateStatus+=''
					objs.startDate=moment(rowSelections.selectedRows[0].startDate,'HH:mm:ss')
					objs.endDate=moment(rowSelections.selectedRows[0].endDate,'HH:mm:ss')
					objs.remark=rowSelections.selectedRows[0].remark
					this.setState({
						visible: true,
						title: title,
						objs: objs,
					});
				}
			}
		}
	}
	//点击取消
	handleCancel = () => {
		this.setState({visible: false});
	}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'campus/fetch_course_time'});
	}
	//新增  编辑
	handleCreate = (title) => {
		const form = this.form;
		form.validateFields((err, values) => {
			if(err) {
				return;
			}
			console.log('Received values of form: ', values);
			values.startDate=timestampToTime(values.startDate);//开始时间
			values.endDate=timestampToTime(values.endDate);//结束时间
			if(values.dateStatus==undefined){
				values.dateStatus=1
			}
			values.isDefault=1
			if(values.remark==undefined){
				values.remark=""
			}
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'campus/add_course_time',
					payload: {...values},
					callback: (res,resMsg) => {
						if(res == 1) message.success(resMsg);
						else message.error(resMsg);
					},
				});
			} else { //编辑
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].syllabusDateId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].syllabusDateId);
					}
				}
				this.props.dispatch({
					type: 'campus/edit_course_time',
					payload: {	...values,syllabusDateId: Id,},
					callback: (res, resMsg) => {
						if(res == 1)	message.success(resMsg); 
						else 	message.error(resMsg);
					},
				});
			}
			this.setState({
				visible: false,
			});
		});
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
				Id.push(rowSelections.selectedRows[0].syllabusDateId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].syllabusDateId);
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
							type: 'campus/remove_course_time',
							payload: {syllabusDateIds:Id},
							callback: (res,resMsg) => {
								if(res==1)	message.success(resMsg);
								else message.error(resMsg);
					        },
						});
					}
				});
			}else{
				var titles="";
				var state;
				if(title=="state1"){//启用
					titles="启用";
					state=1;
				}else{//禁用
					titles="禁用";
					state=0;
				}
				Modal.confirm({
					title: '是否'+titles+'选中项状态?',
					okText: '确定',
					cancelText: '取消',
					onOk() { //调取批量修改机构状态
						dispatch({
							type: 'campus/edit_course_time_state',
							payload: {syllabusDateIds: Id,state:state,},
							callback: (res, resMsg) => {
								if(res == 1) 	message.success(resMsg);
								else	message.error(resMsg);
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
		dispatch({type: 'campus/fetch_course_time',});
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
				type: 'campus/fetch_course_time',
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
		const { campus: { data=[] }, loading } = this.props;
		const rowKey = function(data) {return data.syllabusDateId;/*主键id*/};
		return(
			<PageHeaderLayout title="">
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
		            </div>
					<div className={styles.table_operations} >
				      	<Button icon="plus" type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
				      	<Button icon="edit" type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
				      	<Button icon="minus" type="primary" onClick={() => this.deleaitModel('dele')}>删除</Button>
				      	<Button icon="edit" type="primary"  onClick={() => this.deleaitModel('state1')}>启用</Button>
					    <Button icon="edit" type="ghost"  onClick={() => this.deleaitModel('state0')}>禁用</Button>
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