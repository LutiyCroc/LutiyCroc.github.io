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
        description: "Хотя все уже распланировали давно, ну ладно",

        // Места для посещения
        places: [
            {
                id: 1,
                name: "Город 812",
                category: "food",
                description: "Уютное кафе",
                url: "https://gorod812-cafe.ru/",
                icon: "cafe"
            },
            {
                id: 2,
                name: "John Doe",
                category: "food",
                description: "Стильное заведение",
                url: "https://john-doe.ru/",
                icon: "cocktail"
            },
            {
                id: 3,
                name: "Эрмитаж",
                category: "culture",
                description: "Ну надо сходить сто проц",
                url: "https://www.hermitagemuseum.org/",
                icon: "museum"
            },
            {
                id: 4,
                name: "Пуси Лебеди",
                category: "food",
                description: "Милые пирожные",
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
            },
            {
                id: 8,
                name: "Jungle",
                category: "food",
                description: "Атмосферный ресторан с тропическим вайбомом",
                url: "https://ko-restaurants.ru/r/jungle",
                icon: "jungle"
            },
            {
                id: 9,
                name: "Лахта центр",
                category: "culture",
                description: "Москоу сити 2.0",
                url: "https://lakhta.center/",
                icon: "landmark"
            },
            {
                id: 10,
                name: "Исаакиевский собор",
                category: "culture",
                description: "Красивейший собор Санкт-Петербурга",
                url: "https://ru.wikipedia.org/wiki/%D0%98%D1%81%D0%B0%D0%B0%D0%BA%D0%B8%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_%D1%81%D0%BE%D0%B1%D0%BE%D1%80",
                icon: "cathedral"
            },
            {
                id: 11,
                name: "Елагин остров",
                category: "culture",
                description: "Прекрасный парк для прогулок",
                url: "https://elaginpark.org/",
                icon: "park"
            },
            {
                id: 12,
                name: "Бары на Рубенштейна",
                category: "food",
                description: "Футбольчик",
                url: "",
                icon: "bar"
            },
            {
                id: 13,
                name: "Буше",
                category: "food",
                description: "Че-нить пожрать",
                url: "https://bushe.ru/en",
                icon: "cafe"
            },
            {
                id: 14,
                name: "Мазапарк",
                category: "culture",
                description: "Место для жестких тусовок с игровыми автоматами",
                url: "https://mazapark.ru/",
                icon: "ship"
            },
            {
                id: 15,
                name: "Прогулка на катере",
                category: "culture",
                description: "Романтическая поездка по каналам Санкт-Петербурга",
                url: "",
                icon: "ship"
            },
            {
                id: 16,
                name: "Мост поцелуев",
                category: "culture",
                description: "XOXOXO",
                url: "https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%86%D0%B5%D0%BB%D1%83%D0%B5%D0%B2_%D0%BC%D0%BE%D1%81%D1%82",
                icon: "bridge"
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
        secretMessage: "Я так рад, что у нас с тобой получилось поехать в Питер. Полин, ты - мое счастье. Я готов разделить эту жизнь с тобой.",
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
