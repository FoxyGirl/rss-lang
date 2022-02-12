// TODO: Remove all unused functions
export const getPaginationActives = (
  page: number,
  maxCount: number,
  pageLimit: number
): { isNextActive: boolean; isPrevActive: boolean } => {
  const isNextActive = page * pageLimit < maxCount;
  const isPrevActive = page > 1;

  return { isNextActive, isPrevActive };
};

export const help = 'help';
