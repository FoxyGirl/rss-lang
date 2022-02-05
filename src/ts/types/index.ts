export type Callback<T> = (data: T) => void;

export type CallbackActive<T, K> = (data: T) => K;

export type CallbackEmpty = () => void;

export type CallbackPromiseEmpty = () => Promise<void>;

export type RoutesActions = {
  [key: string]: CallbackEmpty;
};
