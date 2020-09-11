import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeToolsRepository from '../../../src/modules/tools/repositories/fakes/FakeToolsRepository';
import DeleteToolService from '../../../src/modules/tools/services/DeleteToolService';

let fakeToolsRepository: FakeToolsRepository;
let deleteTool: DeleteToolService;

describe('Delete Tool Service', () => {
  beforeEach(() => {
    fakeToolsRepository = new FakeToolsRepository();
    deleteTool = new DeleteToolService(fakeToolsRepository);
  });

  it('should be able to delete a tool', async () => {
    const user_id = v4();

    const { id } = await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    await deleteTool.execute({ id, user_id });

    const tool = await fakeToolsRepository.findById(id);

    expect(tool).toBeFalsy();
  });

  it('should not be able to delete a non-existing tool', async () => {
    await expect(
      deleteTool.execute({
        id: v4(),
        user_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a tool without the user id that registered them', async () => {
    const { id } = await fakeToolsRepository.create({
      user_id: v4(),
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    await expect(
      deleteTool.execute({
        id,
        user_id: v4(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
