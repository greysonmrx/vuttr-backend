import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IToolsRepository from '../repositories/IToolsRepository';
import ITool from '../entities/ITool';

interface Request {
  user_id: string;
  tag?: string;
  page: number;
  limit: number;
}

interface Response {
  tools: ITool[];
  page_count: number;
  total_pages: number;
  current_page: number;
  total_items: number;
  per_page: number;
}

@injectable()
class ListToolsService {
  constructor(
    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ user_id, tag, page, limit }: Request): Promise<Response> {
    const { tools, count } = await this.toolsRepository.findAll({
      user_id,
      tag: tag?.toLowerCase(),
      skip: page * limit - limit,
      take: limit,
    });

    return {
      tools: classToClass(tools),
      page_count: tools.length,
      current_page: page,
      per_page: limit,
      total_items: count,
      total_pages: Math.ceil(count / limit),
    };
  }
}

export default ListToolsService;
