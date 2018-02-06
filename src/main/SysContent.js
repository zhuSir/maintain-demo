import React, {Component } from 'react';
import { Layout, Breadcrumb,Alert } from 'antd';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import 'antd/dist/antd.css';
import Maintain from '../components/maintain/Maintain';
import Records from '../components/records/Records';
import Equip from '../components/equip/Equip';
import WeiBao from '../components/maintain/WeiBao';

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
                    </div>
                </div>
            </Content>
        );
    }

}

export default SysContent