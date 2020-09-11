import { Router } from 'express';

import UsersController from '../controllers/UsersController';

import UserStoreValidator from '../validators/UserStoreValidator';
import UserUpdateValidator from '../validators/UserUpdateValidator';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();
const usersController = new UsersController();

routes.post('/', UserStoreValidator, usersController.store);

routes.put('/', ensureAuthenticated, UserUpdateValidator, usersController.update);

routes.delete('/', ensureAuthenticated, usersController.destroy);

export default routes;
