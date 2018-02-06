import React, {Component} from 'react'
import {Table, Button, message, Alert} from 'antd';
import 'antd/dist/antd.css'
import CreatCompanyAlert from './../company/CreatCompanyAlert'
import InviteGroupPeople from './InviteGroupPeople'
import * as common from '../../util/common.js';

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyID: common.getCookie("companyId"),
            groupList: [],
            userId: common.getCookie("userId"),
            userName: common.getCookie("userName")
        };
    }

    removeGroup(id) {
        const groupList = [...this.state.groupList];
        let data = {
            id: id
        };

        common.axiosPost("removeGroup", "groupControllrer", data, common.guid()).then(
            response => {
                let res = response.data.data;
                if (res.code == 0) {
                    message.success(res.info)
                    this.setState({
                        groupList: groupList.filter(item => item.id !== id)
                    });
                } else if (res.code == 1) {
                    message.warning(res.info)
                }
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    handleCreatCompanyBackfunction(groupName) {
        const {groupList} = this.state;
        const data = {
            groupname: groupName,
            companyID: this.state.companyID,
            reatUserName: this.state.userName,
            reatUserID: this.state.userId,
        };

        common.axiosPost("creatGroup", "groupControllrer", data, common.guid()).then(
            response => {
                this.setState({
                    groupList: [...groupList, response.data.data],
                });
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    inviteGroupMember(id, phone) {
        if (this.phoneVerify(phone)) {
            const data = {
                companyId: this.state.companyID,
                phone: phone,
                groupID: id
            };

            common.axiosPost("invitePeopleGroup", "groupControllrer", data, common.guid()).then(
                response => {
                    const res = response.data.data;
                    if (res.code == 0) {
                        message.success(res.info)
                    } else if (res.code == 1) {
                        message.warning(res.info)
                    }
                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
        }
    }

    componentDidMount() {
        const data = {
            companyId: this.state.companyID
        };

        common.axiosPost("getGroupList", "groupControllrer", data, common.guid()).then(
            response => {
                this.setState({
                    groupList: response.data.data
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
    }

    phoneVerify = (phone) => {
        if (!(/^1[34578]\d{9}$/.test(phone))) {
            message.warning("手机号码有误，请重填");
            return false;
        }
        return true;
    }
    lookGroupListBtnClick(id,event){
        console.log(id);
    }


    render() {
        const columns = [{
            title: '组名称',
            dataIndex: 'groupName',
            key: 'groupName',
        },
            {
                title: '编辑',
                key: 'action',
                render: (text, record) => (
                    <InviteGroupPeople
                        groupItem={record}
                        handleDeleteRecord={this.removeGroup.bind(this)}
                        handleInviteRecord={this.inviteGroupMember.bind(this)}
                        lookGroupHandle={this.lookGroupListBtnClick.bind(this)}

                    />
                ),
            }
        ];
        return (
            <div>
                <CreatCompanyAlert handleCreatgroup={this.handleCreatCompanyBackfunction.bind(this)} type={2}/>
                <Table style={{ marginTop: 16 }}
                    rowKey="id"
                    className="ml-5 mr-5 mt-3"
                    columns={columns}
                    dataSource={this.state.groupList}
                />


            </div>
        )
    }
}

export  default GroupList;