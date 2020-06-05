import { Request, Response } from 'express';
import connection from '../database/connection';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await connection('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://192.168.0.106:3333/uploads/${item.image}`,
      };
    });
    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await connection('points').where('id', id).first();
    if (!point) {
      return res.status(400).json({ message: 'Point Not found' });
    }
    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.106:3333/uploads/${point.image}`,
    };
    const items = await connection('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');
    return res.json({ point: serializedPoint, items });
  }

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;
    const point = {
      name,
      email,
      whatsapp,
      image: req.file.filename,
      latitude,
      longitude,
      city,
      uf,
    };
    const trx = await connection.transaction();
    const insertedIds = await trx('points').insert(point);
    const point_id = insertedIds[0];
    const pointItem = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => ({
        item_id,
        point_id,
      }));
    await trx('point_items').insert(pointItem);
    await trx.commit();
    return res.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
