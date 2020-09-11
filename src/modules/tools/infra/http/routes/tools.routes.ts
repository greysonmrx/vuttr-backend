import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ToolsController from '../controllers/ToolsController';

import ToolIndexValidator from '../validators/ToolIndexValidator';
import ToolStoreValidator from '../validators/ToolStoreValidator';
import ToolUpdateValidator from '../validators/ToolUpdateValidator';
import ToolDestroyValidator from '../validators/ToolDestroyValidator';

const routes = Router();
const toolsController = new ToolsController();

routes.get('/', ensureAuthenticated, ToolIndexValidator, toolsController.index);

routes.post('/', ensureAuthenticated, ToolStoreValidator, toolsController.store);

routes.put('/:id', ensureAuthenticated, ToolUpdateValidator, toolsController.update);

routes.delete('/:id', ensureAuthenticated, ToolDestroyValidator, toolsController.destroy);

export default routes;
