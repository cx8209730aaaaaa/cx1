import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../Mana/Role.less';
//补课信息
//select
const Option = Select.Option;
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
		dataIndex: 'sequence',
		key: 'sequence',
	},
	{
		title: '孩子',
		dataIndex: 'childrenName ',
		key: 'childrenName ',
	}, {
		title: '课程',
		dataIndex: 'courseName ',
		key: 'courseName ',
	}, {
		title: '课程包',
		dataIndex: 'coursePageName ',
		key: 'coursePageName ',
	},
	 {
		title: '补课时间',
		dataIndex: 'makeupDate ',
		key: 'makeupDate ',
		render: (text, record, index) =>{
			return record.makeupDate
		}
	},{
		title: '状态',
		dataIndex: 'makeupStatus',
		key: 'makeupStatus',
		render: (text, record, index) =>{
			if(record.makeupStatus==1){
				return "有效"
			}else{
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
	        onOk={onCancel}
	      >
	        <Form layout="horizontal">
	          <FormItem label="孩子" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('childrenId ', {
	            	 initialValue:objs.childrenId ,
	              rules: [{ required: true, message: '负责人姓名不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
            <FormItem label="课程包" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('coursePageId ', {
	            	initialValue:objs.coursePageId ,
	              rules: [{ required: true, message: '班级名称不能为空!' }],
	            })(
	               <Input />
	            )}
          	</FormItem>
          	<FormItem label="课程" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('courseId ', {
	            	initialValue:objs.courseId ,
	              rules: [{ required: true, message: 'ico不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
          	<FormItem label="补课时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('makeupDate', {
	            	initialValue:objs.makeupDate,
	              rules: [{ required: true, message: 'ico不能为空!' }],
	            })(
	            	<DatePicker showTime format="YYYY/MM/DD HH:mm:ss"/>
	            )}
          	</FormItem>
          	<FormItem label="补课状态" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('makeupStatus ', {
	            	initialValue:objs.makeupStatus ,
	              rules: [{ required: true, message: 'ico不能为空!' }],
	            })(
	              <Select showSearch  placeholder="请选择">
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
		if(title == "新增") {
			this.setState({visible: true,title: title,objs: ""});
		} else { //编辑
			if(!rowSelections || rowSelections.selected == false) {
				message.warning('还未选择数据,无操作');
			} else {
				if(rowSelections.selectedRows.length > 1) {
					message.warning('只能选择一项进行操作');
				} else {
					rowSelections.selectedRows[0].makeupCourseId+=''
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
		this.props.dispatch({type: 'attendance/fetch_makeupCourse'});
		
		
		
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
					type: 'attendance/add_class',
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
					type: 'attendance/edit_class',
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
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({type: 'attendance/getMakeupCourse'});
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
			if(values.childrenId==undefined){
				values.childrenId=""
			}
			if(values.courseId==undefined){
				values.courseId=""
			}
			if(values.coursePageId==undefined){
				values.coursePageId=""
			}
			if(values.makeupDate==undefined){
				values.makeupDate=""
			}
			if(values.updatedAt==undefined){
				values.updatedAt=""
			}
			dispatch({type: 'attendance/getMakeupCourse',payload:{...values} });
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
            <FormItem label="孩子">
              {getFieldDecorator('childrenName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="课程名称">
              {getFieldDecorator('courseName')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
           <Col md={8} sm={24}>
            <FormItem label="课程包">
              {getFieldDecorator('coursePageName')(
               <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="补课时间">
              {getFieldDecorator('makeupDate ')(
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
		const { attendance: { data=[] }, loading } = this.props;
		const rowKey = function(data) {
		  return data.makeupCourseId ;  // 主键id
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
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}  pagination={{ pageSize: 10 }}/>
				    
	      		</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)