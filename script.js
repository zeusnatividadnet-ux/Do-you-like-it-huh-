// Global Variables
let username = '';
let isMusicPlaying = false;
let currentTheme = 'hearts';
let fallingInterval = null;
let redeemedCodes = [];
let guestbookEntries = [];
let visitCount = 0;
let isAdmin = false;
let allUsers = [];
let userInbox = [];
let customMusicData = null;
let isCustomMusic = false;
let whitelistedUsers = ['sam', 'samantha']; // Dynamic whitelist
let currentSession = null;

// Admin credentials
const adminName = 'zeuslangmalakas13';

const mascotMessages = [
    "Building this take me few days",
    "This is my kind of appreciation",
    "I'm watching you... Zeus~ 😼",
    "Need a support? I'm here! 💕",
    "My Skill's Screaming and Made this for you✨",
    "Meow meow! Having fun? Leave a message🎉"
];

// Default redeem codes
let redeemCodes = {
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
    'Halloween (Limited time event)': ['🦋', '🕯️', '⚰️', '🍭', '👻', '🎃']
};

// ===== STORAGE FUNCTIONS =====
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

// User-specific storage
function saveUserSetting(key, data) {
    saveToStorage(`${username}_${key}`, data);
}

function loadUserSetting(key) {
    return loadFromStorage(`${username}_${key}`);
}

function loadUserData() {
    const savedEntries = loadFromStorage('guestbookEntries');
    const savedVisits = loadFromStorage('visitCount');
    const savedUsers = loadFromStorage('allUsers');
    const savedCustomCodes = loadFromStorage('customRedeemCodes');
    const savedWhitelist = loadFromStorage('whitelistedUsers');

    if (savedEntries) guestbookEntries = savedEntries;
    if (savedVisits) visitCount = savedVisits;
    if (savedUsers) allUsers = savedUsers;
    if (savedCustomCodes) Object.assign(redeemCodes, savedCustomCodes);
    if (savedWhitelist) whitelistedUsers = savedWhitelist;
    
    visitCount++;
    saveToStorage('visitCount', visitCount);
}

function restoreSession() {
    if (!currentSession) return;
    
    username = currentSession.username;
    isAdmin = currentSession.isAdmin;
    
    // Hide splash and login
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('loginScreen').classList.remove('active');
    
    // Load user-specific settings
    const savedCodes = loadUserSetting('redeemedCodes');
    const savedTheme = loadUserSetting('currentTheme');
    const savedMusicData = loadUserSetting('customMusicData');
    const savedBgColor = loadUserSetting('bgColor');
    
    if (savedCodes) redeemedCodes = savedCodes;
    if (savedTheme) currentTheme = savedTheme;
    if (savedMusicData) {
        customMusicData = savedMusicData;
        isCustomMusic = true;
    }
    if (savedBgColor) {
        document.body.style.background = savedBgColor;
    }
    
    // Show appropriate screen
    if (isAdmin) {
        showScreen('adminScreen');
        loadAdminPanel();
    } else {
        const isTarget = whitelistedUsers.includes(username.toLowerCase());
        showScreen('messageScreen');
        setupUserScreen(isTarget);
        startFallingItems();
    }
    
    // Show UI elements
    document.getElementById('musicToggle').classList.add('active');
    document.getElementById('settingsBtn').classList.add('active');
    document.getElementById('signoutBtn').classList.add('active');
    
    loadUserInbox();
}

function createSession() {
    currentSession = {
        username: username,
        isAdmin: isAdmin,
        loginTime: new Date().toLocaleString()
    };
    saveToStorage('currentSession', currentSession);
}

function registerUser(name) {
    if (!allUsers.find(u => u.name.toLowerCase() === name.toLowerCase())) {
        const user = {
            name: name,
            loginDate: new Date().toLocaleString(),
            isTarget: whitelistedUsers.includes(name.toLowerCase())
        };
        allUsers.push(user);
        saveToStorage('allUsers', allUsers);
    }
}

// ===== SIGN OUT FUNCTION =====
function signOut() {
    const confirmed = confirm('Are you sure you want to sign out? 🚪');
    
    if (!confirmed) return;
    
    // Clear session
    currentSession = null;
    saveToStorage('currentSession', null);
    
    // Stop music
    const defaultMusic = document.getElementById('bgMusic');
    const customMusic = document.getElementById('customMusic');
    defaultMusic.pause();
    customMusic.pause();
    isMusicPlaying = false;
    
    // Clear falling animations
    if (fallingInterval) {
        clearInterval(fallingInterval);
    }
    document.getElementById('fallingItems').innerHTML = '';
    
    // Hide UI elements
    document.getElementById('musicToggle').classList.remove('active');
    document.getElementById('settingsBtn').classList.remove('active');
    document.getElementById('signoutBtn').classList.remove('active');
    
    // Reset variables
    username = '';
    isAdmin = false;
    redeemedCodes = [];
    
    // Show login screen
    showScreen('loginScreen');
    document.getElementById('nameInput').value = '';
    
    playSound('clickSound');
}

// ===== MASCOT FUNCTIONS =====
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

// ===== AUDIO FUNCTIONS =====
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Audio play failed:', e));
}

function toggleMusic() {
    const defaultMusic = document.getElementById('bgMusic');
    const customMusic = document.getElementById('customMusic');
    const currentMusic = isCustomMusic ? customMusic : defaultMusic;
    const toggle = document.getElementById('musicToggle');
    const statusText = document.getElementById('musicStatusText');
    
    if (isMusicPlaying) {
        currentMusic.pause();
        toggle.textContent = '🔇';
        if (statusText) statusText.textContent = '🔇 Play Music';
        toggle.classList.remove('playing');
        isMusicPlaying = false;
    } else {
        currentMusic.play().catch(e => console.log('Music play failed:', e));
        toggle.textContent = '🔊';
        if (statusText) statusText.textContent = '🔊 Pause Music';
        toggle.classList.add('playing');
        isMusicPlaying = true;
    }
}

function resetMusic() {
    const defaultMusic = document.getElementById('bgMusic');
    const customMusic = document.getElementById('customMusic');
    
    customMusic.pause();
    customMusic.src = '';
    
    isCustomMusic = false;
    customMusicData = null;
    saveUserSetting('customMusicData', null);
    
    if (isMusicPlaying) {
        defaultMusic.play();
    }
    
    document.getElementById('uploadStatus').textContent = '✅ Reset to default music!';
    document.getElementById('currentMusicName').textContent = 'Default Music';
    document.getElementById('musicInfo').style.display = 'none';
    
    playSound('successSound');
}

// ===== LOGIN FUNCTION =====
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

    username = input;
    registerUser(username);
    
    errorMsg.textContent = '';
    playSound('successSound');
    triggerCatReaction('loginCat', 'spin');
    createConfetti();
    
    // Check if admin
    if (username.toLowerCase() === adminName) {
        isAdmin = true;
        createSession();
        setTimeout(() => {
            showScreen('adminScreen');
            loadAdminPanel();
        }, 400);
    } else {
        // Regular user or stranger
        isAdmin = false;
        createSession();
        const isTarget = whitelistedUsers.includes(username.toLowerCase());
        
        setTimeout(() => {
            showScreen('messageScreen');
            setupUserScreen(isTarget);
            startFallingItems();
        }, 400);
    }
    
    // Show UI elements
    document.getElementById('musicToggle').classList.add('active');
    document.getElementById('settingsBtn').classList.add('active');
    document.getElementById('signoutBtn').classList.add('active');
    
    const music = document.getElementById('bgMusic');
    music.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('musicToggle').textContent = '🔊';
        document.getElementById('musicToggle').classList.add('playing');
    }).catch(e => {
        console.log('Auto-play failed:', e);
    });
}

function setupUserScreen(isTarget) {
    const targetContent = document.getElementById('targetUserContent');
    const strangerContent = document.getElementById('strangerContent');
    const badge = document.getElementById('userBadge');
    
    if (isTarget) {
        targetContent.style.display = 'block';
        strangerContent.style.display = 'none';
        badge.className = 'user-badge target';
        badge.textContent = '⭐ Special User';
        typeMessage();
    } else {
        targetContent.style.display = 'none';
        strangerContent.style.display = 'block';
        badge.className = 'user-badge stranger';
        badge.textContent = '👤 Guest User';
    }
    
    // Load user inbox
    loadUserInbox();
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

// ===== MESSAGE TYPING FUNCTION =====
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
        'Remember that you're matter. You\'re appreciated. You\'re loved.',
        '',
        'Keep being amazing! ✨',
        '',
        '~ <a href="https://www.facebook.com/share/1BFWiXpaav/" target="_blank">Zeus</a> 🐾',
        '',
        '[system] Hi po, if you have secret message code try it po🎁'
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

// ===== REDEEM CODE FUNCTIONS =====
function redeemCode() {
    const codeInput = document.getElementById('codeInput');
    const code = codeInput.value.trim().toUpperCase();
    const redeemBtn = document.querySelector('.redeem-btn');
    const messageDiv = document.getElementById('redeemMessage');
    const bonusDiv = document.getElementById('bonusMessages');

    // Load user-specific redeemed codes
    redeemedCodes = loadUserSetting('redeemedCodes') || [];

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
        saveUserSetting('redeemedCodes', redeemedCodes);
        
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

// ===== ADMIN PANEL FUNCTIONS =====
function loadAdminPanel() {
    loadUserData();
    updateUserList();
    updateAdminMessages();
    updateRecipientSelect();
    displayAdminCodes();
    displayWhitelist();
    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('specialUsers').textContent = whitelistedUsers.length;
}

function showAdminSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    
    if (section === 'users') {
        document.getElementById('adminUserList').classList.add('active');
        updateUserList();
    } else if (section === 'whitelist') {
        document.getElementById('adminWhitelist').classList.add('active');
        displayWhitelist();
    } else if (section === 'messages') {
        document.getElementById('adminMessages').classList.add('active');
        updateAdminMessages();
    } else if (section === 'send') {
        document.getElementById('adminSend').classList.add('active');
        updateRecipientSelect();
    } else if (section === 'codes') {
        document.getElementById('adminCodes').classList.add('active');
        displayAdminCodes();
    }
    
    playSound('clickSound');
}

function updateUserList() {
    const container = document.getElementById('userListContent');
    
    if (allUsers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a582c7;">No users yet.</p>';
        return;
    }
    
    container.innerHTML = allUsers.map(user => {
        const isWhitelisted = whitelistedUsers.includes(user.name.toLowerCase());
        return `
        <div class="user-item">
            <strong>${user.name}</strong>
            ${isWhitelisted ? '<span class="user-badge-inline">⭐ Special</span>' : '<span class="user-badge-inline" style="background: #936fb5;">👤 Guest</span>'}
            <br>
            <small>Login: ${user.loginDate}</small>
        </div>
    `;
    }).join('');
}

// ===== WHITELIST MANAGEMENT =====
function addToWhitelist() {
    const nameInput = document.getElementById('whitelistName');
    const name = nameInput.value.trim().toLowerCase();
    
    if (name === '') {
        alert('Please enter a username! 📝');
        return;
    }
    
    if (whitelistedUsers.includes(name)) {
        alert('User already in whitelist! ⭐');
        return;
    }
    
    whitelistedUsers.push(name);
    saveToStorage('whitelistedUsers', whitelistedUsers);
    
    // Update user status if they exist
    const user = allUsers.find(u => u.name.toLowerCase() === name);
    if (user) {
        user.isTarget = true;
        saveToStorage('allUsers', allUsers);
    }
    
    nameInput.value = '';
    displayWhitelist();
    updateUserList();
    document.getElementById('specialUsers').textContent = whitelistedUsers.length;
    
    playSound('successSound');
    createConfetti();
    alert(`${name} added to whitelist! ⭐`);
}

function removeFromWhitelist(name) {
    const confirmed = confirm(`Remove ${name} from whitelist?\n\nThey will become a Guest User.`);
    
    if (!confirmed) return;
    
    whitelistedUsers = whitelistedUsers.filter(u => u !== name.toLowerCase());
    saveToStorage('whitelistedUsers', whitelistedUsers);
    
    // Update user status if they exist
    const user = allUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (user) {
        user.isTarget = false;
        saveToStorage('allUsers', allUsers);
    }
    
    displayWhitelist();
    updateUserList();
    document.getElementById('specialUsers').textContent = whitelistedUsers.length;
    
    playSound('clickSound');
    alert(`${name} removed from whitelist!`);
}

function displayWhitelist() {
    const container = document.getElementById('whitelistContent');
    
    if (whitelistedUsers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a582c7;">No special users yet.</p>';
        return;
    }
    
    container.innerHTML = whitelistedUsers.map(name => `
        <div class="whitelist-item">
            <strong>${name}</strong>
            <button class="remove-whitelist-btn" onclick="removeFromWhitelist('${name}')">Remove ❌</button>
        </div>
    `).join('');
}

function updateAdminMessages() {
    const container = document.getElementById('adminMessagesContent');
    
    if (guestbookEntries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a582c7;">No messages yet.</p>';
        return;
    }
    
    container.innerHTML = guestbookEntries.map(entry => `
        <div class="message-item">
            <strong>${entry.name}</strong> - <small>${entry.date}</small><br>
            <p style="margin-top: 8px; color: #666;">${entry.message}</p>
        </div>
    `).join('');
}

function updateRecipientSelect() {
    const select = document.getElementById('recipientSelect');
    select.innerHTML = '<option value="all">📢 All Users</option>';
    
    allUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        select.appendChild(option);
    });
}

function sendAdminMessage() {
    const recipient = document.getElementById('recipientSelect').value;
    const messageText = document.getElementById('adminMessageText').value.trim();
    
    if (messageText === '') {
        alert('Please write a message! 📝');
        return;
    }
    
    const message = {
        id: Date.now(),
        from: 'Admin (Zeus)',
        message: messageText,
        date: new Date().toLocaleString()
    };
    
    if (recipient === 'all') {
        allUsers.forEach(user => {
            let inbox = loadFromStorage('userInbox_' + user.name) || [];
            inbox.unshift(message);
            saveToStorage('userInbox_' + user.name, inbox);
        });
        alert('Message sent to all users! 📨');
    } else {
        let inbox = loadFromStorage('userInbox_' + recipient) || [];
        inbox.unshift(message);
        saveToStorage('userInbox_' + recipient, inbox);
        alert(`Message sent to ${recipient}! 📨`);
    }
    
    document.getElementById('adminMessageText').value = '';
    playSound('successSound');
    createConfetti();
}

// ===== REDEEM CODE MANAGEMENT =====
function createRedeemCode() {
    const codeName = document.getElementById('newCodeName').value.trim().toUpperCase();
    const codeTitle = document.getElementById('newCodeTitle').value.trim();
    const codeContent = document.getElementById('newCodeContent').value.trim();
    
    if (codeName === '' || codeTitle === '' || codeContent === '') {
        alert('Please fill all fields! 📝');
        return;
    }
    
    if (redeemCodes[codeName]) {
        alert('Code already exists! 🔄');
        return;
    }
    
    redeemCodes[codeName] = {
        message: codeTitle,
        content: codeContent
    };
    
    // Save custom codes separately
    let customCodes = loadFromStorage('customRedeemCodes') || {};
    customCodes[codeName] = redeemCodes[codeName];
    saveToStorage('customRedeemCodes', customCodes);
    
    document.getElementById('newCodeName').value = '';
    document.getElementById('newCodeTitle').value = '';
    document.getElementById('newCodeContent').value = '';
    
    displayAdminCodes();
    playSound('successSound');
    createConfetti();
    alert('Code created successfully! 🎁');
}

function deleteRedeemCode(codeName) {
    const confirmed = confirm(`Delete code "${codeName}"?`);
    
    if (!confirmed) return;
    
    delete redeemCodes[codeName];
    
    // Update custom codes
    let customCodes = loadFromStorage('customRedeemCodes') || {};
    delete customCodes[codeName];
    saveToStorage('customRedeemCodes', customCodes);
    
    displayAdminCodes();
    playSound('clickSound');
    alert(`Code "${codeName}" deleted!`);
}

function displayAdminCodes() {
    const container = document.getElementById('codesList');
    const codes = Object.keys(redeemCodes);
    
    if (codes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a582c7;">No codes yet.</p>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin-top: 20px;">Existing Codes</h3>' + codes.map(code => `
        <div class="code-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${code}</strong><br>
                    <small>${redeemCodes[code].message}</small>
                </div>
                <button class="remove-whitelist-btn" onclick="deleteRedeemCode('${code}')">Delete 🗑️</button>
            </div>
        </div>
    `).join('');
}

// ===== INBOX FUNCTIONS =====
function loadUserInbox() {
    userInbox = loadFromStorage('userInbox_' + username) || [];
    updateInboxBadge();
}

function updateInboxBadge() {
    const badge = document.getElementById('inboxBadge');
    badge.textContent = userInbox.length;
}

function displayInbox() {
    const container = document.getElementById('inboxContent');
    
    if (userInbox.length === 0) {
        container.innerHTML = '<div class="empty-inbox"><p>📭 No messages yet.</p></div>';
        return;
    }
    
    container.innerHTML = userInbox.map(msg => `
        <div class="inbox-item">
            <div class="inbox-item-header">
                <span class="inbox-from">${msg.from}</span>
                <span class="inbox-date">${msg.date}</span>
            </div>
            <div class="inbox-message">${msg.message}</div>
        </div>
    `).join('');
}

// ===== GUESTBOOK FUNCTIONS =====
function addGuestbookEntry() {
    const messageInput = document.getElementById('guestMessage');
    const message = messageInput.value.trim();

    // Use logged-in username automatically
    if (message === '') {
        playSound('meowSound');
        alert('Please write a message! 🐾');
        return;
    }

    const entry = {
        id: Date.now(),
        name: username, // Use logged-in username
        message: message,
        date: new Date().toLocaleString()
    };

    guestbookEntries.unshift(entry);
    saveToStorage('guestbookEntries', guestbookEntries);
    
    displayGuestbookEntries();
    
    // Clear only the message, not the name
    messageInput.value = '';
    
    playSound('successSound');
    createConfetti();
    alert('Message posted! 💌');
}

function displayGuestbookEntries() {
    const container = document.getElementById('guestbookEntries');
    
    if (guestbookEntries.length === 0) {
        container.innerHTML = '<div class="empty-guestbook"><p>📝 No messages yet. Be the first to leave one!</p></div>';
        return;
    }

    container.innerHTML = guestbookEntries.map(entry => {
        // Show delete button only for own messages or if admin
        const canDelete = (entry.name === username) || isAdmin;
        
        return `
        <div class="guestbook-entry">
            <div class="entry-header">
                <div class="entry-name">${entry.name}</div>
                <div class="entry-date">${entry.date}</div>
            </div>
            <div class="entry-message">${entry.message}</div>
            ${canDelete ? `<button class="delete-entry" onclick="deleteGuestbookEntry(${entry.id})">Delete 🗑️</button>` : ''}
        </div>
        `;
    }).join('');
}

function deleteGuestbookEntry(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        guestbookEntries = guestbookEntries.filter(entry => entry.id !== id);
        saveToStorage('guestbookEntries', guestbookEntries);
        displayGuestbookEntries();
        playSound('clickSound');
    }
}

// ===== SETTINGS FUNCTIONS =====
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    playSound('clickSound');
    showSettingCategory('theme');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
    playSound('clickSound');
}

function showSettingCategory(category) {
    document.querySelectorAll('.setting-section').forEach(s => s.style.display = 'none');
    
    if (category === 'theme') {
        document.getElementById('themeSettings').style.display = 'block';
        loadUserThemeSettings();
    } else if (category === 'music') {
        document.getElementById('musicSettings').style.display = 'block';
    } else if (category === 'inbox') {
        document.getElementById('inboxSettings').style.display = 'block';
        displayInbox();
    } else if (category === 'guestbook') {
        document.getElementById('guestbookSettings').style.display = 'block';
        // Auto-fill username and lock it
        document.getElementById('guestName').value = username;
        displayGuestbookEntries();
    }
    
    playSound('clickSound');
}

function loadUserThemeSettings() {
    const savedBgColor = loadUserSetting('bgColor');
    if (savedBgColor) {
        // Extract color from gradient for picker
        const match = savedBgColor.match(/#[0-9a-f]{6}/i);
        if (match) {
            document.getElementById('bgColorPicker').value = match[0];
        }
    }
}

function changeTheme(theme) {
    currentTheme = theme;
    saveUserSetting('currentTheme', currentTheme);
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

function changeBackgroundColor() {
    const color = document.getElementById('bgColorPicker').value;
    const defaultPurple = '#936fb5';
    
    if (color !== defaultPurple) {
        const confirmed = confirm("Isn't your favorite color purple? 💜\n\nDo you really want to change it?");
        
        if (!confirmed) {
            document.getElementById('bgColorPicker').value = defaultPurple;
            return;
        }
    }
    
    const gradient = `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, 20)} 100%)`;
    document.body.style.background = gradient;
    document.body.style.backgroundSize = '400% 400%';
    saveUserSetting('bgColor', gradient);
    
    playSound('successSound');
    alert('Background color changed! 🎨\n\nThis setting is unique to you.');
}

function resetBackgroundColor() {
    const defaultGradient = 'linear-gradient(135deg, #e0c3fc 0%, #c9a7eb 25%, #b794d9 50%, #a582c7 75%, #936fb5 100%)';
    document.body.style.background = defaultGradient;
    document.body.style.backgroundSize = '400% 400%';
    document.getElementById('bgColorPicker').value = '#936fb5';
    saveUserSetting('bgColor', defaultGradient);
    
    playSound('successSound');
    alert('Reset to purple! 💜');
}

function adjustColor(color, amount) {
    const num = parseInt(color.replace("#",""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// ===== MUSIC UPLOAD FUNCTION =====
document.addEventListener('DOMContentLoaded', function() {
    const musicUpload = document.getElementById('musicUpload');
    if (musicUpload) {
        musicUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const customMusic = document.getElementById('customMusic');
                    const defaultMusic = document.getElementById('bgMusic');
                    
                    customMusicData = event.target.result;
                    customMusic.src = customMusicData;
                    
                    saveUserSetting('customMusicData', customMusicData);
                    
                    defaultMusic.pause();
                    isCustomMusic = true;
                    
                    if (isMusicPlaying) {
                        customMusic.play();
                    }
                    
                    document.getElementById('uploadStatus').textContent = '✅ Music uploaded successfully!';
                    document.getElementById('currentMusicName').textContent = file.name;
                    document.getElementById('musicInfo').style.display = 'block';
                    
                    playSound('successSound');
                    createConfetti();
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// ===== ANIMATION FUNCTIONS =====
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

// ===== EVENT LISTENERS =====
document.getElementById('nameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startGame();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('codeInput');
    if (codeInput) {
        codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                redeemCode();
            }
        });
    }
});

document.getElementById('settingsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSettings();
    }
});

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
    loadUserData();
    createFloatingElements();
    
    // Hide splash screen after animation
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('loginScreen').classList.add('active');
    }, 3500);
});