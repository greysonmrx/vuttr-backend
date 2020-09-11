import { v4 } from 'uuid';

import FakeTool from '@modules/tools/entities/fakes/FakeTool';
import IFindToolsDTO from '@modules/tools/dtos/IFindToolsDTO';
import ICreateToolsDTO from '@modules/tools/dtos/ICreateToolsDTO';
import IToolsRepository from '../IToolsRepository';

class FakeToolsRepository implements IToolsRepository {
  private fakeTools: FakeTool[] = [];

  public async findById(id: string): Promise<FakeTool | undefined> {
    const findTool = this.fakeTools.find(tool => tool.id === id);

    return findTool;
  }

  public async findByTitle(title: string): Promise<FakeTool | undefined> {
    const findTool = this.fakeTools.find(tool => tool.title === title);

    return findTool;
  }

  public async findAll({ user_id, skip, tag, take }: IFindToolsDTO): Promise<{ tools: FakeTool[]; count: number }> {
    const findTools = this.fakeTools.filter(tool => (tool.user_id === user_id && tag ? tool.tags.includes(tag) : true));

    const tools = findTools.slice(skip, skip + take);

    return { tools, count: tools.length };
  }

  public async create({ user_id, title, link, description, tags }: ICreateToolsDTO): Promise<FakeTool> {
    const fakeTool = new FakeTool();

    Object.assign(fakeTool, {
      id: v4(),
      user_id,
      title,
      link,
      description,
      tags,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.fakeTools.push(fakeTool);

    return fakeTool;
  }

  public async update(tool: FakeTool): Promise<FakeTool> {
    const findIndex = this.fakeTools.findIndex(findTool => findTool.id === tool.id);

    this.fakeTools[findIndex] = tool;

    return tool;
  }

  public async delete(id: string): Promise<void> {
    this.fakeTools = this.fakeTools.filter(tool => tool.id !== id);
  }
}

export default FakeToolsRepository;
