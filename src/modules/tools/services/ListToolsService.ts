import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IToolsRepository from '../repositories/IToolsRepository';
import ITool from '../entities/ITool';

interface Request {
  user_id: string;
  tag?: string;
  title?: string;
  page: number;
  limit: number;
}

interface Response {
  tools: ITool[];
  total_pages: number;
  current_page: number;
}

@injectable()
class ListToolsService {
  constructor(
    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ user_id, tag, page, limit, title }: Request): Promise<Response> {
    const { tools, count } = await this.toolsRepository.findAll({
      user_id,
      tag: tag?.toLowerCase(),
      title: title?.toLowerCase(),
      skip: page * limit - limit,
      take: limit,
    });

    return {
      tools: classToClass(tools),
      current_page: page,
      total_pages: Math.ceil(count / limit),
    };
  }
}

export default ListToolsService;
