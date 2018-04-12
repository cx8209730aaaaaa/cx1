import React, {	Component} from 'react';
import { connect } from 'dva'; //调取接口用
import { Table, Button, Card, Modal, Form, Icon, Input, Menu, Dropdown, message, TreeSelect, Select, Switch, Row, Col,DatePicker } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
/*import { routerRedux } from 'dva/router'; //调取接口用*/
import styles from '../Mana/Role.less';

const Option = Select.Option;
var coursetimeselect=[];//课程时间
var school_select=[];//学校

//table 列表
const columns = [{
	title: '序号',
	dataIndex: 'sequence',
	key: 'sequence',
}, {
	title: '学校ID',
	dataIndex: 'schoolId',
	key: 'schoolId',
}, {
	title: '教室名称',
	dataIndex: 'name',
	key: 'name',
}, {
	title: '容纳人数',
	dataIndex: 'acceptanceNum',
	key: 'acceptanceNum',
}, {
	title: '临时容纳人数',
	dataIndex: 'tmAcceptanceNum',
	key: 'tmAcceptanceNum',
}, {
	title: '状态',
	dataIndex: 'state',
	key: 'state',
	render: (text, record, index) => {
		if(record.state == 1) {
			return "有效"
		} else if(record.state == 0) {
			return "无效"
		}
	}
}];

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
	          <FormItem label="课程时间" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('syllabusDateId', {
	            	 initialValue:objs.syllabusDateId,
	              rules: [{ required: true, message: '负责人姓名不能为空!' }],
	            })(
	           	<Select  mode="tags" searchPlaceholder="请选择" allowClear>
					{coursetimeselect}
				</Select>  
	            )}
          	</FormItem>
            <FormItem label="学校" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('schoolId', {
	            	initialValue:objs.schoolId,
	              rules: [{ required: true, message: '学校不能为空!' }],
	            })(
	            	<Select   searchPlaceholder="请选择" allowClear>
						{school_select}
					</Select>  
	            )}
          	</FormItem>
          	<FormItem label="教室名称" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('name', {
	            	initialValue:objs.name,
	              rules: [{ required: true, message: '教室名称不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
          	<FormItem label="容纳人数"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('acceptanceNum', {
	            	initialValue:objs.acceptanceNum,
	              rules: [{ required: true, message: '容纳人数不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
          	<FormItem label="临时容纳"  labelCol={{span: 8}}  wrapperCol={{span: 12}} className={styles.w50left}>
	            {getFieldDecorator('tmAcceptanceNum', {
	            	initialValue:objs.tmAcceptanceNum,
	              rules: [{ required: true, message: '临时容纳人数不能为空!' }],
	            })(
	              <Input />
	            )}
          	</FormItem>
          	<FormItem label="状态" labelCol={{span: 4}}  wrapperCol={{span: 18}}>
	            {getFieldDecorator('state', {
	            	initialValue:objs.state,
	            })(
	              <Select showSearch    style={{ width: 200 }} placeholder="请选择">
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
					rowSelections.selectedRows[0].schoolId+=''
					rowSelections.selectedRows[0].syllabusDateId+=''
					rowSelections.selectedRows[0].state+=''
					rowSelections.selectedRows[0].syllabusDateId=rowSelections.selectedRows[0].syllabusDateId.split(",");
					this.setState({
						visible: true,
						title: title,
						objs: rowSelections.selectedRows[0],
					});
				}
			}
		}
	}
	//新增  编辑
	handleCreate = (title) => {
		const form = this.form;
		form.validateFields((err, values) => {
			if(err) {
				return;
			}
			console.log('Received values of form: ', values);
			if(values.state==undefined){
				values.state=1
			}
			form.resetFields();
			if(title == "新增") { //新增
				this.props.dispatch({
					type: 'campus/add_classroom',
					payload: {...values},
					callback: (res,resMsg,data) => {
						if(res == 1){
							this.props.dispatch({
								type: 'campus/add_classroomSyllabusDate',
								payload: {
									classroomId:data,
									syllabusDateIds:values.syllabusDateId,
								},
								callback: (res1,resMsg1) => {
									if(res1 == 1)	message.success(resMsg1); 
									else 	message.error(resMsg1);
								}
							})
						}else{
							message.error(resMsg);
						} 
					}
				});
			} else { //编辑
				var Id = [];
				if(rowSelections.selectedRows.length == 1) {
					Id.push(rowSelections.selectedRows[0].classroomId );
				} else {
					for(var i = 0; i < rowSelections.selectedRows.length; i++) {
						Id.push(rowSelections.selectedRows[i].classroomId );
					}
				}
				this.props.dispatch({
					type: 'campus/edit_classroom',
					payload: {	...values,classroomId : Id,},
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
				Id.push(rowSelections.selectedRows[0].classroomId);
			} else {
				for(var i = 0; i < rowSelections.selectedRows.length; i++) {
					Id.push(rowSelections.selectedRows[i].classroomId);
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
							type: 'campus/remove_classroom',
							payload: {classroomIds:Id},
							callback: (res,resMsg) => {
								if(res==1)	message.success(resMsg);
								else message.error(resMsg);
					        },
						});
					}
				});
			}
		}
	}
	//点击取消
	handleCancel = () => {this.setState({	visible: false});}
	
	//默认查询数据
	componentDidMount() {
		//默认查询table 数据
		this.props.dispatch({	type: 'campus/fetch_classroom'});
		//查询课程时间 select  备注
		this.props.dispatch({
			type: 'campus/fetch_ListBycoursetimeselect',
			callback: (res,data) => {
				for (let i = 0; i < data.length; i++) {
				  coursetimeselect.push(<Option key={data[i].syllabusDateId}>{data[i].remark}</Option>);
				}
			}
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
	//重置
	handleFormReset = () => {
		const {	form,	dispatch} = this.props;
		form.resetFields();
		this.setState({	formValues: {},});
		dispatch({
			type: 'campus/fetch_classroom',
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
			if(values.schoolId==undefined){
				values.schoolId=""
			}
			if(values.state==undefined){
				values.state=""
			}
			dispatch({
				type: 'campus/fetch_classroom',
				payload:{	...values} 
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
            <FormItem label="学校">
              {getFieldDecorator('schoolId')(
                <Select   searchPlaceholder="请选择" allowClear>
						{school_select}
				</Select>  
              )}
            </FormItem>
          </Col>
           <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(
               <Select allowClear  placeholder="请选择">
				    <Option value="1">有效</Option>
				    <Option value="0">无效</Option>
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
		const {	visible,title,confirmLoading} = this.state;
		const { campus: { data=[] }, loading } = this.props;
		const rowKey = function(data) {  return data.classroomId; /* 主键id*/};
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
				    <Table rowKey={rowKey} columns={columns} rowSelection={rowSelection} loading={loading}  dataSource={data}  pagination={{ pageSize: 10 }}/>
				    
	      		</div>
	      		</Card>
	   		</PageHeaderLayout>
		)
	}
}
export default() => (<App />)