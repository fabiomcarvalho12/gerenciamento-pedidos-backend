import { registerDecorator, ValidationOptions } from 'class-validator';
import { UniqueUserEmailValidator } from './validators/unique-user-email.validator';
import { UniqueUserDocumentValidator } from './validators/unique-user-document.validator';

export function UniqueUserEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueUserEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueUserEmailValidator,
    });
  };
}

export function UniqueUserDocument(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UniqueUserDocument',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueUserDocumentValidator,
    });
  };
}
