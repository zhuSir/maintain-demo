import React, {Component } from 'react';
import { Menu, Icon } from 'antd';
import 'antd/dist/antd.css';

const SubMenu = Menu.SubMenu;

class SysMenu extends Component{

    handleSelectItem({ item,key, keyPath}){
        this.props.handeleMeunType(key,keyPath);
    }

    render(){
        return(
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleSelectItem.bind(this)} >
                <Menu.Item key="1">
                    <Icon type="desktop" />
                    <span>首页</span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="pie-chart" />
                    <span>统计</span>
                </Menu.Item>
                <SubMenu
                    key="sub1"
                    title={<span><Icon type="user" /><span>人员管理</span></span>}>
                    <Menu.Item key="3">用户列表</Menu.Item>
                    <Menu.Item key="4">新增用户</Menu.Item>
                    <Menu.Item key="5">更新用户</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={<span><Icon type="team" /><span>公司管理</span></span>}>
                    <Menu.Item key="6">研发部</Menu.Item>
                    <Menu.Item key="8">养发部</Menu.Item>
                </SubMenu>
                <Menu.Item key="9">
                    <Icon type="profile" />
                    <span>项目管理</span>
                </Menu.Item>
                <Menu.Item key="10">
                    <Icon type="profile" />
                    <span>报修管理</span>
                </Menu.Item>
            </Menu>
        );
    }

}

export default SysMenu