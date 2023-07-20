export const healthCheck = ({ app }) => {
  app.get('/api/health-check', (req, res) => {
    res.status(200).send('ok');
  });
};
