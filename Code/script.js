document.addEventListener("DOMContentLoaded", () => {
    /** CHANGES I WANT TO DO CURRENTLY
     * 
     * Change the default gameplay area to the classical "compact mode" of most websites
     * Remove the indentation from new paragraphs
     * Change the function showInputBar to animate the whole popping up when the text animation is coming to the end and add a popping back down when the text animation starts (the animation speed should be relative to animSpeed as well)
     * Change the Event listener to restart game on clicking anywhere on the page at a dead-end to be a click on the input bar when a dead-end is reached
     * Hold space to increase the animation speed of the story to 0
     * Press Enter while the animation is playing to skip it and just pop the whole text --> also add a soft lock of enter afterwards to prevent skipping the animation and confirming a dead-end not on purpose
     */

    // Declaring default values
    let animSpeed = 20; // -> the lower the value, the faster it is
    let skipAnimation = false;
    let animationInProgress = false;

    // Story syntax -> [state, place, text, options, placeholder text]

    // Full Story Structure
    const d = "What do you do?";
    const e = "Press Enter to rewind!";
    const w = "Walk towards where?";
    const l = "Look at what?";

    const introText = ['0', "Classroom",
        ``,
        ["look", "walk", "wait"], d];
        /*I stumble one more time out of the final exam, the weight of textbooks finally off my shoulders.
        There she is, standing in the corridor, the girl I've barely spoken to all semester, if I can even say that now, but I can't get her out of my mind.
        She's laughing.
        My heart races; this is my chance, maybe my last chance,
        once again...
        one more time... */
    
    const look_0 = ['00', "Classroom",
        `You look at the...`, 
        ["classroom", "corridor", "girl"], l];
    
        const classroom_00 = ['0', "Classroom",
            `The room is chaotic as students rush out, relieved that the ordeal is over.
            I catch glimpses of stressed faces and hear a mix of sighs and chatter.
            A sea of people flows towards the corridor.`, 
            introText[3], d];
        
        const corridor_00 = ['0', "Classroom",
            `The toilet is just on the other side of the corridor`, 
            introText[3], d];
        
        const girl_00 = ['0', "Classroom",
            `She's just standing there, talking to her friend. Can I just approach her like that?`, 
            introText[3], d];

    const walk_0 = ['01', "Classroom",
        `You walk towards...`, 
        ["classroom", "corridor", "girl"], w];
    
    const wait_0 = ['02', "Classroom",
        `I wait for a moment, uncertain of what to say. 
        Jackson comes from behind me, friendly punches me in the shoulder and happily asks:
        "So how was it?"

        Still surprised I answer:
        "It was alright."

        As I look back at the corridor, the girl is not there anymore. I've lost my chance...`, 
        [], e];

    // Set the initial story state
    let currentState = introText;
    let alternate = false; // To toggle between colors

    // Function to progress the story based on input
    function progressStory(input) {
        if (currentState === introText && input === "look") {
            currentState = look_0;
        } else if (currentState === introText && input === "walk") {
            currentState = walk_0;
        } else if (currentState === introText && input === "wait") {
            currentState = wait_0;
        } else if (currentState === look_0 && input === "classroom") {
            currentState = classroom_00;
        } else if (currentState === look_0 && input === "corridor") {
            currentState = corridor_00;
        } else if (currentState === look_0 && input === "girl") {
            currentState = girl_00;
        } else {
            restartGame();
            return;
        }
        
        hideInputBar();
        animateText(currentState[2], showInputBar);
        inputField.value = ''; // Clear the input field
    }

    // Create the container for the story
    const container = document.createElement("div");
    container.classList.add("container");
    document.body.appendChild(container);

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
    
    inputField.addEventListener("input", handleInput);

    // Append the input bar to the body
    document.body.appendChild(inputBar);

    // Start the beginning animation
    animateText(currentState[2], showInputBar);

    // Pressing Enter when a word is found (This was moderately ChatGPT assisted)
    inputField.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !animationInProgress) {
            const inputText = inputField.value.toLowerCase();
            const matchingOption = currentState[3].find(option => option === inputText);
            if (matchingOption) {
                progressStory(matchingOption);
            } else if (currentState[3].length === 0) {
                restartGame(); // Restart if at a dead-end
            }
        }
    });

    // Restart game on clicking the input bar at a dead-end
    inputBar.addEventListener("click", function() {
        if (currentState[3].length === 0) {
            restartGame();
        }
    });

    // FUNCTIONS:

    // Animate text (this was heavily ChatGPT assisted)
    function animateText(text, callback) {
        const storyTextContainer = document.createElement("div");
        storyTextContainer.className = `story-text ${alternate ? 'text-alternate-2' : 'text-alternate-1'}`;
        container.appendChild(storyTextContainer);
        alternate = !alternate;

        let i = 0;
        animationInProgress = true;

        function typeLetter() {
            if (skipAnimation) {
                storyTextContainer.innerHTML = text; // Skip typing animation and display full text
                animationInProgress = false;
                skipAnimation = false;
                if (callback) callback();
            } else if (i < text.length) {
                storyTextContainer.innerHTML += text[i];
                i++;
                setTimeout(typeLetter, animSpeed);
            } else {
                animationInProgress = false;
                if (callback) callback();
            }
        }

        typeLetter();
    }

    // Display input bar and rectangles with animation (this was heavily ChatGPT assisted)
    function showInputBar() {
        updateOptions(currentState[3]);
        inputField.placeholder = currentState[4];
        inputBar.classList.add("visible");
        inputBar.style.transform = "translateY(0)";
        inputBar.style.transition = `transform ${animSpeed * 3}ms ease-in-out`;
    }

    // Hide input bar and rectangles with animation
    function hideInputBar() {
        inputBar.style.transform = "translateY(100%)";
        inputBar.style.transition = `transform ${animSpeed * 3}ms ease-in-out`;

        setTimeout(() => {
            inputBar.classList.remove("visible");
        }, animSpeed * 3); // Delay to match the animation
    }

    // Update the option rectangles (This was heavily ChatGPT assisted)
    function updateOptions(options) {
        wordsWrapper.innerHTML = ''; // Clear previous options
        options.forEach(word => {
            const wordContainer = document.createElement("div");
            wordContainer.classList.add("word-container");
            wordContainer.dataset.word = word;

            const wordSpan = document.createElement("div");
            wordSpan.classList.add("word-text");

            for (let i = 0; i < word.length; i++) {
                const letterSpan = document.createElement("span");
                letterSpan.textContent = "_";  // Hidden letters replacement character
                letterSpan.classList.add("hidden-letter");
                wordSpan.appendChild(letterSpan);
            }

            wordContainer.appendChild(wordSpan);
            wordsWrapper.appendChild(wordContainer);

            wordContainer.addEventListener("click", () => {
                if (inputField.value.toLowerCase() === word) {
                    progressStory(word);
                }
            });
        });
    }

    function handleInput() { // This was heavily ChatGPT assisted
        // Get the current value of the input field
        const inputText = inputField.value.toLowerCase();

        // Get all word containers
        const wordContainers = document.querySelectorAll(".word-container");

        // Loop through each word container
        wordContainers.forEach(container => {
            const word = container.dataset.word.toLowerCase();
            const wordSpans = container.querySelectorAll(".hidden-letter");

            // Update each letter span based on input
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];

                if (inputText.includes(letter)) {
                    wordSpans[i].textContent = letter;
                } else {
                    wordSpans[i].textContent = "_";
                }
            }

            // Check if the word has been fully revealed
            if (inputText === word) {
                container.style.cursor = "pointer";
            } else {
                container.style.cursor = "default";
            }
        });
    }

    // Holding space to speed up the animation and pressing enter to skip it
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") {
            animSpeed = 0; // Speed up the animation by setting speed to 0
        }
        if (event.code === "Enter" && animationInProgress) {
            skipAnimation = true; // Skip the current animation
        }
    });
    document.addEventListener("keyup", function(event) {
        if (event.code === "Space") {
            animSpeed = 20; // Reset animation speed
        }
    });

    // Restart the game
    function restartGame() {
        container.innerHTML = ''; // Clear the container
        currentState = introText;
        animateText(currentState[2], showInputBar);
    }
});