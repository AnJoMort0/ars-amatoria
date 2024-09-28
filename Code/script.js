document.addEventListener("DOMContentLoaded", () => {
    // GENERAL VALUES
    const DEFAULT_ANIM_SPEED    = 20;                   // For the text animation
    const FASTER_ANIM_SPEED     = 5;
    let currentState            = 'intro';              // Starting state is 'intro'
    let animationInProgress     = false;
    let alternate               = false;                // For the text colour

    // Placeholder texts
    const d = "What do you do?";
    const e = "Press Enter to rewind!";
    const w = "Walk towards where?";
    const l = "Look at what?";

    /* Story syntax -> 
    const title = 
    [
        `text`, 
        [
            ['verb1', title_of_destination1], 
            ['v2', tod2], 
            ['v3', tod3],
        ],
        d
    ];
    */

    const storyStates = {
        'intro': [
            `I stumble one more time out of the final exam, the weight of textbooks finally off my shoulders.
There she is, standing in the corridor, the girl I've barely spoken to all semester, if I can even say that now, but I can't get her out of my mind.
She's laughing.
My heart races; this is my chance, maybe my last chance,
once again...
one more time...`
,
            [
                ['look', 'look_classroom'],
                ['walk', 'walk_from_classroom'],
                ['wait', 'wait_on_intro']
            ],
            d
        ],
        'look_classroom': [
            `You look at the...`, 
            [
                ['classroom', 'look_at_classroom'],
                ['corridor', 'look_at_corridor'],
                ['girl', 'look_at_girl']
            ],
            l
        ],
        'look_at_classroom': [
            `The room is chaotic as students rush out, relieved that the ordeal is over.
I catch glimpses of stressed faces and hear a mix of sighs and chatter.
A sea of people flows towards the corridor.`, 
            [
                ['walk', 'walk_from_classroom'],
                ['wait', 'wait_on_intro']
            ],
            d
        ],
        'look_at_corridor': [
            `The toilet is just on the other side of the corridor`, 
            [
                ['walk', 'walk_from_classroom'],
                ['wait', 'wait_on_intro']
            ],
            d
        ],
        'look_at_girl': [
            `She's just standing there, talking to her friend. Can I just approach her like that?`, 
            [
                ['walk', 'walk_from_classroom'],
                ['wait', 'wait_on_intro']
            ],
            d
        ],
        'walk_from_classroom': [
            `You walk towards...`, 
            [
                ['classroom', 'w_cr_cr'],
                ['corridor', 'w_cr_cd'],
                ['girl', 'w_cr_g']
            ],
            w
        ],
        'wait_on_intro': [
            `I wait for a moment, uncertain of what to say. 
Jackson comes from behind me, friendly punches me in the shoulder and happily asks:
"So how was it?"
    
Still surprised I answer:
"It was alright."
    
As I look back at the corridor, the girl is not there anymore. I've lost my chance...`, 
            [],
            e
        ],
    };
    
    // Get references to elements
    const container         = document.getElementById('container');
    const playerInput       = document.getElementById('playerInput');
    const inputBar          = document.getElementById('inputBar');

    startGame();

    //FUNCTIONS

    function startGame() {
        const stateContent      = storyStates[currentState];
        const text              = stateContent[0];
        const storyContainer    = document.getElementById('storyContainer');
        const textElement       = document.createElement('div');
        textElement.classList.add('story-text');
        textElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
        storyContainer.appendChild(textElement);

        playerInput.placeholder = storyStates[currentState][2];
    
        animateTextIntoElement(text, textElement, () => {
            showInputBar();
            displayChoices();
        });
    }

    function animateTextIntoElement(text, element, callback) { // Heavily chatGPT assisted
        let index               = 0;
        animationInProgress     = true;
        let currentAnimSpeed    = DEFAULT_ANIM_SPEED;
        let isSpacePressed      = false;
    
        // Determine if we can skip the animation
        const stateContent      = storyStates[currentState];
        const choices           = stateContent[1];
        const placeholder       = stateContent[2];
        const canSkipAnimation  = !(choices.length === 0 && placeholder === e);
    
        function typeNextChar() {
            if (index < text.length && animationInProgress) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeNextChar, currentAnimSpeed);
            } else {
                // Animation finished
                animationInProgress = false;
                removeEventListeners();
                if (callback) callback();
            }
        }
    
        // Event listeners to control animation speed
        function onKeyDown(event) {
            if (event.key === ' ') {
                if (!isSpacePressed) {
                    isSpacePressed      = true;
                    currentAnimSpeed    = FASTER_ANIM_SPEED;
                }
                event.preventDefault(); // Prevent scrolling when pressing space
            } else if (event.key === 'Enter') {
                if (canSkipAnimation && animationInProgress) {
                    // Skip the animation
                    animationInProgress  = false;
                    element.innerHTML   += text.slice(index);
                    removeEventListeners();
                    if (callback) callback();
                }
            }
        }
    
        function onKeyUp(event) {
            if (event.key === ' ') {
                isSpacePressed      = false;
                currentAnimSpeed    = DEFAULT_ANIM_SPEED;
            }
        }
    
        function removeEventListeners() { // To prevent bugs that I was facing
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    
        // Add event listeners
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    
        // Start typing
        typeNextChar();
    }    

    function showInputBar() {
        inputBar.classList.add('show');
        playerInput.disabled = false; // Enable input field
        playerInput.focus(); // Add focus to the input field
    }    
    function hideInputBar() {
        inputBar.classList.remove('show');
        playerInput.disabled = true; // Disable input field
        playerInput.blur(); // Remove focus from the input field
    }    

    function displayChoices() {
        const choicesWrapper        = document.getElementById('choicesWrapper');
        choicesWrapper.innerHTML    = ''; // Clear previous choices
        const stateContent          = storyStates[currentState];
        const choices               = stateContent[1];
    
        if (choices.length === 0) {
            choicesWrapper.classList.add('hidden'); // Hide the choices wrappern if it's a deadend
        } else {
            choicesWrapper.classList.remove('hidden');
            choices.forEach(choice => {
                const censoredWord          = '-'.repeat(choice[0].length);
                const choiceElement         = document.createElement('div');
                choiceElement.classList.add('choices-container');
                choiceElement.textContent   = censoredWord;
                choicesWrapper.appendChild(choiceElement);
            });
            addChoiceClickEvents();
        }
        adjustContainerHeight();
    }

    function adjustContainerHeight() {
        const inputBar  = document.querySelector('.input-bar');
        const container = document.querySelector('.container');

        // Get the dynamic height of the input bar
        const inputBarHeight = inputBar.offsetHeight;

        // Set the container height to fill the remaining space
        container.style.height = `calc(100vh - ${inputBarHeight}px - 10px)`;
    }

    function updateChoices() { // Based on the letters input by the player
        const inputValue    = playerInput.value.toLowerCase().trim();
        const stateContent  = storyStates[currentState];
        const choices       = stateContent[1];
    
        if (choices.length === 0) {
            return;
        }
    
        const choiceElements = document.querySelectorAll('.choices-container');
    
        choices.forEach((choice, i) => { //Heavily chatGPT assisted
            const choiceWord    = choice[0].toLowerCase();
            let displayWord     = '';
            for (let i = 0; i < choiceWord.length; i++) {
                if (inputValue[i] && inputValue[i] === choiceWord[i]) {
                    displayWord += choiceWord[i];
                } else {
                    displayWord += '-';
                }
            }
            // Update the choice element
            choiceElements[i].textContent = displayWord;

            // Update the cursor style based on whether the input matches the choice
            if (inputValue === choiceWord) {
                choiceElements[i].style.cursor = 'pointer'; // Fully matching input, allow clicking
            } else {
                choiceElements[i].style.cursor = 'not-allowed'; // Not fully matching, prevent clicking
            }
        });
    }
    
    function addChoiceClickEvents() { // Moderately chatGPT assisted
        const choiceElements = document.querySelectorAll('.choices-container');
        choiceElements.forEach((choiceElement, i) => {
            choiceElement.addEventListener('click', (b) => {
                const selectedChoice    = storyStates[currentState][1][i][0];
                const inputValue        = playerInput.value.toLowerCase().trim();
    
                // Allow clicking only if the input value matches the choice
                if (inputValue === selectedChoice.toLowerCase()) {
                    checkPlayerChoice(); // Proceed to the next state
                }
            });
        });
    }    

    function checkPlayerChoice() {
        if (animationInProgress) {
            return; // Do nothing if animation is in progress
        }
    
        const inputValue    = playerInput.value.toLowerCase().trim();
        const stateContent  = storyStates[currentState];
        const choices       = stateContent[1];
    
        if (choices.length === 0 && stateContent[2] === e) {
            proceedToNextState('intro');
            return;
        }
    
        for (let i = 0; i < choices.length; i++) {
            if (inputValue === choices[i][0].toLowerCase()) {
                proceedToNextState(choices[i][1]);
                return;
            }
        }
    }       

    function proceedToNextState(nextStateName) { // Moderately chatGPT assisted
        hideInputBar();
        
        // Reset text color alternation only when restarting the game (when transitioning to 'intro')
        if (nextStateName === 'intro') {
            alternate = false;
            storyContainer.innerHTML = ''; // Clear the story container when restarting
        } else {
            alternate = !alternate; // Toggle text color alternation for every other state
        }

        playerInput.value       = '';    // Clear input
        const nextStateContent  = storyStates[nextStateName];
        playerInput.placeholder = nextStateContent[2]; // Update placeholder
    
        // Wait for the input bar to hide before continuing
        setTimeout(() => {
            // Create a new text element for the next part of the story
            const newTextElement = document.createElement('div');
            newTextElement.classList.add('story-text');
            newTextElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
            storyContainer.appendChild(newTextElement);
    
            // Update the current state
            currentState = nextStateName;
    
            // Animate the next part of the story
            animateTextIntoElement(nextStateContent[0], newTextElement, () => {
                showInputBar();
                displayChoices();
            });
        }, 500); // Adjust this delay to match your input bar animation duration
    }     

    playerInput.addEventListener('input', updateChoices);

    playerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !animationInProgress) {
            checkPlayerChoice();
        }
    });    

});