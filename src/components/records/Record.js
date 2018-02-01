import React, { Component } from 'react';
import * as RequestAPI from '../../config/config';
	
export default class Record extends Component {
	
constructor() {
    super();
    this.state = {
      edit: false
    };
  }

handleToggle(){
	this.setState({
      edit: !this.state.edit
    });
}

handleEdit(){
    event.preventDefault();
    const record = {
	      id: this.refs.id.value,
	      date: this.refs.date.value,
	      title: this.refs.title.value
    }
    
    RequestAPI.updateRecord(this.props.record.id,record).then(
  		response => {
  			this.props.handleEditRecord(this.props.record, response);
  			this.setState({edit: !this.state.edit})
  		},
  		error => console.log(error)
    )
}

handleDelete(event){
	event.preventDefault();
	
	RequestAPI.deleteRecord(this.props.record.id).then(
  		response => this.props.handleDeleteRecord(this.props.record),
  		error => console.log(error)
    )
    	
}

recordRow() {
    return (
      <tr>
        <td>{this.props.record.id}</td>
        <td>{this.props.record.date}</td>
        <td>{this.props.record.title}</td>
        <td>
		<button className="btn btn-info mr-1" onClick={this.handleToggle.bind(this)}>Edit</button>
		<button className="btn btn-danger" onClick={this.handleDelete.bind(this)}>Delete</button>
        </td>
      </tr>
    );
  }

  recordForm() {
    return (
      <tr>
        <td><input type="text" className="form-control" defaultValue={this.props.record.id} ref="id" /></td>
        <td><input type="text" className="form-control" defaultValue={this.props.record.date} ref="date" /></td>
        <td><input type="text" className="form-control" defaultValue={this.props.record.title} ref="title" /></td>
        <td>
          <button className="btn btn-info mr-1" onClick={this.handleEdit.bind(this)}>Update</button>
          <button className="btn btn-danger" onClick={this.handleToggle.bind(this)}>Cancel</button>
        </td>
      </tr>
    );
  }

  render() {
    if(this.state.edit){
    	return this.recordForm();
    }else{
    	return this.recordRow();
    }
  }
}
