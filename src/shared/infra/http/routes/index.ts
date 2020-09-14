import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import toolsRouter from '@modules/tools/infra/http/routes/tools.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/tools', toolsRouter);
routes.get('/user/:userId', (req, res) => res.send(req.params.userId));

export default routes;
