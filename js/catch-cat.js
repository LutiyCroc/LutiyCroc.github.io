// Мини-игра "Поймай котика"

class CatchCatGame {
    constructor() {
        this.state = {
            caughtCount: 0,
            requiredCatches: 5,
            timeLeft: 45,
            isPlaying: false,
            timerInterval: null
        };

        this.gameArea = null;
        this.catImage = null;
        this.moveInterval = null;
        this.catSpeed = 1500; // начальная скорость движения (мс) - быстрее
        this.catPosition = { x: 50, y: 50 }; // в процентах

        this.init();
    }

    init() {
        this.gameArea = document.getElementById('catch-cat-game-area');
        this.catImage = document.getElementById('catch-cat');

        if (!this.gameArea || !this.catImage) return;

        this.fillContent();
        this.initCatMovement();
        this.initCatClick();
        this.initContinueButton();
    }

    fillContent() {
        const title = document.getElementById('catch-cat-title');
        const description = document.getElementById('catch-cat-description');
        const continueButton = document.getElementById('btn-catch-cat-continue');
        const retryButton = document.getElementById('btn-catch-cat-retry');

        if (title) title.textContent = content.catchCat.title;
        if (description) description.textContent = content.catchCat.description;
        if (continueButton) continueButton.textContent = content.catchCat.continueButton;
        if (retryButton) retryButton.textContent = content.catchCat.retryButton;
    }

    initCatMovement() {
        // Случайное движение котика
        this.moveCatRandomly();

        // Движение при наведении курсора
        this.gameArea.addEventListener('mousemove', (e) => {
            if (!this.state.isPlaying) return;
            this.escapeFromCursor(e);
        });

        // Для тач-устройств
        this.gameArea.addEventListener('touchmove', (e) => {
            if (!this.state.isPlaying) return;
            e.preventDefault();
            const touch = e.touches[0];
            this.escapeFromCursor({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });
    }

    startCatRunningAnimation() {
        this.catImage.classList.add('running');
    }

    stopCatRunningAnimation() {
        this.catImage.classList.remove('running');
    }

    moveCatRandomly() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        this.moveInterval = setInterval(() => {
            if (!this.state.isPlaying) return;
            this.changeCatPosition();
        }, this.catSpeed);
    }

    changeCatPosition() {
        // Случайная позиция в пределах игровой области (с отступом от краёв)
        const padding = 10; // 10% отступ
        const minX = padding;
        const maxX = 100 - padding;
        const minY = padding;
        const maxY = 100 - padding;

        const oldX = this.catPosition.x;
        const oldY = this.catPosition.y;

        this.catPosition.x = minX + Math.random() * (maxX - minX);
        this.catPosition.y = minY + Math.random() * (maxY - minY);

        // Вычисляем направление движения для поворота
        const angle = Math.atan2(this.catPosition.y - oldY, this.catPosition.x - oldX);
        const rotation = angle * (180 / Math.PI);

        this.catImage.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        this.updateCatPosition();
    }

    escapeFromCursor(event) {
        const rect = this.gameArea.getBoundingClientRect();
        const catRect = this.catImage.getBoundingClientRect();

        // Позиция курсора относительно игровой области
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;

        // Позиция котика в пикселях
        const catX = catRect.left - rect.left + catRect.width / 2;
        const catY = catRect.top - rect.top + catRect.height / 2;

        // Расстояние между курсором и котиком
        const distance = Math.sqrt(
            Math.pow(cursorX - catX, 2) + Math.pow(cursorY - catY, 2)
        );

        // Вычисляем угол для поворота котика от курсора
        const angle = Math.atan2(cursorY - catY, cursorX - catX);
        const rotation = angle * (180 / Math.PI);

        // Поворачиваем котика от курсора
        this.catImage.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

        // Если курсор близко (менее 150px), убегаем
        if (distance < 150) {
            // Вычисляем направление от курсора
            const escapeAngle = Math.atan2(catY - cursorY, catX - cursorX);

            // Двигаем котика в противоположном направлении
            const escapeDistance = 30; // в процентах
            let newX = this.catPosition.x + Math.cos(escapeAngle) * escapeDistance;
            let newY = this.catPosition.y + Math.sin(escapeAngle) * escapeDistance;

            // Ограничиваем пределами
            newX = Math.max(10, Math.min(90, newX));
            newY = Math.max(10, Math.min(90, newY));

            this.catPosition.x = newX;
            this.catPosition.y = newY;

            this.updateCatPosition();
        }
    }

    updateCatPosition() {
        this.catImage.style.left = `${this.catPosition.x}%`;
        this.catImage.style.top = `${this.catPosition.y}%`;
        // Сохраняем текущий поворот если есть
        const currentTransform = this.catImage.style.transform;
        if (currentTransform && currentTransform.includes('rotate')) {
            // Не перезаписываем поворот
        } else {
            this.catImage.style.transform = 'translate(-50%, -50%)';
        }
    }

    initCatClick() {
        this.catImage.addEventListener('click', (e) => this.catchCat(e));
        this.catImage.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.catchCat(e);
        }, { passive: false });
    }

    catchCat(event) {
        if (!this.state.isPlaying) {
            this.startGame();
        }

        // Добавляем анимацию "пойман"
        this.catImage.classList.add('caught');
        setTimeout(() => {
            this.catImage.classList.remove('caught');
        }, 500);

        // Увеличиваем счётчик
        this.state.caughtCount++;
        this.updateProgress();

        // Показываем сообщение
        this.showMessage();

        // Создаём эффект частиц
        const rect = this.catImage.getBoundingClientRect();
        const x = event.clientX || rect.left + rect.width / 2;
        const y = event.clientY || rect.top + rect.height / 2;
        this.createCatchParticles(x, y);

        // Увеличиваем скорость с каждым пойманным котиком
        this.catSpeed = Math.max(800, 2000 - this.state.caughtCount * 200);
        this.moveCatRandomly();

        // Перемещаем котика сразу после ловли
        setTimeout(() => {
            this.changeCatPosition();
        }, 300);

        // Проверяем завершение
        if (this.state.caughtCount >= this.state.requiredCatches) {
            this.completeGame();
        }
    }

    showMessage() {
        const messageBox = document.getElementById('catch-cat-message');
        if (!messageBox) return;

        const messageIndex = (this.state.caughtCount - 1) % content.catchCat.messages.length;
        const message = content.catchCat.messages[messageIndex];

        messageBox.textContent = message;
        messageBox.classList.remove('hidden');

        // Сброс анимации
        messageBox.style.animation = 'none';
        messageBox.offsetHeight; // Trigger reflow
        messageBox.style.animation = 'scaleIn 0.48s var(--ease-bounce) forwards';
    }

    createCatchParticles(x, y) {
        const particleCount = 15;
        const types = ['heart', 'star', 'flower'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle particle-${types[i % types.length]}`;

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

            particle.textContent = this.getParticleSymbol(types[i % types.length]);
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 850);
        }
    }

    getParticleSymbol(type) {
        const symbols = {
            heart: '♡',
            star: '✦',
            flower: '✿'
        };
        return symbols[type] || '✦';
    }

    updateProgress() {
        const progress = document.getElementById('catch-cat-progress');
        if (progress) {
            progress.textContent = `${this.state.caughtCount}/${this.state.requiredCatches}`;
        }
    }

    startGame() {
        this.state.isPlaying = true;
        this.startCatRunningAnimation();
        this.startTimer();
    }

    startTimer() {
        const timerElement = document.getElementById('catch-cat-timer');
        if (!timerElement) return;

        this.state.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            timerElement.textContent = this.state.timeLeft;

            // Добавляем пульсацию когда мало времени
            if (this.state.timeLeft <= 10) {
                timerElement.classList.add('urgent');
            }

            if (this.state.timeLeft <= 0) {
                this.completeGame();
            }
        }, 1000);
    }

    completeGame() {
        this.state.isPlaying = false;
        this.stopCatRunningAnimation();
        clearInterval(this.state.timerInterval);
        clearInterval(this.moveInterval);

        // Скрываем котика
        this.catImage.style.display = 'none';

        // Скрываем сообщение при ловле
        const messageBox = document.getElementById('catch-cat-message');
        if (messageBox) {
            messageBox.classList.add('hidden');
        }

        // Скрываем статистику
        const stats = document.querySelector('.catch-cat-stats');
        if (stats) {
            stats.classList.add('hidden');
        }

        // Показываем завершение
        const completeSection = document.getElementById('catch-cat-complete');
        const completeText = document.getElementById('catch-cat-complete-text');

        if (completeSection) {
            completeSection.classList.remove('hidden');
        }

        if (completeText) {
            if (this.state.caughtCount >= this.state.requiredCatches) {
                completeText.textContent = content.catchCat.completeText;
            } else {
                completeText.textContent = `Ты поймала ${this.state.caughtCount} котиков! Молодец! 💗`;
            }
        }

        // Анимация счастливого котика
        const finalCat = document.getElementById('cat-caught-final');
        if (finalCat) {
            finalCat.style.animation = 'bounce 0.85s var(--ease-bounce)';
        }
    }

    initContinueButton() {
        const continueButton = document.getElementById('btn-catch-cat-continue');
        const retryButton = document.getElementById('btn-catch-cat-retry');

        if (continueButton) {
            continueButton.addEventListener('click', () => {
                // Уведомляем игру о завершении
                if (typeof game !== 'undefined' && game) {
                    game.transitionTo('final');
                }
            });
        }

        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.reset();
            });
        }
    }

    reset() {
        this.state.caughtCount = 0;
        this.state.timeLeft = 45;
        this.state.isPlaying = false;
        this.catSpeed = 2000;

        clearInterval(this.state.timerInterval);
        clearInterval(this.moveInterval);

        // Сброс UI
        const progress = document.getElementById('catch-cat-progress');
        const timer = document.getElementById('catch-cat-timer');
        const messageBox = document.getElementById('catch-cat-message');
        const completeSection = document.getElementById('catch-cat-complete');
        const stats = document.querySelector('.catch-cat-stats');

        if (progress) progress.textContent = '0/5';
        if (timer) {
            timer.textContent = '45';
            timer.classList.remove('urgent');
        }
        if (messageBox) messageBox.classList.add('hidden');
        if (completeSection) completeSection.classList.add('hidden');
        if (stats) stats.classList.remove('hidden');

        // Показываем котика
        if (this.catImage) {
            this.catImage.style.display = 'block';
            this.catPosition = { x: 50, y: 50 };
            this.updateCatPosition();
            this.stopCatRunningAnimation();
            this.catImage.style.transform = 'translate(-50%, -50%)';
        }

        // Перезапускаем случайное движение
        this.moveCatRandomly();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.catchCatGame = new CatchCatGame();
});
