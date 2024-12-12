let checkingBalance = 1000;
let savingsBalance = 5000;

let currentAccount = 'checking'; // Default account
let pinEntered = false; // Track whether the PIN has been entered
let enteredPin = ''; // For PIN entry
const correctPin = '1234'; // Set the correct PIN for validation

let transactionMode = ''; // Tracks whether user is depositing or withdrawing
let enteredAmount = ''; // Stores the amount entered for transactions

// Get references to the DOM elements
const atmScreen = document.getElementById('atmScreen');
const cardSlot = document.getElementById('cardSlot');
const keys = document.querySelectorAll('.key');

// Function to update the screen
function updateScreen(message) {
    atmScreen.innerText = message;
}

// Function to reset the transaction state
function resetTransaction() {
    transactionMode = '';
    enteredAmount = '';
}

// Function to process a deposit
function deposit(amount) {
    if (!pinEntered) {
        updateScreen('Please enter your PIN first.');
        return;
    }
    if (currentAccount === 'checking') {
        checkingBalance += amount;
        updateScreen(`Deposited $${amount}. New Checking Balance: $${checkingBalance}`);
    } else if (currentAccount === 'savings') {
        savingsBalance += amount;
        updateScreen(`Deposited $${amount}. New Savings Balance: $${savingsBalance}`);
    }
    resetTransaction();
}

// Function to process a withdrawal
function withdraw(amount) {
    if (!pinEntered) {
        updateScreen('Please enter your PIN first.');
        return;
    }
    if (currentAccount === 'checking') {
        if (amount > checkingBalance) {
            updateScreen('Insufficient funds in Checking.');
        } else {
            checkingBalance -= amount;
            updateScreen(`Withdrew $${amount}. New Checking Balance: $${checkingBalance}`);
        }
    } else if (currentAccount === 'savings') {
        if (amount > savingsBalance) {
            updateScreen('Insufficient funds in Savings.');
        } else {
            savingsBalance -= amount;
            updateScreen(`Withdrew $${amount}. New Savings Balance: $${savingsBalance}`);
        }
    }
    resetTransaction();
}

// Handle keypad input
keys.forEach((key) => {
    key.addEventListener('click', () => {
        const value = key.dataset.value;

        if (transactionMode) {
            // Handle amount entry for transactions
            if (value === 'CLR') {
                enteredAmount = ''; // Clear entered amount
                updateScreen('Enter Amount: ');
            } else if (value === 'ENTER') {
                const amount = parseFloat(enteredAmount);
                if (!isNaN(amount) && amount > 0) {
                    if (transactionMode === 'deposit') {
                        deposit(amount);
                    } else if (transactionMode === 'withdraw') {
                        withdraw(amount);
                    }
                } else {
                    updateScreen('Invalid amount. Try again.');
                }
            } else {
                enteredAmount += value; // Append digit to entered amount
                updateScreen(`Enter Amount: $${enteredAmount}`);
            }
        } else if (!pinEntered) {
            // Handle PIN entry
            if (value === 'CLR') {
                enteredPin = ''; // Clear entered PIN
                updateScreen('Enter your PIN.');
            } else if (value === 'ENTER') {
                if (enteredPin === correctPin) {
                    pinEntered = true;
                    updateScreen('PIN Accepted. Select an option.');
                } else {
                    updateScreen('Incorrect PIN. Try again.');
                    enteredPin = ''; // Reset entered PIN
                }
            } else {
                enteredPin += value; // Add digit to PIN
                updateScreen(`PIN: ${'*'.repeat(enteredPin.length)}`); // Display masked PIN
            }
        }
    });
});

// Switch account functionality
document.getElementById('switch-account').addEventListener('click', () => {
    if (!pinEntered) {
        updateScreen('Please enter your PIN first.');
        return;
    }
    currentAccount = currentAccount === 'checking' ? 'savings' : 'checking';
    updateScreen(`Switched to ${currentAccount} account.`);
});

// Card insertion
cardSlot.addEventListener('click', () => {
    updateScreen('Card Inserted. Enter PIN to proceed.');
    pinEntered = false; // Reset PIN entry on card insertion
    enteredPin = ''; // Clear entered PIN
    resetTransaction(); // Reset transaction state
});

// Top buttons (Deposit, Withdraw, Check Balance)
document.querySelectorAll('.btn-selector').forEach((button) => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'deposit') {
            if (pinEntered) {
                transactionMode = 'deposit';
                updateScreen('Enter Amount: ');
            } else {
                updateScreen('Please enter your PIN first.');
            }
        } else if (action === 'withdraw') {
            if (pinEntered) {
                transactionMode = 'withdraw';
                updateScreen('Enter Amount: ');
            } else {
                updateScreen('Please enter your PIN first.');
            }
        } else if (action === 'check-balance') {
            if (pinEntered) {
                if (currentAccount === 'checking') {
                    updateScreen(`Checking Balance: $${checkingBalance}`);
                } else if (currentAccount === 'savings') {
                    updateScreen(`Savings Balance: $${savingsBalance}`);
                }
            } else {
                updateScreen('Please enter your PIN first.');
            }
        }
    });
});