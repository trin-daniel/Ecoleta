import express from 'express';
import { celebrate, Joi } from 'celebrate';
import PointsController from './controllers/PointsController';
import Itemscontroller from './controllers/ItemsController';
import multerConfig from './config/multer';
import multer from 'multer';

const routes = express.Router();
const pointsController = new PointsController();
const itemscontroller = new Itemscontroller();
const upload = multer(multerConfig);

routes.post(
  '/points',
  upload.single('image'),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    },
  ),
  pointsController.create,
);

routes.get('/items', itemscontroller.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

export default routes;
