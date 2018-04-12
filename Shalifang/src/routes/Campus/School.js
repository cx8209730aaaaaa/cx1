import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,Upload } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
/*import { routerRedux } from 'dva/router'; //调取接口用*/
import styles from '../Mana/Role.less';


const Option = Select.Option;

var treeData =[];//tree  机构 data
//图片
var headerimg="";
var imageUrl="";
//图片
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
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
        style={{width:'200px'}}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={urls}
        method="POST"
        enctype="multipart/form-data"
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt=""  style={{width:'200px'}} /> : uploadButton}
      </Upload>
    );
  }
}


//table 列表
const columns = [
	{
	title: '序号',
		dataIndex: 'sequence',
		key: 'sequence',
	},
	{
		title: '学校名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '机构ID',
		dataIndex: 'orgId',
		key: 'orgId',
	},{
		title: '地址',
		dataIndex: 'addr',
		key: 'addr',
	},{
		title: '图片',
		dataIndex: 'url',
		key: 'url',
		render: val => <img src={val} style={{width:'50px'}} />,
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
	          <FormItem label="学校名称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('name', {
	            	 initialValue:objs.name,
	              rules: [{ required: true, message: '学校名称不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
         	 <FormItem label="机构" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('orgId',{
            	 initialValue:objs.orgId,
            })(
            	<TreeSelect  dropdownMatchSelectWidth   treeDefaultExpandAll   allowClear
			        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}   placeholder="请选择上级机构"
			        treeData={treeData}  >
			    </TreeSelect>
            )}
          </FormItem>
          <FormItem label="地址" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('addr', {
            	initialValue:objs.addr,
              rules: [{ required: true, message: '地址不能为空!' }],
            })(
               <Input />
            )}
          </FormItem>
          <FormItem label="ico" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('ico', {
            	initialValue:objs.ico,
            })(
               <Select  placeholder="请选择菜单类型" allowClear>
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
          <FormItem label="学校图片" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {(
             	<Avatar />
            )}
          </FormItem>
          <FormItem label="状态" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
            {getFieldDecorator('state', {
            	initialValue:objs.state,
            	rules: [{ required: true, message: '状态不能为空!' }],
            })(
            <Select placeholder="请选择状态">
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
			imageUrl="";
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
					rowSelections.selectedRows[0].orgId+=''
					rowSelections.selectedRows[0].state+=''
					if(rowSelections.selectedRows[0].url!=undefined){
						imageUrl=rowSelections.selectedRows[0].url
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
			type: 'basics/fetch_school',
			payload: {
				pageIndex: 1,
				pageSize: 10,
			},
		});
		//默认查询tree
		this.props.dispatch({
			type: 'basics/fetch_organ_tree',
			callback: (res,data) => {
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
			if(values.state == undefined) { //状态默认和选中状态为1
				values.state = 1
			}
			values.url=headerimg;
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'basics/add_school',
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
					Id.push(rowSelections.selectedRows[0].schoolId );
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].schoolId );
					}
				}
				//获取id
				console.log("..Id" + Id);
				this.props.dispatch({
					type: 'basics/edit_school',
					payload: {
						...values,
						schoolId : Id,
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
				Id.push(rowSelections.selectedRows[0].schoolId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].schoolId);
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
							type: 'basics/remove_school',
							payload: {schoolIds:Id},
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
							type: 'basics/edit_school_state',
							payload: {
								schoolIds: Id,
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
			if(values.orgId==undefined){
				values.orgId=""
			}
			if(values.addr==undefined){
				values.addr=""
			}
			if(values.updatedAt==undefined){
				values.updatedAt=""
			}
			dispatch({
				type: 'basics/fetch_school',
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
            <FormItem label="学校名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所属机构">
              {getFieldDecorator('orgId')(
                <TreeSelect  dropdownMatchSelectWidth   treeDefaultExpandAll   allowClear
				        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}   placeholder="请选择上级机构"
				        treeData={treeData}
				      >
			    </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="学校地址">
              {getFieldDecorator('addr')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="学校状态">
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
		const rowKey = function(data) {  return data.schoolId;  /* 主键id*/};
		
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