import { registerDecorator } from 'class-validator';
import { DATETIME_BR, dateValid } from '@core/utils/date-provider';
import { ValidationOptionsProps } from './validation-option-props';

export function IsOnlyDateTimeBr(validationOptions?: ValidationOptionsProps) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like DD/MM/YYYY HH:MM:SS',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (!validationOptions.isRequired && !value) {
            return true;
          }
          return typeof value === 'string' && dateValid(value, DATETIME_BR);
        },
      },
    });
  };
}
