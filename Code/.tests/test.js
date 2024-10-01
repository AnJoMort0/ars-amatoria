document.addEventListener("DOMContentLoaded", () => {    
    // Create the input bar
    const inputBar = document.createElement("div");
    inputBar.classList.add("input-bar");

    // Create a wrapper for the word containers (ChatGPT assisted)
    const wordsWrapper = document.createElement("div");
    wordsWrapper.classList.add("words-wrapper");
    inputBar.appendChild(wordsWrapper);

    // Create the input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "player-input";
    inputField.maxLength = 15;
    inputField.placeholder = d;
    inputBar.appendChild(inputField);
});