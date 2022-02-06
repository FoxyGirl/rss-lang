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
