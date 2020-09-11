import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number().messages({
        'number.base': `O parâmetro 'página' precisa ser um número`,
      }),
      limit: Joi.number().messages({
        'number.base': `O parâmetro 'limite' precisa ser um número`,
      }),
      tag: Joi.string().messages({
        'string.empty': `O parâmetro 'tag' não pode estar vazio`,
      }),
    }),
  })(request, response, next);
};
