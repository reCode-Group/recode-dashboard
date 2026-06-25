// Массив советов
const proTips = [
    "Используйте <kbd>Ctrl + C</kbd> и <kbd>Ctrl + V</kbd> для быстрого копирования и вставки блоков.",
    "Зажимайте <kbd>Shift</kbd> при перетаскивании блока для создания его копии.",
    "Двойной клик по блоку сворачивает/разворачивает его содержимое для экономии места.",
    "Используйте <kbd>Ctrl + Z</kbd> для отмены и <kbd>Ctrl + Y</kbd> для повтора последнего действия.",
    "Нажмите <kbd>Tab</kbd> для быстрой навигации между полями ввода внутри блока."
];

// Функция для получения случайного совета
function getRandomTip() {
    return proTips[Math.floor(Math.random() * proTips.length)];
}

// Функция для обновления совета на странице
function updateProTip() {
    const tipElement = document.querySelector('.pro-tip p');
    if (tipElement) {
        tipElement.innerHTML = getRandomTip();
    }
}

// Обновляем совет при загрузке страницы
document.addEventListener('DOMContentLoaded', updateProTip);

// Также можно обновлять при клике на совет
document.querySelector('.pro-tip')?.addEventListener('click', function() {
    updateProTip();
});