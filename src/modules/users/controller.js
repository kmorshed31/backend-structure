import { usersService } from './index.js';

export const list = async (_req, res) => {
  const data = await usersService.list();
  res.json({ data });
};

export const get = async (req, res) => {
  const data = await usersService.get(req.params.id);
  res.json({ data });
};

export const create = async (req, res) => {
  const data = await usersService.create(req.body);
  res.status(201).json({ data });
};

export const update = async (req, res) => {
  const data = await usersService.update(req.params.id, req.body);
  res.json({ data });
};

export const remove = async (req, res) => {
  await usersService.remove(req.params.id);
  res.status(204).send();
};
