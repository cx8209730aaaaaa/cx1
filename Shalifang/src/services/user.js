import request from '../utils/requestTest';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
export function get(url,params) {
			url+='.manage'
      if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
        } else {
          url += '&' + paramsArray.join('&')
        }
        url+='&token='+localStorage.getItem('token')
      }else{
      	url+='?token='+localStorage.getItem('token')
      }
  //	debugger;
    return request(url,{
      method:'get',
    });
}