import Api from './ApiGlobal';

export type LoginData = { login: string, password: string, name:string, roleId: number, token: string}

export const loginAccount = (data: LoginData) => {
  return Api.post('/account/login', data);
};


export const logoutAccount = () => {
  
  const config = {
      headers: { Authorization: `${localStorage.getItem('token')}` }
    };
  return Api.post('/account/logout',{},config);
  
};

