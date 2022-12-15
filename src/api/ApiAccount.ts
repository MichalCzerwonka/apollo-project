import Api from './ApiGlobal';
import { apiConfig } from './ApiGlobal';

export type LoginData = { login: string, password: string, name:string, roleId: number, token: string}

export const loginAccount = (data: LoginData) => {
  return Api.post('/account/login', data);
};


export const logoutAccount = () => {
  return Api.post('/account/logout',{},apiConfig);
  
};

