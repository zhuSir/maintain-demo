import React, { Component } from 'react';
import Create_mask from './Create_mask'
import './Companylist.css'
import { Table, Input, Popconfirm } from 'antd';
import * as RecordsAPI from '../../util/RecordsAPI'

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);
class Companylist extends Component {
        constructor(props) {
            super(props);
            this.state={
                companylist:[]
            }
        }
        componentDidMount(){
            const data = {
                uId: 1
            }
            RecordsAPI.getProjectsCompany(data).then(
                response => {
                    console.log(response);
                    this.setState({companylist: response.data});
                },
                error => console.log(error)
            );
        }
        /*公司删除*/
        handleDeleteClick(companyform) {
            const companyformIndex = this.state.companylist.indexOf(companyform);
            const newCompanylist = this.state.companylist.filter( (item, index) => index !== companyformIndex);
            this.setState({
                companylist: newCompanylist
            });
            console.log(companyform)
        }

        handleInformationOnClick(company){
            /* this.props.handleInformationOnClick(company);*/
            let data = {
                company: company
            }
            let path = {
                pathname: "/Information",
                state: data
            }
            this.props.history.push(path);
        }

        /*  编辑*/
        handleUpdate(companyform,data){
            const companyformIndex = this.state.companylist.indexOf(companyform);
            const newCompanylist= this.state.companylist.map( (item, index) => {
                if(index !== companyformIndex) {
                    return item;
                }
                return {
                    ...item,
                    ...data
                };
            });
            this.setState({
                companylist: newCompanylist
            });
        }

        addRecord(companyform) {
            console.log(companyform)
            this.setState({
                companylist: [
                    ...this.state.companylist,
                    companyform
                ]
            })
        }


        state = { visible: false }
        handleDeleteClick = () => {
            this.setState({
                visible: true,
            });
        }
        handleOk = (e) => {
            console.log(e);
            this.setState({
                visible: false,
            });
            let postDatas = {
                uId: RecordsAPI.uId,
                cId: this.props.companyform.id
            }
            RecordsAPI.removeProjectsCompany(postDatas).then(
                response =>
                    this.props.handleDeleteClick(this.props.companyform)

            ).catch(
                error => console.log(error.message)
            )
        }
        handleCancel = (e) => {
            console.log(e);
            this.setState({
                visible: false,
            });
        }



    constructor(props) {
        super(props);
        this.columns = [{
            title: '公司名称',
            dataIndex: 'name',
            width: '25%',
            render: (text, record) => this.renderColumns(text, record, 'name'),
        }, {
            title: '负责人',
            dataIndex: 'managerName',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'managerName'),
        }, {
            title: '联系电话',
            dataIndex: 'managerPhone',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'managerPhone'),
        }, {
            title: '状态',
            dataIndex: 'operation',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                      <a onClick={() => this.save(record.key)}>Save</a>
                                      <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                                        <a>Cancel</a>
                                      </Popconfirm>
                                </span>
                                /*: <a onClick={() => this.edit(record.key)}>编辑</a>*/
                                : <button className="btn btn-info mr-1" onClick={this.edit(record.key)}>编辑</button>
                                : <button type="primary" className="btn btn-danger mr-1" onClick={this.handleDeleteClick.bind(this)}>删除</button>
                                : <button className="btn btn-info" onClick={this.handleInformationOnClick.bind(this)}>详情</button>
                        }
                    </div>
                );
            },
        }];
        this.state = { data };
        this.cacheData = data.map(item => ({ ...item }));

        renderColumns(text, record, column) {
            return (
                <EditableCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
            );
        }
        handleChange(value, key, column) {
            const newData = [...this.state.data];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                target[column] = value;
                this.setState({ data: newData });
            }
        }
        edit(key) {
            const newData = [...this.state.data];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                target.editable = true;
                this.setState({ data: newData });
            }
        }
        save(key) {
            const newData = [...this.state.data];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                delete target.editable;
                this.setState({ data: newData });
                this.cacheData = newData.map(item => ({ ...item }));
            }
        }
        cancel(key) {
            const newData = [...this.state.data];
            const target = newData.filter(item => key === item.key)[0];
            if (target) {
                Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                delete target.editable;
                this.setState({ data: newData });
            }
        }
        render() {
            return <Table bordered dataSource={this.state.data} columns={this.columns} />;
        }
    }
}

export default Companylist;
