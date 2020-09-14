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
  })(request, response, next);
};
