import Api from './ApiGlobal';
import apiConfig from './ApiGlobal';

export type ClientInformation = {
  id: number,
  kntId: number,
  kitId: number,
  nazwa: string,
  opis: string,
  archiwalny: boolean,
  opeUtowrzyl: number,
  dataUtworzenia: number,
  opeModyfikowal: number,
  dataModyfikacji: number,
  wybrany: boolean
}

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
    dataModyfikacji: number,
    kntInformacje: ClientInformation[]
}


export const getClients = () => {
  return Api.get('/clients', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};

export const getSelectedClient = (clientId: number) => {
  return Api.get('/clients/'+clientId, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};