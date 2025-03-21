import { storyStates, getOriginalStoryStates } from './story.js';
// Store the initial copy of storyStates
let currentStoryStates = JSON.parse(JSON.stringify(storyStates));
import { reflections, getReflectionState } from './reflections.js';

document.addEventListener("DOMContentLoaded", () => {
    // GENERAL VALUES
    const DEFAULT_ANIM_SPEED    = 20;       // For the text animation
    const FASTER_ANIM_SPEED     = 5;
    let currentState            = 'intro';  // Starting state is 'intro'
    let animationInProgress     = false;
    let alternate               = false;    // For the text colour
    let isFirstInput            = true;     // For the final glitch hints

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

    // Reflexion messages controls
    let reflectionIndex = 0;
    if (localStorage.getItem('reflectionIndex')) {
        reflectionIndex = parseInt(localStorage.getItem('reflectionIndex'));
    }

    // Easter eggs triggers
    const easterEggs = {
        "walk": { 
            state: "w_cr_r", 
            target: "ee1", 
            requiredStates: ["cr_approach"],
        },
        "smile": { 
            state: "intro", 
            target: "ee2", 
            requiredStates: [],
        },
        "wait": { 
            state: "cr_approach", 
            target: "ee3", 
            requiredStates: [],
        }
    };
    
    // Get references to elements
    // Title Screen
    const titleScreen       = document.getElementById('titleScreen');
    const logo              = document.getElementById('titleLogo');
    const continueButton    = document.getElementById('continueButton');
    const newGameButton     = document.getElementById('newGameButton');
    const historyButton     = document.getElementById('rewindHistoryButton');
    const aboutButton       = document.getElementById("about-button");
    const aboutPopup        = document.getElementById("about-popup");

    // Rewind History Elements
    const rewindContainer      = document.getElementById('rewindContent');
    const rewindList           = document.getElementById('rewindList');
    const mainMenuButton       = document.getElementById('mainMenuButton');

    //Game Elements
    const mainContent   = document.getElementById('mainContent');
    const container     = document.getElementById('container');
    const scrollArrow   = document.getElementById('scrollToBottom');
    const playerInput   = document.getElementById('playerInput');
    const inputBar      = document.getElementById('inputBar');

    const currentSpeedElement   = document.getElementById('currentSpeed');
    const speedHintElement      = document.getElementById('speedHint');

    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });

    mainMenuButton.addEventListener('click', () => {playClickSound(); window.location.reload()});

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

    // Check if there are visitedStates
    let visitedStates   = {};
    let unlockedStates  = {};

    // Load visitedStates from localStorage if available
    if (localStorage.getItem('visitedStates')) {
        visitedStates = JSON.parse(localStorage.getItem('visitedStates'));
    }
    if (localStorage.getItem('unlockedStates')) {
        unlockedStates = JSON.parse(localStorage.getItem('unlockedStates'));
    }

    // Disable the "Continue" button if no states have been visited yet
    if (Object.keys(visitedStates).length > 0) {
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

        clearGameData();
        
        isPinkPalette = true;
        localStorage.setItem('isPinkPalette', JSON.stringify(isPinkPalette));

        // Remove the palette classes and add pink-palette
        document.body.classList.remove('blue-palette', 'pink-palette');
        document.body.classList.add('pink-palette');

        currentState = 'intro';
        localStorage.setItem('currentState', currentState);

        hideTitleScreen(false); // Pass false to indicate new game
    });

    historyButton.addEventListener('click', () => {
        hideTitleScreen(false, true);
    });

    aboutButton.addEventListener("click", () => {
        aboutPopup.classList.add("visible");
    });
    // Close pop-up when clicking anywhere on the screen or pressing a key
    document.addEventListener("click", (event) => {
        if (aboutPopup.classList.contains("visible") && !aboutPopup.contains(event.target) && event.target !== aboutButton) {
            aboutPopup.classList.remove("visible");
        }
    });
    document.addEventListener("keydown", () => {
        if (aboutPopup.classList.contains("visible")) {
            aboutPopup.classList.remove("visible");
        }
    });


    // Scroll down button - Moderately chatGPT assisted
    function updateScrollArrow() {
        if (container.scrollHeight - container.scrollTop > container.clientHeight + 30) {
            scrollArrow.classList.add('visible');
        } else {
            scrollArrow.classList.remove('visible');
        }
        requestAnimationFrame(updateScrollArrow);
    }
    requestAnimationFrame(updateScrollArrow);

    scrollArrow.addEventListener('click', () => {
        let scrollTarget    = container.scrollHeight;
        let scrollSpeed     = 5;
        let isScrolling     = true; // This is essential to prevent this from getting stuck in a loop
    
        function smoothScrollDown() {
            if (!isScrolling) return; // Stop scrolling when interrupted
    
            let currentScroll = container.scrollTop;
            let remainingDistance = scrollTarget - currentScroll;
    
            if (remainingDistance > 1) {
                let step = Math.max(remainingDistance * 0.1, 2); // Exponential decay
                container.scrollTop += step;
                requestAnimationFrame(smoothScrollDown);
            } else {
                container.scrollTop = scrollTarget; // Snap to bottom
                isScrolling = false; // Stop loop
            }
        }
    
        // Allow manual scrolling interruption
        container.addEventListener("wheel", () => { isScrolling = false; });
        container.addEventListener("touchmove", () => { isScrolling = false; });
        container.addEventListener("keydown", (event) => { if (event.key === "ArrowUp" || event.key === "PageUp") isScrolling = false; });
    
        smoothScrollDown();
    });

    updateAnimationSpeedDisplay();

    // FUNCTIONS

    function clearGameData() {
        localStorage.removeItem('currentState');
        localStorage.removeItem('visitedStates')
        visitedStates   = {};
        localStorage.removeItem('reflectionIndex');
        reflectionIndex = 0;
    }

    function hideTitleScreen(isContinuing, isHistory = false) {
        continueButton.disabled     = true;
        newGameButton.disabled      = true;
        historyButton.disabled      = true;
        titleScreen.classList.add('glitchy-transition');
        titleScreen.classList.add('glitch-active');
        playGlitchSound();

        setTimeout(() => {
            titleScreen.classList.remove('glitchy-transition');
            titleScreen.classList.remove('glitch-active');
            
            titleScreen.style.display = 'none';
    
            // If the user wants to see the Rewind History
            if (isHistory) {
                rewindContainer.style.display = 'grid';
                showRewindHistory();
            } else {
                mainContent.style.display = 'flex';
                startGame(isContinuing);
            }
        }, 1000);
    }
    function showRewindHistory() {
        rewindList.innerHTML  = ''; // Clear the history view

        Object.keys(storyStates).forEach((state) => {
            const stateContent = storyStates[state];

            // Skip easter egg states unless they are unlocked
            if (state.startsWith("ee") && !unlockedStates[state]) {
                return; // Do not add undiscovered easter eggs to history
            }

            // Check if the state has the history format
            if (stateContent.length > 3) {
                const [title, action, description] = stateContent[3];
                let actionDisplay = action;
                let descriptionDisplay = description;
    
                // Censor if state hasn't been visited
                const isLocked = !unlockedStates[state];
                if (isLocked) {
                    actionDisplay       = '-'.repeat(action.length);
                    descriptionDisplay  = '-'.repeat(description.length);
                }
    
                // Create a history item for each path
                const historyItem = document.createElement('div');
                historyItem.classList.add('history-item');
                
                if (isLocked) {
                    historyItem.classList.add('locked');
                }
    
                historyItem.innerHTML = `
                    <strong>${title}</strong>
                    <em>${actionDisplay}</em>
                    <p>${descriptionDisplay}</p>
                `;
    
                // Special colors for easter eggs and "the_end"
                if (state === 'the_end') {
                    historyItem.style.color = 'lime';
                } else if (title.toLowerCase().includes('easter')) {
                    historyItem.style.color = 'gold';
                }

                rewindList.appendChild(historyItem);
            }
        });

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

        setTimeout(() => {
            container.scrollTop = container.scrollHeight; // nudge down even when the autoscroll is off so that it becomes easier to understand the text is being written
        }, 100);
    
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
            if (callback) callback();
            return;
        }
    
        startTypingSound();
    
        function typeNextChar() {
            if (index < text.length && animationInProgress) {
                element.innerHTML += text.charAt(index);
                index++;
                // Scroll to bottom after adding a character if auto-scroll is enabled
                if (autoScrollEnabled) {
                    container.scrollTop += 7;
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
        
        /*
        //This was to make the text go down when the input bar disappears, but it was actually not that good looking and made reading more difficult
        const container = document.querySelector('.container');

        container.classList.remove('expanded');*/

        setTimeout(() => {
            if (autoScrollEnabled) {
                container.scrollTop = container.scrollHeight + 100;
            }
        }, 500);
    }    
    function hideInputBar() {
        inputBar.classList.remove('show');
        playerInput.disabled = true; // Disable input field
        playerInput.blur(); // Remove focus from the input field
        
        /*
        //This was to make the text go down when the input bar disappears, but it was actually not that good looking and made reading more difficult
        const container = document.querySelector('.container');
        container.classList.add('expanded');

        // Force reflow to immediately apply new height --> ChatGPT assisted
        container.style.height = "100vh"; 
        container.offsetHeight; // Forces the browser to recognize the change

        // Scroll to bottom instantly when hiding input bar
        container.scrollTop = container.scrollHeight; */
    }    

    function displayChoices() { // Lightly chatGPT assisted, mostly for the localStorage saved choices
        const choicesWrapper        = document.getElementById('choicesWrapper');
        choicesWrapper.innerHTML    = ''; // Clear previous choices
        const stateContent          = storyStates[currentState];
        let choices = [...stateContent[1]]; // Copy the original choices

        // Lock certain states behind discovering other states
        if (currentState === 'walk_on_intro'
            && visitedStates['look_at_corridor']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'w_cr_r')) {
                storyStates[currentState][1].push(['restroom', 'w_cr_r']);
            }
        }
        if (currentState === 'walk_on_intro'
            && (visitedStates['look_at_girl']
            || visitedStates['stare_on_intro'])) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'w_cr_friends')) {
                storyStates[currentState][1].push(['friends', 'w_cr_friends']);
            }
        }
        if (currentState === 'look_on_intro'
            && (visitedStates['look_at_girl']
            || visitedStates['stare_on_intro'])) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'look_at_friends')) {
                storyStates[currentState][1].push(['friends', 'look_at_friends']);
            }
        }
        if (currentState === 'walk_on_intro'
            && (visitedStates['cr_approach']
            || visitedStates['gr_smile'])) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'w_cr_outside')) {
                storyStates[currentState][1].push(['outside', 'w_cr_outside']);
            }
        }
        if (currentState === 'w_cr_r'
            && (visitedStates['cr_approach']
            || visitedStates['gr_smile'])
            && visitedStates['cr_confess']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'cr_confess_alt')) {
                storyStates[currentState][1].push(['confess', 'cr_confess_alt']);
            }
        }
        if (currentState === 'intro'
            && (visitedStates['cr_approach']
            || visitedStates['gr_smile'])) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'scream_on_intro')) {
                storyStates[currentState][1].push(['scream', 'scream_on_intro']);
            }
        }
        if ((currentState === 'intro' || currentState === 'look_at_floor' || currentState === 'look_at_girl' || currentState === 'look_at_corridor' || currentState === 'look_at_jackson')
            && visitedStates['talk_on_intro']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'talk_again')) {
                storyStates[currentState][1].push(['talk', 'talk_again']);
            }
        }
        if (currentState === 'look_on_intro'
            && visitedStates['wait_on_intro']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'look_at_jackson')) {
                storyStates[currentState][1].push(['Jackson', 'look_at_jackson']);
            }
        }
        if (currentState === 'cr_approach'
            && visitedStates['cr_hide']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'ex_gossip')) {
                storyStates[currentState][1].push(['gossip', 'ex_gossip']);
            }
        }
        if (currentState === 'wave_on_look'
            && visitedStates['cr_approach']
            && visitedStates['gr_smile']
            && visitedStates['gr_joke']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'gr_cry')) {
                storyStates[currentState][1].push(['cry', 'gr_cry']);
            }
        }
        if (currentState === 'walk_on_intro'
            && visitedStates['wait_on_intro'] 
            && visitedStates['ex_stop'] 
            && visitedStates['ex_touch'] 
            && visitedStates['ex_recall'] 
            && visitedStates['ex_compliment']
            && visitedStates['ex_gossip']) {
            if (!storyStates[currentState][1].some(choice => choice[1] === 'final')) {
                storyStates[currentState][1].push(['Jackson', 'final']);
            }
        }
        
        // Remove certain states if they have already been explored
        if (visitedStates['talk_on_intro']) {
            storyStates['intro'][1]             = storyStates['intro'][1].filter(choice             => choice[1] !== 'talk_on_intro');
            storyStates['look_at_floor'][1]     = storyStates['look_at_floor'][1].filter(choice     => choice[1] !== 'talk_on_intro');
            storyStates['look_at_girl'][1]      = storyStates['look_at_girl'][1].filter(choice      => choice[1] !== 'talk_on_intro');
            storyStates['look_at_corridor'][1]  = storyStates['look_at_corridor'][1].filter(choice  => choice[1] !== 'talk_on_intro');
            storyStates['look_at_jackson'][1]   = storyStates['look_at_jackson'][1].filter(choice   => choice[1] !== 'talk_on_intro');
        }
        if (visitedStates['cr_confess'] && (visitedStates['cr_approach'] || visitedStates['gr_smile'])) {
            storyStates['w_cr_r'][1]            = storyStates['w_cr_r'][1].filter(choice            => choice[1] !== 'cr_confess');
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
                const isUnlocked    = visitedStates[nextState]; // Check if the state has been visited
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

        if (currentState === 'final') { // Glitchy effect to hint towards the end - lightly chatGPT assisted
            if (isFirstInput) {
                // If this is the first input, trigger the glitch effect
                isFirstInput = false;  // Set the flag so the glitch only happens once
                document.body.classList.add('glitchy-transition');
                playGlitchSound();
                setTimeout(() => {
                    document.body.classList.remove('glitchy-transition');
                }, 500);
            } else if (inputValue.includes('s') || inputValue.includes('t') || inputValue.includes('o') || inputValue.includes('p')) {
                // If the first letter typed is 'S', 'T', 'O', or 'P', trigger a glitch effect
                document.body.classList.add('glitchy-transition');
                playGlitchSound();
                setTimeout(() => {
                    document.body.classList.remove('glitchy-transition');
                }, 500);
            }
        }

        for (const word in easterEggs) { // Input bar highlights for easter eggs
            const egg = easterEggs[word];
            // Check if the word matches, the current state is correct, and ALL required states were visited
            if (inputValue === word && currentState === egg.state && egg.requiredStates.every(state => visitedStates[state])) {
                playerInput.classList.add("golden");
                return;
            }
        }
        playerInput.classList.remove("golden");
    
        if (choices.length === 0) {
            return;
        }
    
        const choiceElements = document.querySelectorAll('.choices-container');
    
        choices.forEach((choice, i) => {
            const choiceWord    = choice[0];
            const nextState     = choice[1];
            let displayWord     = '';
    
            if (visitedStates[nextState]) {
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
    
            // Set the cursor based on input matching the full choiceWord
            if (inputValue === choiceWord.toLowerCase() || visitedStates[nextState]) {
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

            choiceElement.addEventListener('click', () => {
                const inputValue = playerInput.value.toLowerCase().trim();
    
                if (visitedStates[nextState] || inputValue === choiceWord.toLowerCase()) {
                    // Unlock the choice
                    if (!visitedStates[nextState]) {
                        visitedStates[nextState] = true;
                        localStorage.setItem('visitedStates', JSON.stringify(visitedStates));
                    }
                    if (!unlockedStates[nextState]) {
                        unlockedStates[nextState] = true;
                        localStorage.setItem('unlockedStates', JSON.stringify(unlockedStates));
                    }
                    proceedToNextState(nextState);
                }
            });
        });
    } 

    function checkPlayerChoice() { // Lightly chatGPT assisted, mostly for the localStorage saved choices
        
        if (animationInProgress) {
            return; // Do nothing while animation is in progress
        }
    
        const inputValue    = playerInput.value.toLowerCase().trim();
        const stateContent  = storyStates[currentState];
        const choices       = stateContent[1];

        // Trigger easter-egg
        for (const word in easterEggs) {
            const egg = easterEggs[word];
    
            if (inputValue === word && currentState === egg.state && egg.requiredStates.every(state => visitedStates[state])) {
                proceedToNextState(egg.target);
                return;
            }
        }

        // If the current state is 'final'
        if (currentState === 'final') {
            if (!inputValue.includes('s') && !inputValue.includes('t') && !inputValue.includes('o') && !inputValue.includes('p')) {
                playerInput.value = '';
                document.body.classList.add('glitchy-transition');
                playGlitchSound();
                setTimeout(() => {
                    document.body.classList.remove('glitchy-transition');
                }, 500);
            }
            if (inputValue === '') {
                // If Enter is pressed with no input, go back to 'intro'
                proceedToNextState('intro');
            } else if (inputValue === 'stop') {
                // If the player types "stop" and presses Enter, go to 'the_end'
                proceedToNextState('the_end');
            }
            return;
        }
    
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
    
            if (inputValue === choiceWord) {
                proceedToNextState(nextState);
                return;
            }
        }
    }        

    function proceedToNextState(nextStateName) { // moderately assisted by chatGPT for the color changing and reflections case

        if (!visitedStates[nextStateName]) {
            visitedStates[nextStateName] = true;
            localStorage.setItem('visitedStates', JSON.stringify(visitedStates));
        }
        if (!unlockedStates[nextStateName]) {
            unlockedStates[nextStateName] = true;
            localStorage.setItem('unlockedStates', JSON.stringify(unlockedStates));
        }

        if (nextStateName === 'the_end') {
            // Hide the input bar entirely
            inputBar.style.display = 'none';
        }

        if (nextStateName === 'final') {
            isFirstInput = true;  // Reset this flag when entering 'final' it is important for the hints
        }
        
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
    
        // Palette changes for eastereggs
        playerInput.classList.remove("golden");
        // Check if the state starts with "ee" (for Easter Eggs)
        if (nextStateName.startsWith("ee")) {
            document.body.classList.remove('pink-palette', 'blue-palette');
            document.body.classList.add('gold-palette');

            if (glitchEnabled) {
                document.body.classList.add('glitchy-transition');
                playGlitchSound();
    
                setTimeout(() => {
                    document.body.classList.remove('glitchy-transition');
                }, 1000);
            }
        } else if (currentState.startsWith("ee")) {
            // Revert to the previous palette if leaving an easter egg
            document.body.classList.remove('gold-palette');
            if (isPinkPalette) {
                document.body.classList.add('pink-palette');
            } else {
                document.body.classList.add('blue-palette');
            }

            if (glitchEnabled) {
                document.body.classList.add('glitchy-transition');
                playGlitchSound();
    
                setTimeout(() => {
                    document.body.classList.remove('glitchy-transition');
                }, 1000);
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
    
        } else if(nextStateName === 'the_end') {
            container.innerHTML = '';   // Clear the story container

            document.documentElement.style.setProperty('--final-background-color', '#4a5333');
            document.documentElement.style.setProperty('--final-accent-color', '#6c8365');
            document.documentElement.style.setProperty('--final-text-color', '#e6e8e6');

            if (glitchEnabled) {
                document.body.classList.add('glitchy-transition');
                playGlitchSound();
    
                setTimeout(() => {
                    if (isPinkPalette) {
                        document.body.classList.remove('blue-palette');
                        document.body.classList.add('calm-palette');
                    } else {
                        document.body.classList.remove('pink-palette');
                        document.body.classList.add('calm-palette');
                    }
                }, 500);
            } else {
                if (isPinkPalette) {
                    document.body.classList.remove('blue-palette');
                    document.body.classList.add('calm-palette');
                } else {
                    document.body.classList.remove('pink-palette');
                    document.body.classList.add('calm-palette');
                }
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

    document.addEventListener("keydown", (e) => {
        if (currentState === 'the_end' && e.key === 'Enter' && !animationInProgress) {
            triggerFadeToBlack();
        }
    });
    
    function triggerFadeToBlack() {
        const fadeScreen = document.getElementById('fadeScreen');
        
        // Start the fade
        fadeScreen.style.opacity = '1';
    
        // After the fade, clear the local storage and return to main menu
        setTimeout(() => {
            clearGameData();
            window.location.reload();
        }, 5000); // Match the fade-out duration
    }

    playerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !animationInProgress) {
            checkPlayerChoice();
        }
    });
});    