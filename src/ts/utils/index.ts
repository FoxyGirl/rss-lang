import { LocalStorageKeys, IWord } from '../types';

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

export function searchRightAnswerWords(data: IWord[], obj: { [key: string]: boolean }) {
  const arr = Object.entries(obj).reduce((acc, item) => {
    const [key, value] = item;
    return value ? [...acc, data[Number(key)].word] : acc;
  }, [] as string[]);
  return arr;
}

export function searchMaxRightSequence(obj: { [key: string]: boolean }) {
  let count = 0;
  let num = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj[key] === true) {
      num += 1;
    } else {
      count = num > count ? num : count;
      num = 0;
    }
  }
  return count;
}

export function searchUseWords(data: IWord[], obj: { [key: string]: boolean }) {
  const arr = Object.keys(obj).map((key) => data[Number(key)].word);
  return arr;
}
