import { Repository, getRepository } from 'typeorm';

import IToolsRepository from '@modules/tools/repositories/IToolsRepository';

import IFindToolsDTO from '@modules/tools/dtos/IFindToolsDTO';
import ICreateToolsDTO from '@modules/tools/dtos/ICreateToolsDTO';
import Tool from '../entities/Tool';

class ToolsRepository implements IToolsRepository {
  private ormRepository: Repository<Tool>;

  constructor() {
    this.ormRepository = getRepository(Tool);
  }

  public async findById(id: string): Promise<Tool | undefined> {
    const tool = await this.ormRepository.findOne({
      where: { id },
    });

    return tool;
  }

  public async findByTitle(title: string): Promise<Tool | undefined> {
    const tool = await this.ormRepository.findOne({
      where: { title },
    });

    return tool;
  }

  public async findAll({ user_id, skip, take, tag, title }: IFindToolsDTO): Promise<{ tools: Tool[]; count: number }> {
    const query = await this.ormRepository
      .createQueryBuilder('tools')
      .skip(skip)
      .take(take)
      .where('tools.user_id = :user_id', { user_id });

    let result: [Tool[], number];

    if (tag) {
      result = await query.andWhere(`tools.tags @> '{"${tag}"}'`).getManyAndCount();
    } else if (title) {
      result = await query.andWhere(`tools.title LIKE '${title}%'`).getManyAndCount();
    } else {
      result = await query.getManyAndCount();
    }

    const [tools, count] = result;

    return { tools, count };
  }

  public async create({ user_id, title, description, link, tags }: ICreateToolsDTO): Promise<Tool> {
    const tool = await this.ormRepository.create({
      user_id,
      title,
      description,
      link,
      tags,
    });

    await this.ormRepository.save(tool);

    return tool;
  }

  public async update(tool: Tool): Promise<Tool> {
    await this.ormRepository.save(tool);

    return tool;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default ToolsRepository;
