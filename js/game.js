// Основная игровая логика

class Game {
    constructor() {
        this.state = {
            screen: 'intro',
            collectedHearts: [],
            openedGifts: [],
            catchCatCompleted: false,
            finalLetterOpened: false
        };

        this.screens = {
            intro: document.getElementById('screen-intro'),
            hearts: document.getElementById('screen-hearts'),
            gifts: document.getElementById('screen-gifts'),
            catchCat: document.getElementById('screen-catch-cat'),
            final: document.getElementById('screen-final')
        };

        this.init();
    }

    init() {
        this.fillIntroContent();
        this.initIntroButton();
        this.initHearts();
        this.initGifts();
        this.initCatchCat();
        this.initFinal();
        this.initCatInteractions();
    }

    // Заполнение контента на экране приветствия
    fillIntroContent() {
        const title = document.getElementById('intro-title');
        const catSpeech = document.getElementById('intro-cat-speech');
        const startButton = document.getElementById('btn-start');

        if (title) title.textContent = content.intro.title;
        if (catSpeech) catSpeech.textContent = content.intro.catSpeech;
        if (startButton) startButton.textContent = content.intro.buttonText;
    }

    // Инициализация кнопки старта
    initIntroButton() {
        const startButton = document.getElementById('btn-start');
        if (!startButton) return;

        startButton.addEventListener('click', () => {
            this.createButtonBurst(startButton);
            setTimeout(() => {
                this.transitionTo('hearts');
            }, 300);
        });
    }

    // Переход между экранами
    transitionTo(screenName) {
        const currentScreen = this.screens[this.state.screen];
        const nextScreen = this.screens[screenName];

        if (!currentScreen || !nextScreen) return;

        // Очищаем сообщения перед переходом
        this.clearMessages();

        // Создаём красивый переход с сердечками
        this.createTransitionParticles();

        // Анимация выхода текущего экрана
        currentScreen.classList.add('animate-fade-out');

        setTimeout(() => {
            currentScreen.classList.add('hidden');
            currentScreen.classList.remove('animate-fade-out');

            // Анимация входа следующего экрана
            nextScreen.classList.remove('hidden');
            nextScreen.classList.add('animate-fade-in');

            setTimeout(() => {
                nextScreen.classList.remove('animate-fade-in');
            }, 480);

            this.state.screen = screenName;

            // Сбрасываем игру catch-cat при переходе на этот экран
            if (screenName === 'catchCat' && typeof catchCatGame !== 'undefined') {
                catchCatGame.reset();
            }
        }, 480);
    }

    // Очистка сообщений
    clearMessages() {
        const messageBox = document.getElementById('hearts-message');
        if (messageBox) {
            messageBox.classList.add('hidden');
        }
    }

    // Создание частиц для перехода между экранами
    createTransitionParticles() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Создаём несколько волн сердечек
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                const particleCount = 16;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle particle-heart';

                    const angle = (i / particleCount) * Math.PI * 2;
                    const distance = 100 + wave * 50 + Math.random() * 50;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;

                    particle.style.cssText = `
                        left: ${centerX}px;
                        top: ${centerY}px;
                        --tx: ${tx}px;
                        --ty: ${ty}px;
                        font-size: ${20 + Math.random() * 15}px;
                    `;

                    particle.textContent = '♡';
                    document.body.appendChild(particle);

                    setTimeout(() => {
                        particle.remove();
                    }, 1200);
                }
            }, wave * 200);
        }
    }

    // Инициализация сердечек
    initHearts() {
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach(heart => {
            heart.addEventListener('click', (e) => this.collectHeart(e, heart));
        });

        const continueButton = document.getElementById('btn-hearts-continue');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.transitionTo('gifts');
            });
        }
    }

    // Сбор сердечка
    collectHeart(event, heart) {
        const heartId = parseInt(heart.dataset.heart);

        if (this.state.collectedHearts.includes(heartId)) return;

        this.state.collectedHearts.push(heartId);
        heart.classList.add('collected');

        // Анимация сбора
        heart.style.animation = 'pop 0.22s var(--ease-bounce)';

        // Получаем точные координаты клика относительно элемента
        const rect = heart.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;

        // Проверяем, что клик был внутри элемента
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            // Создаём эффект в точке клика
            this.createHeartBurst(x, y);
        }

        // Анимация сердечка, улетающего к прогресс-бару
        this.animateHeartToProgress(heart);

        // Показ сообщения
        this.showHeartMessage(heartId);

        // Обновление прогресса
        this.updateHeartsProgress();

        // Проверка завершения
        if (this.state.collectedHearts.length === 3) {
            setTimeout(() => this.showHeartsComplete(), 500);
        }
    }

    // Анимация сердечка, улетающего к прогресс-бару
    animateHeartToProgress(heart) {
        const progress = document.getElementById('hearts-progress');
        if (!progress) return;

        const heartRect = heart.getBoundingClientRect();
        const progressRect = progress.getBoundingClientRect();

        const flyingHeart = document.createElement('div');
        flyingHeart.className = 'flying-heart';
        flyingHeart.innerHTML = `
            <svg viewBox="0 0 100 100" style="width: 40px; height: 40px;">
                <path d="M50 88 C20 60 10 40 25 25 C35 15 45 20 50 30 C55 20 65 15 75 25 C90 40 80 60 50 88 Z" fill="#D990A6"/>
            </svg>
        `;

        flyingHeart.style.cssText = `
            position: fixed;
            left: ${heartRect.left + heartRect.width / 2}px;
            top: ${heartRect.top + heartRect.height / 2}px;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        `;

        document.body.appendChild(flyingHeart);

        // Анимируем к прогресс-бару
        requestAnimationFrame(() => {
            flyingHeart.style.left = `${progressRect.left + progressRect.width / 2}px`;
            flyingHeart.style.top = `${progressRect.top + progressRect.height / 2}px`;
            flyingHeart.style.opacity = '0';
            flyingHeart.style.transform = 'translate(-50%, -50%) scale(0.3)';
        });

        setTimeout(() => {
            flyingHeart.remove();
        }, 800);
    }

    // Создание красивого взрыва сердечек
    createHeartBurst(x, y) {
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-heart';

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${18 + Math.random() * 14}px;
            `;

            particle.textContent = '♡';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 850);
        }
    }

    // Показ сообщения при сборе сердечка
    showHeartMessage(heartId) {
        const messageBox = document.getElementById('hearts-message');
        if (!messageBox) return;

        const messageIndex = heartId - 1;
        const message = content.hearts.messages[messageIndex];

        messageBox.textContent = message;
        messageBox.classList.remove('hidden');

        // Сброс анимации
        messageBox.style.animation = 'none';
        messageBox.offsetHeight; // Trigger reflow
        messageBox.style.animation = 'scaleIn 0.48s var(--ease-bounce) forwards';

        // НЕ скрываем автоматически - сообщение остаётся видимым
        // Скроется только при следующем действии или смене экрана
    }

    // Обновление прогресса сердечек
    updateHeartsProgress() {
        const progress = document.getElementById('hearts-progress');
        if (!progress) return;

        progress.textContent = `${this.state.collectedHearts.length}/3`;
    }

    // Показ завершения сбора сердечек
    showHeartsComplete() {
        const completeSection = document.getElementById('hearts-complete');
        const completeText = document.getElementById('hearts-complete-text');

        if (!completeSection) return;

        if (completeText) {
            completeText.textContent = content.hearts.completeText;
        }

        completeSection.classList.remove('hidden');

        // Анимация котика
        const happyCat = document.getElementById('cat-happy');
        if (happyCat) {
            happyCat.style.animation = 'bounce 0.85s var(--ease-bounce)';
        }
    }

    // Инициализация подарков
    initGifts() {
        const giftBoxes = document.querySelectorAll('.gift-box');
        giftBoxes.forEach(box => {
            box.addEventListener('click', (e) => this.openGift(box, e));
            box.addEventListener('mouseenter', () => {
                if (!box.classList.contains('opened')) {
                    this.createGiftSparkle(box);
                }
            });
        });
    }

    // Создание искрок при наведении на подарок
    createGiftSparkle(box) {
        const rect = box.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-heart';

            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 15;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${10 + Math.random() * 6}px;
            `;

            particle.textContent = '♡';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 500);
        }
    }

    // Открытие подарка
    openGift(box, event) {
        const giftId = parseInt(box.dataset.gift);

        if (this.state.openedGifts.includes(giftId)) return;

        this.state.openedGifts.push(giftId);
        box.classList.add('opened');

        // Показ сообщения
        const messageEl = document.getElementById(`gift-message-${giftId}`);
        if (messageEl) {
            const messageIndex = giftId - 1;
            messageEl.textContent = content.gifts.messages[messageIndex];
            messageEl.classList.remove('hidden');
        }

        // Создаём эффект в точке клика
        if (event) {
            const rect = box.getBoundingClientRect();
            const x = event.clientX;
            const y = event.clientY;

            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                this.createGiftBurst(x, y);
            }
        } else {
            // Если нет события, используем центр элемента
            const rect = box.getBoundingClientRect();
            this.createGiftBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }

        // Проверка завершения
        if (this.state.openedGifts.length === 3) {
            setTimeout(() => this.showGiftsComplete(), 500);
        }
    }

    // Создание взрыва частиц для подарков
    createGiftBurst(x, y) {
        const particleCount = 18;
        const particleTypes = ['heart', 'star', 'flower'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${particleTypes[i % particleTypes.length]}`;

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 70 + Math.random() * 45;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${16 + Math.random() * 12}px;
            `;

            particle.textContent = this.getParticleSymbol(particleTypes[i % particleTypes.length]);
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // Показ завершения подарков
    showGiftsComplete() {
        const completeSection = document.getElementById('gifts-complete');
        if (!completeSection) return;

        completeSection.classList.remove('hidden');
        completeSection.style.animation = 'slideUp 0.48s var(--ease-soft) forwards';
    }

    // Инициализация экрана "Поймай котика"
    initCatchCat() {
        const continueButton = document.getElementById('btn-gifts-continue');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                this.transitionTo('catchCat');
            });
        }
    }

    // Инициализация финального экрана
    initFinal() {
        const title = document.getElementById('final-title');
        const openButton = document.getElementById('btn-open-letter');

        if (title) title.textContent = content.final.title;
        if (openButton) openButton.textContent = content.final.openButton;

        if (openButton) {
            openButton.addEventListener('click', () => this.openFinalLetter());
        }
    }

    // Открытие финального письма
    openFinalLetter() {
        if (this.state.finalLetterOpened) return;

        this.state.finalLetterOpened = true;

        const envelopeContainer = document.getElementById('envelope-container');
        const letterContent = document.getElementById('letter-content');
        const finalMessage = document.getElementById('final-message');
        const finalSignature = document.getElementById('final-signature');

        if (!envelopeContainer || !letterContent) return;

        // Анимация закрытия конверта
        envelopeContainer.style.animation = 'scaleOut 0.48s var(--ease-soft) forwards';

        setTimeout(() => {
            envelopeContainer.classList.add('hidden');

            // Показ письма
            letterContent.classList.remove('hidden');

            if (finalMessage) {
                finalMessage.innerHTML = content.final.message;
            }

            if (finalSignature) {
                finalSignature.textContent = content.final.signature;
            }

            // Запускаем многоуровневый салют
            this.launchLetterFireworks();

            // Анимация котика
            const finalCat = document.getElementById('cat-final');
            if (finalCat) {
                finalCat.style.animation = 'bounce 0.85s var(--ease-bounce)';
            }
        }, 480);
    }

    // Многоуровневый салют при открытии письма
    launchLetterFireworks() {
        const screenFinal = document.getElementById('screen-final');
        if (!screenFinal) return;

        const rect = screenFinal.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Волна 1 — раскрытие (мгновенно)
        this.createWave1Burst(centerX, centerY - 50);

        // Волна 2 — боковые фейерверки (через 300ms)
        setTimeout(() => {
            this.createWave2Fireworks(rect);
        }, 300);

        // Волна 3 — большой верхний салют (через 600ms)
        setTimeout(() => {
            this.createWave3Burst(centerX, centerY - 150);
        }, 600);

        // Волна 4 — дождь из сердечек (через 900ms)
        setTimeout(() => {
            this.createWave4Rain(rect);
        }, 900);

        // Волна 5 — финальный акцент (через 1200ms)
        setTimeout(() => {
            this.createWave5Accent(centerX, centerY - 100);
        }, 1200);
    }

    // Волна 1: всплеск рядом с конвертом
    createWave1Burst(x, y) {
        const particleCount = 30;
        const types = ['heart', 'star', 'sparkle'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${types[i % types.length]}`;

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${14 + Math.random() * 10}px;
            `;

            particle.textContent = this.getParticleSymbol(types[i % types.length]);
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1200);
        }

        // Расширяющееся кольцо света
        const ring = document.createElement('div');
        ring.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 10px;
            height: 10px;
            border: 3px solid rgba(245, 168, 176, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ringExpand 1s var(--ease-soft) forwards;
            pointer-events: none;
        `;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 1000);
    }

    // Волна 2: боковые фейерверки
    createWave2Fireworks(rect) {
        const positions = [
            { x: rect.left + rect.width * 0.2, y: rect.top + rect.height * 0.3 },
            { x: rect.left + rect.width * 0.8, y: rect.top + rect.height * 0.4 }
        ];

        positions.forEach(pos => {
            this.createFireworkBurst(pos.x, pos.y, 20);
        });
    }

    createFireworkBurst(x, y, count) {
        const types = ['heart', 'star', 'flower'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${types[i % types.length]}`;

            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 50;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${12 + Math.random() * 8}px;
            `;

            particle.textContent = this.getParticleSymbol(types[i % types.length]);
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1500);
        }
    }

    // Волна 3: большой верхний салют
    createWave3Burst(x, y) {
        const starCount = 40;

        for (let i = 0; i < starCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-star';

            const angle = (i / starCount) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${16 + Math.random() * 12}px;
                animation-delay: ${Math.random() * 0.2}s;
            `;

            particle.textContent = '✦';
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }
    }

    // Волна 4: дождь из сердечек
    createWave4Rain(rect) {
        const heartCount = 25;

        for (let i = 0; i < heartCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-heart';

            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top - 20;

            particle.style.cssText = `
                left: ${startX}px;
                top: ${startY}px;
                --tx: ${(Math.random() - 0.5) * 30}px;
                --ty: ${rect.height + 100}px;
                font-size: ${12 + Math.random() * 8}px;
                animation-duration: ${2 + Math.random() * 1}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;

            particle.textContent = '♡';
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 3500);
        }
    }

    // Волна 5: финальный акцент (большое сердце)
    createWave5Accent(x, y) {
        const heart = document.createElement('div');
        heart.className = 'particle final-heart';

        heart.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            font-size: 60px;
            animation: finalHeartPulse 2s var(--ease-soft) forwards;
            pointer-events: none;
        `;

        heart.textContent = '♡';
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2000);
    }

    // Создание взрыва частиц
    createBurst(x, y) {
        const particleCount = 12;
        const particleTypes = ['heart', 'star', 'flower'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${particleTypes[i % particleTypes.length]}`;

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${14 + Math.random() * 10}px;
            `;

            particle.textContent = this.getParticleSymbol(particleTypes[i % particleTypes.length]);
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 850);
        }
    }

    // Создание взрыва частиц на кнопке
    createButtonBurst(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        this.createBurst(centerX, centerY);
    }

    // Праздничный взрыв частиц
    createCelebrationBurst() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createBurst(
                    centerX + (Math.random() - 0.5) * 300,
                    centerY + (Math.random() - 0.5) * 300
                );
            }, i * 150);
        }
    }

    // Инициализация интерактивности котиков
    initCatInteractions() {
        const interactiveCats = document.querySelectorAll('.cat-interactive');
        interactiveCats.forEach(cat => {
            cat.addEventListener('mouseenter', () => {
                this.createCatSparkle(cat);
            });
        });
    }

    // Создание искрок при наведении на котика
    createCatSparkle(catElement) {
        const rect = catElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-star';

            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${12 + Math.random() * 8}px;
            `;

            particle.textContent = '✦';
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    // Получение символа частицы
    getParticleSymbol(type) {
        const symbols = {
            heart: '♡',
            star: '✦',
            flower: '✿',
            sparkle: '✨'
        };
        return symbols[type] || '✦';
    }
}

// Инициализация игры при загрузке
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
