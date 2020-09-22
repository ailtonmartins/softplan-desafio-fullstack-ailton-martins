import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/user';

class UserService {

  get(id) {
     return axios.get(API_URL + "/" + id, { headers: authHeader() });
  }

  getAll() {
      return axios.get(API_URL, { headers: authHeader() } );
  }  

  save(id, form) {    
        if ( id ) {
            return axios.put(API_URL + "/" + id, form
                    , { headers: authHeader() })
                .then(response => {
                    return response.data;
                });
        } else {
            return axios.post(API_URL, form, { headers: authHeader() })
                .then(response => {
                    return response.data;
                });
        }
        
  }
}

export default new UserService();
