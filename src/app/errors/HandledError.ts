class HandledError extends Error {
  code: number;
  details: string;

  constructor(code: number, message: string, details: string) {
    super(message);
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, HandledError.prototype);
  }
}

export default HandledError;
