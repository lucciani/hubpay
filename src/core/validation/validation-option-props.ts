import { ValidationOptions } from 'class-validator';

export interface ValidationOptionsProps extends ValidationOptions {
  isRequired?: boolean;
}
