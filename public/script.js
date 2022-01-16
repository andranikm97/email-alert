const DID_SUBSCRIBE = 'DID_SUBSCRIBE';
const modalSkeleton = `
      <form class="modal-box" id="email-form">
        <img
          class="close-button"
          id="close-modal"
          src="/images/cross.png"
          alt="close button"
        />
        <div class="form-result">
          <div class="input-box" id="input-box">
            <h1 style="margin: 5px">Subscribe!</h1>
            <input
              placeholder="Please enter your email"
              style="margin: 5px"
              id="entered-email"
            />
            <span class="invalid-email-tooltip" id="tooltip">
              Please enter a valid email
            </span>
            <button type="submit" style="margin: 5px">Submit</button>
          </div>
          <div class="email-submitted-box" id="email-submitted-box">
            <h1>Submission successful!</h1>
            <img
              class="checkmark"
              src="/images/checkmark.png"
              alt="checkmark"
            />
          </div>
        </div>
      </form>
  `;
let modal = document.createElement('div');
modal.classList.add('email-modal');
modal.id = 'email-modal';
modal.innerHTML = modalSkeleton;
document.body.appendChild(modal);

let randomNumberText = document.getElementById('ran');
let randomNumberBox = document.getElementById('random-number-box');
let closeEmailAlertModalButton = document.getElementById('close-modal');
let emailForm = document.getElementById('email-form');
let enteredEmail = document.getElementById('entered-email');
let tooltip = document.getElementById('tooltip');
let inputBox = document.getElementById('input-box');
let emailSubmittedBox = document.getElementById('email-submitted-box');

closeEmailAlertModalButton.addEventListener('click', closeEmailAlertModal);

function generateRandomNumbers() {
  const interval = setInterval(() => {
    fetch('http://localhost:4000/random-number')
      .then((data) => data.json())
      .then(({ randomNumber }) => {
        randomNumberText.innerText = `Random number from server: ${randomNumber}`;
        if (randomNumber > 50) {
          showEmailModal();
          clearInterval(interval);
        }
      });
  }, 1000);

  return interval;
}

function showEmailModal() {
  modal.style.display = 'flex';
}

emailForm.onsubmit = function submitEmail(e) {
  e.preventDefault();

  fetch('http://localhost:4000/emails', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      address: enteredEmail.value,
    }),
  })
    .then((res) => {
      if (res.status >= 400) {
        invalidEmail();
      } else {
        validEmail();
      }
    })
    .catch((e) => console.error('Error: ', e));
};

function invalidEmail() {
  tooltip.style.visibility = 'visible';
  tooltip.style.opacity = '1';

  setTimeout(() => {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'none';
  }, 1000);
}

function validEmail() {
  inputBox.style.display = 'none';
  closeEmailAlertModalButton.style.display = 'none';
  emailSubmittedBox.style.display = 'flex';
  removeRandomNumber();
  setTimeout(() => {
    localStorage.setItem(DID_SUBSCRIBE, true);
    closeEmailAlertModal();
  }, 2000);
}

function closeEmailAlertModal() {
  modal.style.display = 'none';

  if (!didSubscribe()) {
    generateRandomNumbers();
  }
}

function removeRandomNumber() {
  randomNumberBox.style.display = 'none';
}

function didSubscribe() {
  return localStorage.getItem(DID_SUBSCRIBE);
}

if (!didSubscribe()) {
  generateRandomNumbers();
} else {
  removeRandomNumber();
}
