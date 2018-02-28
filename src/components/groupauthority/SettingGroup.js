import React, {Component} from 'react'
import {Table, Icon, Divider, Button, Checkbox, Row, Col,message} from 'antd';
import * as common from '../../util/common.js'


export  default class SettingGroup extends Component {

    constructor(event) {
        super(event);

        this.state = {
            groupList: [],
            itemList: [],
            editResult: [],
            havaDate:false
        };
    }
    componentDidMount() {
        const data = {
            companyId: common.getCookie("companyId")
        };
        if( common.getCookie("companyId")==0)
        {
            message.error("您还没有公司！")
            return;
        }

        common.axiosPost("getGroupAuthorityList", "authorityController", data, common.guid()).then(
            response => {
                this.setState({
                    groupList: response.data.data,
                    havaDate:true,
                })
            }
        ).catch(
            error => {
                console.log(error),

                    this.setState({
                        havaDate:false,
                    })
            }
        )
        common.axiosPost("getAllList", "authorityController", data, common.guid()).then(
            response => {
                this.setState({
                    itemList: response.data.data
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    onRowClick() {
    }

    renderError() {
        return (
            <div>
                加载中。。。
            </div>
        )
    }
    render(){
        if(this.state.havaDate)
        {
            return this.renderData();
        }
        else
        {
            return this.renderError();
        }
    }
    renderData() {

        function onChange(groupId, checkedValues) {
            console.log(groupId,checkedValues);
            const data = {
                groupID: groupId.id,
                auID: checkedValues,
                companyID:common.getCookie("companyId")
            };
            common.axiosPost("setGroupAu", "authorityController", data, common.guid()).then(
                response => {
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
            console.log(groupId.authorityArr, checkedValues);
            // console.log('checked = ', checkedValues+",组ID="+groupId);
        }

        const columns = [{
            title: '组名称',
            dataIndex: 'groupName',
            key: 'groupName',

        }, {
            title: '设置权限',
            key: 'action',
            render: (text, record) => (

                  <Checkbox.Group
                    key='ddd'
                    style={{width: '60%'}}
                    onChange={onChange.bind(this, record)}
                     defaultValue={record.authorityArr}>
                          <Row >
                               {this.state.itemList.map((item) => (
                                   <Col span={8}  key={item.id}><Checkbox   key={item.id} value={item.id} disabled={common.getCookie("isConpanyLeader")==0}  defaultChecked={true}>{item.name}</Checkbox></Col>

                                   ))}

                        </Row>

                </Checkbox.Group>

            ),
        },
            {
                title: '操作',
                dataIndex: 'groupName1',
                key: 'groupName1',
                render: (text, record) => (
                    <Button  className="ml-5 " disabled={common.getCookie("isConpanyLeader")==0}>保存</Button>
                ),
            }]
        return (
            <Table
                rowKey="id"
                key="ddd"
                columns={columns}
                dataSource={this.state.groupList}
                pagination={{  //分页
                    total:this.state.groupList.length,
                    pageSize:7,  hideOnSinglePage:false}}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            // message.error(record.groupName)
                        },       // 点击行
                        onMouseEnter: () => {
                        },  // 鼠标移入行
                    };
                  }
                }
            />
        )
    }
}
