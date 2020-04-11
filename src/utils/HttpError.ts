/*== Custom Http Error =====================================================

This error extends the base Error class and adds a status, allowing it to
pair seamlessly with sending back an HTTP response to the client

*/

class HttpError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export default HttpError;
