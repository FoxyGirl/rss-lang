export type Callback<T> = (data: T) => void;

export type CallbackActive<T, K> = (data: T) => K;

export type CallbackEmpty = () => void;

export type CallbackPromiseEmpty = () => Promise<void>;

export type RoutesActions = {
  [key: string]: CallbackEmpty;
};

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export interface IUserData {
  email: string;
  password: string;
}

export interface IUserFullData extends IUserData {
  name: string;
}

export interface IUserShortResponse {
  id: string;
  email: string;
  name: string;
}

export interface IUserResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export enum LocalStorageKeys {
  currentPage = 'currentPage',
  token = 'token',
  refreshToken = 'refreshToken',
  userId = 'userId',
  userName = 'userName',
}

export enum FormStrings {
  login = 'Войти',
  logout = 'Выйти',
  signup = 'Зарегистрироваться',
}
