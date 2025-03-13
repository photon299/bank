//* 1. Добавить возможность удаления аккаунта
//* 2. Добавить конвертер валют $
//* 3. 
//* 

const [depositInput, withdrawInput] = document.querySelectorAll(".button-row input"),
    accountModal = document.querySelector(".account-window"),
    users = []; // textarea = accountModal.querySelector("textarea"),

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
    createProfileBtn = createElement("button", "createBtn", modalBtnsWrapp, "Создать новый профиль"),
    enterProfileBtn = createElement("button", "enterBtn", modalBtnsWrapp, "Войти в аккаунт");
    //* New profile modal
const newProfileModal = createElement("div", "newProfile__modal", wrapper),
    newProfileForm = createElement("form", "newProfile__form", newProfileModal);
    // nameLine = createElement("div", "newProfile__input", newProfileModal, "Введите имя:"),
    // inputName = createElement("input", "newProfile__input", nameLine),
    // surnameLine = createElement("div", "newProfile__input", newProfileModal, "Введите фамилию:"),
    // inputSurname = createElement("input", "newProfile__input", surnameLine),
    // ageLine = createElement("div", "newProfile__input", newProfileModal, "Введите возраст:"),
    // inputAge = createElement("input", "newProfile__input", ageLine),
    // budgetLine = createElement("div", "newProfile__input", newProfileModal, "Введите бюджет:"),
    // inputBudget = createElement("input", "newProfile__input", budgetLine),
    // newProfileBtn;

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


  // Создаем поля ввода
// const nameLine = createInputField("Введите имя:", "name", "text", newProfileForm),
// surnameLine = createInputField("Введите фамилию:", "surname", "text", newProfileForm),
// ageLine = createInputField("Введите возраст:", "age", "number", newProfileForm),
// budgetLine = createInputField("Введите бюджет:", "budget", "number", newProfileForm);

const submitButton = createElement("button", "newProfile__button", newProfileForm, "Создать");
submitButton.type = "submit";
let formData;


// newProfileForm.addEventListener("submit", (event) => {
//     event.preventDefault();
// });


class BankAccount {
    constructor (owner, balance = 0, parole = "1234") {
        this.owner = {
            name: owner[0],
            surname: owner[1],
            age: owner[2]
        };
        this.balance = balance;
        this.transactions = [];
        this.parole = parole;
    };
    getOwnerData() { return this.owner }
    deposit(amount) { 
        if (amount > 0) {
            this.balance = +this.balance + amount;
            this.transactions.push(["+", amount, this.balance, new Date().toLocaleString()]);//Time
        } else return "Сумма должна быть больше 0!";
    };
    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance = +this.balance - amount;
            this.transactions.push(["-", amount, this.balance, new Date().toLocaleString()]);//Time
        } else console.log("Недостаточно средств!");
    };
    getBalance() { return this.balance };
    getHistory() { //textarea
        // (this.transactions.length > 0) ? this.transactions.forEach(trns => console.log(`${trns[0] === "+" ? "Внесено: +" : "Выведено: -"}${trns[1]}. Баланс: ${trns[2]}. Время транзакции: ${trns[3]}`))
        // : console.log("История транзакций пуста!");
        // this.transactions.forEach(trns => textarea.innerText += `${trns[0] === "+" ? "Внесено: +" : "Выведено: -"}${trns[1]}. Баланс: ${trns[2]}. Время транзакции: ${trns[3]}`);
        //*
        // this.transactions.forEach((trns, i) => {
        //     if (i === 0) textarea.value = "";
        //     textarea.value += textarea.innerText += `${trns[0] === "+" ? "Внесено: +" : "Выведено: -"}${trns[1]}. Баланс: ${trns[2]}. Время транзакции: ${trns[3]}\n`
        // });
        const textarea = document.querySelector("textarea")
        this.transactions.forEach((trns, i) => {
            if (i === 0) textarea.value = "";
            textarea.value += textarea.innerText += `${trns[0] === "+" ? "Внесено: +" : "Выведено: -"}${trns[1]} | Баланс: ${trns[2]} | ${trns[3]}\n` //Время транзакции: 
        });
    }
    getParole() { return this.parole };

}
const makeBankAccount = (owner, balance, parole) => {
    return new BankAccount(owner, balance, parole)
};
// const account = new BankAccount("alice", 1000);


const fillAccountModal = (account ) => { //textarea
    const {name, surname, age} = account.getOwnerData();
    const spans = accountModal.querySelectorAll(".account-info span");
    spans[0].innerText = name;
    spans[1].innerText = surname;
    spans[2].innerText = age;
    spans[3].innerText = account.getBalance();
    account.getHistory(); //textarea
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
            newProfileModal.classList.remove("active");
            fillAccountModal(users[users.length - 1]);//* , textarea// accountModal.querySelector("textarea")
            accountModal.classList.remove("hide");
            newProfileForm.reset();
        };
    } else if (target.matches("#deposit-btn")) {
        if (+depositInput.value >= 20) {
            users[users.length - 1].deposit(+depositInput.value); //users[0]
            fillAccountModal(users[users.length - 1]);//* , textarea// accountModal.querySelector("textarea")
        } else alert("Можно ввести не менее 20 грн");
        depositInput.value = "";
    } else if (target.matches("#withdraw-btn")) {
        if (+withdrawInput.value > 0 && +withdrawInput.value <= users[users.length - 1].getBalance()) {
            users[users.length - 1].withdraw(+withdrawInput.value);//users[0]
            fillAccountModal(users[users.length - 1]);//* , textarea// accountModal.querySelector("textarea")
        } else alert("Сумма вывода не должна превышать Ваш баланс");
        withdrawInput.value = "";
    } else if (target.matches(".account__exit")) {
        accountModal.classList.add("hide");
        chooseModal.classList.remove("hide");
        document.querySelector("textarea").value = "";
    } else if (target.matches(".enterBtn")) {
        chooseModal.classList.add("hide");
        enterModal.classList.add("active");
    } else if (target.matches(".enter-btn")) {
        paroleInput.value = "";
        users.forEach((user, i) => {
            if (user.getParole() === paroleInput.value) {
                enterModal.classList.remove("active");
                accountModal.classList.remove("hide");
                fillAccountModal(users[i]);
            }
        });
    }
});
