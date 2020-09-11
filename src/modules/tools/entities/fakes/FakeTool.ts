import ITool from '../ITool';

class FakeTool implements ITool {
  id: string;

  user_id: string;

  title: string;

  link: string;

  description: string;

  tags: string[];

  created_at: Date;

  updated_at: Date;
}

export default FakeTool;
