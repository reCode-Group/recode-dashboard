import { Link as RouterLink } from 'react-router-dom';
import { companyAvatarUrl, constructorLogoUrl } from '../assets.js';

function getViewerName(viewerContext) {
  return viewerContext?.name || viewerContext?.email || 'Пользователь reCode';
}

function getViewerCompany(viewerContext) {
  if (viewerContext?.has_organization && viewerContext?.organization_status === 'active') {
    return 'Участник организации';
  }

  return 'Гость платформы';
}

export function Header({handlers, viewerContext}) {
  return (
<>
  <header className="header">
    <div className="header-left">
      <div className="header-logo">
        <RouterLink to="/">
          <img src={constructorLogoUrl} alt="Рекод Конструктор макросов" />
        </RouterLink>
      </div>
      <div className="divider" />
      <div className="project-info" onClick={handlers.openProjectEditModal}>
        <span className="status-dot" />
        <span>Проект:</span>
        <span className="project-name">Без_названия_01</span>
      </div>
    </div>
    <div className="header-right">
      <RouterLink className="support-btn" to="/contacts#support">Техподдержка</RouterLink>
      <RouterLink className="lk-btn" to="/lk/dashboard">Личный кабинет</RouterLink>
      <div className="divider"/>
      <div className="user">
        <div className="avatar">
          <img src={companyAvatarUrl} alt="" />
        </div>
        <div className="user-info">
          <p className="name">{getViewerName(viewerContext)}</p>
          <p className="role">{getViewerCompany(viewerContext)}</p>
        </div>
      </div>
    </div>
  </header>
  <nav className="top-nav">
    <a className="active">Рабочая область</a>
    <a onClick={handlers.openModal}>Проекты</a>
    <RouterLink to="/documentation">Документация</RouterLink>
    <a onClick={handlers.openProjectEditModal}>Настройки</a>
  </nav>
</>
  );
}
