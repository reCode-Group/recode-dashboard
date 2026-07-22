export function Modals({ handlers }) {
	return (
		<div className="modals">
			<div className="modal-overlay" id="projectsModal">
				<div className="modal-container">
					{/* Заголовок */}
					<div className="modal-header">
						<div className="modal-title">
							<h2>Проекты</h2>
							<p className="modal-subtitle">Выберите проект или создайте новый</p>
						</div>
						<button className="modal-close" onClick={handlers.closeModal}>
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none">
								<path
									d="M18 6L6 18M6 6L18 18"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
					{/* Контент с таблицей */}
					<div className="modal-content">
						<div className="projects-table">
							{/* Заголовок таблицы */}
							<div className="table-header">
								<div className="table-row">
									<div className="table-cell name-cell">Название проекта</div>
									<div className="table-cell modified-cell">Последнее изменение</div>
									<div className="table-cell created-cell">Дата создания</div>
									<div className="table-cell actions-cell" />
								</div>
							</div>
							{/* Тело таблицы (скроллится) */}
							<div className="table-body" id="projectsTableBody">
								{/* Проекты будут добавляться динамически */}
							</div>
						</div>
					</div>
					{/* Футер с кнопками */}
					<div className="modal-footer">
						<button className="btn-cancel" onClick={handlers.closeModal}>
							Отмена
						</button>
						<button className="btn-create" onClick={handlers.createNewProject}>
							<svg width={18} height={18} viewBox="0 0 24 24" fill="none">
								<path
									d="M12 5V19M5 12H19"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							</svg>
							Создать проект
						</button>
					</div>
				</div>
			</div>
			<div className="modal-overlay" id="projectCreateModal">
				<div
					className="modal-container confirmation-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="projectCreateTitle"
				>
					<div className="modal-header">
						<div className="modal-title">
							<h2 id="projectCreateTitle">Новый проект</h2>
							<p className="modal-subtitle">Задайте понятное название, чтобы быстро найти проект в списке.</p>
						</div>
						<button
							className="modal-close"
							type="button"
							aria-label="Закрыть"
							onClick={handlers.closeProjectCreateModal}
						>
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none">
								<path
									d="M18 6L6 18M6 6L18 18"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
					<div className="modal-content confirmation-content">
						<label className="project-field" htmlFor="newProjectNameInput">
							<span>Название проекта</span>
							<input
								type="text"
								id="newProjectNameInput"
								placeholder="Например: Фарм ресурсов"
								autoComplete="off"
							/>
						</label>
					</div>
					<div className="modal-footer">
						<button className="btn-cancel" type="button" onClick={handlers.closeProjectCreateModal}>
							Отмена
						</button>
						<button className="btn-create" type="button" onClick={handlers.confirmProjectCreation}>
							Создать проект
						</button>
					</div>
				</div>
			</div>
			<div className="modal-overlay" id="projectEditModal">
				<div className="modal-container">
					{/* Заголовок */}
					<div className="modal-header">
						<div className="modal-title">
							<h2>Настройки проекта</h2>
							<p className="modal-subtitle">Управление свойствами и настройками</p>
						</div>
						<button className="modal-close" onClick={handlers.closeProjectEditModal}>
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none">
								<path
									d="M18 6L6 18M6 6L18 18"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
					{/* Контентная часть */}
					<div className="modal-content">
						<div style={{ padding: 30 }}>
							<h3>Название проекта</h3>
							<input
								type="text"
								id="projectNameInput"
								style={{
									width: '100%',
									padding: '12px 16px',
									fontSize: 16,
									border: '2px solid #d1d5db',
									outline: 'none',
									borderRadius: 10,
									marginBottom: 20,
								}}
								placeholder="Введите новое название проекта"
							/>
							<h3>Автосохранение</h3>
							<label className="autosave-setting" htmlFor="autosaveIntervalSelect">
								<span>Сохранять изменения через</span>
								<select id="autosaveIntervalSelect" defaultValue="180000">
									<option value="0">Выключено</option>
									<option value="30000">30 секунд</option>
									<option value="60000">1 минута</option>
									<option value="180000">3 минуты (по умолчанию)</option>
									<option value="300000">5 минут</option>
								</select>
							</label>
							<div className="danger-zone">
								<div>
									<h3>Удаление проекта</h3>
									<p>Проект будет удалён на сервере вместе с блоками и настройками.</p>
								</div>
								<button
									className="btn-danger"
									type="button"
									onClick={handlers.openProjectDeleteModal}
								>
									Удалить проект
								</button>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
								<button
									className="btn-cancel"
									onClick={handlers.closeProjectEditModal}
									style={{ flex: 1 }}
								>
									Отмена
								</button>
								<button
									className="btn-create"
									onClick={handlers.saveProjectName}
									style={{ flex: 1 }}
								>
									Сохранить
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="modal-overlay" id="projectDeleteModal">
				<div
					className="modal-container confirmation-modal"
					role="dialog"
					aria-modal="true"
					aria-labelledby="projectDeleteTitle"
				>
					<div className="modal-header">
						<div className="modal-title">
							<h2 id="projectDeleteTitle">Удалить проект?</h2>
							<p className="modal-subtitle">Это действие нельзя отменить.</p>
						</div>
						<button
							className="modal-close"
							type="button"
							aria-label="Закрыть"
							onClick={handlers.closeProjectDeleteModal}
						>
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none">
								<path
									d="M18 6L6 18M6 6L18 18"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
					<div className="modal-content confirmation-content">
						Проект <strong id="projectDeleteName">Новый проект</strong> будет удалён вместе со всеми блоками и настройками.
						Если это последний проект, конструктор сразу создаст новый пустой проект.
						<label className="delete-confirmation" htmlFor="projectDeleteConfirmInput">
							<span>
								Для подтверждения введите <strong id="projectDeleteConfirmName">Новый проект</strong>
							</span>
							<input
								type="text"
								id="projectDeleteConfirmInput"
								autoComplete="off"
								placeholder="Название проекта"
							/>
						</label>
					</div>
					<div className="modal-footer">
						<button className="btn-cancel" type="button" onClick={handlers.closeProjectDeleteModal}>
							Оставить проект
						</button>
						<button
							className="btn-danger"
							type="button"
							id="projectDeleteConfirmButton"
							onClick={handlers.confirmProjectDeletion}
							disabled
						>
							Удалить проект
						</button>
					</div>
				</div>
			</div>
			<div className="modal-overlay" id="codeFullModal">
				<div className="modal-container code-modal">
					{/* Заголовок */}
					<div className="modal-header">
						<div className="modal-title">
							<h2>Сгенерированный код</h2>
							<p className="modal-subtitle">Полный просмотр сгенерированного кода</p>
						</div>
						<button className="modal-close" onClick={handlers.closeCodeFullModal}>
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none">
								<path
									d="M18 6L6 18M6 6L18 18"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>
					{/* Контент с кодом */}
					<div className="modal-content">
						<div className="code-full-view">
							<div className="code-header">
								<div className="language-badge" id="fullCodeLanguage">
									JavaScript
								</div>
								<div className="code-actions">
									<button className="icon-btn" title="Копировать" onClick={handlers.copyFullCode}>
										<span className="material-symbols-outlined">content_copy</span>
									</button>
									<button className="icon-btn" title="Скачать" onClick={handlers.downloadFullCode}>
										<span className="material-symbols-outlined">download</span>
									</button>
								</div>
							</div>
							<pre className="code-full-box">
								<code id="fullGeneratedCode" />
							</pre>
						</div>
					</div>
					{/* Футер с кнопками */}
					<div className="modal-footer">
						<button className="btn-cancel" onClick={handlers.closeCodeFullModal}>
							Закрыть
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
