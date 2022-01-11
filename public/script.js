let randomNumberText = document.getElementById('ran');
let randomNumberBox = document.getElementById('random-number-box');
let modal = document.getElementById('email-modal');
let closeModalButton = document.getElementById('close-modal');
let emailForm = document.getElementById('email-form');
let enteredEmail = document.getElementById('entered-email');
let tooltip = document.getElementById('tooltip');
let inputBox = document.getElementById('input-box');
let emailSubmittedBox = document.getElementById('email-submitted-box');

closeModalButton.addEventListener('click', closeModal);

function generateRandomNumbers() {
  const interval = setInterval(function () {
    fetch('http://localhost:4000/random-number')
      .then((data) => data.json())
      .then(({ randomNumber }) => {
        randomNumberText.innerText = `Random number from server: ${randomNumber}`;
        if (randomNumber > 50 && !localStorage.getItem('DID_SUBCRIBE')) {
          showEmailModal();
          clearInterval(interval);
        }
      });
  }, 1000);
}

function showEmailModal() {
  modal.style.display = 'flex';
}

emailForm.onsubmit = function submitEmail(e) {
  e.preventDefault();

  if (!validateEmail(enteredEmail.value)) {
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';

    setTimeout(() => {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'none';
    }, 1000);
  } else {
    fetch('http://localhost:4000/emails', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        address: enteredEmail.value,
      }),
    })
      .then(() => {
        inputBox.style.display = 'none';
        closeModalButton.style.display = 'none';
        emailSubmittedBox.style.display = 'flex';
        removeRandomNumber();
        setTimeout(() => {
          closeModal();
          localStorage.setItem('DID_SUBCRIBE', true);
        }, 2000);
      })
      .catch((e) => console.error(e));
  }
};

//* Function grabbed from Stack Overflow (https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript)

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

function closeModal() {
  modal.style.display = 'none';

  if (!localStorage.getItem('DID_SUBCRIBE')) {
    generateRandomNumbers();
  }
}

function removeRandomNumber() {
  randomNumberBox.style.display = 'none';
}

if (!localStorage.getItem('DID_SUBCRIBE')) {
  generateRandomNumbers();
} else {
  removeRandomNumber();
}
