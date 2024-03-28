import { fetch } from 'https://esm.town/v/std/fetch?v=4';

const apiKey = process.env.get('VIZHUB_API_KEY');

const files = {
  'data.csv': 'test\n1',
};
// Modify https://vizhub.com/curran/6a2b0403e1664a2bb95b658e541ecfd8
const username = 'curran';
const vizId = '6a2b0403e1664a2bb95b658e541ecfd8';

fetch(
  `https://vizhub.com/api/set-viz/${username}/${vizId}`,
  {
    method: 'POST',
    headers: { Authorization: apiKey },
    body: JSON.stringify({ files }),
  },
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
