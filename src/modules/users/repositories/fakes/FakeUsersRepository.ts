import { v4 } from 'uuid';

import FakeUser from '@modules/users/entities/fakes/FakeUser';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUsersDTO';

import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private fakeUsers: FakeUser[] = [];

  public async findById(id: string): Promise<FakeUser | undefined> {
    const findUser = this.fakeUsers.find(user => user.id === id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<FakeUser | undefined> {
    const findUser = this.fakeUsers.find(user => user.email === email);

    return findUser;
  }

  public async create({ name, email, password }: ICreateUsersDTO): Promise<FakeUser> {
    const fakeUser = new FakeUser();

    Object.assign(fakeUser, {
      id: v4(),
      name,
      email,
      password,
      created_at: String(new Date()),
      updated_at: String(new Date()),
    });

    this.fakeUsers.push(fakeUser);

    return fakeUser;
  }

  public async update(fakeUser: FakeUser): Promise<FakeUser> {
    const findIndex = this.fakeUsers.findIndex(findUser => findUser.id === fakeUser.id);

    this.fakeUsers[findIndex] = fakeUser;

    return fakeUser;
  }

  public async delete(id: string): Promise<void> {
    this.fakeUsers = this.fakeUsers.filter(user => user.id !== id);
  }
}

export default FakeUsersRepository;
