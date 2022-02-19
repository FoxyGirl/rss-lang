import { API_URL } from '../constants';
import { IWord, IUserData, IUserFullData, IUserResponse, IUserShortResponse } from '../types';

class API {
  static readonly baseURL = API_URL;

  static readonly words = `${this.baseURL}/words`;

  static readonly users = `${this.baseURL}/users`;

  static readonly signin = `${this.baseURL}/signin`;

  async getWords(page = 0, group = 0): Promise<IWord[]> {
    const response = await fetch(`${API.words}?page=${page}&group=${group}`);

    if (response.ok) {
      return response.json();
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async getUser(id: string): Promise<IUserResponse> {
    const response = await fetch(`${API.users}/${id}`);

    if (response.ok) {
      return response.json();
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async createUser(body: IUserFullData): Promise<IUserShortResponse> {
    const response = await fetch(API.users, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserShortResponse>;
    }

    if (response.status === 417) {
      const warning = 'Юзер с такой почтой уже зарегистрирован';
      console.error(warning);
      throw new Error(warning);
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async signin(body: IUserData): Promise<IUserResponse> {
    const response = await fetch(API.signin, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserResponse>;
    }

    if (response.status === 403) {
      const warning = 'Неверный пароль или email';
      console.error(warning);
      throw Error(warning);
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }
}

const api = new API();

export default api;
