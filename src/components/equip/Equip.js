/**
 * Created by BinYiChen on 2018/2/1.
 */
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Cascader,
    Divider,
    Popconfirm,
    DatePicker,
    message
} from 'antd';
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
                title: '省',
                dataIndex: 'province',
                key: 'province',
            }, {
                title: '市',
                dataIndex: 'city',
                key: 'city',
            }, {
                title: '区',
                dataIndex: 'area',
                key: 'area',
            }, {
                title: '设备详情',
                dataIndex: 'equipDetail',
                key: 'equipDetail',
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => (
                    <span>
                        <Button type="primary" onClick={this.showModal}>编辑</Button>
                        <Divider type="vertical"/>
                        <Popconfirm title="删除不可恢复，你确定要删除吗?" okText="确认" cancelText="取消"
                                    onConfirm={this.doDelete.bind(this, record, index)}>
                            <Button type="primary">删除</Button>
                        </Popconfirm>
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

    doDelete = (record, index) => {
        net.axiosPost('deleteEquip', 'equipController', record.id, net.guid()).then(
            response => {
                console.log(response.data.result);
                if (response.data.result == 'true') {
                    const dataSource = [...this.state.dataSource];
                    dataSource.splice(index, 1);
                    this.setState({dataSource});
                } else {
                    message.error(response.data.reason);
                }
            }
        )
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
                let address = values['city'];
                values['province'] = address[0];
                values['city'] = address[1];
                values['area'] = address[2];
                net.axiosPost('saveEquip', 'equipController', values, net.guid()).then(
                    response => {
                        form.resetFields();
                        let insertEntity = response.data.data;
                        let source = this.state.dataSource;
                        source.push(insertEntity);
                        this.setState({detailVisible: false, dataSource: source});
                    }
                ).catch(
                    error => {
                        net.httpError(error);
                    }
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
            error => {
                net.httpError(error);
            }
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
                        })(<Cascader key='value' options={areaData}/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="详细地址">
                        {getFieldDecorator('address')(<Input type="text"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="投入时间">
                        {getFieldDecorator('putUseTime')(<DatePicker />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="保修时间">
                        {getFieldDecorator('guaranteePeriod')(<DatePicker />)}
                    </FormItem>
                    {/*<FormItem {...formItemLayout} label="设备类别">*/}
                    {/*{getFieldDecorator('equipTypeId')(<Input type="textarea"/>)}*/}
                    {/*</FormItem>*/}
                </Form>
            </Modal>
        );
    }
);

export default Equip;