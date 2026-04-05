import https from 'https';

https.get('https://raw.githubusercontent.com/Nabeelahmad193221/Nabeelahmad193221/main/README.md', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
