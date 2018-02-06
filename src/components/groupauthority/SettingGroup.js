import React,{Component} from 'react'
import { Table, Icon, Divider,Button ,Checkbox, Row, Col} from 'antd';
import * as common from '../../util/common.js';
// import * as net from '../../util/common';


export  default class SettingGroup extends Component {

    constructor(event){
        super(event);
        let isEdit = common.getCookie('createBy');
        if (isEdit==common.getCookie('createBy'))
        {
            isEdit=true;
        }
        else
        {
            isEdit=false;
        }
        this.state={
            groupList:[],
            isEdit:isEdit,
            itemList:[],
            editResult:[]
        };
    }
// { id:1,groupName:'技术研发部',item:[],rowKey:"1"},
// { id:2,groupName:'运维部',item:[],rowKey:"1"},
// { id:3,groupName:'设计部',item:[1,2,3],rowKey:"1"},
// { id:6,groupName:'我的小卖部',item:[1],rowKey:"1"},
// {id:1,title:"权限1",},
// {id:2,title:"权限2",},
// {id:3,title:"权限3",},
// {id:4,title:"权限4",},
// {id:5,title:"权限5",},
// {id:6,title:"权限6",}
    componentDidMount() {
        const data = {
            companyId: common.getCookie("companyId")


        };

        common.axiosPost("getGroupAuthorityList", "authorityController", data, common.guid()).then(
            response => {
                console.log(response.data.data+"eeeee");

                this.setState({
                    groupList: response.data.data
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        )
        common.axiosPost("getAllList", "authorityController", data, common.guid()).then(
            response => {
                console.log(response.data.data+"eeeee");
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


    onRowClick(){
        console.log("dddddddd");

    }

    render(){

        function onChange(groupId,checkedValues,) {

            const data = {
                groupID:groupId.id,
                auID: checkedValues
            };
            common.axiosPost("setGroupAu", "authorityController", data, common.guid()).then(
                response => {


                }
            ).catch(
                error => {
                    console.log(error)
                }
            )
            console.log(groupId.authorityArr,checkedValues);
            // console.log('checked = ', checkedValues+",组ID="+groupId);
        }

        const columns = [{
            title: '组名称',
            dataIndex: 'groupName',
            key: 'groupName',
        },{
            title: '设置权限',
            key: 'action',
            render: (text, record) => (


                <Checkbox.Group style={{ width: '60%' }} onChange={onChange.bind(this,record)} defaultValue={record.authorityArr}>
                    <Row>
                        {this.state.itemList.map((item) => (<Col span={8}><Checkbox value={item.id}   defaultChecked={true}>{item.name}</Checkbox></Col>
                        ))}
                    </Row>
                </Checkbox.Group>
            ),
        }]

        return(
            <div>
                <Table
                    // className="ml-5 mr-5 mt-3"
                    columns={columns}
                    dataSource={this.state.groupList}
                    // onRowClick = {this.onRowClick}
                />
            </div>
        )
    }
}
