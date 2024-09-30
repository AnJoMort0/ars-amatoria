document.addEventListener("DOMContentLoaded", () => {
    // GENERAL VALUES
    const DEFAULT_ANIM_SPEED    = 20;       // For the text animation
    const FASTER_ANIM_SPEED     = 5;
    let currentState            = 'intro';  // Starting state is 'intro'
    let animationInProgress     = false;
    let alternate               = false;    // For the text colour

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
one more time...`,
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
                ['girl', 'look_at_girl'],
                ['floor', 'look_at_floor'],
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
    // Title Screen
    const titleScreen       = document.getElementById('titleScreen');
    const logo              = document.getElementById('titleLogo');
    const continueButton    = document.getElementById('continueButton');
    const newGameButton     = document.getElementById('newGameButton');

    //Game Elements
    const mainContent   = document.getElementById('mainContent');
    const container     = document.getElementById('container');
    const playerInput   = document.getElementById('playerInput');
    const inputBar      = document.getElementById('inputBar');

    const currentSpeedElement   = document.getElementById('currentSpeed');
    const speedHintElement      = document.getElementById('speedHint');

    // Colour palette control
    let isPinkPalette       = true; // Start with the rose palette
    if (localStorage.getItem('isPinkPalette')) {
        isPinkPalette = JSON.parse(localStorage.getItem('isPinkPalette'));
        if (!isPinkPalette) {
            document.body.classList.add('blue-palette');
        } else {
            document.body.classList.add('pink-palette');
        }
    }
    // Apply the correct palette class on page load
    if (isPinkPalette) {
        document.body.classList.add('pink-palette');
    } else {
        document.body.classList.add('blue-palette');
    }

    // Animation speed control
    const animationSpeeds = ['Normal', 'Fast', 'None'];
    let currentSpeedIndex = 0; // Default to 'Normal'
    if (localStorage.getItem('animationSpeed')) {
        const savedSpeed    = localStorage.getItem('animationSpeed');
        currentSpeedIndex   = animationSpeeds.indexOf(savedSpeed);
        if (currentSpeedIndex === -1) {
            currentSpeedIndex = 0; // Default to 'Normal' if not found
        }
    }

    // Glitchy transition control
    let glitchEnabled = true; // Default to flashing images (glitch) enabled
    if (localStorage.getItem('glitchEnabled')) {
        glitchEnabled = JSON.parse(localStorage.getItem('glitchEnabled'));
    }
    document.getElementById('flashingToggle').textContent = glitchEnabled ? "On" : "Off";

    // Better readability control
    let betterReadabilityEnabled = false; // Default to Off
    if (localStorage.getItem('betterReadabilityEnabled')) {
        betterReadabilityEnabled = JSON.parse(localStorage.getItem('betterReadabilityEnabled'));
        if (betterReadabilityEnabled) {
            document.body.classList.add('better-readability');
            document.getElementById('betterReadabilityToggle').textContent = "On";
        }
    }

    // Check if there are unlocked choices
    let unlockedChoices = {};
    if (localStorage.getItem('unlockedChoices')) {
        unlockedChoices = JSON.parse(localStorage.getItem('unlockedChoices'));
        continueButton.disabled = false;
    } else {
        continueButton.disabled = true;
        continueButton.style.cursor = 'not-allowed';
    }
    // Title Screen
    continueButton.addEventListener('click', () => {
        if (!continueButton.disabled) {
            hideTitleScreen(true);
        }
    });

    newGameButton.addEventListener('click', () => {
        // Clear the saved game data
        localStorage.removeItem('unlockedChoices');
        unlockedChoices = {};
        isPinkPalette = true;
        localStorage.setItem('isPinkPalette', JSON.stringify(isPinkPalette));

        // Remove the palette classes and add pink-palette
        document.body.classList.remove('blue-palette', 'pink-palette');
        document.body.classList.add('pink-palette');

        currentState = 'intro';
        localStorage.setItem('currentState', currentState);

        hideTitleScreen(false); // Pass false to indicate new game
    });

    updateAnimationSpeedDisplay();

    // FUNCTIONS

    function hideTitleScreen(isContinuing) {
        continueButton.disabled     = true;
        newGameButton.disabled      = true;
        titleScreen.classList.add('glitchy-transition');
        titleScreen.classList.add('glitch-active')
        setTimeout(() => {
            titleScreen.classList.remove('glitchy-transition');
            titleScreen.classList.remove('glitch-active');
            
            titleScreen.style.display = 'none';
            mainContent.style.display = 'flex';
    
            startGame(isContinuing);
        }, 1000);
    }
    
    function startGame(isContinuing) {
        if (isContinuing && localStorage.getItem('currentState')) {
            currentState = localStorage.getItem('currentState');
        } else {
            currentState = 'intro';
            localStorage.setItem('currentState', currentState);
        }
    
        const stateContent  = storyStates[currentState];
        const text          = stateContent[0];
        const textElement   = document.createElement('div');
        textElement.classList.add('story-text');
        textElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
        container.appendChild(textElement);
    
        // Set the initial placeholder
        playerInput.placeholder = stateContent[2];
    
        animateTextIntoElement(text, textElement, () => {
            showInputBar();
            displayChoices();
        });
    }    

    function animateTextIntoElement(text, element, callback) { // moderately chatGPT assisted
        let index           = 0;
        animationInProgress = true;
        let currentAnimSpeed;
        let isSpacePressed  = false;

        // Determine the animation speed based on the setting
        const speedSetting  = animationSpeeds[currentSpeedIndex];

        if (speedSetting === 'Normal') {
            currentAnimSpeed = DEFAULT_ANIM_SPEED;
        } else if (speedSetting === 'Fast') {
            currentAnimSpeed = FASTER_ANIM_SPEED;
        } else if (speedSetting === 'None') { // chatGPT proposition
            // Skip the animation
            element.innerHTML  += text;
            animationInProgress = false;
            // Scroll to bottom after adding text
            container.scrollTop = container.scrollHeight;
            if (callback) callback();
            return;
        }

        function typeNextChar() {
            if (index < text.length && animationInProgress) {
                element.innerHTML += text.charAt(index);
                index++;
                // Scroll to bottom after adding a character
                container.scrollTop = container.scrollHeight;
                setTimeout(typeNextChar, currentAnimSpeed);
            } else {
                // Animation finished
                animationInProgress = false;
                removeEventListeners();
                // Ensure the container is scrolled to the bottom
                container.scrollTop = container.scrollHeight;
                if (callback) callback();
            }
        }

        // Event listeners to control animation speed
        function onKeyDown(event) {
            if (speedSetting === 'Normal') {
                if (event.key === ' ') {
                    if (!isSpacePressed) {
                        isSpacePressed      = true;
                        currentAnimSpeed    = FASTER_ANIM_SPEED;
                    }
                    event.preventDefault(); // Prevent scrolling when pressing space
                }
            }

            // Skip the animation
            if (event.key === 'Enter') {
                if (animationInProgress) {
                    animationInProgress = false;
                    element.innerHTML  += text.slice(index);
                    removeEventListeners();
                    if (callback) callback();
                }
            }
        }

        function onKeyUp(event) {
            if (speedSetting === 'Normal') {
                if (event.key === ' ') {
                    isSpacePressed = false;
                    currentAnimSpeed = DEFAULT_ANIM_SPEED;
                }
            }
        }

        function removeEventListeners() {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }

        if (speedSetting !== 'None') {
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
        }

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

    function displayChoices() { // Lightly chatGPT assisted, mostly for the localStorage saved choices
        const choicesWrapper        = document.getElementById('choicesWrapper');
        choicesWrapper.innerHTML    = ''; // Clear previous choices
        const stateContent          = storyStates[currentState];
        const choices               = stateContent[1];
    
        if (choices.length === 0) {
            choicesWrapper.classList.add('hidden'); // Hide the choices wrapper if it's a dead end
        } else {
            choicesWrapper.classList.remove('hidden');
            // Dynamically set grid columns
            choicesWrapper.style.gridTemplateColumns = `repeat(${choices.length}, 1fr)`;
    
            choices.forEach((choice) => {
                const choiceWord    = choice[0];
                const nextState     = choice[1];
                const choiceKey     = `${currentState}-${nextState}`; // Create a unique key for the choice
                const isUnlocked    = unlockedChoices[choiceKey];     // Check if this choice is unlocked
                const censoredWord  = isUnlocked ? choiceWord : '-'.repeat(choiceWord.length);
                const choiceElement = document.createElement('div');
                choiceElement.classList.add('choices-container');
                choiceElement.textContent = censoredWord;
    
                // Set the cursor based on whether the choice is unlocked
                choiceElement.style.cursor = isUnlocked ? 'pointer' : 'not-allowed';
    
                choicesWrapper.appendChild(choiceElement);
            });
            addChoiceClickEvents();
        }
        adjustContainerHeight();
    }    

    function adjustContainerHeight() {
        const inputBar  = document.querySelector('.input-bar');
        const container = document.querySelector('.container');

        const inputBarHeight    = inputBar.offsetHeight;
        container.style.height  = `calc(100vh - ${inputBarHeight}px - 25px)`;
    }

    function updateChoices() { // Lightly chatGPT assisted, mostly for the localStorage saved choices
        const inputValue    = playerInput. value.toLowerCase().trim();
        const stateContent  = storyStates[currentState];
        const choices       = stateContent[1];
    
        if (choices.length === 0) {
            return;
        }
    
        const choiceElements = document.querySelectorAll('.choices-container');
    
        choices.forEach((choice, i) => {
            const choiceWord    = choice[0];
            const nextState     = choice[1];
            const choiceKey     = `${currentState}-${nextState}`; // Create a unique key for the choice
            let displayWord     = '';
    
            if (unlockedChoices[choiceKey]) {
                displayWord = choiceWord; // Uncensored if unlocked
            } else {
                // Censor letters that don't match the player's input
                for (let j = 0; j < choiceWord.length; j++) {
                    if (inputValue[j] && inputValue[j] === choiceWord[j]) {
                        displayWord += choiceWord[j];
                    } else {
                        displayWord += '-';
                    }
                }
            }
    
            // Update the choice element's display
            choiceElements[i].textContent = displayWord;
    
            // Set the cursor: 'pointer' if unlocked or fully matching, otherwise 'not-allowed'
            if (unlockedChoices[choiceKey] || inputValue === choiceWord) {
                choiceElements[i].style.cursor = 'pointer';
            } else {
                choiceElements[i].style.cursor = 'not-allowed';
            }
        });
    }    

    function addChoiceClickEvents() { // Lightly chatGPT assisted, mostly for the localStorage saved choices
        const choiceElements    = document.querySelectorAll('.choices-container');
        choiceElements.forEach((choiceElement, i) => {
            const choiceWord    = storyStates[currentState][1][i][0];
            const nextState     = storyStates[currentState][1][i][1];
            const choiceKey     = `${currentState}-${nextState}`; // Create a unique key for the choice

            choiceElement.addEventListener('click', () => {
                const inputValue = playerInput.value.toLowerCase().trim();
    
                if (unlockedChoices[choiceKey] || inputValue === choiceWord.toLowerCase()) {
                    // Unlock the choice with the combination of currentState and nextState
                    unlockChoice(currentState, nextState);
                    proceedToNextState(nextState);
                }
            });
        });
    }    

    function unlockChoice(currentState, nextState) { // Heavily chatGPT assisted
        const choiceKey = `${currentState}-${nextState}`;
        
        if (!unlockedChoices[choiceKey]) {
            unlockedChoices[choiceKey] = true;
            localStorage.setItem('unlockedChoices', JSON.stringify(unlockedChoices));
        }
    }    

    function checkPlayerChoice() { // Lightly chatGPT assisted, mostly for the localStorage saved choices
        if (animationInProgress) {
            return; // Do nothing
        }
    
        const inputValue    = playerInput.value.toLowerCase().trim();
        const stateContent  = storyStates[currentState];
        const choices       = stateContent[1];
    
        if (choices.length === 0 && stateContent[2] === e) {
            proceedToNextState('intro');
            return;
        }
    
        for (let i = 0; i < choices.length; i++) {
            const choiceWord    = choices[i][0].toLowerCase();
            const nextState     = choices[i][1];
            const choiceKey     = `${currentState}-${nextState}`; // Create a unique key for the choice
    
            if (inputValue === choiceWord) {
                // Unlock the choice with the combination of currentState and nextState
                unlockChoice(currentState, nextState);
                proceedToNextState(nextState);
                return;
            }
        }
    }    

    function proceedToNextState(nextStateName) { // Color change code generated by chatGPT
        hideInputBar();
    
        if (nextStateName === 'intro') {
            alternate = false;
            container.innerHTML = '';   // Clear the story container
    
            // Set the final palette variables based on the next palette
            if (isPinkPalette) {
                document.documentElement.style.setProperty('--final-background-color', '#203f4f');
                document.documentElement.style.setProperty('--final-accent-color', '#337b7b');
                document.documentElement.style.setProperty('--final-text-color', '#d1ecf1');
            } else {
                document.documentElement.style.setProperty('--final-background-color', '#2f1a26');
                document.documentElement.style.setProperty('--final-accent-color', '#472233');
                document.documentElement.style.setProperty('--final-text-color', '#e0c3c3');
            }
    
            if (glitchEnabled) {
                document.body.classList.add('glitchy-transition');
    
                setTimeout(() => {
                    togglePalette();
                }, 1000);
            } else {
                togglePalette();
            }
    
        } else {
            alternate = !alternate;
        }
    
        playerInput.value = ''; // Clear input
        const nextStateContent = storyStates[nextStateName];
        playerInput.placeholder = nextStateContent[2]; // Update placeholder
    
        setTimeout(() => {
            const newTextElement = document.createElement('div');
            newTextElement.classList.add('story-text');
            newTextElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
            container.appendChild(newTextElement);
    
            currentState = nextStateName;
            localStorage.setItem('currentState', currentState);
    
            animateTextIntoElement(nextStateContent[0], newTextElement, () => {
                showInputBar();
                displayChoices();
            });
        }, 500);
    }
    
    // Function to toggle the palette without the glitch effect
    function togglePalette() {
        // Toggle the palette
        isPinkPalette = !isPinkPalette;
    
        if (isPinkPalette) {
            document.body.classList.remove('blue-palette');
            document.body.classList.add('pink-palette');
        } else {
            document.body.classList.remove('pink-palette');
            document.body.classList.add('blue-palette');
        }
    
        // Remove the glitchy transition class after the effect
        document.body.classList.remove('glitchy-transition');
    
        // Save the palette choice
        localStorage.setItem('isPinkPalette', JSON.stringify(isPinkPalette));
    } 

    function updateAnimationSpeedDisplay() { // Moderately chatGPT assisted
        const speed = animationSpeeds[currentSpeedIndex];
        currentSpeedElement.textContent = speed;

        if (speed === 'Normal') {
            speedHintElement.textContent = 'Hold SPACE to speed up an animation\nPress ENTER to skip an animation';
        } else if (speed === 'Fast') {
            speedHintElement.textContent = 'Press ENTER to skip an animation';
        } else if (speed === 'None') {
            speedHintElement.textContent = '';
        }
    }
    // Event listeners for animation speed control --> Heavily chatGPT assisted
    document.getElementById('prevSpeed').addEventListener('click', () => {
        currentSpeedIndex = (currentSpeedIndex - 1 + animationSpeeds.length) % animationSpeeds.length;
        updateAnimationSpeedDisplay();
        localStorage.setItem('animationSpeed', animationSpeeds[currentSpeedIndex]);
    });

    document.getElementById('nextSpeed').addEventListener('click', () => {
        currentSpeedIndex = (currentSpeedIndex + 1) % animationSpeeds.length;
        updateAnimationSpeedDisplay();
        localStorage.setItem('animationSpeed', animationSpeeds[currentSpeedIndex]);
    });

    function toggleFlashingImages() { // Moderately chatGPT assisted
        glitchEnabled = !glitchEnabled;
        document.getElementById('flashingToggle').textContent = glitchEnabled ? "On" : "Off";
        localStorage.setItem('glitchEnabled', JSON.stringify(glitchEnabled));
    }
    // Event listener to the "Flashing Images" button
    document.getElementById('flashingToggle').addEventListener('click', toggleFlashingImages);

    // Function to toggle better readability mode
    function toggleBetterReadability() {
        betterReadabilityEnabled = !betterReadabilityEnabled;
        if (betterReadabilityEnabled) {
            document.body.classList.add('better-readability');
            document.getElementById('betterReadabilityToggle').textContent = "On";
        } else {
            document.body.classList.remove('better-readability');
            document.getElementById('betterReadabilityToggle').textContent = "Off";
        }
        localStorage.setItem('betterReadabilityEnabled', JSON.stringify(betterReadabilityEnabled));
    }
    // Event listener for the "Better Readability" button
    document.getElementById('betterReadabilityToggle').addEventListener('click', toggleBetterReadability);
    
    // chatGPT assisted code to glitch the code
    function startRandomGlitches() {
        const randomDelay = Math.random() * 5000 + 2000; // Random delay between 2 to 7 seconds
        setTimeout(() => {
            logo.classList.add('glitch-active');
        
            setTimeout(() => {
                logo.classList.remove('glitch-active');
            }, 300); // Match the duration of the glitch animation
            startRandomGlitches(); // Schedule the next glitch
        }, randomDelay);
    }
    startRandomGlitches();

    playerInput.addEventListener('input', updateChoices);

    playerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !animationInProgress) {
            checkPlayerChoice();
        }
    });    
});    