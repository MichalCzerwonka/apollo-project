import Api from './ApiGlobal';

export type ClientInformationType = {
  id: number,
  kod: string
}

export type ClientInformation = {
  id: number,
  kntId: number,
  kntKod: string,
  kitId: number,
  kitKod: string,
  nazwa: string,
  opis: string,
  archiwalny: boolean,
  opeUtworzyl: string,
  dataUtworzenia: Date,
  opeModyfikowal: string,
  dataModyfikacji: Date,
  wybrany: boolean,
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
    opeUtworzyl: string, 
    dataUtworzenia: Date, 
    opeModyfikowal: string,
    dataModyfikacji: Date,
    archiwalny: boolean,
    kntInformacje: ClientInformation[]
}


export const getClients = () => {
  return Api.get('/clients', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};
export const getClientInformationTypes = () => {
  return Api.get('/informationtype', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};

export const getSelectedClient = (clientId: number) => {
  return Api.get('/clients/'+clientId, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};


export const postNewClient = (data: Client) => {
  return Api.post('/clients/add', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};
export const postNewClientInformation = (data: ClientInformation, clientCode:string | undefined) => {
  if(typeof(clientCode) === "string"){
  data.kntKod = clientCode;
  }
  return Api.post('/information/add', data, {
   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};

export const putEditClient = (data: Client) => {
  return Api.put('/clients/edit', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};
export const putEditClientInformation = (data: ClientInformation) => {
  console.log('edit');
  console.log(data);
  return Api.put('/information/edit', data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
};