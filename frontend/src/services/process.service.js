import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/api/process';

class ProcessService {
  
  getAll( page ) {
      return axios.get(API_URL + "?page=" + page, { headers: authHeader() });
  }

  get(id) {
      return axios.get(API_URL + "/" + id, { headers: authHeader() });
  }

  delete(id) {
      return axios.delete(API_URL + "/" + id, { headers: authHeader() });
  }

  save(id, form) {
      console.log(id );
      console.log(form);
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

  saveFeedback( id , feedback ) {
        return axios
            .post(API_URL + "/"+ id +"/feedback", {
                text: feedback
            }, { headers: authHeader() })
            .then(response => {
               return response.data;
            });
  }
}

export default new ProcessService();
