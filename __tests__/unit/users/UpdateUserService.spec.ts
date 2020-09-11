import AppError from '../../../src/shared/errors/AppError';

import FakeUsersRepository from '../../../src/modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../../src/modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserService from '../../../src/modules/users/services/UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUser: UpdateUserService;

describe('Update Profile Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUser = new UpdateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to update a user', async () => {
    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const updatedUser = await updateUser.execute({
      user_id,
      name: 'Breno Almeida Ribeiro',
      email: 'BrenoAlmeidaRibeiro@jourrapide.com',
      password: 'miQuoh5f',
      current_password: 'jieNgae7',
    });

    expect(updatedUser).toHaveProperty('id');
  });

  it('should not be able to update user with duplicate e-mail', async () => {
    await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Breno Almeida Ribeiro',
      email: 'BrenoAlmeidaRibeiro@jourrapide.com',
      password: 'miQuoh5f',
    });

    await expect(
      updateUser.execute({
        user_id,
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existent user', async () => {
    await expect(
      updateUser.execute({
        user_id: 'non-existing-user',
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a user without the current password when a new password exists', async () => {
    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(
      updateUser.execute({
        user_id,
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update user with an incorrect password', async () => {
    const { id: user_id } = await fakeUsersRepository.create({
      name: 'Guilherme Martins',
      email: 'guilhermemartins@armyspy.com',
      password: 'jieNgae7',
    });

    await expect(
      updateUser.execute({
        user_id,
        name: 'Breno Almeida Ribeiro',
        email: 'guilhermemartins@armyspy.com',
        password: 'jieNgae7',
        current_password: 'incorrectPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
