import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUser from '../entities/IUser';

interface Request {
  user_id: string;
  name: string;
  email: string;
  current_password?: string;
  password?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email, password, current_password }: Request): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Este endereço de e-mail já está em uso. Tente outro.', 409);
    }

    Object.assign(user, { name, email });

    if (password && !current_password) {
      throw new AppError('Você precisa informar a senha atual para criar uma nova.', 401);
    }

    if (password && current_password) {
      const checkCurrentPassword = await this.hashProvider.compareHash(current_password, user.password);

      if (!checkCurrentPassword) {
        throw new AppError('Senha incorreta.', 401);
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.update(user);

    return classToClass(user);
  }
}

export default UpdateUserService;
