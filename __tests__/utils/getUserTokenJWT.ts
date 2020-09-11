import request from 'supertest';

import app from '../../src/shared/infra/http/app';

async function getUserTokenJWT(): Promise<string> {
  await request(app).post('/users').send({
    name: 'Guilherme Martins',
    email: 'guilhermemartins@armyspy.com',
    password: 'jieNgae7',
  });

  const response = await request(app).post('/sessions').send({
    email: 'guilhermemartins@armyspy.com',
    password: 'jieNgae7',
  });

  return response.body.token;
}

export default getUserTokenJWT;
