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
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;

class Equip extends Component {

    constructor() {
        super();
        this.state = {
            dataSource: [],
            modifyIndex: null,
            fields: {
                id: {
                    value: 0
                },
                equipName: {
                    value: '',
                }, equipModel: {
                    value: '',
                }, equipFirm: {
                    value: '',
                }, equipDetail: {
                    value: '',
                }, address: {
                    value: '',
                }, city: {
                    value: ['福建省', '厦门市', '思明区'],
                }, putUseTime: {
                    value: moment(),
                }, guaranteePeriod: {
                    value: moment(),
                }
            },
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
                        <Button type="primary" onClick={this.showModal.bind(this, record, index)}>编辑</Button>
                        <Divider type="vertical"/>
                        <Popconfirm title="删除不可恢复，你确定要删除吗?" okText="确认" cancelText="取消"
                                    onConfirm={this.doDelete.bind(this, record, index)}>
                            <Button type="primary">删除</Button>
                        </Popconfirm>
                    </span>
                ),
            }]
        }
    }

    showModal = (record, index) => {
        let that = this;
        if (typeof(index) !== "undefined") {
            net.axiosPost('getEquipById', 'equipController', record.id, net.guid()).then(
                response => {
                    if (response.data.result === 'true') {
                        let record = response.data.data;
                        let fields = that.state.fields;
                        fields.id = {value: record.id};
                        fields.address = {value: record.address};
                        fields.equipDetail = {value: record.equipDetail};
                        fields.equipFirm = {value: record.equipFirm};
                        fields.equipModel = {value: record.equipModel};
                        fields.equipName = {value: record.equipName};
                        fields.guaranteePeriod = {value: moment(record.guaranteePeriod)};
                        fields.putUseTime = {value: moment(record.putUseTime)};
                        fields.city = {value: new Array(record.province, record.city, record.area)};
                        that.setState({
                            fields: {...that.state.fields, ...fields},
                            modifyIndex: index
                        })
                    } else {
                        message.error(response.data.reason);
                    }
                }
            ).catch(
                error => {
                    net.httpError(error);
                }
            );
        } else {
            let fields = that.state.fields;
            fields.id = {value: 0};
            fields.address = {value: ''};
            fields.equipDetail = {value: ''};
            fields.equipFirm = {value: ''};
            fields.equipModel = {value: ''};
            fields.equipName = {value: ''};
            fields.guaranteePeriod = {value: moment()};
            fields.putUseTime = {value: moment()};
            fields.city = {value: new Array('福建省', '厦门市', '思明区')};
            that.setState({
                fields: {...that.state.fields, ...fields},
                modifyIndex: null
            })
        }
        this.setState({detailVisible: true});
    }

    doDelete = (record, index) => {
        net.axiosPost('deleteEquip', 'equipController', record.id, net.guid()).then(
            response => {
                if (response.data.result === 'true') {
                    const dataSource = [...this.state.dataSource];
                    dataSource.splice(index, 1);
                    this.setState({dataSource});
                } else {
                    message.error(response.data.reason);
                }
            }
        ).catch(
            error => {
                net.httpError(error);
            }
        );
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
                let id = values['id'];
                let address = values['city'];
                values['province'] = address[0];
                values['city'] = address[1];
                values['area'] = address[2];
                if (id === 0) {
                    delete values['id'];
                    net.axiosPost('saveEquip', 'equipController', values, net.guid()).then(
                        response => {
                            if (response.data.result === 'true') {
                                form.resetFields();
                                let insertEntity = response.data.data;
                                let source = this.state.dataSource;
                                source.push(insertEntity);
                                this.setState({detailVisible: false, dataSource: source});
                            } else {
                                message.error(response.data.reason);
                            }
                        }
                    ).catch(
                        error => {
                            net.httpError(error);
                        }
                    );
                } else {
                    net.axiosPost('updateEquip', 'equipController', values, net.guid()).then(
                        response => {
                            if (response.data.result === 'true') {
                                form.resetFields();
                                const dataSource = [...this.state.dataSource];
                                dataSource.splice(this.state.modifyIndex, 1, response.data.data);
                                this.setState({detailVisible: false, dataSource});
                            } else {
                                message.error(response.data.reason);
                            }
                        }
                    ).catch(
                        error => {
                            net.httpError(error);
                        }
                    )
                }
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
                <div className="table-operations" style={{marginBottom: 16}}>
                    <Button type="primary" onClick={this.showModal}>新增</Button>
                </div>
                <Table rowKey='id' dataSource={this.state.dataSource} columns={this.state.columns}/>
                <EquipCreateForm {...this.state.fields} ref={this.saveFormRef}
                                 visible={this.state.detailVisible} onCancel={this.handleCancel}
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
const EquipCreateForm = Form.create({
    mapPropsToFields(props) {
        return {
            id: Form.createFormField({
                ...props.id,
                value: props.id.value,
            }),
            equipName: Form.createFormField({
                ...props.equipName,
                value: props.equipName.value,
            }), equipModel: Form.createFormField({
                ...props.equipModel,
                value: props.equipModel.value,
            }), equipFirm: Form.createFormField({
                ...props.equipFirm,
                value: props.equipFirm.value,
            }), equipDetail: Form.createFormField({
                ...props.equipDetail,
                value: props.equipDetail.value,
            }), city: Form.createFormField({
                ...props.city,
                value: props.city.value,
            }), address: Form.createFormField({
                ...props.address,
                value: props.address.value,
            }), putUseTime: Form.createFormField({
                ...props.putUseTime,
                value: props.putUseTime.value,
            }), guaranteePeriod: Form.createFormField({
                ...props.guaranteePeriod,
                value: props.guaranteePeriod.value,
            })
        };
    }
})(
    (props) => {
        const {visible, onCancel, onCreate, form} = props;
        const {getFieldDecorator} = form;
        return (
            <Modal visible={visible} title="新增设备" okText="确认" cancelText="取消" onCancel={onCancel} onOk={onCreate}
                   mask={true} maskClosable={false} width={600} destroyOnClose={true}>
                <Form layout="vertical">
                    <FormItem {...formItemLayout}>
                        {getFieldDecorator('id')(<Input type="hidden"/>)}
                    </FormItem>
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