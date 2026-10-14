// Логика планера Санкт-Петербурга

class PetersburgPlanner {
    constructor() {
        this.state = {
            selectedPlaces: [],
            routeOrder: [],
            mood: null,
            date: '',
            startTime: '10:00',
            endTime: '',
            personalNote: '',
            placeNotes: {}, // Заметки для каждого места
            placeTimeSettings: {} // Настройки времени для каждого места: { placeId: { timeMode: 'auto'|'fixed', fixedStartTime: 'HH:MM', durationMinutes: N } }
        };

        this.currentFilter = 'all';
        this.itinerary = []; // Рассчитанное расписание
        this.init();
    }

    init() {
        this.loadState();
        // Временно очищаем состояние для тестирования
        this.clearState();
        this.initModal();
        this.initTabs();
        this.initFilters();
        this.renderPlaces();
        this.renderMoods();
        this.initSecretHeart();
        this.initRoute();
        this.initFinalCard();
        this.buildItinerary(); // Строим расписание при инициализации
        this.updateUI();
    }

    // Инициализация модального окна
    initModal() {
        const trigger = document.getElementById('easter-egg-trigger');
        const modal = document.getElementById('petersburg-modal');
        const closeBtn = document.getElementById('btn-close-petersburg');

        if (!trigger || !modal) return;

        trigger.addEventListener('click', () => this.open());
        closeBtn.addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.close();
            }
        });

        // Заполняем заголовки
        const setTitle = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setTitle('petersburg-title', content.petersburg.title);
        setTitle('petersburg-subtitle', content.petersburg.subtitle);
        setTitle('route-title', content.petersburg.routeTitle);
        setTitle('mood-title', content.petersburg.moodTitle);
        setTitle('date-label', content.petersburg.dateField);
        setTitle('start-time-label', content.petersburg.startTimeField);
        setTitle('end-time-label', content.petersburg.endTimeField);
        setTitle('route-hint', content.petersburg.routeHint);
        setTitle('personal-note-label', content.petersburg.personalNote);
        setTitle('btn-clear-plan', content.petersburg.clearButton);
        setTitle('btn-download-card', content.petersburg.downloadButton);
        setTitle('btn-copy-plan', content.petersburg.copyButton);
    }

    open() {
        const modal = document.getElementById('petersburg-modal');
        modal.classList.remove('hidden');
        this.createOpenBurst();
    }

    close() {
        const modal = document.getElementById('petersburg-modal');
        modal.classList.add('hidden');
        this.saveState();
    }

    createOpenBurst() {
        const trigger = document.getElementById('easter-egg-trigger');
        const rect = trigger.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-heart';

            const angle = (i / 20) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${16 + Math.random() * 12}px;
            `;

            particle.textContent = '♡';
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }
    }

    // Инициализация вкладок
    initTabs() {
        const tabs = document.querySelectorAll('.petersburg-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Обновляем кнопки вкладок
        document.querySelectorAll('.petersburg-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Обновляем контент вкладок
        document.querySelectorAll('.petersburg-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
            content.classList.toggle('hidden', content.id !== `tab-${tabName}`);
        });

        if (tabName === 'final') {
            this.buildItinerary();
            this.renderFinalCard();
        }
    }

    // Инициализация фильтров
    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setFilter(filter);
            });
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderPlaces();
    }

    // Рендер карточек мест
    renderPlaces() {
        const grid = document.getElementById('places-grid');
        if (!grid) return;

        grid.innerHTML = '';

        const filteredPlaces = this.getFilteredPlaces();

        if (filteredPlaces.length === 0) {
            grid.innerHTML = `<div class="empty-state">${content.petersburg.emptyState}</div>`;
            return;
        }

        filteredPlaces.forEach(place => {
            const card = this.createPlaceCard(place);
            grid.appendChild(card);
        });

        this.updateCounter();
    }

    getFilteredPlaces() {
        const places = content.petersburg.places;

        switch (this.currentFilter) {
            case 'food':
                return places.filter(p => p.category === 'food');
            case 'culture':
                return places.filter(p => p.category === 'culture');
            case 'selected':
                return places.filter(p => this.state.selectedPlaces.includes(p.id));
            default:
                return places;
        }
    }

    createPlaceCard(place) {
        const isSelected = this.state.selectedPlaces.includes(place.id);
        const card = document.createElement('div');
        card.className = `place-card ${isSelected ? 'selected' : ''}`;
        card.dataset.placeId = place.id;

        const icon = this.getPlaceIcon(place.icon);

        card.innerHTML = `
            <div class="place-card-icon">${icon}</div>
            <div class="place-card-name">${place.name}</div>
            <div class="place-card-description">${place.description}</div>
            <div class="place-card-actions">
                <button class="place-select-btn ${isSelected ? 'selected' : ''}" data-place-id="${place.id}">
                    ${isSelected ? content.petersburg.selectedButton : content.petersburg.selectButton}
                </button>
                <a href="${place.url}" target="_blank" rel="noopener noreferrer" class="place-card-link">
                    ${content.petersburg.openCardButton}
                </a>
            </div>
        `;

        // Обработчик выбора
        const selectBtn = card.querySelector('.place-select-btn');
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlace(place.id);
        });

        // Эффект клика
        card.addEventListener('click', (e) => {
            if (e.target === selectBtn || e.target.closest('a')) return;
            this.createCardClickEffect(e, card);
        });

        return card;
    }

    getPlaceIcon(iconType) {
        const icons = {
            cafe: '☕',
            cocktail: '🍸',
            museum: '🏛️',
            cake: '🧁',
            sushi: '🍣',
            bowl: '🍜',
            wine: '🍷'
        };
        const icon = icons[iconType] || '📍';
        return `<span style="font-size: 32px;">${icon}</span>`;
    }

    togglePlace(placeId) {
        const index = this.state.selectedPlaces.indexOf(placeId);

        if (index > -1) {
            this.state.selectedPlaces.splice(index, 1);
            this.state.routeOrder = this.state.routeOrder.filter(id => id !== placeId);
        } else {
            this.state.selectedPlaces.push(placeId);
            this.state.routeOrder.push(placeId);
        }

        this.buildItinerary();
        this.renderPlaces();
        this.saveState();
    }

    updateCounter() {
        const counter = document.getElementById('selection-counter');
        if (!counter) return;

        const count = this.state.selectedPlaces.length;
        const total = content.petersburg.places.length;
        counter.textContent = content.petersburg.counter
            .replace('{count}', count)
            .replace('{total}', total);
    }

    createCardClickEffect(event, card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;

        // Проверяем, что клик внутри карточки
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            return;
        }

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle particle-star';

            const angle = (i / 8) * Math.PI * 2;
            const distance = 40 + Math.random() * 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                --tx: ${tx}px;
                --ty: ${ty}px;
                font-size: ${12 + Math.random() * 8}px;
            `;

            particle.textContent = '✦';
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 600);
        }
    }

    // Рендер настроений
    renderMoods() {
        const grid = document.getElementById('moods-grid');
        if (!grid) return;

        grid.innerHTML = '';

        content.petersburg.moods.forEach(mood => {
            const card = document.createElement('div');
            card.className = `mood-card ${this.state.mood === mood.id ? 'selected' : ''}`;
            card.dataset.moodId = mood.id;

            const icon = this.getMoodIcon(mood.id);

            card.innerHTML = `
                <div class="mood-card-icon">${icon}</div>
                <div class="mood-card-name">${mood.name}</div>
                <div class="mood-card-description">${mood.description}</div>
            `;

            card.addEventListener('click', () => {
                this.setMood(mood.id);
            });

            grid.appendChild(card);
        });

        // Восстанавливаем личную заметку
        const noteInput = document.getElementById('personal-note');
        if (noteInput) {
            noteInput.value = this.state.personalNote;
            noteInput.addEventListener('input', (e) => {
                this.state.personalNote = e.target.value;
                this.saveState();
            });
        }
    }

    getMoodIcon(moodId) {
        const icons = {
            cozy: '🏠',
            adventure: '🍽️',
            beautiful: '📸',
            cultural: '🎭',
            spontaneous: '🎲'
        };
        return icons[moodId] || '💫';
    }

    setMood(moodId) {
        this.state.mood = moodId;
        this.buildItinerary();
        this.renderMoods();
        this.saveState();
    }

    // Секретное сердечко
    initSecretHeart() {
        const secretHeart = document.getElementById('secret-heart');
        const secretMessage = document.getElementById('secret-message');

        if (!secretHeart) return;

        secretHeart.addEventListener('click', () => {
            secretMessage.textContent = content.petersburg.secretMessage;
            secretMessage.classList.remove('hidden');

            // Создаём эффект
            const rect = secretHeart.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle particle-heart';

                const angle = (i / 12) * Math.PI * 2;
                const distance = 50 + Math.random() * 30;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                particle.style.cssText = `
                    left: ${centerX}px;
                    top: ${centerY}px;
                    --tx: ${tx}px;
                    --ty: ${ty}px;
                    font-size: ${14 + Math.random() * 10}px;
                `;

                particle.textContent = '♡';
                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 800);
            }
        });
    }

    // Режим маршрута
    initRoute() {
        const dateInput = document.getElementById('route-date');
        if (dateInput) {
            dateInput.value = this.state.date;
            dateInput.addEventListener('change', (e) => {
                this.state.date = e.target.value;
                this.buildItinerary();
                this.saveState();
            });
        }

        const startTimeInput = document.getElementById('route-start-time');
        if (startTimeInput) {
            startTimeInput.value = this.state.startTime;
            startTimeInput.addEventListener('change', (e) => {
                this.state.startTime = e.target.value;
                this.buildItinerary();
                this.saveState();
            });
        }

        const endTimeInput = document.getElementById('route-end-time');
        if (endTimeInput) {
            endTimeInput.value = this.state.endTime;
            endTimeInput.addEventListener('change', (e) => {
                this.state.endTime = e.target.value;
                this.buildItinerary();
                this.saveState();
            });
        }

        const clearBtn = document.getElementById('btn-clear-plan');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm(content.petersburg.clearConfirm)) {
                    this.clearPlan();
                }
            });
        }

        this.renderRoute();
    }

    renderRoute() {
        const routeList = document.getElementById('route-list');
        if (!routeList) return;

        routeList.innerHTML = '';

        if (this.state.routeOrder.length === 0) {
            routeList.innerHTML = `<div class="empty-state">${content.petersburg.emptyState}</div>`;
            return;
        }

        // Показываем расписание для каждого места
        this.itinerary.forEach((item) => {
            const place = content.petersburg.places.find(p => p.id === item.placeId);
            if (!place) return;

            const index = item.index - 1;
            const note = this.state.placeNotes[item.placeId] || {};
            const timeSettings = this.state.placeTimeSettings[item.placeId] || {
                timeMode: 'auto',
                fixedStartTime: null,
                durationMinutes: null
            };

            const isFixed = timeSettings.timeMode === 'fixed';

            const routeItem = document.createElement('div');
            routeItem.className = 'route-item';

            routeItem.innerHTML = `
                <div class="route-item-header">
                    <span class="route-item-name">${item.index}. ${place.name}</span>
                    <div class="route-item-time">${item.startTime}–${item.endTime} (${item.duration} мин)</div>
                </div>
                ${item.warning ? `<div class="route-item-warning">${item.warning}</div>` : ''}
                <div class="route-item-actions">
                    <button class="route-action-btn move-up" data-place-id="${item.placeId}" ${index === 0 ? 'disabled' : ''}>
                        ↑
                    </button>
                    <button class="route-action-btn move-down" data-place-id="${item.placeId}" ${index === this.state.routeOrder.length - 1 ? 'disabled' : ''}>
                        ↓
                    </button>
                    <button class="route-action-btn delete" data-place-id="${item.placeId}">
                        ✕
                    </button>
                </div>
                <div class="route-item-fields">
                    <div class="route-time-mode">
                        <label class="route-mode-label">
                            <input type="radio" name="time-mode-${item.placeId}" value="auto" ${!isFixed ? 'checked' : ''} data-place-id="${item.placeId}">
                            Автоматически
                        </label>
                        <label class="route-mode-label">
                            <input type="radio" name="time-mode-${item.placeId}" value="fixed" ${isFixed ? 'checked' : ''} data-place-id="${item.placeId}">
                            Задать время
                        </label>
                    </div>
                    ${isFixed ? `
                        <div class="route-time-inputs">
                            <input type="time" class="route-field time-field" data-place-id="${item.placeId}"
                                   value="${timeSettings.fixedStartTime || ''}" placeholder="ЧЧ:ММ">
                        </div>
                    ` : ''}
                    <div class="route-duration-input">
                        <label class="route-duration-label">Длительность (мин):</label>
                        <input type="number" class="route-field duration-field" data-place-id="${item.placeId}"
                               value="${timeSettings.durationMinutes || item.duration}" min="15" step="15">
                    </div>
                    <input type="text" class="route-field note-field" data-place-id="${item.placeId}"
                           placeholder="${content.petersburg.noteField}" value="${note.note || ''}">
                </div>
            `;

            // Обработчики кнопок
            routeItem.querySelector('.move-up').addEventListener('click', () => this.movePlaceUp(index));
            routeItem.querySelector('.move-down').addEventListener('click', () => this.movePlaceDown(index));
            routeItem.querySelector('.delete').addEventListener('click', () => this.removePlace(item.placeId));

            // Обработчик переключения режима времени
            routeItem.querySelectorAll('input[name="time-mode-' + item.placeId + '"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateTimeMode(item.placeId, e.target.value);
                });
            });

            // Обработчик поля времени (для ручного режима)
            const timeField = routeItem.querySelector('.time-field');
            if (timeField) {
                timeField.addEventListener('change', (e) => {
                    this.updateFixedStartTime(item.placeId, e.target.value);
                });
            }

            // Обработчик поля длительности
            routeItem.querySelector('.duration-field').addEventListener('change', (e) => {
                this.updateDuration(item.placeId, parseInt(e.target.value) || 60);
            });

            // Обработчик поля заметки
            routeItem.querySelector('.note-field').addEventListener('input', (e) => {
                this.updatePlaceNote(item.placeId, 'note', e.target.value);
            });

            routeList.appendChild(routeItem);
        });
    }

    movePlaceUp(index) {
        if (index === 0) return;
        const temp = this.state.routeOrder[index];
        this.state.routeOrder[index] = this.state.routeOrder[index - 1];
        this.state.routeOrder[index - 1] = temp;
        this.buildItinerary();
        this.renderRoute();
        this.saveState();
    }

    movePlaceDown(index) {
        if (index === this.state.routeOrder.length - 1) return;
        const temp = this.state.routeOrder[index];
        this.state.routeOrder[index] = this.state.routeOrder[index + 1];
        this.state.routeOrder[index + 1] = temp;
        this.buildItinerary();
        this.renderRoute();
        this.saveState();
    }

    removePlace(placeId) {
        this.state.routeOrder = this.state.routeOrder.filter(id => id !== placeId);
        this.state.selectedPlaces = this.state.selectedPlaces.filter(id => id !== placeId);
        delete this.state.placeNotes[placeId];
        delete this.state.placeTimeSettings[placeId];
        this.buildItinerary();
        this.renderRoute();
        this.renderPlaces();
        this.saveState();
    }

    updatePlaceNote(placeId, field, value) {
        if (!this.state.placeNotes[placeId]) {
            this.state.placeNotes[placeId] = {};
        }
        this.state.placeNotes[placeId][field] = value;
        this.buildItinerary();
        this.saveState();
    }

    updateTimeMode(placeId, mode) {
        if (!this.state.placeTimeSettings[placeId]) {
            this.state.placeTimeSettings[placeId] = {};
        }
        this.state.placeTimeSettings[placeId].timeMode = mode;
        this.buildItinerary();
        this.renderRoute();
        this.saveState();
    }

    updateFixedStartTime(placeId, time) {
        if (!this.state.placeTimeSettings[placeId]) {
            this.state.placeTimeSettings[placeId] = {};
        }
        this.state.placeTimeSettings[placeId].fixedStartTime = time;
        this.state.placeTimeSettings[placeId].timeMode = 'fixed';
        this.buildItinerary();
        this.renderRoute();
        this.saveState();
    }

    updateDuration(placeId, duration) {
        if (!this.state.placeTimeSettings[placeId]) {
            this.state.placeTimeSettings[placeId] = {};
        }
        this.state.placeTimeSettings[placeId].durationMinutes = duration;
        this.buildItinerary();
        this.renderRoute();
        this.saveState();
    }

    clearPlan() {
        this.state.selectedPlaces = [];
        this.state.routeOrder = [];
        this.state.mood = null;
        this.state.date = '';
        this.state.startTime = '10:00';
        this.state.endTime = '';
        this.state.personalNote = '';
        this.state.placeNotes = {};
        this.state.placeTimeSettings = {};
        this.itinerary = [];

        // Очищаем поля ввода
        const dateInput = document.getElementById('route-date');
        if (dateInput) dateInput.value = '';

        const startTimeInput = document.getElementById('route-start-time');
        if (startTimeInput) startTimeInput.value = '10:00';

        const endTimeInput = document.getElementById('route-end-time');
        if (endTimeInput) endTimeInput.value = '';

        this.renderPlaces();
        this.renderRoute();
        this.renderMoods();
        this.updateCounter();
        this.saveState();
    }

    // Итоговая открытка
    initFinalCard() {
        const copyBtn = document.getElementById('btn-copy-plan');
        const downloadBtn = document.getElementById('btn-download-card');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyPlan());
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadCard());
        }
    }

    renderFinalCard() {
        document.getElementById('final-card-title').textContent = content.petersburg.finalTitle;

        // Дата
        const dateEl = document.getElementById('final-card-date');
        if (this.state.date) {
            dateEl.textContent = this.formatDate(this.state.date);
        } else {
            dateEl.textContent = '';
        }

        // Настроение
        const moodEl = document.getElementById('final-card-mood');
        if (this.state.mood) {
            const mood = content.petersburg.moods.find(m => m.id === this.state.mood);
            moodEl.textContent = `${this.getMoodIcon(this.state.mood)} ${mood.name}`;
        } else {
            moodEl.textContent = '';
        }

        // Маршрут с расписанием и временной линией
        const routeEl = document.getElementById('final-card-route');
        if (this.itinerary.length > 0) {
            const transitionBuffer = content.petersburg.durationSettings.transition || 30;
            
            let routeHTML = '';
            
            this.itinerary.forEach((item, index) => {
                const place = content.petersburg.places.find(p => p.id === item.placeId);
                const note = this.state.placeNotes[item.placeId] || {};
                const icon = this.getPlaceIcon(place.icon);

                let noteText = '';
                if (note.note) {
                    noteText = `<div class="final-route-note">${note.note}</div>`;
                }

                // Метка ручного времени
                let timeModeLabel = '';
                if (item.timeMode === 'fixed') {
                    timeModeLabel = `<div class="final-route-fixed-label">Время выбрано вручную</div>`;
                }

                routeHTML += `
                    <div class="final-route-item">
                        <div class="final-route-time">${item.startTime}–${item.endTime}</div>
                        <div class="final-route-content">
                            <div class="final-route-icon">${icon}</div>
                            <div class="final-route-details">
                                <div class="final-route-number">${item.index}. ${place.name}</div>
                                <div class="final-route-duration">${item.duration} мин</div>
                                ${noteText}
                                ${timeModeLabel}
                            </div>
                        </div>
                    </div>
                `;

                // Добавляем переход между остановками (если не последняя)
                if (index < this.itinerary.length - 1) {
                    routeHTML += `
                        <div class="final-route-transition">
                            <div class="final-route-transition-icon">🚶</div>
                            <div class="final-route-transition-text">${transitionBuffer} минут на дорогу и небольшой перерыв</div>
                        </div>
                    `;
                }
            });

            routeEl.innerHTML = routeHTML;
        } else {
            routeEl.innerHTML = `<div class="empty-state">${content.petersburg.emptyRoute}</div>`;
        }

        // Заметки
        const notesEl = document.getElementById('final-card-notes');
        if (this.state.personalNote) {
            notesEl.textContent = this.state.personalNote;
        } else {
            notesEl.textContent = '';
        }

        // Добавляем финальную фразу под заметками
        const footerEl = document.getElementById('final-card-footer-text');
        if (footerEl) {
            footerEl.textContent = 'Главное место в моём плане — рядом с тобой ♡';
        }
    }

    copyPlan() {
        let text = `${content.petersburg.finalTitle}\n\n`;

        if (this.state.date) {
            text += `📅 ${this.formatDate(this.state.date)}\n\n`;
        }

        if (this.state.mood) {
            const mood = content.petersburg.moods.find(m => m.id === this.state.mood);
            text += `${this.getMoodIcon(this.state.mood)} ${mood.name}\n\n`;
        }

        text += '📍 Наш маршрут:\n';

        this.itinerary.forEach((item) => {
            const place = content.petersburg.places.find(p => p.id === item.placeId);
            const note = this.state.placeNotes[item.placeId] || {};
            text += `${item.index}. ${item.startTime}–${item.endTime} — ${place.name}`;
            if (note.note) text += `\n   Заметка: ${note.note}`;
            text += '\n';
        });

        if (this.state.personalNote) {
            text += `\n💭 ${this.state.personalNote}`;
        }

        navigator.clipboard.writeText(text).then(() => {
            alert('План скопирован в буфер обмена!');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
        });
    }

    // Сохранение и загрузка состояния
    saveState() {
        try {
            localStorage.setItem('petersburg-planner', JSON.stringify(this.state));
        } catch (e) {
            console.error('Ошибка сохранения состояния:', e);
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem('petersburg-planner');
            if (saved) {
                this.state = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Ошибка загрузки состояния:', e);
        }
    }

    // Очистка состояния при первой загрузке (для тестирования)
    clearStateIfEmpty() {
        if (this.state.selectedPlaces.length === 0 && this.state.routeOrder.length === 0) {
            return; // Если уже пусто, не нужно очищать
        }
        // Если нужно принудительно очистить, можно вызвать clearState()
    }

    // Временная функция для очистки состояния (для отладки)
    clearState() {
        localStorage.removeItem('petersburg-planner');
        this.state = {
            selectedPlaces: [],
            routeOrder: [],
            mood: null,
            date: '',
            startTime: '10:00',
            endTime: '',
            personalNote: '',
            placeNotes: {},
            placeTimeSettings: {}
        };
        this.renderPlaces();
        this.renderRoute();
        this.renderMoods();
        this.updateCounter();
    }

    updateUI() {
        this.updateCounter();
        this.renderMoods();
    }

    // Форматирование даты в красивом русском формате
    formatDate(dateString) {
        if (!dateString) return '';

        try {
            // date input возвращает YYYY-MM-DD, парсим как локальную дату
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month - 1 потому что месяцы в JS 0-11

            if (isNaN(date.getTime())) return '';

            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('ru-RU', options);
        } catch (e) {
            console.error('Ошибка форматирования даты:', e);
            return dateString;
        }
    }

    // Автоматический расчёт расписания с поддержкой ручного режима
    buildItinerary() {
        if (this.state.routeOrder.length === 0) {
            this.itinerary = [];
            return;
        }

        const startTime = this.state.startTime || '10:00';
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const transitionBuffer = content.petersburg.durationSettings.transition || 30;

        let currentTime = startHours * 60 + startMinutes; // в минутах с начала дня
        let previousEndTime = null;

        this.itinerary = this.state.routeOrder.map((placeId, index) => {
            const place = content.petersburg.places.find(p => p.id === placeId);
            if (!place) return null;

            // Получаем настройки времени для этого места
            const timeSettings = this.state.placeTimeSettings[placeId] || {
                timeMode: 'auto',
                fixedStartTime: null,
                durationMinutes: null
            };

            // Определяем длительность
            let duration = timeSettings.durationMinutes;
            if (!duration) {
                // Если не задана вручную, берём из настроек категории
                if (place.category === 'culture') {
                    duration = content.petersburg.durationSettings.culture || 180;
                } else if (place.category === 'food') {
                    if (place.icon === 'cake' || place.name.toLowerCase().includes('пирож') || place.name.toLowerCase().includes('слад')) {
                        duration = content.petersburg.durationSettings.cafe || 45;
                    } else if (place.icon === 'wine' || place.name.toLowerCase().includes('вино') || place.name.toLowerCase().includes('bar')) {
                        duration = content.petersburg.durationSettings.restaurant || 90;
                    } else {
                        duration = content.petersburg.durationSettings.restaurant || 90;
                    }
                } else {
                    duration = 60;
                }
            }

            // Определяем время начала
            let startTimeMinutes;
            let warning = null;

            if (timeSettings.timeMode === 'fixed' && timeSettings.fixedStartTime) {
                // Ручной режим: берём установленное время
                const [fixedHours, fixedMinutes] = timeSettings.fixedStartTime.split(':').map(Number);
                startTimeMinutes = fixedHours * 60 + fixedMinutes;

                // Проверяем конфликт с предыдущей остановкой
                if (previousEndTime && startTimeMinutes < previousEndTime) {
                    warning = 'Эта остановка начинается раньше, чем заканчивается предыдущая';
                }
            } else {
                // Автоматический режим: время начала = окончание предыдущей + буфер
                if (previousEndTime) {
                    startTimeMinutes = previousEndTime + transitionBuffer;
                } else {
                    startTimeMinutes = currentTime;
                }
            }

            const endTimeMinutes = startTimeMinutes + duration;

            // Форматируем время
            const formatTime = (minutes) => {
                const h = Math.floor(minutes / 60);
                const m = minutes % 60;
                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            };

            const result = {
                placeId,
                index: index + 1,
                startTime: formatTime(startTimeMinutes),
                endTime: formatTime(endTimeMinutes),
                duration,
                durationMinutes: duration,
                startMinutes: startTimeMinutes,
                endMinutes: endTimeMinutes,
                timeMode: timeSettings.timeMode,
                fixedStartTime: timeSettings.fixedStartTime,
                category: place.category,
                warning: warning
            };

            previousEndTime = endTimeMinutes;

            return result;
        }).filter(item => item !== null);
    }

    // Скачивание открытки как PNG
    async downloadCard() {
        const downloadBtn = document.getElementById('btn-download-card');
        if (!downloadBtn) return;

        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = content.petersburg.preparingCard;
        downloadBtn.disabled = true;

        try {
            console.log('Начинаем создание открытки...');

            // Переключаемся на вкладку final
            this.switchTab('final');

            // Пересчитываем расписание и обновляем открытку
            this.buildItinerary();
            this.renderFinalCard();

            const finalCard = document.getElementById('final-card');
            if (!finalCard) {
                throw new Error('Элемент открытки не найден');
            }

            console.log('Элемент открытки найден');

            // Ждём загрузки всех изображений и рендеринга
            await new Promise(resolve => setTimeout(resolve, 800));

            console.log('Начинаем html2canvas...');

            const canvas = await html2canvas(finalCard, {
                backgroundColor: '#FFF8F1',
                scale: 2, // Увеличиваем разрешение
                logging: true,
                useCORS: true,
                allowTaint: true,
                imageTimeout: 5000
            });

            console.log('Canvas создан, размер:', canvas.width, 'x', canvas.height);

            // Создаём Blob и скачиваем
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Не удалось создать Blob');
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'nashe-puteshestvie-v-peterburg.png';
                link.href = url;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);

                console.log('Изображение скачано');
            }, 'image/png');

        } catch (error) {
            console.error('Ошибка при создании изображения:', error);
            alert(content.petersburg.downloadError + '\n\nОшибка: ' + error.message);
        } finally {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }
    }
}

// Инициализация планера
let petersburgPlanner;
document.addEventListener('DOMContentLoaded', () => {
    petersburgPlanner = new PetersburgPlanner();
});
