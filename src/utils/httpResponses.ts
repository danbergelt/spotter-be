export type Success<T> = {
  success: true;
} & T;

export type Failure<T> = {
  success: false;
} & T;

// accepts arbitrary data to return in a success/fail http response

export const success = <T>(data = {} as T): Success<T> => {
  return { success: true, ...data };
};

export const failure = <T>(data: T): Failure<T> => {
  return { success: false, ...data };
};
