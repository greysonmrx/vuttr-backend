import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IToolsRepository from '../repositories/IToolsRepository';
import ITool from '../entities/ITool';

interface Request {
  id: string;
  user_id: string;
  title: string;
  link: string;
  description: string;
  tags: string[];
}

@injectable()
class UpdateToolService {
  constructor(
    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ id, user_id, title, link, description, tags }: Request): Promise<ITool> {
    const tool = await this.toolsRepository.findById(id);

    if (!tool) {
      throw new AppError('Tool not found.', 404);
    }

    const toolExistsWithTitle = await this.toolsRepository.findByTitle(title.toLowerCase());

    if (toolExistsWithTitle && toolExistsWithTitle.id !== id) {
      throw new AppError('Tool already created.', 409);
    }

    const lowerCaseTags = tags.map(tag => tag.toLowerCase());

    Object.assign(tool, {
      title: title.toLowerCase(),
      description,
      link,
      tags: lowerCaseTags,
    });

    const updatedTool = await this.toolsRepository.update(tool);

    return classToClass(updatedTool);
  }
}

export default UpdateToolService;
