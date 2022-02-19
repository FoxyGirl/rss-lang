export type Callback<T> = (data: T) => void;

export type CallbackActive<T, K> = (data: T) => K;

export type CallbackActiveNew<T> = () => T;

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
  difficulty?: string;
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

export interface ITokenResponse {
  token: string;
  refreshToken: string;
}

export interface IUserResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

interface IGameStatistics {
  correctAnswers: number;
  lastChanged: string;
  learnedWords: number;
  longestSeries: number;
  wrongAnswers: number;
}

// key as date string
interface IWordStatistics {
  [key: string]: number;
}

export interface IOptionalStatistics {
  wordStatistics: IWordStatistics;
  gameStatistics: {
    audio: IGameStatistics;
    sprint: IGameStatistics;
  };
}
export interface IStatisticsResponse {
  learnedWords: number;
  optional?: IOptionalStatistics;
}

export interface IOptionalWord {
  learnt: boolean;
}

export interface IUserWord {
  difficulty: string;
  id: string;
  wordId: string;
}
export interface IUserWordsResponse {
  difficulty: string;
  optional?: IOptionalWord;
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
