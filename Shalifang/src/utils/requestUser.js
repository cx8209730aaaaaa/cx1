import fetch from 'dva/fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const response = await fetch(url, options);

  checkStatus(response);

  const data = await response.json();
  var token="";
  var userinfo="";
  console.log(data)
  if(data.obj!=undefined&&data.obj!=""&&data.obj!=null){
  	token=data.obj.token;
  	localStorage.setItem('token', token);
  	userinfo=data.obj;
    localStorage.setItem('userinfo', userinfo);
    const ret = {
	    status: 'ok',
	    currentAuthority: data.obj.name,
	    token:token,
	  };
	    return ret;
  }else{
  	const ret = {
	    status: 'error',
	    currentAuthority:"...",
	    token:"...",
	  };
	  return ret;
  }
 





}
