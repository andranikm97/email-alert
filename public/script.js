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

const styles = `html,
body {
  margin: 0;
  height: 100%;
}

body {
  width: 100%;
  background-color: #fefbf3;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.content {
  flex: 10;
  margin-top: 15px;
  width: 70%;
  background-color: white;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: black;
  overflow: scroll;
  padding: 10px;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.content::-webkit-scrollbar {
  display: none; /*Chrome*/
}

.randomNum {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  visibility: visible;
  width: 100%;
  font-size: 30px;
}

.email-modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100vh;
  width: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-box {
  position: relative;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 60%;
  border-radius: 5px;
  background-color: antiquewhite;
}

.checkmark {
  width: 40px;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
}

.close-button:hover {
  cursor: pointer;
}

.input-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.email-submitted-box {
  display: none;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.invalid-email-tooltip {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: 40px;
  left: 105%;

  opacity: 0;
  transition: opacity 0.5s;
}

.invalid-email-tooltip::after {
  content: ' ';
  position: absolute;
  top: 50%;
  right: 100%; /* To the left of the tooltip */
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}
`;

let stylesheet = document.createElement('style');
stylesheet.innerHTML = styles;
document.head.appendChild(stylesheet);

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
