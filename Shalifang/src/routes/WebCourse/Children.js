import React, {	Component} from 'react';
import { connect } from 'dva'; 
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import styles from '../Mana/Role.less';
//孩子查看

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const { TextArea } = Input;
var treeData =[];//tree  机构 data


//时间戳 转化为时间格式
var Y,M,D="";
function timestampToTime(timestamp){
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000   //* 1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
   /* h = date.getHours() + ':';  m = date.getMinutes() + ':';  s = date.getSeconds();*/
    return Y+M+D;//+h+m+s;
}

//table 列表
const columns = [
	{
		title: '序号',
		dataIndex: 'childrenId',
		key: 'childrenId',
		render: (text, record, index) =>{return index+1}
	},
	{
		title: '学校名称',
		dataIndex: 'schoolName',
		key: 'schoolName',
	}, {
		title: '用户名',
		dataIndex: 'userName',
		key: 'userName',
	}, {
		title: '孩子名称',
		dataIndex: 'name',
		key: 'name',
	},
	 {
		title: '头像',
		dataIndex: 'headPortrait',
		key: 'headPortrait',
		render: val => <img src={val} style={{width:'40px'}} />,
	},
	{
		title: '性别',
		dataIndex: 'sex',
		key: 'sex',
		render: (text, record, index) =>{
			if(record.sex==1){
				return "男"
			}else if(record.sex==0){
				return "女"
			}
		} 
	},
	 {
		title: '生日',
		dataIndex: 'birthday',
		key: 'birthday',
		render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
	},
	{
		title: '年龄',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: '爱好',
		dataIndex: 'hobby',
		key: 'hobby',
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
	          	<FormItem label="用户姓名" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('userName', {
		            	initialValue:objs.userName,
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="孩子名称" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('name', {
		            	initialValue:objs.name,
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="学校" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('schoolName', {
		            	initialValue:objs.schoolName,
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	
	          	<FormItem label="性别" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            	{getFieldDecorator('sex', {
	            		initialValue:objs.sex,
	            	})(
	            		<Select placeholder="请选择性别">
	             			<Option value="1">男</Option>
				            <Option value="0">女</Option>
				        </Select>
	  				)}
	          	</FormItem>
	          	<FormItem label="年龄" labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
		            {getFieldDecorator('age', {
		            	initialValue:objs.age,
		            })(
		            	<Input />
		            )}
	          	</FormItem>
	          	<FormItem label="出生日期" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('birthday', {
		            	initialValue:objs.birthday,
		            })(
		            	<DatePicker  style={{ width: '100%' }}  />
		            )}
	          	</FormItem>
	          
	          	<FormItem label="爱好" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {getFieldDecorator('hobby', {
		            	initialValue:objs.hobby,
		            })(
		            	 <TextArea rows={2} />
		            )}
	          	</FormItem>
	          	<FormItem label="头像" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
		            {(
		            	<img src={objs.headPortrait} style={{width:'100px'}} />
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
		if(!rowSelections || rowSelections.selected == false) {
			message.warning('还未选择数据,无操作');
		} else {
			if(rowSelections.selectedRows.length > 1) {
				message.warning('只能选择一项进行操作');
			} else {
				this.props.dispatch({
					type: 'campus/fetchId_children',
					payload: {childrenId : rowSelections.selectedRows[0].childrenId,},
					callback: (res,resMsg,data) => {
						//性别
						if(data.sex!=undefined)	data.sex+=''
						else	data.sex='1'
						if(data.birthday!=undefined)	data.birthday=moment(data.birthday)
						else	data.birthday=""
						this.setState({
							visible: true,
							title: title,
							objs: data,
						});
					},
				});
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
			type: 'campus/fetch_children',
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
			type: 'campus/fetch_children',
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
			if(values.schoolName==undefined){
				values.schoolName=""
			}
			if(values.userName==undefined){
				values.userName=""
			}
			if(values.age==undefined){
				values.age=""
			}
			if(values.sex==undefined){
				values.sex=""
			}
			if(values.updatedAt==undefined){
				values.updatedAt=""
			}
			dispatch({
				type: 'campus/fetch_children',
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
            <FormItem label="用户名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="学校名称">
              {getFieldDecorator('schoolName')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="孩子姓名">
              {getFieldDecorator('name')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('sex')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
           <Col md={8} sm={24}>
            <FormItem label="年龄">
              {getFieldDecorator('age')(
                <Input placeholder="请输入" />
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
		const rowKey = function(data) {
		  return data.childrenId;  // 主键id
		};
		return(
			<PageHeaderLayout title="">
        		<Card bordered={false}>
        		<div className={styles.tableList}>
		            <div className={styles.tableListForm}>
		              {this.renderAdvancedForm()}
		            </div>
					<div className={styles.table_operations} >
				      	<Button icon="edit" type="primary"  onClick={() => this.showModal('查看')}>查看</Button>
				      	
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