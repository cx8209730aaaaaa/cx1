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
const url='/api/role/getRoleName.role';
const options={method:'get'}
export default async function request(url,options ) {

  const response = await fetch(url, options);
  console.log(response);
  checkStatus(response);
  
  console.log(response);
  const data = await response.json();
 /* const ret = {
    status: 'ok',
    currentAuthority: data.obj.name,
    
  };*/
  return data;
}

