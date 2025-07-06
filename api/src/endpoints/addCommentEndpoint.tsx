import express from 'express';
import { Comment, Info, User } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';
import { sesClient } from '../libs/sesClient';
import { formatTimestamp } from '../../../app/src/accessors/formatTimestamp';
import { SendEmailCommand } from '@aws-sdk/client-sesv2';
import { renderToString } from 'react-dom/server';
import Markdown from 'react-markdown';
import { getVizPageHref } from 'entities/src/accessors';

export const addCommentEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { saveComment, getUser, getInfo } = gateways;

  const sendCommentEmail = async (
    commentAuthor: User,
    vizAuthor: User,
    formattedDate: string,
    markdownHTML: string,
    markdownText: string,
    vizInfo: Info,
  ) => {
    // Check if required environment variables are defined
    if (
      !process.env.FROM_EMAIL ||
      !process.env.FROM_EMAIL_ARN
    ) {
      console.warn(
        'Email environment variables not configured. Skipping email notification.',
      );
      return;
    }

    const linkToViz = getVizPageHref({
      ownerUser: vizAuthor,
      info: vizInfo,
      absolute: true,
    });

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
              Data: `Hi ${vizAuthor.userName},\n${commentAuthor.userName} commented, \"${markdownText}\" on your Viz, ${vizInfo.title}.\nLink: ${linkToViz}`, // required
            },
            Html: {
              Data: `<!DOCTYPE html>

<html>


<body style="background-color: #f6eee3;">
<h1>Your Viz, <a href="${linkToViz}">${vizInfo.title}</a> has recieved a comment!</h1>
    <div class="vh-comment" style="display: flex;
            justify-content: space-between;">
        <div class="comment-top">
            <div class="comment-top-side" style="display: flex;
            align-items: center;
            gap: 12px;"><a class="comment-author" style="display: flex;
            align-items: center;
            gap: 16px;
            font-weight: 600;
            color: var(--vh-color-neutral-01);
            text-decoration: none;" href="${commentAuthor.website}" target="_blank" rel="noreferrer"><img
                        class="w-8 h-8 rounded-full object-cover" src="${commentAuthor.picture}" alt="User avatar" style="width:2rem;height:2rem;">
                    <div>${commentAuthor.userName}</div>
                </a>commented on<div class="comment-date" style="
            color: #576786;
                ">${formattedDate}</div>
            </div>
            <div class="comment-top-side">
            </div>
            <div class="comment-bottom">
                <div class="vh-markdown-body" style="padding-top: 8px;
    padding-bottom: 30px;
    color: #1f2022;padding-top: 20px;
            line-height: 1.5;">
                    ${markdownHTML}
                </div>
            </div>
        </div>

</body>


</html>`, // required
            },
          },
        },
      },
    };

    try {
      const emailCommand = new SendEmailCommand(input);
      const response = await sesClient.send(emailCommand);
    } catch (error) {
      console.error(
        'Failed to send comment notification email:',
        error,
      );
      // Don't throw the error to prevent server crash
    }
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
            renderToString(
              <Markdown>{comment.markdown}</Markdown>,
            ),
            comment.markdown,
            vizInfo,
          );
        }

        res.send(saveCommentResult);
      }
    },
  );
};
