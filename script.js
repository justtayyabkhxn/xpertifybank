"use strict";

// ACCOUNT OWNER DATA

const account1 = {
  owner: "Tayyab Khan",
  movements: [
    500, 2500, -1500, 8000, 18000, 6500, 4500, -1500, 5000, -6500, 500, 15000,
    20000, -6000, 8000,
  ],
  interestRate: 1.25,
  pin: 1234,
};
const account2 = {
  owner: "Zoya Khan",
  movements: [1500, -500, 1500, 18000, -1800, -6500, 5500, -500],
  interestRate: 1.15,
  pin: 1234,
};
const account3 = {
  owner: "Anas Abrar",
  movements: [2500, -1500, 1500, 8000, 18000, -16500, 4500, -15000],
  interestRate: 1.75,
  pin: 1234,
};
const account4 = {
  owner: "Mohd Yasir",
  movements: [500, 2500, -1500, 8000, 18000, 6500, 4500, -1500],
  interestRate: 1.35,
  pin: 1234,
};

const accounts = [account1, account2, account3, account4];

//BUTTONS AND OTHER THINGS

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//MAIN OPERATIONS

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawl";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1
      } : ${type}</div>
          <div class="movements__value">₹ ${mov}.00</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcbalance = function (acc) {
  const balancenew = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balancenew = balancenew;
  labelBalance.textContent = 
  `₹ ${acc.balancenew}.00`;
};

const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `₹ ${incomes}.00`;

  const Out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `₹ ${Out}.00`;

  const interest = acc.movements
    .filter((mov) => mov > 5000)
    .map((deposit) => (deposit * currentaccount.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `₹ ${interest}`;
};

const createusernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createusernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcbalance(acc);
  displaySummary(acc);
};

let currentaccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentaccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentaccount);

  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    // WELCOME AND DISPLAY
    labelWelcome.textContent = `Welcome Back,${currentaccount.owner.split(" ")[0]
      }`;
    containerApp.style.display = "grid";
    inputLoginUsername.value = ``;
    inputLoginPin.value = ``;
    inputLoginPin.blur();
    updateUI(currentaccount);
  } else if (currentaccount.pin !== Number(inputLoginPin.value)) {
    alert("Enter Correct username/password");
    labelWelcome.textContent = "Enter correct username/password";
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  console.log(amount, reciever);
  if (
    amount > 0 &&
    reciever &&
    currentaccount.balancenew >= amount &&
    reciever?.username !== currentaccount.username
  ) {
    console.log("VALID");
    currentaccount.movements.push(-amount);
    reciever.movements.push(amount);
    updateUI(currentaccount);
    inputTransferTo.value = ``;
    inputTransferAmount.value = ``;
    inputTransferAmount.blur();
  } else if (amount > currentaccount.balancenew) {
    alert("Your transfer amount is less than your balance. Try less amount.");
  } else if (!reciever || reciever.username == currentaccount.username) {
    alert("INVALID Reciever");
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentaccount.username &&
    Number(inputClosePin.value) === currentaccount.pin
  ) {
    console.log("DELETE");
    const index = accounts.findIndex(
      (acc) => acc.username === currentaccount.username
    );
    accounts.splice(index, 1);
    console.log(index);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentaccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentaccount.movements.push(amount);
    updateUI(currentaccount);
    inputLoanAmount.value = "";
  }
  else
    alert("Your loan request is less than 10% of your largest deposit");

});
