import request from '../utils/requestbasics';

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
  	//debugger;
    return request(url,{
      method:'get',
    });
}
export function post(url,params) {
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
  	//debugger;
    return request(url,{
      method:'post',
    });
}

export function puts(url,params) {
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
  	//debugger;
    return request(url,{
      method:'put',
    });
}
