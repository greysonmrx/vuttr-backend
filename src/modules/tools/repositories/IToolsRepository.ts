import ICreateToolsDTO from '../dtos/ICreateToolsDTO';

import ITool from '../entities/ITool';
import IFindToolsDTO from '../dtos/IFindToolsDTO';

interface IToolsRepository {
  findById(id: string): Promise<ITool | undefined>;
  findByTitle(title: string): Promise<ITool | undefined>;
  findAll(data: IFindToolsDTO): Promise<{ tools: ITool[]; count: number }>;
  create(data: ICreateToolsDTO): Promise<ITool>;
  update(tool: ITool): Promise<ITool>;
  delete(id: string): Promise<void>;
}

export default IToolsRepository;
