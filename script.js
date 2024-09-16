let totalXP = 0;
let XP = 0;

const inputBox = document.getElementById("input-box");
const rewardCount = document.getElementById("reward-count");
const deadLine = document.getElementById("date");
const listContainer = document.getElementById("list-container");
const textLine = document.getElementById("textLine");

// Initialize date input
document.getElementById("date").valueAsDate = new Date();

// Add a task to the list
function addTask() {
    if (inputBox.value === '') {
        alert("You must write Task Name!");
    } else if (rewardCount.value === '') {
        alert("You must assign reward!");
    } else if (deadLine.value === '') {
        alert("You must assign a deadline!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = `
            ${inputBox.value} <br>
            ${rewardCount.value}xp<br>
            ${formatDate(deadLine.value)}`;
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        // Store the XP value in a custom attribute for future use
        li.setAttribute('data-xp', rewardCount.value);

        inputBox.value = '';
        rewardCount.value = '';
        deadLine.value = getDate();
        saveData();
    }
}

// Handle clicks on the list items
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        // Update totalXP by adding the XP of the completed task
        if (e.target.classList.contains("checked")) {
            totalXP += Number(e.target.getAttribute('data-xp'));
        } else {
            totalXP -= Number(e.target.getAttribute('data-xp'));
        }
        updateTotalXP();
        saveData();
    } else if (e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
        updateTotalXP();
        saveData();
    }
}, false);

// Update the displayed totalXP
function updateTotalXP() {
    textLine.innerHTML = totalXP;
}

// Save the current list to local storage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Show tasks from local storage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    // Update totalXP from local storage
    const items = listContainer.getElementsByTagName("li");
    totalXP = 0;
    for (let item of items) {
        if (item.classList.contains("checked")) {
            totalXP += Number(item.getAttribute('data-xp'));
        }
    }
    updateTotalXP();
}

// Helper function to format date as DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Helper function to get the current date
function getDate() {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; // Months are zero-based
    let year = today.getFullYear();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

showTask();