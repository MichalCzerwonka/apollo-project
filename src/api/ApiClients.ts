import Api from './ApiGlobal';
import apiConfig from './ApiGlobal';

export type Client = {
    id: number, 
    typ: number, 
    kod: string, 
    nazwa1: string, 
    nazwa2: string, 
    miasto: string, 
    nip: string, 
    ulica: string, 
    kodPocztowy: string, 
    poczta: string, 
    telefon: string, 
    email: string, 
    opeUtworzyl: number, 
    dataUtworzenia: number, 
    opeModyfikowal: number,
    dataModyfikacji: number
}


export const getClients = () => {
  return Api.get('/clients', {
    headers: { Authorization: `${localStorage.getItem('token')}` }});
};