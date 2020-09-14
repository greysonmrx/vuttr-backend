import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IToolsRepository from '../repositories/IToolsRepository';
import ITool from '../entities/ITool';

interface Request {
  user_id: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
}

@injectable()
class CreateToolService {
  constructor(
    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ user_id, title, link, description, tags }: Request): Promise<ITool> {
    const toolExistsWithTitle = await this.toolsRepository.findByTitle(title.toLowerCase());

    if (toolExistsWithTitle) {
      throw new AppError('Tool already created.', 409);
    }

    const lowerCaseTags = tags.map(tag => tag.toLowerCase());

    const tool = await this.toolsRepository.create({
      user_id,
      title: title.toLowerCase(),
      description,
      link,
      tags: lowerCaseTags,
    });

    return classToClass(tool);
  }
}

export default CreateToolService;
