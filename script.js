class BankAccount {
    constructor (owner, balance = 0) {
        this.owner = owner;
        this.balance = balance;
        this.transactions = [];
    };
    deposit(amount) { 
        if (amount > 0) {
            this.balance += amount;
            this.transactions.push(["+", amount, this.balance, new Date().toLocaleTimeString()]);
        } else return "Сумма должна быть больше 0!";
    };
    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            this.transactions.push(["-", amount, this.balance, new Date().toLocaleTimeString()]);
        } else console.log("Недостаточно средств!");
    };
    getBalance() { console.log(this.balance) };
    getHistory() {
        this.transactions.forEach(trns => console.log(`${trns[0] === "+" ? "Внесено: +" : "Выведено: -"}${trns[1]}. Баланс: ${trns[2]}. Время транзакции: ${trns[3]}`));
    }
}

const account = new BankAccount("alice", 1000);
// account.deposit(100);
// account.withdraw(344);
// account.deposit(2934);
// account.getHistory();