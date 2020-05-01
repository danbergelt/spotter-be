export type Success<T> = {
  success: true;
} & T;

export type Failure<T> = {
  success: false;
} & T;

export const success = <T>(data = {} as T): Success<T> => {
  return { success: true, ...data };
};

export const failure = <T>(data: T): Failure<T> => {
  return { success: false, ...data };
};
