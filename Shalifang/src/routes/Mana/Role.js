import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Tree,Col,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Role.less';
//角色

const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;

//权限菜单 treeDtae
var treeData = [];//tree菜单内容
var Keysarry="";//权限配置获取选中项的值
var checkkey=[];//权限配置默认选中项的值
//点击配置  复选框
/*function onCheck(checkedKeys, info){
	this.setState({
      checkedKeys,
      //selectedKeys: ['0-3', '0-4'],
    });
	console.log('onCheck', checkedKeys, info);
	Keysarry=checkedKeys;
}*/


//机构管理
var treeorgData = [];//tree菜单内容
var Keysorgarry="";//权限配置获取选中项的值
var checkorgkey="";//权限配置默认选中项的值

//table  角色
const columns = [{
	title: '序号',
	dataIndex: 'roleId',
	key: 'roleId',
	width: '15%',
	render: (text, record, index) => {	return index + 1}
}, {
	title: '角色名称',
	dataIndex: 'name',
	key: 'name',
	width: '20%',
}, {
	title: '描述',
	dataIndex: 'description',
	key: 'description',
	width: '50%',
	render: (text) => <span className="coltdsn">{text}</span>,
}, {
	title: '状态',
	dataIndex: 'state',
	key: 'state',
	width: '15%',
	render: (text, record, index) => {
		if(record.state == 1) {
			return "有效"
		} else if(record.state == 0) {
			return "无效"
		}
	}
}];

//table复选框选中
// rowSelection objects indicates the need for row selection
var rowSelections = "";
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
//table复选框选中
// rowSelection objects indicates the need for row selection
var rowSelections2 = "";
const rowSelection2 = {
 	getCheckboxProps(record) {
   		return {
  			defaultChecked: record.employeeId== table2col[0],// 配置默认勾选的列
		};
	},
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

//人员查询
var table2=[];
var table2col=[];
const columns2 = [{
  title: '组织结构编码',
  dataIndex: 'orgId',
  key: 'orgId',
}, {
  title: '员工名称',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '所属学校',
  dataIndex: 'schoolName',
  key: 'schoolName',
}];
//form 表单
const FormItem = Form.Item;
//表单内容
const CollectionCreateForm = Form.create()(
	(props) => {
		const {	visible,title,onCancel,onCreate,form,showModal,dispatch,objs,onChangetree,renderTreeNodes,onCheck} = props;//
		const {	getFieldDecorator } = form;
		if(title=="配置权限"){
			return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	      	>
		        <Form layout="horizontal">
		           <FormItem label="权限"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('menuIds', {
	            	 	initialValue:objs,
	            	})(
		           		<Tree checkable  defaultExpandAll  multiple defaultCheckedKeys={checkkey}	
			           		  onCheck={onCheck} >
		           		{renderTreeNodes(treeData)}
						</Tree>
		           	)}
		          </FormItem>
	        	</Form>
	      	</Modal>
			);
		}else if(title=="人员分配"){
			return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
	       >
				<TreeSelect	dropdownMatchSelectWidth	treeDefaultExpandAll	allowClear 
					dropdownStyle={{ maxHeight: 400, overflow: 'auto', }}  style={{ width: 300 }}    placeholder="请选择机构"
					treeData={treeorgData}   onChange={onChangetree} >
				</TreeSelect>	
		    	<Table rowkey={table2.employeeId}   dataSource={table2} columns={columns2} rowSelection={rowSelection2} size="small"/>
		  	</Modal>
			);
		}else{
			return(
			<Modal
	        visible={visible}
	        title={title}
	        okText="确定"
	        onCancel={onCancel}
	        onOk={onCreate}
		    >
	        	<Form layout="horizontal">
		          	<FormItem label="角色名称"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
			            {getFieldDecorator('name', {
			            	initialValue:objs.name,
			              	rules: [{ required: true, message: '角色名称不能为空!' }],
			            })(
			              	<Input />
			            )}
			          </FormItem>
		           	<FormItem label="状态"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
			            {getFieldDecorator('state', {
			            	initialValue:objs.state,
			            })(
			            <Select placeholder="请选择状态" allowClear>
		                  	<Option value="1">有效</Option>
		                  	<Option value="0">无效</Option>
		                </Select>
			  			)}
		          	</FormItem>
		          	<FormItem label="角色描述"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
			            {getFieldDecorator('description',{
			            	initialValue:objs.description,
			            })(
			              	<TextArea rows={3} />
			            )}
		          </FormItem>
        		</Form>
    		</Modal>
			);	
		}
	}
);
@connect(({	basics,	loading}) => ({	basics,	loading: loading.models.basics}))
@Form.create()
class App extends React.Component {
	state = {
		confirmLoading: false,
		confirmLoading2: false,
		visible: false,
		title: "新增角色",
		objs: "", //编辑时赋值
	};
	
	//打开弹窗
	showModal = (title) => {
		this.form.resetFields();
		if(title == "新增") {
			this.setState({visible: true,title: title,objs: ""});
		}else{
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			}else{
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				}else{
					if(title == "编辑"){
						rowSelections.selectedRows[0].state+=''
						this.setState({
							visible: true,
							title: title,
							objs: rowSelections.selectedRows[0],
						});
					}else if( title=="人员分配"){
						//默认查询所有人员
						this.props.dispatch({
							type: 'basics/getEmployeeListByRole',
							payload: {roleId:rowSelections.selectedRows[0].roleId},
							callback: (res,data) => {
								this.setState({
									visible: true,
									title: title,
									objs:data.employees,
								});
								table2=[];
								table2col=[];
								table2=data.employees;
								table2col=data.roleEmployee;
					  		}
						});
					}else{
						//默认查询tree
						this.props.dispatch({
							type: 'basics/fetch_menu_checktree',
							payload: {roleId:rowSelections.selectedRows[0].roleId},
							callback: (res,data) => {
								treeData=[];
								treeData=data.selectTree;
								checkkey=[];
								for(var i = 0; i <data.selectMenuIds.length; i++) {
									checkkey.push(data.selectMenuIds[i]);
								}
								//checkkey=data.selectMenuIds;
								console.log(treeData+"..."+checkkey);
								this.setState({
									visible: true,
									title: title,
									objs:checkkey,
								});
					    	}
						});
					}
				}
			}
		}
	}
	//新增  编辑
	handleCreate = (title) => {
		const form = this.form;
		if(title=="配置权限"){
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].roleId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].roleId);
				}
			}
			this.props.dispatch({
				type: 'basics/insertRoleMenu',
				payload: {roleId:Id,menuIds: Keysarry},
				callback: (res, resMsg) => {
					if(res == 1)	message.success(resMsg);
					else 	message.error(resMsg);
				},
			});
			this.setState({visible: false});
		}else if( title== "人员分配"){
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].roleId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].roleId);
				}
			}
			var Id2 = [];
			if(rowSelections2.selected==true){//人员id
				if(rowSelections2.selectedRows.length == 1) {
					Id2.push(rowSelections2.selectedRows[0].employeeId);
				} else {
					for(var i = 0; i < rowSelections2.selectedRows.length; i++) {
						Id2.push(rowSelections2.selectedRows[i].employeeId);
					}
				}
			}
			this.props.dispatch({
				type: 'basics/fetch_org_userqx',
				payload: {roleId:Id,employeeIds: Id2},
				callback: (res, resMsg) => {
					if(res == 1) 	message.success(resMsg);
					else 	message.error(resMsg);
				},
			});
			this.setState({	visible: false});
		}else{
			form.validateFields((err, values) => {
				if(err) {	return;}
				console.log('Received values of form: ', values);
				if(values.state == undefined) { //状态默认和选中状态为1
					values.state = 1
				}
				if(values.description == undefined) { 
					values.description =""
				}
				form.resetFields();
				if(title == "新增") { //新增
					this.props.dispatch({
						type: 'basics/add_role',
						payload: {	...values},
						callback: (res, resMsg) => {
							if(res == 1) 	message.success(resMsg);
							else	message.error(resMsg);
						},
					});
				}else{ //编辑
					var Id = [];
					if(rowSelections.selectedRows.length == 1) {
						Id.push(rowSelections.selectedRows[0].roleId);
					} else {
						for(var i = 0; i < rowSelections.selectedRows.length; i++) {
							Id.push(rowSelections.selectedRows[i].roleId);
						}
					}
					if(title == "编辑"){
						this.props.dispatch({
							type: 'basics/edit_role',
							payload: {	...values,	roleId: Id,},
							callback: (res, resMsg) => {
								if(res == 1) 	message.success(resMsg);
								else 	message.error(resMsg);
							},
						});
					}
				}
				this.setState({	visible: false});
			});
		}
	}
	/*删除  编辑状态*/
	deleaitModel = (title) => {
		const {	dispatch,form} = this.props;
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].roleId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].roleId);
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
							type: 'basics/remove_role',
							payload: {	roleIds: Id},
							callback: (res, resMsg) => {
								if(res == 1) 	message.success(resMsg);
								else	message.error(resMsg);
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
							type: 'basics/edit_role_state',
							payload: {
								roleIds: Id,
								state:state,
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
	//默认查询table 数据
	componentDidMount() {
		//查询所有角色
		this.props.dispatch({
			type: 'basics/fetch_role',
		});
		//角色-人员分配  查询机构
		this.props.dispatch({
			type: 'basics/fetch_organ_tree',
			callback: (res, data) => {
				if(res == 1) {
					treeorgData=data;
				}
			},
		});
	}
	//点击机构 查询用户
  	onChangetree = (value) => {
    	this.props.dispatch({
				type: 'basics/getEmployeeListByRole',
				payload: {
					roleId:rowSelections.selectedRows[0].roleId,
					orgId:value,
				},
				callback: (res, data) => {
					console.log(data);
					if(res == 1) {
						table2=data.employees;
						table2col=data.roleEmployee;
					}
				},
    });
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    // this.setState({ checkedKeys });
    Keysarry=checkedKeys;
  }
  renderTreeNodes = (treeData) => {
    return treeData.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
	//点击取消
	handleCancel = () => {
		this.setState({
			visible: false,
			objs:""
		});
	}
	
	//重置
	handleFormReset = () => {
		const {	form,dispatch} = this.props;
		form.resetFields();
		this.setState({
			formValues: {},
		});
		dispatch({
			type: 'basics/fetch_role',
			payload: {
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
			if(values.name == undefined)	values.name = ""
			if(values.description == undefined)	values.description = ""
			if(values.state == undefined) 	values.state = ""
			if(values.updatedAt == undefined) 	values.updatedAt = ""
			dispatch({
				type: 'basics/fetch_role',
				payload: {	...values}
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
		            <FormItem label="角色名称">
		              {getFieldDecorator('name')(
		                <Input placeholder="请输入" />
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <FormItem label="描述">
		              {getFieldDecorator('description')(
		                <Input placeholder="请输入" />
		              )}
		            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
		            <FormItem label="状态">
		              {getFieldDecorator('state')(
		                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
		                  <Option value="1">有效</Option>
		                  <Option value="0">无效</Option>
		                </Select>
		              )}
		            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		           <Col md={24} sm={48}>
		            <FormItem>
			            <span style={{ float: 'right'}}>
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
		const {visible,title,confirmLoading,confirmLoading2} = this.state;
		const {basics: {data = []},loading,dispatch} = this.props;
		const rowKey = function(data) {  return data.roleId;/*+Date.parse(new Date()); 主键id*/};
		return(
			<PageHeaderLayout title="">
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
		            </div>
					<div className={styles.table_operations} >
				      	<Button  type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
				      	<Button  type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
				      	<Button  type="primary"  onClick={() => this.deleaitModel('dele')}>删除</Button>
				      	<Button  type="primary"  onClick={() => this.deleaitModel('state1')}>启用</Button>
				      	<Button  type="ghost"  onClick={() => this.deleaitModel('state0')}>禁用</Button>
				      	<Button  type="primary"  onClick={() => this.showModal('配置权限')}>权限</Button>
				      	<Button  type="primary"  onClick={() => this.showModal('人员分配')}>人员</Button>
				    </div>
				    <CollectionCreateForm  alt="弹窗" 
				          ref={this.saveFormRef}
				          title={this.state.title}
				          objs={this.state.objs}
				          confirmLoading={confirmLoading}
				          visible={this.state.visible}
				          onCancel={this.handleCancel} 
				          onChangetree={this.onChangetree} 
				          renderTreeNodes={this.renderTreeNodes}
				          onCheck={this.onCheck}
				          onCreate={() => this.handleCreate(this.state.title)}
				    />
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data} pagination={{ pageSize: 10 }}  scroll={{ x: '100%'}}/>
				</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)