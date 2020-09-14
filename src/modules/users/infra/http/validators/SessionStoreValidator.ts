import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required().messages({
        'any.required': `The 'email' field mustn't be empty.`,
        'string.empty': `The 'email' field mustn't be empty.`,
        'string.email': `The 'email' field must be a valid email.`,
      }),
      password: Joi.string().min(6).required().messages({
        'any.required': `The 'password' field mustn't be empty.`,
        'string.empty': `The 'password' field mustn't be empty.`,
        'string.min': `The 'password' length must be at least {#limit} characters long.`,
      }),
    }),
  })(request, response, next);
};
