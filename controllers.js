const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const validateEmail = require('./validateEmail');

exports.createEmail = (req, res) => {
  const { address } = req.body;

  if (!validateEmail(address)) {
    return res.status(500).json({ error: 'Email is incorrect' });
  }

  fetch('http://localhost:3000/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
    }),
  })
    .then((data) => data.json())
    .then((json) => res.json({ creation: json }));
};

exports.getRandomNumber = (req, res) => {
  res.json({ randomNumber: Math.floor(Math.random() * 100 + 1) });
};

exports.deleteAllEmails = async (req, res) => {
  const data = await fetch('http://localhost:3000/emails');
  const emails = await data.json();

  for (let email of emails) {
    await fetch('http://localhost:3000/emails/' + email.id, {
      method: 'DELETE',
    });
  }

  res.send('Deleted all emails');
};
