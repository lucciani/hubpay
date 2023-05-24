import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

/**
 * Trim Pipe.
 * Apply trim to all fields of type string
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  private static isObj(obj: any): boolean {
    return obj !== null && typeof obj === 'object';
  }

  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        if (TrimPipe.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }

  transform(values: any, { metatype }: ArgumentMetadata) {
    const object = plainToClass(metatype, values);
    if (TrimPipe.isObj(object)) {
      return this.trim(object);
    }
    if (typeof object === 'string') {
      return object.trim();
    }

    return object;
  }
}
