import {TipsPanel} from './TipsPanel.jsx';

export function Sidebar({handlers}) {
  return (
<>
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-header">
          <span>УПРАВЛЕНИЕ</span>
          <div className="autosave-badge">
            <span className="autosave-dot" />
            <span className="autosave">Автосохранение</span>
          </div>
        </div>
        <div className="actions-section">
          <div className="section-title">
            <span className="material-symbols-outlined">play_circle</span>
            Выполнение
          </div>
          <div className="language-selector">
            <div className="radio-group">
              <label className="radio-option active" data-lang="js">
                <input type="radio" name="language" defaultValue="js" defaultChecked />
                <span className="radio-checkmark" />
                <span className="radio-label">
                  <span className="material-symbols-outlined">javascript</span>
                  JavaScript
                </span>
              </label>
              <label className="radio-option" data-lang="lua">
                <input type="radio" name="language" defaultValue="lua" />
                <span className="radio-checkmark" />
                <span className="radio-label">
                  <span className="material-symbols-outlined">code</span>
                  Lua
                </span>
              </label>
              <label className="radio-option" data-lang="py">
                <input type="radio" name="language" defaultValue="py" />
                <span className="radio-checkmark" />
                <span className="radio-label">
                  <span className="material-symbols-outlined">terminal</span>
                  Python
                </span>
              </label>
            </div>
          </div>
          <div className="action-buttons">
            <button className="primary-btn generate-btn">
              <span className="material-symbols-outlined">auto_fix</span>
              Генерировать
            </button>
          </div>
        </div>
      </div>
      <div className="code-section">
        <div className="code-header">
          <h3>
            <span className="material-symbols-outlined">code</span>
            Сгенерированный код
          </h3>
          <div className="code-actions">
            <button className="icon-btn copy-btn" title="Копировать">
              <span className="material-symbols-outlined">content_copy</span>
            </button>
            <button className="icon-btn view-btn" title="Просмотреть полный код" onClick={handlers.openCodeFullModal}>
              <span className="material-symbols-outlined">open_in_full</span>
            </button>
          </div>
        </div>
        <div className="code-container">
          <pre className="code-box"><code id="generatedCode" /></pre>
        </div>
      </div>
      <div className="import-export-section">
        <div className="section-title">
          <span className="material-symbols-outlined">import_export</span>
          Работа с блоками
        </div>
        <div className="button-group">
          <button className="export-btn" id="save-json">
            <span className="material-symbols-outlined">download</span>
            Экспорт
          </button>
          <button className="import-btn" id="import">
            <span className="material-symbols-outlined">upload</span>
            Импорт
          </button>
        </div>
        <div className="danger-section">
          <button className="danger-btn clear-btn">
            <span className="material-symbols-outlined">delete_sweep</span>
            Очистить область
          </button>
        </div>
        <div className="textarea-container">
          <textarea id="importExport" placeholder="Вставьте JSON для импорта или нажмите на 'Экспорт', появится код для экспорта..." className="import-export-textarea" defaultValue={"            "} />
        </div>
      </div>
      <TipsPanel />
    </aside>
</>
  );
}
