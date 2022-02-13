import { LocalStorageKeys } from '../types';

export const setLocalCurrentPage = (val: number) => localStorage.setItem(LocalStorageKeys.CurrentPage, String(val));

export const resetLocalCurrentPage = () => localStorage.setItem(LocalStorageKeys.CurrentPage, String(0));

export const getLocalCurrentPage = () => {
  const currentPage = localStorage.getItem(LocalStorageKeys.CurrentPage);
  return currentPage ? Number(currentPage) : null;
};
