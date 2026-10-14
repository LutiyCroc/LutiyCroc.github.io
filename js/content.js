// Конфигурация контента проекта
// Все тексты и сообщения редактируются здесь

const content = {
    // Экран 1: Старт
    intro: {
        title: "С днем рождения, Любовь моя!",
        catSpeech: "От всего сердца",
        buttonText: "Открыть"
    },

    // Экран 2: Сбор сердечек
    hearts: {
        messages: [
            "Ты заслуживаешь только лучшие подарки!",
            "Пусть только счатье будет в твоей жизни!",
            "Ты - самый прекрасный человек во всем мире!"
        ],
        completeText: "Все сердечки собраны! Ты просто крашиха!",
        progressLabel: "Собрано сердечек:"
    },

    // Экран 3: Подарки
    gifts: {
        messages: [
            "Ты - моя радость, даже в самые грустные дни 🤗",
            "Ты - самое чудесное, что было в моей жизни! 💗",
            "Ты кста ща в Питере! 🤩🤩🤩"
        ],
        continueButton: "Продолжить ♡"
    },

    // Экран 4: Планер Санкт-Петербурга
    petersburg: {
        title: "Куда пойдем?",
        subtitle: "",
        description: "Выбери места для нашего романтического путешествия",

        // Места для посещения
        places: [
            {
                id: 1,
                name: "Город 812",
                category: "food",
                description: "Уютное кафе с атмосферой Петербурга",
                url: "https://gorod812-cafe.ru/",
                icon: "cafe"
            },
            {
                id: 2,
                name: "John Doe",
                category: "food",
                description: "Стильное заведение для особенных моментов",
                url: "https://john-doe.ru/",
                icon: "cocktail"
            },
            {
                id: 3,
                name: "Эрмитаж",
                category: "culture",
                description: "Один из величайших музеев мира",
                url: "https://www.hermitagemuseum.org/",
                icon: "museum"
            },
            {
                id: 4,
                name: "Пуси Лебеди",
                category: "food",
                description: "Милые пирожные для сладких моментов",
                url: "https://pusylebedi.ru/",
                icon: "cake"
            },
            {
                id: 5,
                name: "Subzero Sushi",
                category: "food",
                description: "Свежие суши и японская кухня",
                url: "https://subzerosushi.ru/cities/saint-petersburg",
                icon: "sushi"
            },
            {
                id: 6,
                name: "Ramen Wok",
                category: "food",
                description: "Настоящий рамен для тёплых вечеров",
                url: "https://ramenwok.ru/",
                icon: "bowl"
            },
            {
                id: 7,
                name: "Sky Wine Bar",
                category: "food",
                description: "Вино и вид на город с высоты",
                url: "https://skywinebar.ru/",
                icon: "wine"
            }
        ],

        // Фильтры
        filters: {
            all: "Все",
            food: "Еда",
            culture: "Места",
            selected: "Выбранное"
        },

        // Настроения свидания
        moods: [
            {
                id: "cozy",
                name: "Уютный день",
                description: "Теплые места и спокойный вайб"
            },
            {
                id: "adventure",
                name: "Гастрономический оргазм",
                description: "По рестикам, по барам."
            },
            {
                id: "beautiful",
                name: "Фотосетик",
                description: "Места для красивых снимков"
            },
            {
                id: "cultural",
                name: "День просвещения",
                description: "Музеи и история города"
            },
            {
                id: "spontaneous",
                name: "На импровизации",
                description: ""
            }
        ],

        // Тексты интерфейса
        selectButton: "Хочу сюда",
        selectedButton: "Выбрано ♡",
        counter: "Ты выбрала {count} из {total} мест",
        emptyState: "Ну не можем же мы в Питере просто дома отсиживаться 😢",
        routeTitle: "Дата",
        moodTitle: "На каком вайбе",
        openCardButton: "Сайт",
        finalTitle: "Санкт-Петербург",
        downloadButton: "Скачать",
        copyButton: "Скопировать план",
        clearButton: "Очистить план",
        clearConfirm: "Ну как хош",
        personalNote: "Комментарий",
        secretMessage: "Мой план — быть рядом с тобой ♡",
        moveUp: "↑",
        moveDown: "↓",
        remove: "✕",
        dateField: "Дата",
        startTimeField: "Начало дня",
        endTimeField: "Когда хотим закончить (необязательно)",
        routeHint: "Время посещения рассчитывается автоматически. Его можно изменить для каждого места.",
        preparingCard: "Погоди немного...",
        downloadError: "Чет не вышло. Попробуй ещё раз.",
        emptyRoute: "Ну не можем же мы в Питере просто дома отсиживаться 😢",
        whenField: "Когда",
        noteField: "Заметка",
        planField: "Что в планах",
        timeModeAuto: "Автоматически",
        timeModeFixed: "Задать время",
        durationLabel: "Длительность (мин):",
        timeConflictWarning: "Накладочка получается. Попробуй выбрать другое время",

        // Настройки длительности посещения (в минутах)
        durationSettings: {
            culture: 180, // 3 часа для Эрмитажа
            restaurant: 90, // 1.5 часа для ресторанов
            cafe: 45, // 45 минут для кофе/десерта
            transition: 30 // 30 минут на переход между местами
        }
    },

    // Экран 5: Финальная открытка
    final: {
        title: "Вам письмо от Трошина Максима Андреевича (💗)",
        openButton: "Открыть письмо ♡",
        // Заглушка для личного поздравления - замените на реальный текст
        message: `
            Дорогая Полиночка!
            
            Пусть каждый твой день будет наполнен счастьем, теплом и любовью.
            Ты - удивительный человек, который делает эту жизнь намного ярче.
            
            Пусть все твои мечты сбудутся как можно раньше!
            Люблю тебя оч сильно.
            
            С юбилеем, кошечка моя! 🎂
            
            <!-- ЗАМЕНИТЕ ЭТОТ ТЕКСТ НА ВАШЕ ЛИЧНОЕ ПОЗДРАВЛЕНИЕ -->
        `,
        signature: "Обнимаю тебя крепко-крепко. ♡ и целую в засос 💦 Открой кстати там в углу ->"
    },

    // Ассеты изображений
    assets: {
        mainCat: "assets/images/cat-main.svg",
        happyCat: "assets/images/cat-happy.svg",
        travelCat: "assets/images/cat-travel.svg",
        finalCat: "assets/images/cat-final.svg"
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = content;
}
