import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeToolsRepository from '../../../src/modules/tools/repositories/fakes/FakeToolsRepository';
import CreateToolService from '../../../src/modules/tools/services/CreateToolService';

let fakeToolsRepository: FakeToolsRepository;
let createTool: CreateToolService;

describe('Create Tool Service', () => {
  beforeEach(() => {
    fakeToolsRepository = new FakeToolsRepository();
    createTool = new CreateToolService(fakeToolsRepository);
  });

  it('should be able to create a new tool', async () => {
    const tool = await createTool.execute({
      user_id: v4(),
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    expect(tool).toHaveProperty('id');
  });

  it('should not be able to create two tools with the same title', async () => {
    await createTool.execute({
      user_id: v4(),
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    await expect(
      createTool.execute({
        user_id: v4(),
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
