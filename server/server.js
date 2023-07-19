/* eslint-disable no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import ClientError from './lib/client-error.js';
import errorMiddleware from './lib/error-middleware.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());
app.use(errorMiddleware);

const queryObject = {
  get: `
  select *
    from "entries"
    order by "entryId";
  `,

  post: `
  insert into "entries" ("title", "notes", "photoUrl")
    values ($1, $2, $3)
  returning *;
  `,

  put: `
  update "entries"
  set "title"=$1,
      "notes"=$2,
      "photoUrl"=$3
  where "entryId"=$4
  returning *;
  `,
};

// Routing functions
app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = queryObject.get;
    const result = await db.query(sql);
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const sql = queryObject.post;
    const { title, notes, photoUrl } = req.body;
    const params = [title, notes, photoUrl];
    const result = await db.query(sql, params);
    const [entry] = result.rows;
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

app.put('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId) || entryId <= 0) {
      throw new ClientError(400, 'entryId must be a positive integer');
    }
    const { title, notes, photoUrl } = req.body;
    const sql = queryObject.put;
    const params = [title, notes, photoUrl, entryId];
    const result = await db.query(sql, params);
    const [entry] = result.rows;
    if (!entry) {
      throw new ClientError(404, `Unable to find entryId ${entryId}`);
    }
    console.log(result);
    res.status(204).json(entry);
  } catch (err) {
    next(err);
  }
});

// Error functions

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
