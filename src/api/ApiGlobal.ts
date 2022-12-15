import axios from 'axios';

export const apiConfig = {
      headers: { Authorization: `${localStorage.getItem('token')}` }
    };

export default axios.create({
  baseURL: `https://localhost:7179/`,
});



