/* eslint no-console: 0 */
import io from 'socket.io-client';

const socket = io.connect('/');

// Now we can listen for that event
socket.on('connected', data => {
  // Note that the data is the object we sent from the server, as is. So we can assume its id exists.
  console.info('My ID is ' + data.id);
});
