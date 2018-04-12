import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col, } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Role.less';
//菜单
const Option = Select.Option;
//tree  机构 data
var treeData =[];
//table 列表
const columns = [
	{title: '序号',
		dataIndex: 'menuId',
		key: 'menuId',
		render: (text, record, index) => {	return index + 1},
	},{
		title: '菜单名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '父级ID',
		dataIndex: 'parentId',
		key: 'parentId',
	}, {
		title: '菜单类型',
		dataIndex: 'type',
		key: 'type',
		render: (text, record, index) =>{
			if(record.type==1){
				return "文件夹"
			}else if(record.type==2){
				return "菜单"
			}else{
				return "按钮"
			}
		} 
	},{
		title: '菜单URL',
		dataIndex: 'url',
		key: 'url',
	},{
		title: 'icon',
		dataIndex: 'icon',
		key: 'icon',
		render(val) {  return <Icon type={val} />},
	},
	{
		title: '描述',
		dataIndex: 'description',
		key: 'description',
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
	          <FormItem label="菜单名称"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('name', {
	            	 initialValue:objs.name,
	              rules: [{ required: true, message: '菜单名称不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
         	 <FormItem label="上级菜单"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('parentId',{
            	 initialValue:objs.parentId,
            })(
            	<TreeSelect  dropdownMatchSelectWidth   treeDefaultExpandAll   allowClear
						    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}   placeholder="请选择上级菜单"
						    treeData={treeData}>
					    </TreeSelect>
            )}
          </FormItem>
          <FormItem label="菜单类型" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
            {getFieldDecorator('type', {
            	initialValue:objs.type,
              	rules: [{ required: true, message: '菜单类型不能为空!' }],
            })(
             <Select  placeholder="请选择" allowClear>
		      <Option value="1">文件夹</Option>
		      <Option value="2">菜单</Option>
		      <Option value="3">按钮</Option>
		    </Select>
            )}
          </FormItem>
          <FormItem label="状态" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
            {getFieldDecorator('state', {
            	initialValue:objs.state,
            	rules: [{ required: true, message: '菜单状态不能为空!' }],
            })(
            <Select placeholder="请选择">
              <Option value="1">有效</Option>
              <Option value="0">无效</Option>
            </Select>
  			)}
          </FormItem>
          <FormItem label="菜单URL" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('url', {
            	initialValue:objs.url,
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="菜单图标" labelCol={{span: 4}}  wrapperCol={{span: 18}}> 
            {getFieldDecorator('icon', {
            	initialValue:objs.icon,
              rules: [{ required: true, message: '菜单图标不能为空!' }],
            })(
              <Select  placeholder="请选择菜单类型" >
					      <Option value="bars" className={styles.optionss}><Icon type="bars" /></Option>
					      <Option value="folder-open" className={styles.optionss}><Icon type="folder-open" /></Option> 
					      <Option value="solution" className={styles.optionss}><Icon type="solution" /></Option>
					      <Option value="setting" className={styles.optionss}><Icon type="setting" /></Option>
					      <Option value="bar-chart" className={styles.optionss}><Icon type="bar-chart" /></Option>
					      <Option value="shopping-cart" className={styles.optionss}><Icon type="shopping-cart" /></Option>
					      <Option value="video-camera" className={styles.optionss}><Icon type="video-camera" /></Option>
					      <Option value="team" className={styles.optionss}><Icon type="team" /></Option>
					      <Option value="picture" className={styles.optionss}><Icon type="picture" /></Option>
					      <Option value="pause" className={styles.optionss}><Icon type="pause" /></Option>
					      <Option value="clock-circle" className={styles.optionss}><Icon type="clock-circle" /></Option>
				    </Select>
            )}
          </FormItem>
          <FormItem label="描述" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('description', {
            	initialValue:objs.description,
            })(
              <Input />
            )}
          </FormItem>
          
         
        </Form>
      </Modal>
		);
	}
);

@connect(({ basics, loading }) => ({
  basics,
  loading: loading.models.basics,
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
		} else { //编辑角色
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					rowSelections.selectedRows[0].parentId+=''
					rowSelections.selectedRows[0].type+=''
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
	handleCancel = () => {
		this.setState({
			visible: false
		});
	}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({
			type: 'basics/fetch_menu',
		});
		//默认查询tree
		this.props.dispatch({
			type: 'basics/fetch_menu_tree',
			callback: (res, data) => {
				if(res == 1) { //成功
					treeData = data;
				}
			},
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
			if(values.parentId == undefined) { //状态默认和选中状态为1
				values.parentId = 0
			} 
			if(values.url == undefined) { 
				values.url = 1
			} 
			if(values.description == undefined ) {
				values.description = 1
			} 
			if(values.state == undefined) { 
				values.state = 1
			} else {
				values.state = 0
			}
			
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'basics/add_menu',
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
					Id.push(rowSelections.selectedRows[0].menuId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].menuId);
					}
				}
				this.props.dispatch({
					type: 'basics/edit_menu',
					payload: {
						...values,
						menuId: Id,
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
				Id.push(rowSelections.selectedRows[0].menuId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].menuId);
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
							type: 'basics/remove_menu',
							payload: {menuIds:Id},
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
			} else {
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
							type: 'basics/edit_menu_state',
							payload: {
								menuIds: Id,
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

	//重置
	handleFormReset = () => {
		console.log("...重置")
		const {
			form,
			dispatch
		} = this.props;
		form.resetFields();
		this.setState({
			formValues: {},
		});
		dispatch({
			type: 'basics/fetch_menu',
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
			if(values.name==undefined){
				values.name=""
			}
			if(values.parentId==undefined){
				values.parentId=""
			}
			if(values.type==undefined){
				values.type=""
			}
			if(values.url==undefined){
				values.url=""
			}
			if(values.description==undefined){
				values.description=""
			}
			if(values.state==undefined){
				values.state=""
			}
			if(values.updatedAt==undefined){
				values.updatedAt=""
			}
			dispatch({
				type: 'basics/fetch_menu',
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
		const {getFieldDecorator} = this.props.form;
		return(
			<Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
           <Col md={8} sm={24}>
            <FormItem label="菜单名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="父级">
              {getFieldDecorator('parentId')(
                <TreeSelect  dropdownMatchSelectWidth   treeDefaultExpandAll   allowClear
			        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}   placeholder="请选择上级菜单"
			        treeData={treeData}>
			    </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="1">文件夹</Option>
                  <Option value="2">菜单</Option>
                  <Option value="3">按钮</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="菜单链接">
              {getFieldDecorator('url')(
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
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
		const { basics: { data=[] }, loading } = this.props;
		const {	visible,title,confirmLoading} = this.state;
		const rowKey = function(data) {
		  return data.menuId;  //主键id
		};
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
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data} pagination={{ pageSize: 10 }}/>
				    
	      		</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)