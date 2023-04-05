// Send a lightweight custom analytics event to the server.
export const sendEvent = (eventIDs) => {
  if (typeof eventIDs !== 'string') {
    throw new Error('Expected eventIDs to be a string.');
  }
  console.log('sendEvent: ' + JSON.stringify(eventIDs));
  fetch('/api/event/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventIDs }),
  });
};
