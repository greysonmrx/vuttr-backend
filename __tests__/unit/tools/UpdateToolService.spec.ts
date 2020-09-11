import { v4 } from 'uuid';

import AppError from '../../../src/shared/errors/AppError';

import FakeToolsRepository from '../../../src/modules/tools/repositories/fakes/FakeToolsRepository';
import UpdateToolService from '../../../src/modules/tools/services/UpdateToolService';

let fakeToolsRepository: FakeToolsRepository;
let updateTool: UpdateToolService;

describe('Update Tool Service', () => {
  beforeEach(() => {
    fakeToolsRepository = new FakeToolsRepository();
    updateTool = new UpdateToolService(fakeToolsRepository);
  });

  it('should be able to update a tool', async () => {
    const user_id = v4();

    const { id } = await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    const tool = await updateTool.execute({
      id,
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy', 'react'],
    });

    expect(tool).toHaveProperty('id');
  });

  it('should not be able to update a tool with duplicate title', async () => {
    const user_id = v4();

    await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    const { id } = await fakeToolsRepository.create({
      user_id,
      title: 'Notion',
      link: 'https://notion.so',
      description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.',
      tags: ['organization', 'planning', 'collaboration', 'writing', 'calendar'],
    });

    await expect(
      updateTool.execute({
        id,
        user_id,
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description:
          'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing tool', async () => {
    await expect(
      updateTool.execute({
        id: v4(),
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
