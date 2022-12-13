import Api from './Api';

export type LoginData = { login: string, password: string }

export const login = (data: LoginData) => {
  return Api.post('/account/login', data);
};