import React, {Component } from 'react';
import { Layout, Breadcrumb } from 'antd';
import {Route} from 'react-router-dom';

import 'antd/dist/antd.css';
import Maintain from '../components/maintain/Maintain';
import Records from '../components/records/Records';
import Equip from '../components/equip/Equip';
import WeiBao from '../components/maintain/WeiBao';
import Company from '../components/company/Company';
import SettingGroup from '../components/groupauthority/SettingGroup';
import GroupList from '../components/group/GroupList'
import MemberList from '../components/company/MemberList'
import GroupMemberList from "../components/company/GroupMemberList"
import Projects from "../components/project/Projects"
import ProjectDetail from "../components/project/ProjectDetail"
import ProjectCreate from "../components/project/ProjectCreate"
const { Content } = Layout;

const Home = () => (
    <div>
        <h2>Home</h2>
    </div>
)

class SysContent extends Component{
    render(){
        const keyPaths = this.props.meunType.keyPath;
        return(
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '12px 0' }} routes={keyPaths}></Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/records" component={Records}/>
                        <Route path="/maintain" component={Maintain}/>
                        <Route path="/weibao" component={WeiBao}/>
                        <Route path="/equip" component={Equip}/>
                        <Route path="/groupauthority" component={SettingGroup}/>
                        <Route path="/company" component={Company}/>
                        <Route path="/group" component={GroupList}/>
                        <Route path="/companyMemberList" component={MemberList}/>
                        <Route path="/groupList" component={GroupMemberList}/>
                        <Route path="/Projects" component={Projects}/>
                        <Route path="/ProjectDetail" component={ProjectDetail}/>
                        <Route path="/ProjectCreate" component={ProjectCreate}/>


                    </div>
                </div>
            </Content>
        );
    }

}

export default SysContent