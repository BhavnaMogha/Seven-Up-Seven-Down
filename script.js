document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const moneyPutInput = document.getElementById("moneyPut");
    const subButton = document.getElementById("sub");
    const addButton = document.getElementById("add");
    const balanceElement = document.getElementById("balance");
    const downRadio = document.getElementById("flexRadioDefault1");
    const perfectRadio = document.getElementById("flexRadioDefault2");
    const upRadio = document.getElementById("flexRadioDefault3");
    const betButton = document.getElementById("bet");
    const resetButton = document.getElementById("reset");
    const resultNumberElement = document.getElementById("resultNumber");
    const resultTextElement = document.getElementById("resultText");
    const dice1 = document.getElementById("dice1");
    const dice2 = document.getElementById("dice2");
    const animationElement = document.getElementById("animation");
    const errorAmountElement = document.getElementById("errorAmount");
    const errorCheckboxElement = document.getElementById("error-checkbox");

    // Game variables
    let balance = 100;

    // Event listeners
    subButton.addEventListener("click", decreaseBet);
    addButton.addEventListener("click", increaseBet);
    betButton.addEventListener("click", placeBet);
    resetButton.addEventListener("click", resetGame);

    // Functions
    function decreaseBet() {
        if (moneyPutInput.value > 1) {
            moneyPutInput.value = parseInt(moneyPutInput.value) - 1;
        }
    }

    function increaseBet() {
        moneyPutInput.value = parseInt(moneyPutInput.value) + 1;
    }

    function placeBet() {
        const betAmount = parseInt(moneyPutInput.value);
        const selectedRadio = getSelectedRadio();

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
            showError(errorAmountElement, "Invalid bet amount");
            return;
        }

        if (!selectedRadio) {
            showError(errorCheckboxElement, "Please select an option");
            return;
        }

        hideError(errorAmountElement);
        hideError(errorCheckboxElement);

        animateDiceRoll();
        setTimeout(() => {
            const result1 = rollSingleDice(dice1);
            const result2 = rollSingleDice(dice2);
            const totalResult = result1 + result2;
            displayDiceResult(result1, result2);
            displayResult(totalResult);
            newRound();
        }, 3000);
    }

    function resetGame() {
        balance = 100;
        updateBalance();
        moneyPutInput.value = 5;
        hideError(errorAmountElement);
        hideError(errorCheckboxElement);
        clearResult();
    }

    function animateDiceRoll() {
        animationElement.style.display = "block";
        setTimeout(() => {
            animationElement.style.display = "none";
        }, 3000);
    }

    function rollSingleDice(dice) {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        const sides = dice.querySelectorAll(".side");
        sides.forEach(side => side.classList.remove("active"));
        sides[randomValue - 1].classList.add("active");
        return randomValue;
    }

    function displayDiceResult(result1, result2) {
        resultNumberElement.textContent = `${result1} + ${result2}`;
    }

    function displayResult(result) {
        const selectedRadio = getSelectedRadio();
        const betAmount = parseInt(moneyPutInput.value);

        if (
            (selectedRadio === "down" && result >= 2 && result <= 6) ||
            (selectedRadio === "up" && result >= 8 && result <= 12) ||
            (selectedRadio === "perfect" && result === 7)
        ) {
            resultTextElement.textContent = `Congratulations! You won ${getMultiplier(selectedRadio) * betAmount}$`;
            balance += getMultiplier(selectedRadio) * betAmount;
        } else {
            resultTextElement.textContent = `Sorry, you lost ${betAmount}$`;
            balance -= betAmount;
        }

        updateBalance();
    }

    function getSelectedRadio() {
        if (downRadio.checked) return "down";
        if (perfectRadio.checked) return "perfect";
        if (upRadio.checked) return "up";
        return null;
    }

     function getMultiplier(option) {
        if (option === "down" || option === "up") return 2;
        if (option === "perfect") return 4;
        return 1;
    }

    function updateBalance() {
        balanceElement.textContent = balance;
    }

    function clearResult() {
        resultNumberElement.textContent = "please wait";
        resultTextElement.textContent = "Your result will appear here";
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = "block";
    }

    function hideError(element) {
        element.textContent = "";
        element.style.display = "none";
    }

    function newRound() {
        moneyPutInput.value = 5;
        downRadio.checked = false;
        perfectRadio.checked = false;
        upRadio.checked = false;
        hideError(errorAmountElement);
        hideError(errorCheckboxElement);
    }
});
