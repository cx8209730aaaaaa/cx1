import request from '../utils/requestUser';


export function remove(id) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

export function patch(id, values) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
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
      }
  //	debugger;
    return request(url,{
      method:'get',
    });
}

export function gets(url,params) {
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