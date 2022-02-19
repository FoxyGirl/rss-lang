import { API_URL } from '../constants';
import {
  IWord,
  IUserData,
  IUserFullData,
  IUserResponse,
  IUserShortResponse,
  ITokenResponse,
  IStatisticsResponse,
  IUserWordsResponse,
  IUserWord,
  LocalStorageKeys,
  CallbackActiveNew,
} from '../types';

class API {
  static readonly baseURL = API_URL;

  static readonly words = `${this.baseURL}/words`;

  static readonly users = `${this.baseURL}/users`;

  static readonly signin = `${this.baseURL}/signin`;

  getLocalToken = () => localStorage.getItem(LocalStorageKeys.token);

  getLocalRefreshToken = () => localStorage.getItem(LocalStorageKeys.refreshToken);

  getLocalUserId = () => localStorage.getItem(LocalStorageKeys.userId);

  async getNewToken(): Promise<ITokenResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/tokens`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getLocalRefreshToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<ITokenResponse>;
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async repeatRequest<T>(callback: CallbackActiveNew<T>): Promise<T> {
    const data = await this.getNewToken();
    const { token, refreshToken } = data;

    localStorage.setItem(LocalStorageKeys.token, token);
    localStorage.setItem(LocalStorageKeys.refreshToken, refreshToken);

    return callback();
  }

  async getWords(page = 0, group = 0): Promise<IWord[]> {
    const response = await fetch(`${API.words}?page=${page}&group=${group}`);

    if (response.ok) {
      return response.json();
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async getUser(id: string): Promise<IUserResponse> {
    const response = await fetch(`${API.users}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.getUser(id));
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

  async getUserStatistics(): Promise<IStatisticsResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IStatisticsResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.getUserStatistics());
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async updateUserStatistics(body: IStatisticsResponse): Promise<IStatisticsResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/statistics`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IStatisticsResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.updateUserStatistics(body));
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async getUserWords(): Promise<IUserWordsResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserWordsResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.getUserWords());
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async createUserWord(wordId: string, body: IUserWordsResponse): Promise<IUserWordsResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/words/${wordId}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserWordsResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.createUserWord(wordId, body));
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async getUserWord(wordId: string): Promise<IUserWord> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/words/${wordId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserWord>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.getUserWord(wordId));
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  async updateUserWord(wordId: string, body: IUserWordsResponse): Promise<IUserWordsResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/words/${wordId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserWordsResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.updateUserWord(wordId, body));
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }

  // TODO: check what return this response
  async deleteUserWord(wordId: string): Promise<IUserWordsResponse> {
    const response = await fetch(`${API.users}/${this.getLocalUserId()}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.getLocalToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return response.json() as Promise<IUserWordsResponse>;
    }

    if (response.status === 401) {
      this.repeatRequest(() => this.deleteUserWord(wordId));
    }

    throw new Error(`status ${response.status} / ${response.statusText}`);
  }
}

const api = new API();

export default api;
