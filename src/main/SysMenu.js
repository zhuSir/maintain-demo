import React, {Component } from 'react';
import { Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
const SubMenu = Menu.SubMenu;
class SysMenu extends Component{

    handleSelectItem({ item,key, keyPath}){
        this.props.handeleMeunType(key,keyPath);
    }

    render(){
        return(
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleSelectItem.bind(this)} >
                <Menu.Item key="首页">
                    <Link to="/">
                        <Icon type="desktop" />
                        <span>首页</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="统计">
                    <Link to="/records">
                        <Icon type="pie-chart" />
                        <span>统计</span>
                    </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={<span>
                    <Icon type="android" />
                    <span>公司管理</span></span>}>
                    <Menu.Item key="公司信息">
                        <Link to="/company">
                            <Icon type="user" />
                            <span>公司</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="公司成员">
                        <Link to="/maintain">
                            <Icon type="user" />
                            <span>公司成员</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="部门列表">
                        <Link to="/group">
                            <Icon type="team" />
                            <span>部门列表</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="权限管理">
                        <Link to="/groupauthority">
                            <Icon type="user" />
                            <span>权限管理</span>
                        </Link>
                    </Menu.Item>
                </SubMenu>

                <Menu.Item key="项目管理">
                    <Link to="/maintain">
                        <Icon type="profile" />
                        <span>项目管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="报修管理">
                    <Link to="/groupauthority">
                        <Icon type="exception" />
                        <span>报修管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="维修管理">
                    <Link to="/weibao">
                        <Icon type="exception" />
                        <span>维修管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="设备管理">
                    <Link to="/equip">
                        <Icon type="tool" />
                        <span>设备管理</span>
                    </Link>
                </Menu.Item>

                <Menu.Item key="组成员">
                    <Link to="/GroupMemberList">
                        <Icon type="tool" />
                        <span>组成员</span>
                    </Link>
                </Menu.Item>

            </Menu>
        );
    }

}

export default SysMenu