export type Success<T> = {
  success: true;
} & T;

// default object for successful http responses

export const success = <T>(data = {} as T): Success<T> => {
  return { success: true, ...data };
};
