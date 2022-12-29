import Api from './ApiGlobal';

export type DanePogodowe = {
    temperatura: number,
    opis: string,
    zachmurzenie: string
};

export const getWeather = () => {
  return Api.get('/weather', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};