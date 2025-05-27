import express from 'express';
import { Comment, Info, User } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import { sesClient } from '../libs/sesClient';
import { formatTimestamp } from '../../../app/src/accessors/formatTimestamp';
import { SendEmailCommand } from '@aws-sdk/client-sesv2';

export const addCommentEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { saveComment, getUser, getInfo } = gateways;

  let sendCommentEmail = async (
    commentAuthor: User,
    vizAuthor: User,
    formattedDate: string,
    markdownHTML: string,
    markdownText: string,
    vizInfo: Info,
  ) => {
    const input = {
      // SendEmailRequest
      FromEmailAddress: process.env.FROM_EMAIL,
      FromEmailAddressIdentityArn:
        process.env.FROM_EMAIL_ARN,
      Destination: {
        // Destination
        ToAddresses: [
          // EmailAddressList
          vizAuthor.primaryEmail,
        ],
      },
      Content: {
        // EmailContent
        Simple: {
          // Message
          Subject: {
            // Content
            Data: 'Your Viz has recieved a comment!',
          },
          Body: {
            // Body
            Text: {
              Data: `Hi ${vizAuthor.userName},\n${commentAuthor.userName} commented, \"${markdownText}\" on your Viz, ${vizInfo.title}.`, // required
            },
            // Html: {
            //   Data: "STRING_VALUE", // required
            //   Charset: "STRING_VALUE",
            // },
          },
        },
      },
    };

    const emailCommand = new SendEmailCommand(input);
    const response = await sesClient.send(emailCommand);
  };

  app.post(
    '/api/add-comment',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          comment,
        }: {
          comment: Comment;
        } = req.body;

        // Need to be authenticated to add a comment.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // Validate author is logged in
        if (comment.author !== authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const saveCommentResult =
          await saveComment(comment);

        if (saveCommentResult.outcome === 'success') {
          // Unsure what happens if resource is a merge request id
          const getInfoResult = await getInfo(
            comment.resource,
          );
          if (getInfoResult.outcome === 'failure') {
            return res.send(getInfoResult);
          }

          const getUserResult = await getUser(
            getInfoResult.value.data.owner,
          );

          if (getUserResult.outcome === 'failure') {
            return res.send(getUserResult);
          }

          const getAuthorResult = await getUser(
            comment.author,
          );

          if (getAuthorResult.outcome === 'failure') {
            return res.send(getAuthorResult);
          }

          const vizOwner = getUserResult.value.data;
          const commenter = getAuthorResult.value.data;
          const vizInfo = getInfoResult.value.data;

          const formattedDate = formatTimestamp(
            comment.created,
          );

          await sendCommentEmail(
            commenter,
            vizOwner,
            formattedDate,
            null,
            comment.markdown,
            vizInfo,
          );
        }

        res.send(saveCommentResult);
      }
    },
  );
};
