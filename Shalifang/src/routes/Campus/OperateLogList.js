import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message,Pagination, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
/*import { routerRedux } from 'dva/router'; //调取接口用*/
import styles from './Role.less';

//tree  机构 data
var treeData =[];
//select
const Option = Select.Option;
//类型点击事件
function handleChange(value) {
	console.log(`selected ${value}`);
}
//时间戳 转化为时间格式
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 <10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = (date.getDate()    <10 ? '0'+date.getDate() : date.getDate()) + ' ';
    h = (date.getHours()   <10 ? '0'+date.getHours(): date.getHours()) + ':'; 
    m = (date.getMinutes() <10 ? '0'+date.getMinutes(): date.getMinutes()) + ':'; 
    s = date.getSeconds()  <10 ? '0'+date.getSeconds(): date.getSeconds();
    return Y+M+D+h+m+s;
}
//table 列表
const columns = [
	{
	title: ' 操作日志ID',
		dataIndex: 'operateLogId',
		key: 'operateLogId',
	},
	{
		title: '操作时间',
		dataIndex: 'operateDate',
		key: 'operateDate',
	}, {
		title: '操作类型',
		dataIndex: 'type',
		key: 'type',
	},
	 {
		title: '班级编码',
		dataIndex: 'content',
		key: 'content',
	},
	 {
		title: '操作员ID',
		dataIndex: 'operaterId',
		key: 'operaterId',
	},
	 {
		title: '操作员名称',
		dataIndex: 'operaterName',
		key: 'operaterName',
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
	          <FormItem label="负责人" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('employeeId', {
	            	 initialValue:objs.employeeId,
	              rules: [{ required: true, message: '负责人姓名不能为空!' }],
	            })(
	              <Select showSearch
				    style={{ width: 200 }}
				    placeholder="请选择人员"
				    optionFilterProp="children"
				    notFoundContent="无法找到"
				    searchPlaceholder="输入关键词"
				  >
				    <Option value="1">杰克</Option>
				    <Option value="2">露西</Option>
				    <Option value="3">汤姆</Option>
				  </Select>
	            )}
          	</FormItem>
            <FormItem label="孩子编码" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('childrenId', {
	            	initialValue:objs.childrenId,
	              rules: [{ required: true, message: '班级名称不能为空!' }],
	            })(
	               <Input />
	            )}
          	</FormItem>
          	<FormItem label="班级编码" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('classId', {
	            	initialValue:objs.classId,
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
	              <DatePicker  showTime   format="YYYY/MM/DD HH:mm:ss"/>
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
		this.form.resetFields();
		if(title == "新增") {
			this.setState({
				visible: true,
				title: title,
				objs: "",
			});
		} else { //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					rowSelections.selectedRows[0].employeeId+=''
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
	handleCancel = () => {
		this.setState({
			visible: false
		});
	}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({
			type: 'campus/getOperateLogList',
		});
	}
	//新增  编辑
	handleCreate = (title) => {
		const form = this.form;
		form.validateFields((err, values) => {
			if(err) {
				return;
			}
			console.log('Received values of form: ', values);
			
			values.employeeName=values.employeeId;
			console.log(employeeId);
			values.upCourseDate=timestampToTime(values.upCourseDate);//开课时间
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'campus/add_class',
					payload: {
						...values,
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
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].classId );
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].classId );
					}
				}
				//获取id
				console.log("..Id" + Id);
				this.props.dispatch({
					type: 'campus/edit_class',
					payload: {
						...values,
						classId : Id,
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
			type: 'campus/fetch_class',
			payload:{
				pageIndex: 1,
				pageSize: 10,
			} 
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
			if(values.employeeName==undefined){
				values.employeeName=""
			}
			if(values.name==undefined){
				values.name=""
			}
			if(values.nikeName==undefined){
				values.nikeName=""
			}
			if(values.upCourseDate==undefined){
				values.upCourseDate=""
			}
			dispatch({
				type: 'campus/fetch_class',
				payload:{
					...values,
					pageIndex: 1,
					pageSize: 10,
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
                <Input placeholder="请输入" />
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
          <Col md={8} sm={24}>
            <FormItem label="开班时间">
              {getFieldDecorator('upCourseDate')(
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
		const rowKey = function(data) {
		  return data.operateLogId;  // 主键id
		};
		const pagination = {
			total: data.length,
			current: 1,
			showSizeChanger: true,
			onShowSizeChange(current, pageSize) {
				console.log('Current: ', current, '; PageSize: ', pageSize);
			},
			onChange(current) {
				
				console.log('Current: ', current);
			}
		};
		/* pagination={{ pageSize: 100 }}    pagination={pagination}*/
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
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}   pagination={{ pageSize: 10 }} showHeader useFixedHeader/>
				    
	      		</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)