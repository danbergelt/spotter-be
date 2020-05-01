export interface E {
  message: string;
  status: number;
}

// default error object, returning a message and an http status

export const e = (message: string, status: number): E => {
  return { message, status };
};
