import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import moment from 'moment';
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//外部富文本引用 react-lz-editor
import ReactDOM from 'react-dom';
import LzEditor from 'react-lz-editor/index.js'

var contents="";//富文本框
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlContent: contents,
      markdownContent: contents,
      rawContent:contents,
      responseList: []
    }
    this.receiveHtml=this.receiveHtml.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  receiveHtml(content) {
    this.setState({responseList:[]});
    contents=content;
  }
   onChange(info) {
    let currFileList = info.fileList;
    currFileList = currFileList.filter((f) => (!f.length));
    //读取远程路径并显示链接
    currFileList = currFileList.map((file) => {
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.obj.path;
      }
      if (!file.length) {
        return file;
      }
    });
    let _this = this;
    //按照服务器返回信息筛选成功上传的文件
    currFileList = currFileList.filter((file) => {
      //根据多选选项更新添加内容
      let hasNoExistCurrFileInUploadedList =  file.name;
      if (hasNoExistCurrFileInUploadedList) {
        if (!!_this.props.isMultiple == true) {
          _this.state.responseList.push(file);
        } else {
          _this.state.responseList = [file];
        }
      }
      return !!file.response || (!!file.url && file.status == "done") || file.status == "uploading";
    });
   // currFileList = uniqBy(currFileList, "name");
    if (!!currFileList && currFileList.length != 0) {
      // console.log("upload set files as fileList", currFileList);
      this.setState({responseList: currFileList});
    }
    _this.forceUpdate();
  }

 
  render() {
  	const urls="api/attachment/upload.manage?token="+localStorage.getItem('token');
    let policy = "";
    //uploadProps 配置方法见 https://ant.design/components/upload-cn/
    const uploadProps = {
      action: urls,
      listType: 'picture',
      onChange: this.onChange,
      fileList: this.state.responseList,
      data: (file) => {/* //自定义上传参数，这里使用UPYUN
        return {
          Authorization:file.name,
          policy: (() => {
            return policy;
          })(),
          signature: policy
        }
      */},
      multiple: true,
      showUploadList: true
    }
    return (
      <div>
        <LzEditor active={true} importContent={contents} cbReceiver={this.receiveHtml} uploadProps={uploadProps}
        image={true}  video={false}  audio={false}  color={false}	/>
      </div>
    );
  }
}



//文章
const Option = Select.Option;
const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;
//时间戳 转化为时间格式
var Y,M,D,h,m,s="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';  m = date.getMinutes() + ':';  s = date.getSeconds();
    return Y+M+D+h+m+s;
}




//table 列表
const columns = [
	{
	title: '序号',
		dataIndex: 'articleId',
		key: 'articleId',
		render: (text, record, index) =>{return index+1}
	},
	{
	title: '标题',
		dataIndex: 'title',
		key: 'title',
	},{
		title: '时间',
		dataIndex: 'createDate',
		key: 'createDate',
		render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
	},{
		title: '浏览次数',
		dataIndex: 'pageView',
		key: 'pageView',
	},{
		title: '类型',
		dataIndex: 'type',
		key: 'type',
	},{
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
	          	<FormItem  label="标题" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('title', {
		            	initialValue:objs.title,
		            	rules: [{ required: true, message: '活动规则名称不能为空!' }],
		            })(
		               <Input />
		            )}
	          	</FormItem>
	          	
	          	<FormItem label="类型" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('type', {
		            	initialValue:objs.type,
		            	rules: [{ required: true, message: '活动规则类型不能为空!' }],
		            })(
		               <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">满减</Option>
						    <Option value="2">秒杀</Option>
						    <Option value="3">优惠券</Option>
						</Select>
		            )}
	          	</FormItem>
	          	<FormItem label="发布状态" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('state', {
		            	initialValue:objs.state,
		            })(
		                <Select showSearch  style={{ width: '100%' }} placeholder="请选择">
						    <Option value="1">有效</Option>
						    <Option value="0">无效</Option>
						</Select>
		            )}
	          	</FormItem>
	          	<FormItem label="内容" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('acticleTxt', {
		            	initialValue:objs.acticleTxt,
		            })(
		            	<Test />
		            )}
	          	</FormItem>
	          	
	          	
	        </Form>
	      </Modal>
		);
	}
);

@connect(({ attendance, loading }) => ({
  attendance,
  loading: loading.models.attendance,
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
		contents="";
		if(title == "新增") {
			this.setState({visible: true,title: title,objs: ""});
		}else{ //查看
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			}else{
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				}else{
					rowSelections.selectedRows[0].type+=''
					rowSelections.selectedRows[0].state+=''
					contents=rowSelections.selectedRows[0].acticleTxt
					this.setState({
						visible: true,
						title: title,
						objs: rowSelections.selectedRows[0],
					});
				}
			}
		}
	}
	//删除
	deleteModal=(title)=>{
		const {	dispatch,form} = this.props;
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			var Id = [];
			if(rowSelections.selectedRows.length == 1) {
				Id.push(rowSelections.selectedRows[0].articleId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].articleId);
				}
			}
			if(title == "删除") {
			Modal.confirm({
				title: '是否删除选中项?',
				content: '删除后不可还原',
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() { //调取批量删除组织机构
					dispatch({
						type: 'attendance/remove_article',
						payload: {
							articleId: Id
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
	//点击取消
	handleCancel = () => {this.setState({visible: false})}
	//新增
	handleCreate = (title) => {
		const form = this.form;
		form.validateFields((err, values) => {
			if(err) {	return;}
			console.log('Received values of form: ', values);
			if(values.state==undefined) values.state="1"
			values.acticleTxt=contents
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'attendance/add_article',
					payload: {...values},
					callback: (res,resMsg) => {
						if(res == 1) message.success(resMsg);
						else message.error(resMsg);
					},
				});
			}else{
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].articleId);
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].articleId);
					}
				}
				this.props.dispatch({
					type: 'attendance/edit_article',
					payload: {...values,articleId:Id},
					callback: (res,resMsg) => {
						if(res == 1) message.success(resMsg);
						else message.error(resMsg);
					},
				});
			}
			this.setState({
				visible: false,
			});
		});
	}
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({type: 'attendance/fetch_article'});
	}
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/fetch_article',});
	}
	//查询
	handleSearch = (e) => {
		e.preventDefault();
		const {	dispatch,form} = this.props;
		form.validateFields((err, fieldsValue) => {
			if(err) return;
			const values = {
				...fieldsValue,
				//updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
			};
			this.setState({	formValues: values});
			if(values.employeeId==undefined){values.employeeId=""}
			if(values.type==undefined){values.type="1"}
			if(values.state==undefined){values.state="1"}
			if(values.Datas==undefined){
				values.startDate="";//开始时间
				values.endDate="";//结束时间
			}else{
				values.startDate=timestampToTime(values.Dates[0]);//开始时间
				values.endDate=timestampToTime(values.Dates[1]);//结束时间
			}
			//if(values.updatedAt==undefined){values.updatedAt=""}
			dispatch({
				type: 'attendance/fetch_article',
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
			            <FormItem label="标题">
			              {getFieldDecorator('title')(
			                <Input />
			              )}
			            </FormItem>
		          	</Col>
		           <Col md={8} sm={24}>
			            <FormItem label="文章类型">
			              {getFieldDecorator('type')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">满减</Option>
							    <Option value="2">秒杀</Option>
							    <Option value="3">优惠券</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		          <Col md={8} sm={24}>
			            <FormItem label="发布状态">
			              {getFieldDecorator('state')(
			                <Select showSearch   style={{ width: '100%' }} placeholder="请选择">
							    <Option value="1">满减</Option>
							    <Option value="2">秒杀</Option>
							    <Option value="3">优惠券</Option>
							</Select>
			              )}
			            </FormItem>
		          </Col>
		          
		        </Row>
		        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		          	<Col md={24} sm={24}>
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
		const { attendance: { data=[] }, loading } = this.props;
		const rowKey = function(data) {return data.articleId;/*主键id*/};
		return(
			<PageHeaderLayout >
        		<Card bordered={false}>
	        		<div className={styles.tableList}>
			            <div className={styles.tableListForm}>
			              {this.renderAdvancedForm()}
			            </div>
						<div className={styles.table_operations} >
					      	<Button type="primary"  onClick={() => this.showModal('新增')}>新增</Button>
					      	<Button type="primary"  onClick={() => this.showModal('编辑')}>编辑</Button>
					      	<Button type="primary"  onClick={() => this.deleteModal('删除')}>删除</Button>
					    </div>
					    <CollectionCreateForm
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