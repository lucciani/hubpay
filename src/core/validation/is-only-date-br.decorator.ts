import { registerDecorator } from 'class-validator';
import { dateValid, DATE_BR } from '@core/utils/date-provider';
import { ValidationOptionsProps } from './validation-option-props';

export function IsOnlyDateBr(validationOptions?: ValidationOptionsProps) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like DD/MM/YYYY',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (!validationOptions.isRequired && !value) {
            return true;
          }
          return typeof value === 'string' && dateValid(value, DATE_BR);
        },
      },
    });
  };
}
