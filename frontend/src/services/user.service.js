import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/user';

class UserService {
  getAll() {
      return axios.get(API_URL, { headers: authHeader() } );
  }  
}

export default new UserService();
