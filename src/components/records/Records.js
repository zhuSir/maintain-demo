import React, { Component } from 'react';
import Record from './Record';
import RecordForm from './RecordForm';
import AmountBox from './AmountBox'
import * as RequestPAI from "../../config/config";

class Records extends Component {
  constructor(){
  	  super();
	  this.state = {
	  	  isLoaded:false,
	  	  error:null,
		  records : []
	  }
  }
  componentDidMount(){
  	RequestPAI.selectRecords().then(
  	response =>(
	  		this.setState({
				records : response,
				isLoaded : true
			})
		),
  		error => this.setState({
			error : error,
			isLoaded : true
  		})
  	)
  }
  
 addRecord(record){
  	this.setState({
		error:null,
		isLoaded:true,
		records:[
			...this.state.records,
			record
		]
	 })
  }
  
  updateRecord(record, data) {
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.map( (item, index) => {
      if(index !== recordIndex) {
        return item;
      }
      return {
        ...item,
        ...data
      };
    });
    this.setState({
      records: newRecords
    });
  }
  
deleteRecord(record){
    const recordIndex = this.state.records.indexOf(record);
    const newRecords = this.state.records.filter( (item, index) => index !== recordIndex);
    this.setState({
      records: newRecords
    });
}

credits(){
	let credits = this.state.records.filter((record) => {
      	return record.date >= 0;
	})
	return credits.reduce((prev, curr) => {
		return prev + Number.parseInt(curr.date, 0)
	}, 0)
}

debits(){
     	let credits = this.state.records.filter((record) => {
      	return record.date < 0;
	})
	return credits.reduce((prev, curr) => {
		return prev + Number.parseInt(curr.date, 0)
	}, 0)
}

balance(){
	return this.credits() + this.debits();
}  
  
  render() {
	 const error = this.state.error;
	 const isLoaded = this.state.isLoaded;
	 
  	  if(isLoaded){
  	  	  if(error){
  	  	  	  return(<div>{error.responseText}</div>);
  	  	  }else{  	  	  	  
	  	  	  return(
		  	  	  <div>
					<h2>title</h2>
					<div className="row mb-3">
						<AmountBox text="Credit" type="success" amount={this.credits()} />
						<AmountBox text="Debit" type="danger" amount={this.debits()} />
						<AmountBox text="Balance" type="info" amount={this.balance()} />
					</div>
					<RecordForm handleNewRecord={this.addRecord.bind(this)} />
					<table className="table table-bordered">
						<thead>
							<tr>
								<th>id</th>
								<th>Data</th>
								<th>title</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.records.map((record) => <Record key={record.id} record={record} handleEditRecord={this.updateRecord.bind(this)} handleDeleteRecord={this.deleteRecord.bind(this)} />)}
						</tbody>
					</table>
				</div>
				);
  	  	  }
  	  }else{
  	  	  return(<div>loading...</div>);
  	  }
  }
}

export default Records;
