import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

class UsersController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.status(201).json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, current_password } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      user_id: request.user.id,
      name,
      email,
      password,
      current_password,
    });

    return response.status(200).json(user);
  }

  public async destroy(request: Request, response: Response): Promise<Response> {
    const deleteUser = container.resolve(DeleteUserService);

    await deleteUser.execute({ id: request.user.id });

    return response.status(204).json();
  }
}

export default UsersController;
