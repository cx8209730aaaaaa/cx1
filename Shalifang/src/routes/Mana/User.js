import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,Tree,DatePicker,Upload} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from './Role.less';

function onChange2(value) {
  console.log('选择了时间：', value);
}


var school_select=[];//学校
var headerimg="";
var imageUrl="";
//时间戳 转化为时间格式
var Y,M,D="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = date.getDate();
   /* h = date.getHours() + ':';  m = date.getMinutes() + ':';  s = date.getSeconds();*/
    return Y+M+D;//+h+m+s;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {/*
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;*/
}

class Avatar extends React.Component {
  state = {  loading: false };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if(info.file.status === 'done') {
    	headerimg=info.file.response.obj.path;
    	imageUrl=info.file.response.obj.path;
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
	  if(imageUrl==undefined){
	  	 imageUrl = this.state.imageUrl;
	  }else{
	  	headerimg=imageUrl;
	  }
    const urls="api/attachment/upload.manage?token="+localStorage.getItem('token');
    return (
      <Upload
        name="file"
        style={{width:'100px'}}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={urls}
        method="POST"
        enctype="multipart/form-data"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt=""  style={{width:'100px'}} /> : uploadButton}
      </Upload>
    );
  }
}

//tree  机构 data
var treeData =[];
const TreeNode = Tree.TreeNode;
//select
const Option = Select.Option;
//table 列表
const columns = [
	{
		title: '所属机构',
		dataIndex: 'orgId',
		key: 'orgId',
	},{
		title: '员工名称',
		dataIndex: 'name',
		key: 'name',
		className:"hide"
	},{
		title: '联系电话',
		dataIndex: 'phone',
		key: 'phone',
	},	{
		title: '登陆账号',
		dataIndex: 'loginAccount',
		key: 'loginAccount',
	},{
		title: '邮箱',
		dataIndex: 'email',
		key: 'email',
	}, {
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

//table复选框选中
// rowSelection objects indicates the need for row selection
var rowSelections = "";
const rowSelection = {
	/*onChange: (selectedRowKeys, selectedRows) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},*/
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
		const {	visible,title,onCancel,onCreate,form,showModal,dispatch,objs } = props;
		const {	getFieldDecorator } = form;
		return(
			<Modal
		        visible={visible}
		        title={title}
		        okText="确定"
		        onCancel={onCancel}
		        onOk={onCreate}
		      >
						<Form layout = "horizontal" >
						<FormItem label = "机构"	labelCol = {{span: 4}}	wrapperCol = {{span: 18}} > 
						{getFieldDecorator('orgId', {
							initialValue: objs.orgId,
							rules: [{required: true,message: '机构不能为空!'}],
						})(
							<TreeSelect  dropdownMatchSelectWidth   treeDefaultExpandAll   allowClear
					    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}   placeholder="请选择机构"
					        treeData={treeData}  >
				    	</TreeSelect>
		          )}
		        </FormItem>
		        <FormItem label="员工名称"   labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('name', {
		            	 initialValue:objs.name,
		              rules: [{ required: true, message: '员工名称不能为空!' }],
		            })(
		              <Input />
		            )}
		          </FormItem>
		           <FormItem label="登录账号"   labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('loginAccount',{
		            	 initialValue:objs.loginAccount,
		            	 rules: [{ required: true, message: '登录账号不能为空!' }],
		            })(
		              <Input />
		            )}
		          </FormItem>
		          <FormItem label="联系电话"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('phone',{
		            	 initialValue:objs.phone,
		            	 rules: [{ required: true, message: '联系电话不能为空!' }],
		            })(
		              <Input />
		            )}
		          </FormItem>
		         
		          <FormItem label="邮箱"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('email',{
		            	 initialValue:objs.email,
		            	 rules: [{ required: true, message: '邮箱不能为空!' }],
		            })(
		              <Input />
		            )}
		          </FormItem>
		          <FormItem label="职位描述"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('jobDescription',{
		            	 initialValue:objs.jobDescription,
		            	 rules: [{ required: true, message: '职位描述不能为空!' }],
		            })(
		              <Input />
		            )}
		          </FormItem>
		            <FormItem label="头像"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {(
		              <Avatar/>
		            )}
		          </FormItem>
		          <FormItem label="入职时间"  labelCol={{span: 4}}  wrapperCol={{span: 17}}>
		            {getFieldDecorator('inJobDate',{
		            	 initialValue:objs.inJobDate ,
		            })(
		            	 <DatePicker/>
		            )}
		          </FormItem>
		          <FormItem label="离职时间"  labelCol={{span: 4}}  wrapperCol={{span: 17}}>
		            {getFieldDecorator('outJobDate',{
		            	 initialValue:objs.outJobDate,
		            })(
		              <DatePicker />
		            )}
		          </FormItem>
		           <FormItem label="状态"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('state', {
		            	 initialValue: objs.state,
		            	rules: [{ required: true, message: '状态不能为空!' }],
		            })(
		            <Select  placeholder="请选择状态"  >
	                  <Option value="1">有效</Option>
	                  <Option value="0">无效</Option>
	                </Select>
		  			)}
		          </FormItem>
		          
		           <FormItem label="学校"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('schoolId',{
		            	 initialValue:objs.schoolId,
		            	  rules: [{ required: true, message: '学校编码不能为空!' }],
		            })(
		              <Select   searchPlaceholder="请选择" allowClear>
										{school_select}
									</Select> 
		            )}
		          </FormItem>
		          <FormItem label="个人描述"  labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('personDescription',{
		            	 initialValue:objs.personDescription,
		            	  rules: [{ required: true, message: '个人描述不能为空!' }],
		            })(
		              <Input />
		            )}
		          </FormItem>
	        	</Form>
	      	</Modal>
		);
	}
);

@connect(({	basics,	loading}) => ({
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
			imageUrl="";
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
					this.props.dispatch({
						type: 'basics/fetchId_user',
						payload: {employeeId: rowSelections.selectedRows[0].employeeId,},
						callback: (res,data) => {
							data.inJobDate=moment(data.inJobDate)
							data.outJobDate=moment(data.outJobDate)
							data.orgId+=''
							data.state+=''
							data.schoolId+=''
							if(data.headPortrait!=undefined){
								imageUrl=data.headPortrait
							}
						
							if(res==1){//成功
									this.setState({
											visible: true,
											title: title,
											objs: data,
									});
							}
	        	},
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

	//默认查询table 数据
	componentDidMount() {
		this.props.dispatch({
			type: 'basics/fetch_user',
			payload: {
				pageIndex: 1,
				pageSize: 10,
			},
		});
		
		//默认查询组织机构  tree
		this.props.dispatch({
			type: 'basics/fetch_organ_tree',
			callback: (res,data) => {
				if(res==1){//成功
					treeData=data;
				}
	    },
		});
		//默认查询 学校 select 
		this.props.dispatch({
			type: 'campus/fetch_ListByschoolselect',
			callback: (res,data) => {
				for (let i = 0; i < data.length; i++) {
				  school_select.push(<Option key={data[i].id}>{data[i].value}</Option>);
				}
			}
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
			if(values.name == undefined) {
				values.name = ""
			}
			if(values.phone == undefined) {
				values.phone = ""
			}
			if(values.loginAccount == undefined) {
				values.loginAccount = ""
			}
			if(values.email == undefined) {
				values.email = ""
			}
			if(values.state == undefined) {
				values.state = ""
			}
			if(values.state == undefined || values.state == true || values.state == "" || values.state == null) { //状态默认和选中状态为1
				values.state = 1
			} else {
				values.state = 0
			}
			
			values.headPortrait=headerimg;
			values.inJobDate=timestampToTime(values.inJobDate);
			values.outJobDate=timestampToTime(values.outJobDate);
			form.resetFields();
			if(title =="新增") { //新增
				this.props.dispatch({
					type: 'basics/add_user',
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
					Id.push(rowSelections.selectedRows[0].employeeId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].employeeId);
					}
				}
				this.props.dispatch({
					type: 'basics/edit_user',
					payload: {
						...values,
						employeeId: Id,
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
	
   
  
	/*删除  编辑状态*/
	deleaitModel = (title) => {
		const {	dispatch,form} = this.props;
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].employeeId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].employeeId);
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
							type: 'basics/remove_user',
							payload: {
								employeeIds: Id
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
							type: 'basics/edit_user_state',
							payload: {
								employeeIds: Id,
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
		const {	form,dispatch} = this.props;
		form.resetFields();
		this.setState({
			formValues: {},
		});
		dispatch({
			type: 'basics/fetch_user',
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
			if(values.name == undefined) {
				values.name = ""
			}
			if(values.phone == undefined) {
				values.phone = ""
			}
			if(values.loginAccount == undefined) {
				values.loginAccount = ""
			}
			if(values.email == undefined) {
				values.email = ""
			}
			if(values.state == undefined) {
				values.state = ""
			}
			dispatch({
				type: 'basics/fetch_user',
				payload: {
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
		const {	getFieldDecorator} = this.props.form;
		return(
			<Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
           <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电话">
              {getFieldDecorator('phone')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="登录账号">
              {getFieldDecorator('loginAccount')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
         <Col md={8} sm={24}>
            <FormItem label="邮箱">
              {getFieldDecorator('email')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
           <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">有效</Option>
                  <Option value="1">无效</Option>
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
		const {visible,title,confirmLoading} = this.state;
		const {basics: {data = []},loading} = this.props;
		const rowKey = function(data) {
		  return data.employeeId;  // 主键id
		};
		return(
				<PageHeaderLayout title="">
			    <Card className={styles.tableList} bordered={false}>
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
					</Card>
   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)