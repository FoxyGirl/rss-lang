import { LocalStorageKeys } from '../types';

export const setLocalCurrentPage = (val: number) => localStorage.setItem(LocalStorageKeys.currentPage, String(val));

export const resetLocalCurrentPage = () => localStorage.setItem(LocalStorageKeys.currentPage, String(0));

export const getLocalCurrentPage = () => {
  const currentPage = localStorage.getItem(LocalStorageKeys.currentPage);
  return currentPage ? Number(currentPage) : null;
};

export function shuffledArr(arr: number[]) {
  arr.sort(() => Math.random() - 0.5);
  return arr;
}

export function getRandomIntInclusive(min: number, max: number) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
