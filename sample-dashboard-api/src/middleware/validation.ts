import express from 'express';
import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';

type Constructor<T> = {new(): T};

export function validate<T extends object>(type: Constructor<T>): express.RequestHandler {
  let validator = new Validator();

  return (req, res, next) => {
    let input = plainToClass(type, req.body);
    let errors = validator.validateSync(input);
    if (errors.length > 0) {
      next(errors);
    } else {
      req.body = input;
      next();
    }
  }
}