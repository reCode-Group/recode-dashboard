const proTips = [
  'Используйте <kbd>Ctrl + C</kbd> и <kbd>Ctrl + V</kbd> для быстрого копирования и вставки блоков.',
  'Зажимайте <kbd>Shift</kbd> при перетаскивании блока для создания его копии.',
  'Двойной клик по блоку сворачивает/разворачивает его содержимое для экономии места.',
  'Используйте <kbd>Ctrl + Z</kbd> для отмены и <kbd>Ctrl + Y</kbd> для повтора последнего действия.',
  'Нажмите <kbd>Tab</kbd> для быстрой навигации между полями ввода внутри блока.',
];

function getRandomTip() {
  return proTips[Math.floor(Math.random() * proTips.length)];
}

export function updateProTip() {
  const tipElement = document.querySelector('.pro-tip p');
  if (tipElement) tipElement.innerHTML = getRandomTip();
}

export function initTips() {
  updateProTip();

  const proTipElement = document.querySelector('.pro-tip');
  const onClick = () => updateProTip();

  proTipElement?.addEventListener('click', onClick);

  return () => {
    proTipElement?.removeEventListener('click', onClick);
  };
}
