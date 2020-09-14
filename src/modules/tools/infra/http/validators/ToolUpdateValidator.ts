import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required().messages({
        'any.required': `The 'tool' param mustn't be empty.`,
        'string.empty': `The 'tool' param mustn't be empty.`,
        'string.guid': `The 'toolId' must be a valid UUID.`,
      }),
    }),
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required().messages({
        'any.required': `The 'title' field mustn't be empty.`,
        'string.empty': `The 'title' field mustn't be empty.`,
      }),
      link: Joi.string().required().messages({
        'any.required': `The 'link' field mustn't be empty.`,
        'string.empty': `The 'link' field mustn't be empty.`,
      }),
      description: Joi.string().required().messages({
        'any.required': `The 'description' field mustn't be empty.`,
        'string.empty': `The 'description' field mustn't be empty.`,
      }),
      tags: Joi.array().required().messages({
        'any.required': `The 'tags' field mustn't be empty.`,
        'array.empty': `The 'tags' field mustn't be empty.`,
      }),
    }),
  })(request, response, next);
};
