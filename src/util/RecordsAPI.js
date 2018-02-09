import $ from 'jquery';

// const api = "http://localhost:8080";
//const api = "http://10.100.1.247:8080";
const api = "http://10.100.1.242:8080";
//const api = "http://10.100.1.217:8080";

export const uId = 1;

export const companyId = 34;

export const getProjects = (data) => $.post(`${api}/project/select`, data)

export const delectProjects = (data) => $.post(`${api}/project/delect`, data)

export const createProject = (data) => $.post(`${api}/project/insert`, data)

export const updateProject = (data) => $.post(`${api}/project/update`, data)

export const getProjectsCompany = (data) => $.post(`${api}/project_company/select`, data)

export const removeProjectsCompany =(data) => $.post(`${api}/project_company/delect`, data)

export const updateProjectsCompany =(data) => $.post(`${api}/project_company/update`, data)

export const createProjectsCompany = (data) => $.post(`${api}/project_company/insert`, data)