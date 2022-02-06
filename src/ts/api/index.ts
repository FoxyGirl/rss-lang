import { API_URL } from '../constants';
import { IWord } from '../types';

class API {
  static readonly baseURL = API_URL;

  static readonly words = `${this.baseURL}/words`;

  static readonly users = `${this.baseURL}/users`;

  async getWords(page = 0, group = 0): Promise<IWord[]> {
    const response = await fetch(`${API.words}?page=${page}&group=${group}`);

    if (response.ok) {
      return response.json();
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }
}

const api = new API();

// export default API;
export default api;
