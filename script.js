let username = '';
let noClickCount = 0;
let isMusicPlaying = false;
let unlockedGifts = false;

// Accepted names (case insensitive)
const acceptedNames = ['sam', 'samantha'];

// SECRET REDEEM CODES (you can change these!)
const redeemCodes = [
    'IMSORRY',
    'PURPLE',
    '143',
    'IMSOSORRY',
    '2026'
];

// Troll messages and reactions for each "No" click
const trollStages = [
    {
        message: 'Hehe, catch me if you can! 😼',
        catReaction: 'shake'
    },
    {
        message: 'Not so fast, meow~ 😸',
        catReaction: 'jump'
    },
    {
        message: 'Nope! Try again! 🐾',
        catReaction: 'spin'
    },
    {
        message: 'Getting smaller now... 😹',
        catReaction: 'shake'
    },
    {
        message: 'Poof! The button is gone! Just say yes already! 💕',
        catReaction: 'jump'
    }
];

// Initialize floating background elements
function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    const elements = ['🐾', '💜', '✨', '💝', '🌟'];
    
    for (let i = 0; i < 15; i++) {
        const elem = document.createElement('div');
        elem.className = 'floating-element';
        elem.textContent = elements[Math.floor(Math.random() * elements.length)];
        elem.style.left = Math.random() * 100 + '%';
        elem.style.animationDelay = Math.random() * 10 + 's';
        elem.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(elem);
    }
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Audio play failed:', e));
}

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    
    if (isMusicPlaying) {
        music.pause();
        toggle.textContent = '🔇';
        toggle.classList.remove('playing');
        isMusicPlaying = false;
    } else {
        music.play().catch(e => console.log('Music play failed:', e));
        toggle.textContent = '🔊';
        toggle.classList.add('playing');
        isMusicPlaying = true;
    }
}

function startGame() {
    const input = document.getElementById('nameInput').value.trim();
    const errorMsg = document.getElementById('errorMessage');
    const inputField = document.getElementById('nameInput');
    
    if (input === '') {
        inputField.classList.add('error');
        errorMsg.textContent = 'Please enter your name, meow!';
        triggerCatReaction('loginCat', 'shake');
        playSound('meowSound');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }

    // Check if name is accepted
    if (!acceptedNames.includes(input.toLowerCase())) {
        inputField.classList.add('error');
        errorMsg.textContent = 'Please use your real name 🥹';
        triggerCatReaction('loginCat', 'shake');
        playSound('meowSound');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }

    username = input;
    errorMsg.textContent = '';
    playSound('clickSound');
    showScreen('questionScreen');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function handleNoClick() {
    const btn = document.getElementById('noBtn');
    const container = btn.parentElement;
    
    playSound('clickSound');
    
    if (noClickCount < trollStages.length) {
        const stage = trollStages[noClickCount];
        
        // Update message
        document.getElementById('questionText').textContent = stage.message;
        
        // Trigger cat reaction
        triggerCatReaction('questionCat', stage.catReaction);
        
        // Handle button behavior based on stage
        if (noClickCount < 3) {
            // Stages 1-3: Button moves around
            escapeButton(btn, container);
        } else if (noClickCount === 3) {
            // Stage 4: Button shrinks
            btn.classList.add('shrinking');
        } else if (noClickCount === 4) {
            // Stage 5: Button disappears
            btn.classList.add('hidden');
        }
        
        noClickCount++;
    }
}

function escapeButton(btn, container) {
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - btn.offsetWidth - 20;
    const maxY = containerRect.height - btn.offsetHeight - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
}

function triggerCatReaction(catId, reactionType) {
    const cat = document.getElementById(catId);
    cat.classList.add(reactionType);
    setTimeout(() => {
        cat.classList.remove(reactionType);
    }, 600);
}

function selectYes() {
    playSound('successSound');
    triggerCatReaction('questionCat', 'spin');
    
    // Show music toggle button and auto-play music immediately
    document.getElementById('musicToggle').classList.add('active');
    const music = document.getElementById('bgMusic');
    music.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('musicToggle').textContent = '🔊';
        document.getElementById('musicToggle').classList.add('playing');
    }).catch(e => {
        console.log('Auto-play failed, user interaction needed:', e);
    });
    
    setTimeout(() => {
        showScreen('redeemScreen');
    }, 400);
}

// Check Redeem Code
function checkRedeemCode() {
    const input = document.getElementById('redeemInput').value.trim().toUpperCase();
    const errorMsg = document.getElementById('redeemError');
    const inputField = document.getElementById('redeemInput');
    
    if (input === '') {
        inputField.classList.add('error');
        errorMsg.textContent = 'Please enter a code! 🎁';
        triggerCatReaction('redeemCat', 'shake');
        playSound('meowSound');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }
    
    // Check if code is valid
    if (redeemCodes.includes(input)) {
        // CORRECT CODE!
        unlockedGifts = true;
        playSound('successSound');
        triggerCatReaction('redeemCat', 'spin');
        inputField.classList.add('code-success');
        errorMsg.style.color = '#32CD32';
        errorMsg.textContent = '✅ Code accepted! Unlocking gifts... 🎁✨';
        
        // Create confetti
        createConfetti();
        
        setTimeout(() => {
            showScreen('happyScreen');
            startHeartRain();
            typeMessage();
        }, 2000);
    } else {
        // WRONG CODE
        inputField.classList.add('error');
        errorMsg.textContent = 'Invalid code! Try again 🥹';
        triggerCatReaction('redeemCat', 'shake');
        playSound('meowSound');
        setTimeout(() => {
            inputField.classList.remove('error');
            errorMsg.textContent = '';
        }, 2000);
    }
}

// Skip redeem
function skipRedeem() {
    playSound('clickSound');
    showScreen('happyScreen');
    startHeartRain();
    typeMessage();
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#c9a7eb', '#ffc6ff', '#ffadad', '#ffd6a5', '#a0c4ff'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                animation: confettiFall 4s linear forwards;
                z-index: 9999;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 20);
    }
}

function typeMessage() {
    const messages = unlockedGifts ? [
        // IF CODE WAS USED - Special message
        `Dear ${username},`,
        '',
        '🎉 You unlocked the secret gifts! 🎁',
        '',
        'Naalala ko pa \'yung sinabi ko dati, na kapag nagkita ulit tayo,',
        'may ibibigay akong regalo.',
        '',
        'Matagal na rin mula noong huling nagkausap tayo,',
        'at aaminin ko, ako \'yung nagkamali nahihiya kasi ako,',
        'kaya lumayo na lang.',
        '',
        'Kung may pagkakataon na parang iniwasan kita',
        'o naging awkward ako, sorry ha.',
        '',
        'Matagal na talaga ako may gift nahihiya lang ako',
        'na ibigay sayo.',
        '',
        'Pero ngayon, gusto ko lang tuparin \'yung promise ko noon.',
        'At ipakita ang dignity ko.',
        '',
        'May 3 gift ako sayo, pero sana ma-appreciate mo',
        'at mapatawad ako.',
        '',
        'Your kindness makes the world brighter,',
        'and I\'m so grateful to have you in my life.',
        '',
        'This little gift is my way of saying:',
        'You matter. You\'re appreciated. You\'re loved.',
        '',
        '✨ Here are your 3 gifts: ✨',
        'Gift 1: <a href="https://example.com/gift1" target="_blank">Click here</a>',
        'Gift 2: <a href="https://example.com/gift2" target="_blank">Click here</a>',
        'Gift 3: <a href="https://example.com/gift3" target="_blank">Click here</a>',
        '',
        'Keep being amazing! 💜',
        '',
        '— <a href="https://github.com/zeus" target="_blank">Zeus</a> 🐾'
    ] : [
        // IF SKIPPED - Normal message
        `Dear ${username},`,
        '',
        'Thank you for being you! 💖',
        '',
        'Naalala ko pa \'yung sinabi ko dati, na kapag nagkita ulit tayo,',
        'may ibibigay akong regalo.',
        '',
        'Matagal na rin mula noong huling nagkausap tayo,',
        'at aamimin ko, ako \'yung nagkamali nahihiya kasi ako,',
        'kaya lumayo na lang.',
        '',
        'Kung may pagkakataon na parang iniwasan kita',
        'o naging awkward ako, sorry ha.',
        '',
        'Your kindness makes the world brighter,',
        'and I\'m so grateful to have you in my life.',
        '',
        'Keep being amazing! ✨',
        '',
        '(Psst... may secret redeem code ako for special gifts! 🎁)',
        '',
        '— <a href="https://www.facebook.com/share/1BFWiXpaav/" target="_blank">Zeus</a> 🐾'
    ];

    // Update title
    document.getElementById('happyTitle').textContent = unlockedGifts ? 'Gifts Unlocked! 🎁✨' : 'Yay! 💕';

    const typewriterEl = document.getElementById('typewriter');
    let currentLine = 0;
    let currentChar = 0;

    function type() {
        if (currentLine < messages.length) {
            if (currentChar < messages[currentLine].length) {
                if (messages[currentLine].includes('<a href=')) {
                    // Insert HTML directly for links
                    typewriterEl.innerHTML += messages[currentLine];
                    currentChar = messages[currentLine].length;
                } else {
                    const char = messages[currentLine].charAt(currentChar);
                    if (typewriterEl.innerHTML.endsWith('</a>')) {
                        typewriterEl.innerHTML += char;
                    } else {
                        typewriterEl.textContent += char;
                    }
                    currentChar++;
                }
                setTimeout(type, 50);
            } else {
                typewriterEl.innerHTML += '<br>';
                currentLine++;
                currentChar = 0;
                setTimeout(type, 200);
            }
        }
    }

    type();
}

function startHeartRain() {
    const heartRain = document.getElementById('heartRain');
    const hearts = unlockedGifts ? ['🎁', '✨', '💝', '🎉', '💜', '🎊'] : ['💖', '💕', '💗', '💓', '💝', '💜'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heartRain.appendChild(heart);

        setTimeout(() => heart.remove(), 6000);
    }, 300);
}

// Allow Enter key to submit on login screen
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startGame();
    }
});

// Initialize on load
window.addEventListener('load', () => {
    createFloatingElements();
    
    // Add enter key support for redeem input
    setTimeout(() => {
        const redeemInput = document.getElementById('redeemInput');
        if (redeemInput) {
            redeemInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
checkRedeemCode();
}
});
}
}, 100);
});