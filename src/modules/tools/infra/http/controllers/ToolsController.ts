import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListToolsService from '@modules/tools/services/ListToolsService';
import CreateToolService from '@modules/tools/services/CreateToolService';
import UpdateToolService from '@modules/tools/services/UpdateToolService';
import DeleteToolService from '@modules/tools/services/DeleteToolService';

interface IListTools {
  user_id: string;
  tag?: string;
  page: number;
  limit: number;
}

class ToolsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 5, tag } = request.query;

    const listTools = container.resolve(ListToolsService);

    const { tools, page_count, current_page, per_page, total_items, total_pages } = await listTools.execute({
      user_id: request.user.id,
      limit: Number(limit),
      page: Number(page),
      tag,
    } as IListTools);

    return response.status(200).json({ tools, page_count, current_page, per_page, total_items, total_pages });
  }

  public async store(request: Request, response: Response): Promise<Response> {
    const { title, link, description, tags } = request.body;

    const createTool = container.resolve(CreateToolService);

    const tool = await createTool.execute({
      user_id: request.user.id,
      title,
      link,
      description,
      tags,
    });

    return response.status(201).json(tool);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { title, link, description, tags } = request.body;

    const updateTool = container.resolve(UpdateToolService);

    const tool = await updateTool.execute({
      id: request.params.id,
      user_id: request.user.id,
      title,
      link,
      description,
      tags,
    });

    return response.status(200).json(tool);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteTool = container.resolve(DeleteToolService);

    await deleteTool.execute({
      id: request.params.id,
      user_id: request.user.id,
    });

    return response.status(204).json();
  }
}

export default ToolsController;
