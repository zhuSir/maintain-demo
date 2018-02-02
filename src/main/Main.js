import { Layout, Icon, Menu, Dropdown } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import logo from '../logo.svg';
import './Main.css'
import SysMenu from './SysMenu';
import SysContent from "./SysContent";

import {BrowserRouter as Router,Route,Link} from 'react-router-dom';

const { Header, Footer, Sider } = Layout;

class SiderDemo extends Component {

    constructor(){
        super();
        this.state={
            collapsed: false,
            mode: 'inline',
            meunType:{
                key:"",
                keyPath:[{
                    path: 'index',
                    breadcrumbName: '首页'
                }]
            }
        }

    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handeleMeunType =(key,keyPath) =>{
        const paths = [];
        for(let a of keyPath.keys()){
            paths[a]={index:a,breadcrumbName:keyPath[a]};
        }
        this.setState({
            meunType : {
                key : key,
                keyPath:paths
            }
        });
    }

    handleLogout(){

    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="#"><Icon type="logout"/>注销</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="#"><Icon type="switcher"/>切换账号</a>
                </Menu.Item>
            </Menu>
        );

        return (
            <Router>
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}>
                    <div className="logo"/>

                    <SysMenu handeleMeunType={this.handeleMeunType.bind(this)} />

                </Sider>
                <Layout>
                    <Header style={{ background: '#000', padding: 0 }}>
                        <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{cursor: 'pointer'}}
                            />
                        </span>
                        <span style={{color:'#fff', paddingLeft:'2%', fontSize:'1.4em'}}>报障管理系统</span>
                        <span style={{color:'#fff', float:'right', paddingRight:'1%'}}>
                            {/*<img src={logo} className="App-logo" alt="logo" />*/}
                            <Dropdown overlay={menu}>
                                <a href="#">
                                    <Icon type="setting" style={{ fontSize: 25, color: '#fff'}}  />
                                </a>
                            </Dropdown>
                        </span>
                    </Header>

                    <SysContent meunType={this.state.meunType} />

                    <Footer style={{ textAlign: 'center' }}>
                        maintain ©2016 Created by dongdong
                    </Footer>
                </Layout>
            </Layout>
            </Router>
        );
    }
}

export default SiderDemo;