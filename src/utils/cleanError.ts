export const cleanError = (err: string): string => {
  if (err.startsWith('E11000')) {
    const key = err
      .split('index:')[1]
      .split('dup key')[0]
      .split('_')[0]
      .trim();

    return `${key} already exists`;
  }
  return err;
};
