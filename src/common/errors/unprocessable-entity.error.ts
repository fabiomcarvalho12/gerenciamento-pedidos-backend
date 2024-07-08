export class UnprocessableEntityError extends Error {
  constructor(message) {
    super();

    this.name = 'UnprocessableEntityError';
    this.message = message;
  }
}
