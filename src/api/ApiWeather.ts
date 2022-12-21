import Api from './ApiGlobal';
import apiConfig from './ApiGlobal';

export type DanePogodowe = {
    temperatura: number,
    opis: string,
    zachmurzenie: string
};

export const getWeather = () => {
  return Api.get('/weather', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};