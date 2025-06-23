import { SESv2Client } from '@aws-sdk/client-sesv2';
// Set the AWS Region.
const REGION = 'us-east-2';

// Create SES service object.
const sesClient = new SESv2Client({ region: REGION });

export { sesClient };
