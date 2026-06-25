// Массив проектов
const projects = [
    {
        id: 1,
        name: 'Без_названия_проект_001.rcd',
        lastModified: '2 часа назад',
        createdDate: '15.01.2024',
        status: 'active'
    },
    {
        id: 2,
        name: 'Без_названия_проект_002.rcd',
        lastModified: 'Вчера',
        createdDate: '10.01.2024',
        status: 'active'
    },
    {
        id: 3,
        name: 'Без_названия_проект_003.rcd',
        lastModified: '3 дня назад',
        createdDate: '05.01.2024',
        status: 'inactive'
    },
    {
        id: 4,
        name: 'Без_названия_проект_004.rcd',
        lastModified: 'Неделю назад',
        createdDate: '25.12.2023',
        status: 'active'
    },
    {
        id: 5,
        name: 'Без_названия_проект_005.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    },
    {
        id: 6,
        name: 'Без_названия_проект_006.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    },
    {
        id: 7,
        name: 'Без_названия_проект_007.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    },
    {
        id: 8,
        name: 'Без_названия_проект_008.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    },
    {
        id: 9,
        name: 'Без_названия_проект_009.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    },
    {
        id: 10,
        name: 'Без_названия_проект_010.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    },
    {
        id: 11,
        name: 'Без_названия_проект_011.rcd',
        lastModified: '2 недели назад',
        createdDate: '15.12.2023',
        status: 'active'
    }
];

// Открытие модального окна
function openModal() {
    const modal = document.getElementById('projectsModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Загружаем проекты
    loadProjects();

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('projectsModal');
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Загрузка проектов в таблицу
function loadProjects() {
    const tableBody = document.getElementById('projectsTableBody');
    tableBody.innerHTML = '';

    projects.forEach(project => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.setAttribute('data-project-id', project.id);

        row.innerHTML = `
      <div class="table-cell name-cell">
        <span class="status-dot ${project.status}"></span>
        ${project.name}
      </div>
      <div class="table-cell modified-cell">
        ${project.lastModified}
      </div>
      <div class="table-cell created-cell">
        ${project.createdDate}
      </div>
      <div class="table-cell actions-cell">
        <button class="action-btn" onclick="openProject(${project.id})" title="Открыть проект">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10 6H6C5.46957 6 4.96086 6.21071 4.58579 6.58579C4.21071 6.96086 4 7.46957 4 8V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

        // Добавляем обработчик клика на строку
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.action-btn')) {
                selectProject(project.id);
            }
        });

        tableBody.appendChild(row);
    });
}

// Выбор проекта
function selectProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        console.log('Выбран проект:', project.name);

        // Убираем выделение у всех строк
        document.querySelectorAll('.table-row').forEach(row => {
            row.classList.remove('selected');
        });

        // Добавляем выделение выбранной строке
        const selectedRow = document.querySelector(`[data-project-id="${projectId}"]`);
        if (selectedRow) {
            selectedRow.classList.add('selected');
        }

        // Закрываем модалку через секунду (или оставляем открытой)
        // setTimeout(closeModal, 1000);
    }
}

// Открытие проекта (кнопка ссылки)
function openProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        alert(`Открываем проект: ${project.name}`);
        // Здесь будет логика открытия проекта
        closeModal();
    }
}

// Создание нового проекта
function createNewProject() {
    const projectName = prompt('Введите название нового проекта:', 'Новый проект');

    if (projectName && projectName.trim() !== '') {
        const newProject = {
            id: projects.length + 1,
            name: projectName.trim(),
            lastModified: 'Только что',
            createdDate: new Date().toLocaleDateString('ru-RU'),
            status: 'active'
        };

        projects.unshift(newProject); // Добавляем в начало
        loadProjects(); // Обновляем таблицу
        console.log('Создан новый проект:', projectName);
    }
}

// Закрытие по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Закрытие по клику на оверлей
document.getElementById('projectsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

function openProjectEditModal() {
    const modal = document.getElementById('projectEditModal');
    const currentName = document.querySelector('.project-name').textContent;
    const input = document.getElementById('projectNameInput');

    // Устанавливаем текущее имя в поле ввода
    input.value = currentName;

    // Показываем модалку
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.style.opacity = '1';
        input.focus();
        input.select();
    }, 10);
}

// Закрытие модалки
function closeProjectEditModal() {
    const modal = document.getElementById('projectEditModal');
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Сохранение названия проекта
function saveProjectName() {
    const input = document.getElementById('projectNameInput');
    const newName = input.value.trim();

    if (!newName) {
        alert('Введите название проекта');
        input.focus();
        return;
    }

    // Обновляем имя в существующей разметке
    document.querySelector('.project-name').textContent = newName;

    // Закрываем модалку
    closeProjectEditModal();

    // Можно сохранить в localStorage
    localStorage.setItem('projectName', newName);
}

// Закрытие по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('projectEditModal').style.display === 'flex') {
        closeProjectEditModal();
    }
});

// Закрытие по клику на оверлей
document.getElementById('projectEditModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeProjectEditModal();
    }
});

// Сохранение по Enter в поле ввода
document.getElementById('projectNameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        saveProjectName();
    }
});

// Загрузка сохраненного имени при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const savedName = localStorage.getItem('projectName');
    if (savedName) {
        document.querySelector('.project-name').textContent = savedName;
    }
});

// Открытие модалки с полным кодом
function openCodeFullModal() {
    const modal = document.getElementById('codeFullModal');
    const codeElement = document.getElementById('generatedCode');
    const fullCodeElement = document.getElementById('fullGeneratedCode');

    // Получаем текущий код и язык
    const code = codeElement.textContent;
    const language = getSelectedLanguage();
    const languageNames = {
        js: 'JavaScript',
        lua: 'Lua',
        py: 'Python'
    };
    const languageName = languageNames[language] || 'JavaScript';

    // Устанавливаем код и язык
    fullCodeElement.textContent = code;
    fullCodeElement.className = language;
    document.getElementById('fullCodeLanguage').textContent = languageName;

    // Показываем модалку
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Закрытие модалки с полным кодом
function closeCodeFullModal() {
    const modal = document.getElementById('codeFullModal');
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Копирование полного кода
function copyFullCode() {
    const codeToCopy = document.getElementById('fullGeneratedCode').textContent;

    navigator.clipboard.writeText(codeToCopy)
        .then(() => {
            showNotification('Код скопирован в буфер обмена!', 'success');
        })
        .catch(err => {
            console.error('Ошибка копирования:', err);
            showNotification('Ошибка при копировании кода', 'error');
        });
}

// Скачивание полного кода
function downloadFullCode() {
    const codeToDownload = document.getElementById('fullGeneratedCode').textContent;
    const language = getSelectedLanguage();
    const languageExtensions = {
        js: 'js',
        lua: 'lua',
        py: 'py'
    };
    const extension = languageExtensions[language] || 'js';
    const filename = `generated_code_${Date.now()}.${extension}`;

    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Код скачан!', 'success');
}

// Получение выбранного языка (добавьте в существующие функции)
function getSelectedLanguage() {
    const activeOption = document.querySelector('.radio-option.active');
    return activeOption ? activeOption.dataset.lang : 'js';
}

// Обновите функцию показа уведомлений чтобы работала везде
function showNotification(message, type) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(note => note.remove());

    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      font-size: 14px;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      z-index: 1001;
      animation: slideIn 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      ${message}
    </div>
  `;

    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Добавьте анимации для уведомлений в CSS
const notificationStyles = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}
`;

// Добавьте стили если их нет
if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = notificationStyles;
    document.head.appendChild(style);
}

// Закрытие по ESC и клику на оверлей
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.getElementById('codeFullModal').style.display === 'flex') {
            closeCodeFullModal();
        }
    }
});

document.getElementById('codeFullModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCodeFullModal();
    }
});
