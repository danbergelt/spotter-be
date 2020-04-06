// utility class that allows for custom error messages

class Err extends Error {
  public status: number;
  public code: number;
  public errors: Array<{ message: string }>;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export default Err;
