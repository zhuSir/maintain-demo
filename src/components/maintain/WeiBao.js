import React, {Component} from 'react';
import {Table, Button, Modal, Form, Input, message, Radio,} from 'antd';
import {Link} from 'react-router';
import * as net from '../../util/common';
import $ from 'jquery';
import moment from 'moment';
import 'moment/locale/zh-cn';
import EquipTables from './EquipTables';

const FormItem = Form.Item;
const {TextArea} = Input;

class WeiBao extends Component {

    constructor() {
        super();
        this.state = {
            dataSource: [],
            modifyIndex: null,
            formVisible: false,
            columns: [{
                title: '维修单号',
                dataIndex: 'maintainCode',
                key: 'maintainCode'
            }, {
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName'
            }, {
                title: '报障内容',
                dataIndex: 'remarkReason',
                key: 'remarkReason'
            }, {
                title: '报障类型',
                dataIndex: 'faultType',
                key: 'faultType'
            }, {
                title: '创建时间',
                key: 'createtime',
                render: (text, record) => (moment(record.createtime).format("YYYY-MM-DD HH:mm:ss"))
            }, {
                title: '设备名称',
                dataIndex: 'equipName',
                key: 'equipName'
            }, {
                title: '报障人名称',
                dataIndex: 'faultUserName',
                key: 'faultUserName'
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record, index) => (
                    <span>
            <Button type="primary" onClick={this.editModal.bind(this, record, index)}>编辑</Button>
        </span>
                )
            }],
            fields: {
                id: {
                    value: 0
                },
                faultUserName: {
                    value: '',
                }, remarkReason: {
                    value: '',
                }, equipId: {
                    value: '',
                }, faultType: {
                    value: '',
                }
            }
        }
    }


    componentDidMount() {
        net.axiosPost("listMaintain", "maintainController", {}, net.guid()).then(
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

    handleOk = () => {
        var that = this;
        const form = this.form;
        form.validateFields((err, values) => {
            values.equipId = that.state.equipId;
            console.log(values);
            net.axiosPost("updateEquip", 'maintainController', values, net.guid()).then(
                response => {
                    if (response.data.result === 'true') {
                        form.resetFields();
                        const dataSource = [...this.state.dataSource];
                        dataSource.splice(this.state.modifyIndex, 1, response.data.data);
                        this.setState({formVisible: false, dataSource});
                    } else {
                        message.error(response.data.reason);
                    }
                }
            ).catch(
                error => {
                    net.httpError(error);
                }
            )
        })
    }

    editModal = (record, index) => {
        let that = this;
        net.axiosPost('getMaintainById', 'maintainController', record.id, net.guid()).then(
            response => {
                if (response.data.result === 'true') {
                    let record = response.data.data;
                    let fields = that.state.fields;
                    fields.id = {value: record.id};
                    fields.faultUserName = {value: record.faultUserName};
                    fields.remarkReason = {value: record.remarkReason};
                    fields.equipId = {value: record.equipId};
                    fields.faultType = {value: (typeof record.faultType === "undefined") || record.faultType === null ? "一般" : record.faultType};
                    that.setState({
                        fields: {...that.state.fields, ...fields},
                        modifyIndex: index
                    })
                } else {
                    message.error(response.data.reason);
                }
            }
        );
        this.setState({
            formVisible: true
        })
    }

    handleCancel = () => {
        this.setState({
            formVisible: false
        })
    }

    setEquipId = (id) => {
        let that = this;
        let fields = that.state.fields;
        fields.equipId = id;
        this.setState({
            equipId: id,
            fields: {...that.state.fields, ...fields}
        })
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    render() {
        return (
            <div>
                <div className="table-operations" style={{marginBottom: 16}}>
                    {/*<Button type="primary" onClick={this.handleAddFault}>添加报障</Button>*/}
                    <Modal title="添加报障信息"
                           visible={this.state.formVisible}
                           onOk={this.handleOk}
                           confirmLoading={this.state.confirmLoading}
                           onCancel={this.handleCancel}>
                        <MaintianForm ref={this.saveFormRef} setEquipId={this.setEquipId} {...this.state.fields}/>
                    </Modal>
                </div>
                <Table rowKey='id' columns={this.state.columns} dataSource={this.state.dataSource}/>
            </div>
        );
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

class MaintianFormObject extends Component {
    constructor() {
        super();
        this.state = {
            equipObject: {},
            projectObject: {},
            projectListVisible: false,
            equipListVisible: false,
            faultType: 1
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form layout="vertical">
                <FormItem>
                    {getFieldDecorator('id')(<Input type="hidden"/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="报修人名称">
                    {getFieldDecorator('faultUserName')(
                        <Input type="text" disabled={true}/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="维修说明">
                    {getFieldDecorator('remarkReason')(
                        <TextArea placeholder="维修说明" autosize={{minRows: 2, maxRows: 6}}/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="选择设备">
                    {getFieldDecorator('equipId')(
                        <div>
                            <Input type="hidden"/>
                            <Input type="text" placeholder="未选择设备" value={this.state.equipObject.equipName}/>
                            <br />
                            <Button onClick={this.handleAddEquips}>选择设备</Button>
                            <EquipTables
                                equipObject={this.selectEquip}
                                equipListVisible={this.state.equipListVisible}
                                handleEquipOk={this.handleEquipOk}
                                handleEquipCancel={this.handleEquipCancel}
                            />
                        </div>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="报障类型">
                    {getFieldDecorator('faultType')(
                        <Input type="text" disabled={true}/>
                    )}
                </FormItem>
            </Form>
        );
    }

    selectEquip = (obj) => {
        this.setState({
            equipObject: obj
        });
        this.props.setEquipId(obj.id);
    }

    handleEquipCancel = () => {
        this.setState({
            equipListVisible: false
        })
    }
    handleEquipOk = () => {
        this.setState({
            equipListVisible: false
        })
    }

    handleAddEquips = () => {
        this.setState({
            equipListVisible: true
        })
    }

}

const MaintianForm = Form.create({
    mapPropsToFields (props) {
        return {
            id: Form.createFormField({
                ...props.id,
                value: props.id.value,
            }),
            faultUserName: Form.createFormField({
                ...props.faultUserName,
                value: props.faultUserName.value,
            }),
            remarkReason: Form.createFormField({
                ...props.remarkReason,
                value: props.remarkReason.value,
            }),
            equipId: Form.createFormField({
                ...props.equipId,
                value: props.equipId.value,
            }),
            faultType: Form.createFormField({
                ...props.id,
                value: props.faultType.value,
            }),
        }
    }
})(MaintianFormObject);

export default WeiBao;
