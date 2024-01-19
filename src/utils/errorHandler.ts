class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string | string[], statusCode: number) {
    const errorMessage = Array.isArray(message) ? message.join(", ") : message;

    super(errorMessage);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export default ErrorHandler;
