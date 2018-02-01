import React, {Component } from 'react';
import * as RequerystPAI from '../../config/config'

export default class RecordForm extends Component{

constructor(props){
	super(props);
	this.state={
		id:"",
		date:"",
		title : ""
	}
}

handleChange(event){
	let name,obj;
	name = event.target.name;
	this.setState((
		obj = {},
		obj[name+""]=event.target.value,
		obj
	))
}

valid(){
	return this.state.id && this.state.date && this.state.title
}

handeSubmit(event){
	event.preventDefault();

	RequerystPAI.createRecord(this.state).then(
		response => {
			this.props.handleNewRecord(response);
			this.setState(
				{
					id:"",
					date:"",
					title : ""
				}
			)
		}
	)
}

render(){
	return(
	<form className="form-inline mb-3" onSubmit={this.handeSubmit.bind(this)}>
	        <div className="form-group mr-1">
	          <input type="text" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Id" name="id" value={this.state.id} />
	        </div>
	        <div className="form-group mr-1">
	          <input type="text" className="form-control" onChange={this.handleChange.bind(this)} placeholder="Date" name="date" value={this.state.date} />
	        </div>
	        <div className="form-group mr-1">
	          <input type="text" className="form-control" onChange={this.handleChange.bind(this)}  placeholder="Title" name="title" value={this.state.title} />
	        </div>
			<button type="submit" className="btn btn-primary" disabled={!this.valid()} >Create Record</button>
	      </form>
	);
}

}