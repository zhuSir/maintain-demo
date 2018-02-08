import React, {Component, Popconfirm, message,Table, Icon, Divider} from 'react';

class Project extends Component {

    constructor(props) {
        super(props);

    }

    handleDeleteClick() {
        let alertContent = {
            tittle: "警告",
            content: "确定要删除 \"" + this.props.project.name + "\" 这个项目吗？",
            data: this.props.project
        }
        this.props.handleDeleteClick(alertContent);
    }

    handleDetailClick() {
        this.props.handleProjectDetailClick(this.props.project);
    }

    handleEditClick() {
        console.log("编辑");
        this.props.handleProjectEditClick(this.props.project);
    }

    render() {
        let projectState;
        let stateType;
        switch (this.props.project.projectState) {
            case 0:
                projectState = "未开工";
                stateType = "text-primary";
                break;
            case 1:
                projectState = "已开工";
                stateType = "text-success";
                break;
            case 2:
                projectState = "已完工";
                stateType = "text-warning";
                break;
            case 3:
                projectState = "已停工";
                stateType = "text-danger";
                break;
        }
        let date = new Date(this.props.project.planStartDate);
        const stareDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        date = new Date(this.props.project.planEndDate);
        const endDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        return (
            <tr className="center-block table-bordered">
                <td>
                    <h5>{this.props.project.name}</h5>
                </td>
                <td className="text-muted">
                    {stareDate} - {endDate}
                </td>
                <td className={`${stateType} center-block`}>
                    <h6>
                        <b>{projectState}</b>
                    </h6>
                </td>
                <td className="table-condensed">
                    <button className="btn btn-primary mr-1 ml-1" onClick={this.handleDetailClick.bind(this)}>详情
                    </button>
                    <button className="btn btn-info mr-1 " onClick={this.handleEditClick.bind(this)}>编辑</button>
                    <button className="btn btn-danger mr-1" onClick={this.handleDeleteClick.bind(this)}>删除</button>
                </td>
            </tr>
        );
    }
}

export default Project;
