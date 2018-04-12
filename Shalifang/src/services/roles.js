import request from '../utils/requestbasics';

export function get(url,params) {
 	url+='.role'
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
  	//debugger;
    return request(url,{
      method:'get',
    });
}

