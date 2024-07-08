export class EntityNotExistError extends Error {
  constructor(entityName) {
    super();

    this.name = 'EntityNotExistError';
    this.message = `${entityName} not found`;
  }
}
