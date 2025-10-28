let username = '';
let noClickCount = 0;
let isMusicPlaying = false;

// Accepted names (case insensitive)
const acceptedNames = ['sam', 'samantha'];

// Troll messages and reactions for each "No" click
const trollStages = [
    {
        message: 'Hehe, catch me if you can! 馃樇',
        catReaction: 'shake'
    },
    {
        message: 'Not so fast, meow~ 馃樃',
        catReaction: 'jump'
    },
    {
        message: 'Nope! Try again! 馃惥',
        catReaction: 'spin'
    },
    {
        message: 'Getting smaller now... 馃樄',
        catReaction: 'shake'
    },
    {
        message: 'Poof! The button is gone! Now just say yes please 馃ズ',
        catReaction: 'jump'
    }
];

// Initialize floating background elements
function createFloatingElements() {
    const container = document.getElementById('floatingElements');
    const elements = ['馃惥', '馃挏', '鉁�', '馃挐', '馃専'];
    
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
        toggle.textContent = '馃攪';
        toggle.classList.remove('playing');
        isMusicPlaying = false;
    } else {
        music.play().catch(e => console.log('Music play failed:', e));
        toggle.textContent = '馃攰';
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
        errorMsg.textContent = 'Please enter your name, meow! 馃惥';
        triggerCatReaction('loginCat', 'shake');
        playSound('meowSound');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }

    // Check if name is accepted
    if (!acceptedNames.includes(input.toLowerCase())) {
        inputField.classList.add('error');
        errorMsg.textContent = 'Please use your real name 馃ス';
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
        document.getElementById('musicToggle').textContent = '馃攰';
        document.getElementById('musicToggle').classList.add('playing');
    }).catch(e => {
        console.log('Auto-play failed, user interaction needed:', e);
    });
    
    setTimeout(() => {
        showScreen('happyScreen');
        startHeartRain();
        typeMessage();
    }, 400);
}

function typeMessage() {
    const messages = [
        `Dear ${username},`,
        '',
        'Thank you for being you! 馃挅',
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
        'Keep being amazing! 鉁�',
        '',
        '鈥� <a href="https://www.facebook.com/share/1BFWiXpaav/" target="_blank">Zeus</a> 馃惥'
    ];

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
    const hearts = ['馃挅', '馃挄', '馃挆', '馃挀', '馃挐', '馃挏'];

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
});
// Add to script.js
function createConfetti() {
    const colors = ['#ff6b9d', '#c9a7eb', '#ffc6ff', '#ffadad', '#ffd6a5'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 30);
    }
}

// Update selectYes function
function selectYes() {
    playSound('successSound');
    triggerCatReaction('questionCat', 'spin');
    createConfetti(); // ADD THIS
    // ... rest of code ...
    // Add to script.js
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Rainbow mode!
    document.body.style.animation = 'rainbow 2s infinite';
    alert('🎉 You found the secret! Rainbow mode activated! 🌈');
}
}