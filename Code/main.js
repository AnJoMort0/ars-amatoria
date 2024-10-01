import { storyStates, getOriginalStoryStates } from './story.js';
// Store the initial copy of storyStates
let currentStoryStates = JSON.parse(JSON.stringify(storyStates));
import { reflections, getReflectionState } from './special_events.js';

document.addEventListener("DOMContentLoaded", () => {
    // GENERAL VALUES
    const DEFAULT_ANIM_SPEED    = 20;       // For the text animation
    const FASTER_ANIM_SPEED     = 5;
    let currentState            = 'intro';  // Starting state is 'intro'
    let animationInProgress     = false;
    let alternate               = false;    // For the text colour

    const glitchSounds          = ['sounds/glitch1.mp3', 'sounds/glitch2.mp3'];
    const typingSound           = new Audio('sounds/type.mp3');
    const bgMusic               = new Audio('sounds/music.mp3');
    const clickSound            = new Audio('sounds/click.wav');

    const MUSIC_DEFAULT_VOL     = 1;
    const SFX_DEFAULT_VOL       = 0.1;
    let musicEnabled            = true;
    let soundEnabled            = true;

    bgMusic.loop                = true;

    // Placeholder texts
    const d = "What do you do?";
    const e = "Press ENTER to rewind!";
    const w = "Walk towards where?";
    const l = "Look at what?";
    const s = "Press ENTER! You will do it!";

    let reflectionIndex = 0;
    if (localStorage.getItem('reflectionIndex')) {
        reflectionIndex = parseInt(localStorage.getItem('reflectionIndex'));
    }

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

    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });

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

    // Music control
    if (localStorage.getItem('musicEnabled')) {
        musicEnabled = JSON.parse(localStorage.getItem('musicEnabled'));
    } else {
        musicEnabled = true;
    }
    if (musicEnabled) {
        bgMusic.volume = MUSIC_DEFAULT_VOL;
        document.getElementById('musicToggle').textContent = 'On';
    } else {
        bgMusic.volume = 0;
        document.getElementById('musicToggle').textContent = 'Off';
    }
    bgMusic.play();

    // Sound control
    if (localStorage.getItem('soundEnabled')) {
        soundEnabled = JSON.parse(localStorage.getItem('soundEnabled'));
    } else {
        soundEnabled = true;
    }
    if (soundEnabled) {
        typingSound.volume = SFX_DEFAULT_VOL;
        document.getElementById('soundToggle').textContent = 'On';
    } else {
        typingSound.volume = 0;
        document.getElementById('soundToggle').textContent = 'Off';
    }
    // Event listeners for music and sound toggles
    document.getElementById('musicToggle').addEventListener('click', toggleMusic);
    document.getElementById('soundToggle').addEventListener('click', toggleSound);

    // Auto-scroll control
    let autoScrollEnabled = true;
    if (localStorage.getItem('autoScrollEnabled')) {
        autoScrollEnabled = JSON.parse(localStorage.getItem('autoScrollEnabled'));
    } else {
        autoScrollEnabled = true;
    }
    document.getElementById('autoScrollToggle').textContent = autoScrollEnabled ? 'On' : 'Off';
    // Event listener for the Auto-Scroll toggle button
    document.getElementById('autoScrollToggle').addEventListener('click', toggleAutoScroll);
    function toggleAutoScroll() {
        autoScrollEnabled = !autoScrollEnabled;
        document.getElementById('autoScrollToggle').textContent = autoScrollEnabled ? 'On' : 'Off';
        localStorage.setItem('autoScrollEnabled', JSON.stringify(autoScrollEnabled));
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
        // Reset currentStoryStates to the original state
        currentStoryStates = getOriginalStoryStates(); // Get a fresh copy of the original storyStates

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

        localStorage.removeItem('reflectionIndex');
        reflectionIndex = 0;

        hideTitleScreen(false); // Pass false to indicate new game
    });

    updateAnimationSpeedDisplay();

    // FUNCTIONS

    function hideTitleScreen(isContinuing) {
        continueButton.disabled     = true;
        newGameButton.disabled      = true;
        titleScreen.classList.add('glitchy-transition');
        titleScreen.classList.add('glitch-active');
        playGlitchSound();
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
            currentState = 'intro';
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
        let isUserScrolling = false;
    
        // Start the sound and loop it until the typing animation finishes
        function startTypingSound() {
            if (!soundEnabled) return;
        
            typingSound.volume = SFX_DEFAULT_VOL;
            typingSound.currentTime = 0;
            typingSound.loop = false; // We will manually restart if needed
            typingSound.play();
        
            typingSound.onended = function() {
                if (animationInProgress) {
                    startTypingSound(); // Restart the sound if the animation is still ongoing
                }
            };
        }
        
        function stopTypingSound() {
            typingSound.pause();
            typingSound.currentTime = 0; // Reset the sound for next use
        }        
    
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
    
        startTypingSound();
    
        // Add scroll event listener to detect user scrolling
        function onUserScroll() {
            if (animationInProgress) {
                isUserScrolling = true; // User has scrolled manually
                container.removeEventListener('scroll', onUserScroll);
            }
        }
        container.addEventListener('scroll', onUserScroll);
    
        function typeNextChar() {
            if (index < text.length && animationInProgress) {
                element.innerHTML += text.charAt(index);
                index++;
                // Scroll to bottom after adding a character if auto-scroll is enabled
                if (autoScrollEnabled) {
                    container.scrollTop = container.scrollHeight;
                }
                setTimeout(typeNextChar, currentAnimSpeed);
            } else {
                // Animation finished
                animationInProgress = false;
                stopTypingSound();
                removeEventListeners();
                // Ensure the container is scrolled to the bottom if auto-scroll is enabled
                if (autoScrollEnabled) {
                    container.scrollTop = container.scrollHeight;
                }
                if (callback) callback();
            }
        }        
    
        // Event listeners to control animation speed
        function onKeyDown(event) {
            if (speedSetting === 'Normal') {
                if (event.key === ' ') {
                    if (!isSpacePressed) {
                        isSpacePressed = true;
                        currentAnimSpeed = FASTER_ANIM_SPEED;
                    }
                    event.preventDefault(); // Prevent scrolling when pressing space
                }
            }
        
            // Skip the animation
            if (event.key === 'Enter') {
                if (animationInProgress) {
                    animationInProgress = false;
                    element.innerHTML += text.slice(index);
                    removeEventListeners();
                    stopTypingSound();
                    // Scroll to bottom if auto-scroll is enabled
                    if (autoScrollEnabled) {
                        container.scrollTop = container.scrollHeight;
                    }
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
        let choices = [...stateContent[1]]; // Copy the original choices

        // Lock certain states behind discovering other states
        if (currentState === 'walk_from_classroom' && unlockedChoices['look_onIntro-look_at_corridor']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'w_cr_r')) {
                storyStates[currentState][1].push(['restroom', 'w_cr_r']);
            }
        }

        choices = [...storyStates[currentState][1]];
    
        if (choices.length === 0) {
            choicesWrapper.classList.add('hidden'); // Hide the choices wrapper if it's a dead end
        } else {
            choicesWrapper.classList.remove('hidden');
    
            // Old dynamic grid columns setting
            // choicesWrapper.style.gridTemplateColumns = `repeat(${choices.length}, 1fr)`;
    
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
            const choiceKey     = `${currentState}-${nextState}`;
            let displayWord     = '';
    
            if (unlockedChoices[choiceKey]) {
                displayWord = choiceWord;
            } else {
                // Uncensor letters present in inputValue, regardless of position
                for (let j = 0; j < choiceWord.length; j++) {
                    const letter = choiceWord[j];
                    if (inputValue.includes(letter.toLowerCase())) {
                        displayWord += letter;
                    } else {
                        displayWord += '-';
                    }
                }
            }
    
            // Update the choice element's display
            choiceElements[i].textContent = displayWord;
    
            // Set the cursor
            if (unlockedChoices[choiceKey] || inputValue === choiceWord.toLowerCase()) {
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
            return; // Do nothing while animation is in progress
        }
    
        const inputValue    = playerInput.value.toLowerCase().trim();
        const stateContent  = storyStates[currentState];
        const choices       = stateContent[1];
    
        // Special handling for the reflection state
        if (currentState === 'reflection') {
            // After the reflection, transition directly to 'intro'
            proceedToNextState('intro');
            return;
        }
    
        // Handle states with placeholders like 'Press ENTER'
        if (choices.length === 0 && (stateContent[2] === e || stateContent[2] === s)) {
            proceedToNextState('intro');
            return;
        }
    
        // Check player's choice if there are options
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

    function proceedToNextState(nextStateName) { // moderately assisted by chatGPT for the color changing and reflections case
        hideInputBar();
    
        container.appendChild(document.createElement('br'));
    
        // Check if the player should enter the reflection state
        if (nextStateName === 'intro' && currentState !== 'reflection') {
            if (Math.random() < 1 / 3) {
                reflectionIndex++; // Increment reflectionIndex to get the next reflection
                localStorage.setItem('reflectionIndex', reflectionIndex);
                nextStateName = 'reflection';  // Transition to the reflection state
            }
        }
    
        if (nextStateName === 'intro' || nextStateName === 'reflection') {
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
                playGlitchSound();
    
                setTimeout(() => {
                    togglePalette();
                }, 1000);
            } else {
                togglePalette();
            }
    
            // Handle the reflection state transition
            if (nextStateName === 'reflection') {
                const reflectionState = getReflectionState(reflectionIndex); // Get the current reflection state
                playerInput.placeholder = reflectionState[2];  // Set the special reflection placeholder
                playerInput.value = ''; // Clear input
                const newTextElement = document.createElement('div');
                newTextElement.classList.add('story-text');
                newTextElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
                container.appendChild(newTextElement);

                // Scroll to bottom if auto-scroll is enabled
                if (autoScrollEnabled) {
                    container.scrollTop = container.scrollHeight;
                }
    
                newTextElement.innerHTML = reflectionState[0]; // Display the reflection text
                currentState = 'reflection';  // Set current state to 'reflection'
                localStorage.setItem('currentState', currentState);
                showInputBar();  // Show the input bar for pressing Enter
    
                return;  // Exit early, skip further logic
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

    function toggleMusic() {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            bgMusic.volume = MUSIC_DEFAULT_VOL;
            document.getElementById('musicToggle').textContent = 'On';
        } else {
            bgMusic.volume = 0;
            document.getElementById('musicToggle').textContent = 'Off';
        }
        localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
    }
    
    function toggleSound() {
        soundEnabled = !soundEnabled;
        clickSound.volume = soundEnabled ? SFX_DEFAULT_VOL : 0;
        if (soundEnabled) {
            typingSound.volume = SFX_DEFAULT_VOL;
            document.getElementById('soundToggle').textContent = 'On';
        } else {
            typingSound.volume = 0;
            document.getElementById('soundToggle').textContent = 'Off';
            typingSound.pause();
        }
        localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
    }

    let canPlayClickSound = true;
    function playClickSound() {
        if (canPlayClickSound) {
            clickSound.currentTime = 0; // Reset the sound to the start
            clickSound.play();
            vibrateDevice(50);
            canPlayClickSound = false;
            setTimeout(() => {
                canPlayClickSound = true; // Allow the sound to be played again after 300ms
            }, 300); // Adjust the delay time as needed
        }
    }

    function playGlitchSound() {
        if (!soundEnabled) return;
    
        const audio = new Audio();
        const randomSound = glitchSounds[Math.floor(Math.random() * glitchSounds.length)];
        audio.src = randomSound;
        audio.volume = SFX_DEFAULT_VOL;
        
        // Set a random playback rate for pitch variation
        audio.playbackRate = Math.random() * 0.2 + 1;
        
        audio.play();

        vibrateDevice([200, 100, 200]);
    }

    function vibrateDevice(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }    

    playerInput.addEventListener('input', updateChoices);

    playerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !animationInProgress) {
            checkPlayerChoice();
        }
    });    
});    