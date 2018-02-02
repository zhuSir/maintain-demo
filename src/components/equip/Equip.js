/**
 * Created by BinYiChen on 2018/2/1.
 */
import {Table, Button, Modal, Form, Input, Cascader, Divider, DatePicker, Menu, Dropdown, Icon} from 'antd';
import 'antd/dist/antd.css';
import React, {Component} from 'react';
import * as net from '../../util/common';
import * as areaHelper from '../../util/area';

const FormItem = Form.Item;

class Equip extends Component {

    constructor() {
        super();
        this.state = {
            dataSource: [],
            detailVisible: false,
            columns: [{
                title: '设备名称',
                dataIndex: 'equipName',
                key: 'equipName',
            }, {
                title: '设备编号',
                dataIndex: 'equipCode',
                key: 'equipCode',
            }, {
                title: '设备型号',
                dataIndex: 'equipModel',
                key: 'equipModel',
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button type="primary" onClick={this.showModal}>编辑</Button>
                        <Divider type="vertical"/>
                        <Button type="primary" onClick={this.showModal}>查看详情</Button>
                    </span>
                ),
            }]
        }
    }

    showModal = () => {
        this.setState({detailVisible: true});
    }

    handleCancel = () => {
        this.setState({detailVisible: false});
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
                if (err) {
                    return
                }
                net.axiosPost('saveEquip', 'equipController', values, net.guid()).then(
                    response => {
                        form.resetFields();
                        this.setState({detailVisible: false});
                    }
                ).catch(
                    error => console.log(error)
                );
            }
        )
    }

    componentDidMount() {
        net.axiosPost("listEquip", "equipController", {}, net.guid()).then(
            response => {
                let data = response.data.data;
                this.setState({
                    dataSource: data
                })
            }
        ).catch(
            error => console.log(error)
        )
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>新增</Button>
                <Table rowKey='id' dataSource={this.state.dataSource} columns={this.state.columns}/>
                <EquipCreateForm ref={this.saveFormRef} visible={this.state.detailVisible} onCancel={this.handleCancel}
                                 onCreate={this.handleCreate}/>
            </div>
        )
    }
}

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const areaData = areaHelper.addressData();

/**
 * 弹出层菜单
 * @type {React.ComponentClass<Omit<P, keyof FormComponentProps>&TOwnProps>}
 */
const EquipCreateForm = Form.create()(
    (props) => {
        const {visible, onCancel, onCreate, form} = props;
        const {getFieldDecorator} = form;
        return (
            <Modal visible={visible} title="新增设备" okText="Create" onCancel={onCancel} onOk={onCreate}>
                <Form layout="vertical">
                    <FormItem {...formItemLayout} label="设备名称">
                        {getFieldDecorator('equipName', {
                            rules: [{required: true, message: '请输入设备名称'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="设备厂商">
                        {getFieldDecorator('equipFirm', {
                            rules: [{required: true, message: '请输入设备厂商'}],
                        })(<Input type="text"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="设备型号">
                        {getFieldDecorator('equipModel')(<Input type="text"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="设备详情">
                        {getFieldDecorator('equipDetail')(<Input type="text"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="设备地址">
                        {getFieldDecorator('city', {
                            initialValue: ['福建省', '厦门市', '思明区'],
                            rules: [{type: 'array'}],
                        })(<Cascader options={areaData}/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="设备地址">
                        {getFieldDecorator('address')(<Input type="text"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="投入时间">
                        {getFieldDecorator('putUseTime')(<DatePicker />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="保修时间">
                        {getFieldDecorator('guaranteePeriod')(<DatePicker />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="设备类别">
                        {getFieldDecorator('equipTypeId')(<Input type="textarea"/>)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);


export default Equip;