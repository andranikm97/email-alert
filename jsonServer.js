const { exec } = require('child_process');

exec('npm run start:json', (err) => {
  if (err) {
    console.log(err);
    return err;
  }
});
