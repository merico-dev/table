import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { warehouseDataSource } from './data_sources/warehouse';
import { dashboardDataSource } from './data_sources/dashboard';
import errorMiddleware from './middlewares/error';
import queryRoutes from './controllers/queryController';
import dashboardRoutes from './controllers/dashboardController';
import 'reflect-metadata';

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const port = process.env.SERVER_PORT || 31200;
const app = express();

warehouseDataSource.initialize()
  .then(() => {
    console.log("Warehouse Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Warehouse Data Source initialization", err);
  });

dashboardDataSource.initialize()
  .then(() => {
    console.log("Dashboard Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Dashboard Data Source initialization", err);
  });

app.use(bodyParser.json());

const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(';') : ['http://localhost'];
app.use(cors({
  origin: corsOrigins,
}));

app.get('/ping', (req: express.Request, res) => {
  res.send('pong 1');
});

app.use('/query', queryRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
