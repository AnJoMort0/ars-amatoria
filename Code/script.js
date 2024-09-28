document.addEventListener("DOMContentLoaded", () => {
    // GENERAL VALUES
    let animSpeed           = 20;       // -> the lower the value, the faster it is
    let currentState = 'intro'; // Starting state is 'intro'
    let animationInProgress = false;
    let alternate           = false;    // For the text colour

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
one more time... `,
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
    const storyTextElement  = document.getElementById('storyText');
    const choicesWrapper    = document.getElementById('choicesWrapper');
    const playerInput       = document.getElementById('playerInput');
    const inputBar          = document.getElementById('inputBar');

    startGame();

    //FUNCTIONS

    function startGame() {
        const stateContent = storyStates[currentState];
        const text = stateContent[0];
        const storyContainer = document.getElementById('storyContainer');
        const textElement = document.createElement('div');
        textElement.classList.add('story-text');
        textElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
        storyContainer.appendChild(textElement);

        playerInput.placeholder = storyStates[currentState][2]; // Set the initial placeholder
    
        animateTextIntoElement(text, textElement, () => {
            // After text animation, show the input bar
            showInputBar();
            displayChoices();
        });
    }    

    function animateTextIntoElement(text, element, callback) {
        let index = 0;
        animationInProgress = true;
        const interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                animationInProgress = false;
                if (callback) callback();
            }
        }, animSpeed);
    }    

    function showInputBar() {
        inputBar.classList.add('show');
    }
    function hideInputBar() {
        inputBar.classList.remove('show');
    }

    function displayChoices() {
        const choicesWrapper = document.getElementById('choicesWrapper');
        choicesWrapper.innerHTML = ''; // Clear previous choices
        const stateContent = storyStates[currentState];
        const choices = stateContent[1];
    
        if (choices.length === 0) {
            choicesWrapper.classList.add('hidden'); // Hide the choices wrapper
        } else {
            choicesWrapper.classList.remove('hidden');
            choices.forEach(choice => {
                const censoredWord = '-'.repeat(choice[0].length);
                const choiceElement = document.createElement('div');
                choiceElement.classList.add('choices-container');
                choiceElement.textContent = censoredWord;
                choicesWrapper.appendChild(choiceElement);
            });
            addChoiceClickEvents(); // Add click events to new choices
        }
    }    
    function updateChoices() {
        const inputValue = playerInput.value.toLowerCase();
        const stateContent = storyStates[currentState];
        const choices = stateContent[1];
    
        if (choices.length === 0) {
            return;
        }
    
        const choiceElements = document.querySelectorAll('.choices-container');
    
        choices.forEach((choice, index) => {
            const choiceWord = choice[0].toLowerCase();
            let displayWord = '';
            for (let i = 0; i < choiceWord.length; i++) {
                if (inputValue[i] && inputValue[i] === choiceWord[i]) {
                    displayWord += choiceWord[i];
                } else {
                    displayWord += '-';
                }
            }
            // Update the choice element
            choiceElements[index].textContent = displayWord;
        });
    }    
    function addChoiceClickEvents() {
        const choiceElements = document.querySelectorAll('.choices-container');
        choiceElements.forEach((choiceElement, index) => {
            choiceElement.addEventListener('click', () => {
                const selectedChoice = currentState[1][index][0];
                playerInput.value = selectedChoice;
                updateChoices();
                checkPlayerChoice();
            });
        });
    }
    function checkPlayerChoice() {
        const inputValue = playerInput.value.toLowerCase().trim();
        const stateContent = storyStates[currentState];
        const choices = stateContent[1];
    
        if (choices.length === 0 && stateContent[2] === e) {
            // No choices, placeholder is 'e', revert to beginning
            proceedToNextState('intro');
            return;
        }
    
        for (let i = 0; i < choices.length; i++) {
            if (inputValue === choices[i][0].toLowerCase()) {
                // Correct choice entered
                proceedToNextState(choices[i][1]);
                return;
            }
        }
    }    

    function proceedToNextState(nextStateName) {
        hideInputBar();
        alternate = false; // Reset text color alternation on restart
        playerInput.value = ''; // Clear input
        const nextStateContent = storyStates[nextStateName];
        playerInput.placeholder = nextStateContent[2]; // Update placeholder
    
        // Check if we're restarting the game
        if (nextStateName === 'intro') {
            // Clear the story container
            storyContainer.innerHTML = '';
        }
    
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
        if (e.key === 'Enter') {
            checkPlayerChoice();
        }
    });

});