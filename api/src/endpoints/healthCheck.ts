import { Express } from 'express';

export const healthCheck = ({ app }: { app: Express }) => {
  app.get('/api/health-check', (_, res) => {
    res.status(200).send('ok');
  });
};
