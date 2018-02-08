import React, {Component} from 'react';

export default class ProjectDetail extends Component {

    constructor(props){
        super(props);
    }

    handleProjectListOnClick(){
        this.props.handleProjectListOnClick();
    }

    render(){
        let bidState = "未中标";
        switch (this.props.location.state.project.bidState) {
            case 0:
                bidState = "未中标";
                break;
            case 1:
                bidState = "已中标";
                break;
        }
        let projectState;
        switch (this.props.location.state.project.projectState) {
            case 0:
                projectState = "未开工";
                break;
            case 1:
                projectState = "已开工";
                break;
            case 2:
                projectState = "已完工";
                break;
            case 3:
                projectState = "已停工";
                break;
        }
        let date = new Date(this.props.location.state.project.planStartDate);
        let stareDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        date = new Date(this.props.location.state.project.planEndDate);
        let endDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        let auditDate;
        if (this.props.location.state.project.auditDate === null || typeof ( this.props.location.state.project.auditDate) === "undefined") {
            auditDate = "未审核"
        } else {
            date = new Date(this.props.location.state.project.auditDate);
            auditDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        }
        let createDate;
        date = new Date(this.props.location.state.project.createTime);
        createDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        return(
            <div>
                {/*<div className="bg-info pl-4 pr-4 pb-1">*/}
                    {/*<tr>*/}
                        {/*<td onClick={this.handleProjectListOnClick.bind(this)}><h6><b>我的项目 > </b></h6></td>*/}
                        {/*<td></td>*/}
                        {/*<td><h6>项目详情</h6></td>*/}
                    {/*</tr>*/}
                {/*</div>*/}
                <div className="pl-4 pr-4 pt-4 pb-4">
                    <ul className="list-group">
                        <li className="list-group-item"><b>项目名称：</b><span>{this.props.location.state.project.name}</span></li>
                        <li className="list-group-item"><b>项目负责人：</b><span>{this.props.location.state.project.managerName}</span></li>
                        <li className="list-group-item"><b>投标状态：</b><span>{bidState}</span></li>
                        <li className="list-group-item"><b>项目状态：</b><span>{projectState}</span></li>
                        <li className="list-group-item"><b>项目原定计划日期：</b><span>{stareDate} - {endDate}</span></li>
                        <li className="list-group-item"><b>业主单位：</b><span>{this.props.location.state.project.owenerUnitName}</span></li>
                        <li className="list-group-item"><b>建设单位：</b><span>{this.props.location.state.project.constructUnitName}</span></li>
                        <li className="list-group-item"><b>项目备注：</b><span>{this.props.location.state.project.mark}</span></li>
                        <li className="list-group-item"><b>项目说明：</b><span>{this.props.location.state.project.caption}</span></li>
                        <li className="list-group-item"><b>审核人：</b><span>{this.props.location.state.project.auditPersonName}</span></li>
                        <li className="list-group-item"><b>审核日期：</b><span>{auditDate}</span></li>
                        <li className="list-group-item"><b>创建人：</b><span>{this.props.location.state.project.createPersonName}</span></li>
                        <li className="list-group-item"><b>创建日期：</b><span>{createDate}</span></li>
                    </ul>
                </div>
            </div>
        );
    }

}