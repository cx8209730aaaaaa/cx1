import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col, } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Role.less';
//tree  机构 data
var treeData =[];
//select
const Option = Select.Option;
//类型点击事件
function handleChange(value) {
	console.log(`selected ${value}`);
}
//table 列表
const columns = [
	{
		title: '机构名称',
		dataIndex: 'name',
		key: 'name',
		width:'40%',
	},{
		title: '机构类型',
		dataIndex: 'type',
		key: 'type',
		width:'20%',
		render: (text, record, index) =>{
			if(record.type==1){
				return "机构"
			}else if(record.type==2){
				return "部门"
			}else{
				return "岗位"
			}
		} 
	}, {
		title: '地区编码',
		dataIndex: 'addrCode',
		key: 'addrCode',
		width:'20%',
	},
	{
		title: '状态',
		dataIndex: 'state',
		key: 'state',
		width:'20%',
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
	          <FormItem label="机构名称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('name', {
	            	 initialValue:objs.name,
	              rules: [{ required: true, message: '机构名称不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
         	 <FormItem label="上级机构" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('partId',{
            	 initialValue:objs.partId,
            })(
            	<TreeSelect  dropdownMatchSelectWidth   treeDefaultExpandAll   allowClear
				dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}   placeholder="请选择上级机构"
			    treeData={treeData} >
			    </TreeSelect>
            )}
          </FormItem>
          <FormItem label="机构类型" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('type', {
            	initialValue:objs.type,
              rules: [{ required: true, message: '机构类型不能为空!' }],
            })(
             <Select  onChange={handleChange} allowClear>
		      <Option value="1">机构</Option>
		      <Option value="2">部门</Option>
		      <Option value="3">岗位</Option>
		    </Select>
            )}
          </FormItem>
          <FormItem label="地区编码" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
            {getFieldDecorator('addrCode', {
            	initialValue:objs.addrCode,
              rules: [{ required: true, message: '地区编码不能为空!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="状态" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
            {getFieldDecorator('state', {
            	initialValue:objs.state,
            })(
            <Select placeholder="请选择状态" allowClear>
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
		} else { //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					if(rowSelections.selectedRows[0].partId==0){
						rowSelections.selectedRows[0].partId=undefined
					}else{
						rowSelections.selectedRows[0].partId+=''
					}
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
			type: 'basics/fetch_organ',
			payload: {
				pageIndex: 1,
				pageSize: 10,
			},
		});
		//默认查询tree
		this.props.dispatch({
			type: 'basics/fetch_organ_tree',
			callback:(res,data) => {
				if(res==1){//成功
					treeData=data;
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
			if(values.state == undefined || values.state == true || values.state == "" || values.state == null) { //状态默认和选中状态为1
				values.state = 1
			} else {
				values.state = 0
			}
			if(values.partId == undefined) { 
				values.partId =0
			}
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'basics/add_organ',
					payload: {
						...values,
					},
					callback: (res, resMsg) => {
						if(res == 1) { //成功
							message.success(resMsg);
							//默认查询tree
							this.props.dispatch({
								type: 'basics/fetch_organ_tree',
								callback:(res,data) => {
									if(res==1){//成功
										treeData=data;
									}
						        },
							});
						} else { //失败
							message.error(resMsg);
						}
					},
				});
				
			} else { //编辑
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].orgId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].orgId);
					}
				}
				//获取id
				console.log("..Id" + Id);
				this.props.dispatch({
					type: 'basics/edit_organ',
					payload: {
						...values,
						orgId: Id,
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
				Id.push(rowSelections.selectedRows[0].orgId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].orgId);
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
							type: 'basics/remove_organ',
							payload: {orgIds:Id},
							callback: (res,resMsg) => {
								if(res==1){//成功
									message.success(resMsg);
									//默认查询tree
									dispatch({
										type: 'basics/fetch_organ_tree',
										callback:(res,data) => {
											if(res==1){//成功
												treeData=data;
											}
								        },
									});
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
							type: 'basics/edit_organ_state',
							payload: {
								orgIds: Id,
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
			type: 'basics/fetch_organ',
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
			if(values.partId==undefined){
				values.partId=""
			}
			if(values.type==undefined){
				values.type=""
			}
			if(values.addrCode==undefined){
				values.addrCode=""
			}
			if(values.state==undefined){
				values.state=""
			}
			if(values.updatedAt==undefined){
				values.updatedAt=""
			}
			dispatch({
				type: 'basics/fetch_organ',
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
            <FormItem label="机构名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="机构类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="1">机构</Option>
                  <Option value="2">部门</Option>
                  <Option value="3">岗位</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="地区编码">
              {getFieldDecorator('addrCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
		const { basics: { data=[] }, loading } = this.props;
		const rowKey = function(data) {
		  return data.orgId;  // 主键id
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