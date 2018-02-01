import $ from 'jquery';
export const api =process.env.REACT_APP_RECORDS_API_URL || "http://5a6fe1bdc495aa0012e643a5.mockapi.io"
	
export const selectRecords =(function(){
	return $.getJSON(`${api}/record`)
})

export const createRecord =(function(params){
	const obj = $.post(`${api}/record`,params);
	console.log(obj);
	return obj;
})
	
export const updateRecord =(id,params) => $.ajax({url: `${api}/record/${id}`,type: 'PUT',data: params})
	
export const deleteRecord =(id) => $.ajax({url: `${api}/record/${id}`,type: 'DELETE'})