import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().messages({
        'number.base': `The 'page' param must be a number.`,
      }),
      limit: Joi.number().messages({
        'number.base': `The 'limit' param must be a number.`,
      }),
      tag: Joi.string().messages({
        'string.empty': `The 'tag' param mustn't be empty.`,
      }),
      title: Joi.string().messages({
        'string.empty': `The 'title' param mustn't be empty.`,
      }),
    }),
  })(request, response, next);
};
