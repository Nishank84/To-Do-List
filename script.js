let totalXP = 0;
let redeemedMinutes = 0; // Total minutes redeemed
let redeemedRupees = 0; // Total rupees redeemed


const inputBox = document.getElementById("input-box");
const rewardCount = document.getElementById("reward-count");
const deadLine = document.getElementById("date");
const listContainer = document.getElementById("list-container");
const textLine = document.getElementById("textLine");
const redeemDialog = document.getElementById("redeem-dialog");
const conversionType = document.getElementById("conversion-type");
const conversionRate = document.getElementById("conversion-rate");
const redeemedTimeDisplay = document.getElementById("redeemed-time"); // Display redeemed minutes
const redeemedRupeesDisplay = document.getElementById("redeemed-rupees"); // Display redeemed rupees


// Initialize date input
const today = new Date().toISOString().split("T")[0];
deadLine.min = today;
deadLine.value = today;

// Add Task
function addTask() {
    const taskName = inputBox.value.trim();
    const xpReward = parseInt(rewardCount.value);
    const deadline = deadLine.value;

    if (!taskName || isNaN(xpReward) || !deadline) {
        alert("Please fill out all fields!");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
            ${inputBox.value} <br>
            ${rewardCount.value}XP<br>
            ${formatDate(deadLine.value)}
            <span>&times;</span>`;
    li.dataset.xp = xpReward;
    li.dataset.deadline = deadline;
    listContainer.appendChild(li);

    resetForm();
    sortTasks();
    saveData();
}

// Reset form fields
function resetForm() {
    inputBox.value = "";
    rewardCount.value = "";
    deadLine.value = today;
}

// Handle click events
listContainer.addEventListener("click", function (e) {
    const target = e.target;

    if (target.tagName === "LI") {
        toggleTask(target);
    } else if (target.tagName === "SPAN") {
        deleteTask(target.parentElement);
    }
});

// Toggle Task
function toggleTask(task) {
    task.classList.toggle("checked");
    const xpChange = parseInt(task.dataset.xp);
    totalXP += task.classList.contains("checked") ? xpChange : -xpChange;
    updateTotalXP();
    saveData();
}

// Delete Task
function deleteTask(task) {
    task.remove();
    updateTotalXP();
    saveData();
}

// Sort Tasks
function sortTasks() {
    const items = Array.from(listContainer.children);

    // Separate checked and unchecked tasks
    const uncheckedTasks = items.filter(item => !item.classList.contains("checked"));
    const checkedTasks = items.filter(item => item.classList.contains("checked"));

    // Sort unchecked tasks by deadline (ascending)
    uncheckedTasks.sort((a, b) => {
        const aDeadline = new Date(a.dataset.deadline);
        const bDeadline = new Date(b.dataset.deadline);
        return aDeadline - bDeadline;
    });

    // Combine unchecked tasks (sorted) with checked tasks (unchanged)
    const sortedTasks = [...uncheckedTasks, ...checkedTasks];

    // Append sorted tasks back to the list container
    sortedTasks.forEach(item => listContainer.appendChild(item));
}



// Update Total XP
function updateTotalXP() {
    textLine.textContent = totalXP;
}

// Open the redeem dialog
function openRedeemDialog() {
    redeemDialog.classList.remove("hidden"); // Display the redeem dialog
}

// Close the redeem dialog
function closeRedeemDialog() {
    redeemDialog.classList.add("hidden"); // Hide the redeem dialog
}

// Redeem XP function
function redeemXP() {
    const rate = parseInt(conversionRate.value); // Conversion rate entered by the user
    const amount = parseInt(document.getElementById("redeem-amount").value); // XP amount to redeem

    // Validate inputs
    if (isNaN(rate) || rate <= 0) {
        alert("Please enter a valid conversion rate.");
        return;
    }
    if (isNaN(amount) || amount <= 0 || amount > totalXP) {
        alert("Invalid XP amount or insufficient XP.");
        return;
    }

    // Deduct redeemed XP from total XP
    totalXP -= amount;

    // Process redemption based on conversion type
    if (conversionType.value === "time") {
        const minutes = amount * rate; // Calculate redeemed minutes
        redeemedMinutes += minutes; // Add to total redeemed minutes
        alert(`You redeemed ${amount} XP for ${minutes} minutes of free time.`);
    } else if (conversionType.value === "money") {
        const rupees = amount * rate; // Calculate redeemed rupees
        redeemedRupees += rupees; // Add to total redeemed rupees
        alert(`You redeemed ${amount} XP for ₹${rupees}.`);
    }

    // Update the UI
    updateRedeemedDisplay(); // Update redeemed values
    updateTotalXP(); // Update total XP display

    // Close the redeem dialog
    closeRedeemDialog();

    // Save data for persistence
    saveData();
}

// Open the spend dialog
function openSpendDialog() {
    document.getElementById("spend-amount").value = ""; // Reset input field
    document.getElementById("spend-dialog").classList.remove("hidden"); // Show the dialog
    updateSpendPlaceholder(); // Set the initial placeholder based on the default selection
}

// Close the spend dialog
function closeSpendDialog() {
    document.getElementById("spend-dialog").classList.add("hidden"); // Hide the dialog
}

// Update the input placeholder based on the selected spend type
function updateSpendPlaceholder() {
    const spendType = document.getElementById("spend-type").value; // Get the selected type (time or money)
    const spendInput = document.getElementById("spend-amount"); // Reference to the input field

    if (spendType === "time") {
        spendInput.placeholder = "Enter minutes to spend"; // Update placeholder for minutes
    } else if (spendType === "money") {
        spendInput.placeholder = "Enter rupees to spend"; // Update placeholder for rupees
    }
}

document.getElementById("spend-type").addEventListener("change", updateSpendPlaceholder); //Event listener to dynamically update the input placeholder

// Spend the selected value
function spendValue() {
    const spendType = document.getElementById("spend-type").value; // Get the selected type (time or money)
    const amount = parseInt(document.getElementById("spend-amount").value); // Get the entered amount

    // Validate input
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (spendType === "time") {
        if (amount > redeemedMinutes) {
            alert("You don't have enough minutes to spend.");
            return;
        }
        redeemedMinutes -= amount; // Deduct the spent minutes
        alert(`You have spent ${amount} minutes.`);
    } else if (spendType === "money") {
        if (amount > redeemedRupees) {
            alert("You don't have enough rupees to spend.");
            return;
        }
        redeemedRupees -= amount; // Deduct the spent rupees
        alert(`You have spent ₹${amount}.`);
    }

    // Update UI and save data
    updateRedeemedDisplay();
    saveData();

    // Close the dialog
    closeSpendDialog();
}

// Update the redeemed values display
function updateRedeemedDisplay() {
    redeemedTimeDisplay.textContent = `Free time Available: ${redeemedMinutes} min`; // Update redeemed minutes
    redeemedRupeesDisplay.textContent = `Money Available: ₹${redeemedRupees}`; // Update redeemed rupees
}

// Update Total XP
function updateTotalXP() {
    textLine.textContent = `Available XP: ${totalXP}`; // Update total XP display
}

// LocalStorage
function saveData() {
    localStorage.setItem("tasks", listContainer.innerHTML); // Save tasks
    localStorage.setItem("totalXP", totalXP); // Save total XP
    localStorage.setItem("redeemedMinutes", redeemedMinutes); // Save redeemed minutes
    localStorage.setItem("redeemedRupees", redeemedRupees); // Save redeemed rupees
}


// Update conversion rate placeholder dynamically
conversionType.addEventListener("change", function () {
    if (conversionType.value === "time") {
        conversionRate.placeholder = "1 XP = ? min";
    } else if (conversionType.value === "money") {
        conversionRate.placeholder = "1 XP = ₹ ?";
    }
});

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
}

// Load Tasks
loadData();

function loadData() {
    totalXP = parseInt(localStorage.getItem("totalXP")) || 0;
    redeemedMinutes = parseInt(localStorage.getItem("redeemedMinutes")) || 0;
    redeemedRupees = parseInt(localStorage.getItem("redeemedRupees")) || 0;

    // Update UI with loaded data
    updateTotalXP();
    updateRedeemedDisplay();
}

// Call loadData to initialize the app state on page load
window.onload = loadData;

