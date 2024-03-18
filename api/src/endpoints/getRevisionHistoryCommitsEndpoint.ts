import express from 'express';
import {
  Gateways,
  err,
  missingParameterError,
  ok,
} from 'gateways';

export const getRevisionHistoryCommitsEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  app.post(
    '/api/get-revision-history-commits',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const { id } = req.body;

        console.log('TODO fetch commits for ' + id);

        if (id === undefined) {
          res.send(err(missingParameterError('id')));
          return;
        }

        res.send(ok('test'));
      }
    },
  );
};
