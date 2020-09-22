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
