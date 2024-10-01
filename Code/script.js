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

    const reflections = [
        "Something feels off. Why am I doing this?",
        "This feels wrong. But I have to keep trying, right?",
        "Should I keep going? There has to be a better way.",
        "How can I do such a thing? Am I turning into one of those guys?",
        "She doesn’t deserve this. No one does. I should stop… but what if the next time is different?",
        "This isn’t me. I just need to find the right approach. That’s all.",
        "Why isn’t this working? I’ve done everything right!",
        "Maybe… maybe I’m not the problem here. Maybe she’s the one who doesn’t see what we could be.",
        "I hate this. I hate the way I feel, but I can’t stop. What’s wrong with me?",
        "It’s not supposed to be like this. Why can’t I just get it right? Why can’t she see me?",
        "What if I’m making it worse? What if every time I reset, I lose another piece of myself?",
        "This isn’t about her anymore, is it? It’s about proving that I can do it.",
        "I don’t want to hurt her, but I’m running out of options. I’ll just try one more time.",
        "She’s laughing again… like I’m a joke. Is that what I am now? A joke?",
        "I hate myself for doing this. But what else can I do? Walk away?",
        "I should let her go. I should. But I’m too deep in this now.",
        "Every time I try, I lose a little more of her. Of me. Why am I still pushing?",
        "I’m better than this. I deserve more than this humiliation.",
        "Maybe she wants me to fail. Maybe she gets some sick pleasure out of it.",
        "How many times do I have to do this before she finally understands? We’re meant to be together.",
        "This fucking girl. Why doesn’t she get it? I’m the one who’s right for her!",
        "It’s like she’s trying to make me fail. Maybe she likes seeing me suffer.",
        "I’ve come too far to give up now. I’m not the one who’s wrong here.",
        "This is all just a game to her, isn’t it? Well, I can play games too.",
        "She’s just another obstacle. I’ll get past her like I’ve done before.",
        "Maybe if she knew what I’ve been through, she’d stop playing hard to get.",
        "I fucking hate this. But I hate losing more. I can’t lose again.",
        "Why can’t she see that I’m the one she needs? I’m the one who’s been here, trying again and again.",
        "Am I going crazy? Or is it her? Maybe it’s both of us.",
        "This isn’t about love anymore. It’s about winning.",
        "She owes me this. After everything I’ve done… everything I’ve tried.",
        "I didn’t come this far just to walk away empty-handed.",
        "I hate her. I hate what she’s turned me into. But I can’t stop. I won’t stop.",
        "She has no idea what I’m capable of. I’ll show her.",
        "I could break her if I wanted to. She wouldn’t stand a chance.",
        "She thinks she can just walk away from me? Not this time.",
        "I’ll fucking tear down her whole world if she keeps this up.",
        "She’s mine. She just doesn’t know it yet.",
        "One way or another, I’ll get what I deserve. She can’t hide from me.",
        "I’ll make her beg for me. She’ll wish she’d given in sooner.",
        "She’s a fucking puppet. And I’m the one pulling the strings.",
        "I’ll crush her resistance. She’ll have no choice but to fall for me.",
        "I want to see her break. I want her to know she lost.",
        "I could ruin her in an instant. It would be so easy.",
        "If she keeps pushing me, I won’t be responsible for what happens.",
        "She’s pushing me to the edge. And when I snap, she’ll regret it.",
        "I could hurt her. I want to hurt her. And I don’t care anymore.",
        "Why should I be the one who’s suffering? It’s her turn to feel the pain.",
        "She’ll wish she’d never met me. By the time I’m done, she’ll regret everything.",
        "I’ll fucking destroy everything she cares about if that’s what it takes.",
        "There’s a part of me that wants to make her pay. And I’m so close to letting it loose.",
        "What’s stopping me from making her suffer? Nothing. Nothing.",
        "She can run, but she can’t escape me. I’ll always be right behind her.",
        "I don’t care if she screams. It’s music to my ears.",
        "She’s not just a girl anymore. She’s my possession.",
        "Why does this hurt so much? I just want her to see me the way I see her.",
        "I’m not giving up. Not now. Not ever. We’re supposed to be together.",
        "I’ve lost track of how many times I’ve done this. But every time, I get a little closer.",
        "She doesn’t have a choice anymore. I’ll make her see.",
        "Maybe this isn’t love. Maybe this is something darker… but it doesn’t matter anymore.",
        "I hate myself for what I’ve become. But I can’t go back. Not after all of this.",
        "What am I doing? What have I done? Is this even about her anymore?",
        "I’m stuck in this loop. But the worst part? I don’t want it to end.",
        "She doesn’t know how lucky she is to have me trying this hard.",
        "I’ll make her love me. Even if it kills me.",
        "This isn’t who I wanted to be. But it’s who I am now.",
        "I’m starting to think I don’t deserve her. But she sure as hell doesn’t deserve me.",
        "There’s no turning back. I’m too far gone now.",
        "She’ll see. One way or another, she’ll have to see.",
        "I should’ve given up a long time ago. But giving up? That’s for losers.",
        "Maybe I’ll never get it right. But I’d rather die trying than walk away.",
        "It doesn’t matter what it takes anymore. I’ll do whatever I have to.",
    ];
    let reflectionIndex = 0;
    if (localStorage.getItem('reflectionIndex')) {
        reflectionIndex = parseInt(localStorage.getItem('reflectionIndex'));
    }

    // Dynamic reflection state generator
    function getReflectionState() {
        const reflectionText = reflections[reflectionIndex % reflections.length];
        return [
            reflectionText, 
            [],
            s
        ];
    }


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
                ['wait', 'wait_on_intro'],
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

        'reflection': getReflectionState()
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
                stopTypingSound();
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
    
        const unlockedChoicesCount = Object.keys(unlockedChoices).length;
    
        // Check if the player should enter the reflection state
        if (nextStateName === 'intro' && unlockedChoicesCount % 5 === 0 && unlockedChoicesCount !== 0 && currentState !== 'reflection') {
            reflectionIndex++;
            localStorage.setItem('reflectionIndex', reflectionIndex);
            nextStateName = 'reflection';  // Transition to the reflection state
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
                const reflectionState = getReflectionState(); // Get the current reflection state
                playerInput.placeholder = reflectionState[2];  // Set the special reflection placeholder
                playerInput.value = ''; // Clear input
                const newTextElement = document.createElement('div');
                newTextElement.classList.add('story-text');
                newTextElement.classList.add(alternate ? 'text-alternate-1' : 'text-alternate-2');
                container.appendChild(newTextElement);
                
                newTextElement.innerHTML = reflectionState[0]; // No typing, just display the reflection
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

    function playGlitchSound() {
        if (!soundEnabled) return;
    
        const audio = new Audio();
        const randomSound = glitchSounds[Math.floor(Math.random() * glitchSounds.length)];
        audio.src = randomSound;
        audio.volume = SFX_DEFAULT_VOL;
        
        // Set a random playback rate for pitch variation
        audio.playbackRate = Math.random() * 0.2 + 1;
        
        audio.play();
    }    

    playerInput.addEventListener('input', updateChoices);

    playerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !animationInProgress) {
            checkPlayerChoice();
        }
    });    
});    