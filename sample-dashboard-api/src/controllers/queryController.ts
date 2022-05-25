import express from 'express';
const router = express.Router();
import { warehouseDataSource } from '../data_sources/warehouse';

router.post('/', async (req: express.Request, res, next) => {
  try {
    const rows = await warehouseDataSource.query(req.body.sql);
    res.json(rows);
  } catch (error) {
    next(error);
  }
})

export default router;