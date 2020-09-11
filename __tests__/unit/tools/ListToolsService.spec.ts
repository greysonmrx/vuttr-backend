import { v4 } from 'uuid';

import FakeToolsRepository from '../../../src/modules/tools/repositories/fakes/FakeToolsRepository';
import ListToolsService from '../../../src/modules/tools/services/ListToolsService';

let fakeToolsRepository: FakeToolsRepository;
let listTools: ListToolsService;

describe('List Tools Service', () => {
  beforeEach(() => {
    fakeToolsRepository = new FakeToolsRepository();
    listTools = new ListToolsService(fakeToolsRepository);
  });

  it('should be able to list all tools', async () => {
    const user_id = v4();

    await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    const { tools } = await listTools.execute({
      user_id,
      limit: 5,
      page: 1,
    });

    expect(tools).toHaveLength(2);
  });

  it('should be able filter tools by tag', async () => {
    const user_id = v4();

    await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy'],
    });

    await fakeToolsRepository.create({
      user_id,
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description:
        'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy', 'react'],
    });

    const { tools } = await listTools.execute({
      user_id,
      limit: 5,
      page: 1,
      tag: 'react',
    });

    expect(tools).toHaveLength(1);
  });
});
