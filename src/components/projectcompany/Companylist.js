import React, { Component } from 'react';
import Create_mask from './Create_mask'
import Companyform from './Companyform'
import './Companylist.css'
/*import * as RecordsAPI from '../../util/RecordsAPI'*/
import * as net from '../../util/common';
class Companylist extends Component {
    constructor(props) {
        super(props);
        this.state={
            companylist:[]
        }
    }
    componentDidMount(){
        const data = {
            uId: net.getCookie("userId")
        }
        net.axiosPost("listCompany", "projectCompanyController",data,net.guid()).then(
            response => {
                console.log(response);
                this.setState({companylist: response.data.data});
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
    render() {
        return (
            <div className="ml-4 mr-4 mt-4 mb-4">
                <h4>甲方公司列表</h4>
                <Create_mask handleNewRecord={this.addRecord.bind(this)}/>
                <table className="table table-bordered tables">
                    <thead>
                    <tr className="tabs">
                        <th>公司名称</th>
                        {/*<th>公司类型</th>*/}
                        <th>负责人</th>
                        <th>联系电话</th>
                        <th>状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.companylist.map((companyform) => (
                        <Companyform
                            key={companyform.id}
                            companyform={companyform}
                            handleInformationOnClick={this.handleInformationOnClick.bind(this)}
                            handleDeleteClick={this.handleDeleteClick.bind(this)}
                            handleEditCompanyform={this.handleUpdate.bind(this)}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Companylist;
