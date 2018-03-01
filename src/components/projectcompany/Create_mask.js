import React, { Component } from 'react';
import {  Modal, Form, Input, Checkbox, Row, Col} from 'antd';
import './Companylist.css'
/*import * as RecordsAPI from '../../util/RecordsAPI'*/
import * as net from '../../util/common';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};
function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
}
const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="创建公司"
                person="person is not null"
                telephone="telephonen is not null"
                okText="创建"
                cancelText="取消"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical" >
                    <FormItem label="公司类型">
                        {getFieldDecorator('states', {
                            rules: [{ required: true, message: '公司类型不能为空!' }],
                        })(
                            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                                <Row>
                                    <Col span={6}><Checkbox value="1" checked="checked" >甲方公司</Checkbox></Col>
                                    <Col span={6}><Checkbox value="0" >乙方公司</Checkbox></Col>
                                </Row>
                            </Checkbox.Group>
                        )}
                    </FormItem>
                    <FormItem label="公司名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '公司名称不能为空!' }],
                        })(
                            <Input type="textarea"/>
                        )}
                    </FormItem>
                    <FormItem label="公司负责人">
                        {getFieldDecorator('managerName',{
                            rules: [{ required: true, message: '公司负责人不能为空!' }],
                        })(
                            <Input type="textarea" />
                        )}
                    </FormItem>
                    <FormItem label="电话号码">
                        {getFieldDecorator('managerPhone',{
                            rules: [{ required: true, message: '电话号码不能为空!' }],
                        })(
                            <Input  type="telephone" maxlength="11"/>
                        )}
                    </FormItem>
                    {/*<FormItem label="建设单位:">
                        {getFieldDecorator('mark')(<Input type="textarea" />)}
                    </FormItem>*/}
                </Form>
            </Modal>
        );
    }
);
class Create_mask extends Component {
    state = {
        visible: false,
    };
    showModal = () => {
        this.setState({ visible: true });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleCreate = () => {
       /* var states={
            if(checkedValues == 1){
                firstPart ="甲方公司"
            }else(checkedValues == 0){
                firstPart ="乙方公司"
            }else{
                firstPart ="甲方/乙方公司"
            }
        }*/
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.handleNewRecord(values)
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
            let data={
                name: values.name,
                managerName: values.managerName,
                managerPhone:  values.managerPhone,
               /* build: values.build,
                deportment: values.deportment,*/
                mark: values.mark,
                /*uId: RecordsAPI.uId*/
                uId: net.getCookie("userId")
            }
            console.log(data)
            net.axiosPost("saveCompany", "projectCompanyController",data,net.guid()).then(
                response => {
                    console.log(response.data);
                    /*this.props.handleNewRecord(response.data);*/
                }

            ).catch(
                error => console.log(error.message)
            )
        });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    render() {
        return(
            <div>
                <button type="primary" onClick={this.showModal} className="btn btn-info mr-1 btncre">创建公司</button>
                <CollectionCreateForm
                    ref={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}
export default Create_mask;


