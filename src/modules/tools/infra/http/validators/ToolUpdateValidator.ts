import { Request, Response, NextFunction, RequestHandler } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

export default (request: Request, response: Response, next: NextFunction): RequestHandler => {
  return celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().uuid().required().messages({
        'any.required': `O parâmetro 'ferramenta' não pode estar vazio`,
        'string.empty': `O parâmetro 'ferramenta' não pode estar vazio`,
        'string.guid': `Insira uma ferramenta válida`,
      }),
    }),
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required().messages({
        'any.required': `O campo 'título' não pode estar vazio`,
        'string.empty': `O campo 'título' não pode estar vazio`,
      }),
      link: Joi.string().required().messages({
        'any.required': `O campo 'link' não pode estar vazio`,
        'string.empty': `O campo 'link' não pode estar vazio`,
      }),
      description: Joi.string().required().messages({
        'any.required': `O campo 'descrição' não pode estar vazio`,
        'string.empty': `O campo 'descrição' não pode estar vazio`,
      }),
      tags: Joi.array().required().messages({
        'any.required': `O campo 'tags' não pode estar vazio`,
        'array.empty': `O campo 'tags' não pode estar vazio`,
      }),
    }),
  })(request, response, next);
};
