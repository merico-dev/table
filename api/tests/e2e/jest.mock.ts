import { NextFunction, Request, Response } from 'express';

jest.mock('~/middleware/validation', () => ({
  validate: () => (req: Request, res: Response, next: NextFunction) => next(),
  validateClass: (type, data) => data,
}));
