import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IToolsRepository from '../repositories/IToolsRepository';

interface Request {
  id: string;
  user_id: string;
}

@injectable()
class DeleteToolService {
  constructor(
    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ id, user_id }: Request): Promise<void> {
    const tool = await this.toolsRepository.findById(id);

    if (!tool) {
      throw new AppError('Tool not found.', 404);
    }

    if (tool.user_id !== user_id) {
      throw new AppError("Tool doesn't belongs to this user.", 401);
    }

    await this.toolsRepository.delete(id);
  }
}

export default DeleteToolService;
