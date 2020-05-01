export type Failure<T> = {
  success: false;
} & T;

export const failure = <T>(data: T): Failure<T> => {
  return { success: false, ...data };
};
