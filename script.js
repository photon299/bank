const [depositInput, withdrawInput] = document.querySelectorAll(".button-row input"),
    accountModal = document.querySelector(".account-window"),
    users = [];

const createElement = (tag, className, where = document.documentElement, text = "") => {
    const element = document.createElement(tag);
    element.classList.add(className);
    where.append(element);
    element.innerText = text;
    return element;
};

const header = document.querySelector(".header"),
    wrapper = document.querySelector(".wrapper"),
    chooseModal = createElement("div", "choose__modal", wrapper, ),
    modalBtnsWrapp = createElement("div", "buttons__wrapper", chooseModal),
    createProfileBtn = createElement("button", "createBtn", modalBtnsWrapp, "Создать учётную запись"),
    enterProfileBtn = createElement("button", "enterBtn", modalBtnsWrapp, "Войти");
    //* New profile modal
const newProfileModal = createElement("div", "newProfile__modal", wrapper),
    newProfileForm = createElement("form", "newProfile__form", newProfileModal);

const createInputField = (labelText, inputName, inputType, parent) => {
    const label = createElement("label", "newProfile__label", parent, labelText);
    const input = createElement("input", "newProfile__input", parent);
    input.type = inputType;
    input.name = inputName;
    return input;
};
createInputField("Введите имя:", "name", "text", newProfileForm);
createInputField("Введите фамилию:", "surname", "text", newProfileForm);
createInputField("Введите возраст:", "age", "number", newProfileForm);
createInputField("Введите бюджет:", "budget", "number", newProfileForm);
createInputField("Введите пароль:", "parole", "text", newProfileForm);

const enterModal = document.querySelector(".enter__modal"),
    paroleInput = enterModal.querySelector("input");

const submitButton = createElement("button", "newProfile__button", newProfileForm, "Создать");
submitButton.type = "submit";
let formData;

class BankAccount {
    constructor (owner, balance = 0, parole = "12345") {
        this.owner = {
            name: owner[0],
            surname: owner[1],
            age: owner[2]
        };
        this.balance = balance;
        this.transactions = [];
        this.parole = parole;
        this.active = false;
    };
    getOwnerData() { return this.owner }
    deposit(amount) { 
        if (amount > 0) {
            this.balance = +this.balance + amount;
            this.transactions.push(["+", amount, this.balance, new Date().toLocaleString()]);
        } else return "Сумма должна быть больше 0!";
    };
    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance = +this.balance - amount;
            this.transactions.push(["-", amount, this.balance, new Date().toLocaleString()]);
        } else console.log("Недостаточно средств!");
    };
    getBalance() { return this.balance };
    getHistory() {
        const textarea = document.querySelector("textarea")
        this.transactions.forEach((trns, i) => {
            if (i === 0) textarea.value = "";
            textarea.value += textarea.innerText += `📜: ${trns[0] === "+" ? "Пополнение: +" : "Снятие: -"}${trns[1]} | 📊 Баланс: ${trns[2]} | ${trns[3]}\n` //Время транзакции: 
        });
    }
    getParole() { return this.parole };
    getStatus() { return this.active };
    changeStatus() {return this.active = !this.active}
}
const makeBankAccount = (owner, balance, parole) => {
    return new BankAccount(owner, balance, parole)
};

const fillAccountModal = (account ) => {
    const {name, surname, age} = account.getOwnerData();
    const spans = accountModal.querySelectorAll(".account-info span");
    spans[0].innerText = name;
    spans[1].innerText = surname;
    spans[2].innerText = age;
    spans[3].innerText = account.getBalance();
    account.getHistory();
}

wrapper.addEventListener("click", (event) => {
    const target = event.target;
    if (target.matches(".createBtn")){
        chooseModal.classList.add("hide");
        newProfileModal.classList.add("active");
    } else if (target.matches("[type='submit']")) {
        event.preventDefault();
        const inputs = target.parentElement.querySelectorAll("input");
        if (+inputs[0].value !== NaN && +inputs[1].value !== NaN && (14 <= +inputs[2].value && +inputs[2].value <= 110) && +inputs[3].value > 50 && inputs[4].value.length > 4) {
            formData = new FormData(newProfileForm);
            users.push(makeBankAccount([formData.get("name"), formData.get("surname"), formData.get("age")], formData.get("budget"), formData.get("parole")));
            users[users.length - 1].changeStatus();
            newProfileModal.classList.remove("active");
            fillAccountModal(users[users.length - 1]);
            accountModal.classList.remove("hide");
            newProfileForm.reset();
        };
    } else if (target.matches("#deposit-btn")) {
        if (+depositInput.value >= 20) {
            users[users.length - 1].deposit(+depositInput.value);
            fillAccountModal(users[users.length - 1]);
        } else alert("Можно ввести не менее 20 грн");
        depositInput.value = "";
    } else if (target.matches("#withdraw-btn")) {
        if (+withdrawInput.value > 0 && +withdrawInput.value <= users[users.length - 1].getBalance()) {
            users[users.length - 1].withdraw(+withdrawInput.value);
            fillAccountModal(users[users.length - 1]);
        } else alert("Сумма вывода не должна превышать Ваш баланс");
        withdrawInput.value = "";
    } else if (target.matches(".account__exit")) {
        accountModal.classList.add("hide");
        users.forEach(user => {if (user.getStatus()) user.changeStatus()});
        chooseModal.classList.remove("hide");
        document.querySelector("textarea").value = "";
    } else if (target.matches(".enterBtn")) {
        chooseModal.classList.add("hide");
        enterModal.classList.add("active");
    } else if (target.matches(".submit__parole-btn")) {
        users.forEach((user, i) => {
            if (user.getParole() === paroleInput.value ) {
                if (enterModal.classList.contains("absolute") && user.getStatus()) {
                    users.splice(i, 1);
                    enterModal.classList.remove("absolute");
                    accountModal.classList.add("hide");
                    chooseModal.classList.remove("hide");
                }
                user.changeStatus()
                enterModal.classList.remove("active");
                accountModal.classList.remove("hide");
                fillAccountModal(users[i]);
            }
        });
        paroleInput.value = "";
    } else if (target.matches(".exit-log")) {
        if (enterModal.classList.contains("absolute")) {
            enterModal.classList.remove("absolute");
        }  else {
            enterModal.classList.remove("active");
            chooseModal.classList.remove("hide");
        }
    } else if (target.matches(".delete__account-btn")) {
        enterModal.classList.add("absolute");
    }
});
