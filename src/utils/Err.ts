// utility class that allows for custom error messages

class Err extends Error {
  statusCode: number;
  code: number;
  errors: Array<{ message: string }>;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default Err;
