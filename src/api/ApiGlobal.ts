import axios from 'axios';

export default axios.create({
  baseURL: `https://localhost:7179/`,
});

export const config = {
      headers: { Authorization: `${localStorage.getItem('token')}` }
    };

