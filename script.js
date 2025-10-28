let username = '';
let isMusicPlaying = false;
let currentTheme = 'hearts';
let fallingInterval = null;
let redeemedCodes = [];
let guestbookEntries = [];
let visitCount = 0;

const acceptedNames = ['sam', 'samantha'];

const mascotMessages = [
    "Meow! You're doing great! 😸",
    "Purrfect! Keep going! 🐾",
    "I'm watching you... meow~ 😼",
    "Need a paw? I'm here! 💕",
    "You're pawsome! ✨",
    "Meow meow! Having fun? 🎉"
];

const redeemCodes = {
    'STAR2025': {
        message: '🌟 Special Star Message',
        content: 'You\'re a shining star in my life! Your presence lights up even the darkest days. Thank you for being so amazing! ✨'
    },
    'MEOW123': {
        message: '🐱 Secret Cat Message',
        content: 'Meow meow! Just like cats have 9 lives, I hope our friendship lasts for many lifetimes. You\'re purrfect just the way you are! 🐾'
    },
    'HEART99': {
        message: '💖 Heartfelt Message',
        content: 'From the bottom of my heart, thank you for all the kindness you\'ve shown me. You have a heart of gold and deserve all the happiness in the world! 💕'
    },
    'MAGIC777': {
        message: '🎩 Magical Message',
        content: 'You have a magical way of making everyone around you smile. Your positive energy is contagious and I\'m grateful to know you! ✨🎭'
    },
    'RAINBOW': {
        message: '🌈 Rainbow Message',
        content: 'You bring color to my world like a beautiful rainbow after the rain. Thank you for being such a wonderful friend and person! 🌈💫'
    }
};

const themes = {
    'hearts': ['💖', '💕', '💗', '💓', '💝', '💜'],
    'cats': ['🐾', '🐱', '😺', '😸', '😻', '🐈'],
    'stars': ['⭐', '🌟', '✨', '💫', '🌠', '⚡'],
    'flowers': ['🌸', '🌺', '🌻', '🌷', '🌹', '🏵️'],
    'butterflies': ['🦋', '🦋', '🦋', '🦋', '🦋', '🦋']
};

// Persistent Storage Functions
function saveToStorage(key, data) {
    try {
        const stored = {
            data: data,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(key, JSON.stringify(stored));
    } catch (e) {
        console.log('Storage error:', e);
    }
}

function loadFromStorage(key) {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored).data;
        }
    } catch (e) {
        console.log('Load error:', e);
    }
    return null;
}

function loadUserData() {
    const savedUsername = loadFromStorage('username');
    const savedCodes = loadFromStorage('redeemedCodes');
    const savedEntries = loadFromStorage('guestbookEntries');
    const savedTheme = loadFromStorage('currentTheme');
    const savedVisits = loadFromStorage('visitCount');

    if (savedUsername) username = savedUsername;
    if (savedCodes) redeemedCodes = savedCodes;
    if (savedEntries) {
        guestbookEntries = savedEntries;
        displayGuestbookEntries();
    }
    if (savedTheme) currentTheme = savedTheme;
    if (savedVisits) visitCount = savedVisits;
    
    visitCount++;
    saveToStorage('visitCount', visitCount);
}

// Mascot Functions
function triggerMascot() {
    const bubble = document.getElementById('mascotBubble');
    const text = document.getElementById('mascotText');
    
    playSound('meowSound');
    
    const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
    text.textContent = randomMessage;
    
    bubble.classList.add('active');
    
    setTimeout(() => {
        bubble.classList.remove('active');
    }, 3000);
}

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
        errorMsg.textContent = 'Please enter your name, meow! 🐾';
        triggerCatReaction('loginCat', 'shake');
        playSound('meowSound');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }

    if (!acceptedNames.includes(input.toLowerCase())) {
        inputField.classList.add('error');
        errorMsg.textContent = 'Please use your real name 🥹';
        triggerCatReaction('loginCat', 'shake');
        playSound('meowSound');
        setTimeout(() => inputField.classList.remove('error'), 500);
        return;
    }

    username = input;
    saveToStorage('username', username);
    
    errorMsg.textContent = '';
    playSound('successSound');
    triggerCatReaction('loginCat', 'spin');
    createConfetti();
    
    document.getElementById('musicToggle').classList.add('active');
    document.getElementById('settingsBtn').classList.add('active');
    document.getElementById('guestbookBtn').classList.add('active');
    
    const music = document.getElementById('bgMusic');
    music.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('musicToggle').textContent = '🔊';
        document.getElementById('musicToggle').classList.add('playing');
    }).catch(e => {
        console.log('Auto-play failed:', e);
    });

    setTimeout(() => {
        showScreen('messageScreen');
        startFallingItems();
        typeMessage();
    }, 400);
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function triggerCatReaction(catId, reactionType) {
    const cat = document.getElementById(catId);
    cat.classList.add(reactionType);
    setTimeout(() => {
        cat.classList.remove(reactionType);
    }, 600);
}

function typeMessage() {
    const messages = [
        `Dear ${username},`,
        '',
        'Thank you for being you! 💖',
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
        'Keep being amazing! ✨',
        '',
        '~ <a href="https://www.facebook.com/share/1BFWiXpaav/" target="_blank">Zeus</a> 🐾',
        '',
        'P.S. Try the secret codes below for more surprises! 🎁'
    ];

    const typewriterEl = document.getElementById('typewriter');
    let currentLine = 0;
    let currentChar = 0;

    function type() {
        if (currentLine < messages.length) {
            if (currentChar < messages[currentLine].length) {
                if (messages[currentLine].includes('<a href=')) {
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

function redeemCode() {
    const codeInput = document.getElementById('codeInput');
    const code = codeInput.value.trim().toUpperCase();
    const redeemBtn = document.querySelector('.redeem-btn');
    const messageDiv = document.getElementById('redeemMessage');
    const bonusDiv = document.getElementById('bonusMessages');

    if (code === '') {
        messageDiv.innerHTML = '<div class="redeem-message error">Please enter a code! 🎯</div>';
        codeInput.classList.add('error');
        playSound('meowSound');
        setTimeout(() => {
            codeInput.classList.remove('error');
            messageDiv.innerHTML = '';
        }, 2000);
        return;
    }

    if (redeemedCodes.includes(code)) {
        messageDiv.innerHTML = '<div class="redeem-message error">Code already used! 🔄</div>';
        playSound('meowSound');
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 2000);
        return;
    }

    if (redeemCodes[code]) {
        playSound('successSound');
        redeemBtn.classList.add('success');
        createConfetti();
        triggerCatReaction('happyCat', 'jump');
        
        redeemedCodes.push(code);
        saveToStorage('redeemedCodes', redeemedCodes);
        
        messageDiv.innerHTML = '<div class="redeem-message success">Code redeemed successfully! 🎉</div>';
        
        setTimeout(() => {
            const bonusMsg = document.createElement('div');
            bonusMsg.className = 'bonus-message';
            bonusMsg.innerHTML = `
                <h3>${redeemCodes[code].message}</h3>
                <p>${redeemCodes[code].content}</p>
            `;
            bonusDiv.appendChild(bonusMsg);
            
            const messageBox = document.querySelector('.message-box');
            messageBox.scrollTop = messageBox.scrollHeight;
        }, 500);

        setTimeout(() => {
            messageDiv.innerHTML = '';
            codeInput.value = '';
            redeemBtn.classList.remove('success');
        }, 2000);
    } else {
        messageDiv.innerHTML = '<div class="redeem-message error">Invalid code! Try again 🔍</div>';
        codeInput.classList.add('error');
        playSound('meowSound');
        triggerCatReaction('happyCat', 'shake');
        
        setTimeout(() => {
            messageDiv.innerHTML = '';
            codeInput.classList.remove('error');
        }, 2000);
    }
}

// Guestbook Functions
function openGuestbook() {
    document.getElementById('guestbookScreen').classList.add('active');
    playSound('clickSound');
}

function closeGuestbook() {
    document.getElementById('guestbookScreen').classList.remove('active');
    playSound('clickSound');
}

function addGuestbookEntry() {
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (name === '' || message === '') {
        playSound('meowSound');
        alert('Please fill in both name and message! 🐾');
        return;
    }

    const entry = {
        id: Date.now(),
        name: name,
        message: message,
        date: new Date().toLocaleString()
    };

    guestbookEntries.unshift(entry);
    saveToStorage('guestbookEntries', guestbookEntries);
    
    displayGuestbookEntries();
    
    nameInput.value = '';
    messageInput.value = '';
    
    playSound('successSound');
    createConfetti();
}

function displayGuestbookEntries() {
    const container = document.getElementById('guestbookEntries');
    
    if (guestbookEntries.length === 0) {
        container.innerHTML = '<div class="empty-guestbook"><p>📝 No messages yet. Be the first to leave one!</p></div>';
        return;
    }

    container.innerHTML = guestbookEntries.map(entry => `
        <div class="guestbook-entry">
            <div class="entry-header">
                <div class="entry-name">${entry.name}</div>
                <div class="entry-date">${entry.date}</div>
            </div>
            <div class="entry-message">${entry.message}</div>
            <button class="delete-entry" onclick="deleteGuestbookEntry(${entry.id})">Delete 🗑️</button>
        </div>
    `).join('');
}

function deleteGuestbookEntry(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        guestbookEntries = guestbookEntries.filter(entry => entry.id !== id);
        saveToStorage('guestbookEntries', guestbookEntries);
        displayGuestbookEntries();
        playSound('clickSound');
    }
}

// Settings Functions
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    playSound('clickSound');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
    playSound('clickSound');
}

function changeTheme(theme) {
    currentTheme = theme;
    saveToStorage('currentTheme', currentTheme);
    playSound('clickSound');
    
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.theme-option').classList.add('selected');
    
    if (fallingInterval) {
        clearInterval(fallingInterval);
    }
    
    const container = document.getElementById('fallingItems');
    container.innerHTML = '';
    
    startFallingItems();
}

function startFallingItems() {
    const container = document.getElementById('fallingItems');
    const items = themes[currentTheme];

    fallingInterval = setInterval(() => {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = items[Math.floor(Math.random() * items.length)];
        item.style.left = Math.random() * 100 + '%';
        item.style.animationDuration = (Math.random() * 2 + 3) + 's';
        item.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(item);

        setTimeout(() => item.remove(), 6000);
    }, 300);
}

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

// Event Listeners
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startGame();
    }
});

document.getElementById('codeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        redeemCode();
    }
});

document.getElementById('settingsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSettings();
    }
});

document.getElementById('guestbookScreen').addEventListener('click', function(e) {
    if (e.target === this) {
        closeGuestbook();
    }
});

// Initialize on load
window.addEventListener('load', () => {
    loadUserData();
    createFloatingElements();
    
    // Hide splash screen after animation
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('loginScreen').classList.add('active');
    }, 3500);
});