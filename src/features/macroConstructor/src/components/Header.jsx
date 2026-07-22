import { Flex, useDisclosure } from '@chakra-ui/react';
import CreateSupportTicketModal from 'views/Dashboard/Support/components/CreateSupportTicketModal';

function getDisplayName(viewerContext) {
  const firstName = viewerContext?.name?.trim();
  const surnameInitial = viewerContext?.surname?.trim()?.[0];

  if (firstName) {
    return surnameInitial ? `${firstName} ${surnameInitial}.` : firstName;
  }

  return viewerContext?.name || viewerContext?.email || 'Пользователь';
}

function getCompanyName(organization) {
  return organization?.short_name?.trim() || organization?.full_name?.trim() || '';
}

function getInitials(name) {
  if (!name) {
    return 'ПР';
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'ПР';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function AvatarFallback({ initials }) {
  return (
    <Flex
      align='center'
      justify='center'
      bg='#005de0'
      color='white'
      w='100%'
      h='100%'
      borderRadius='0.5rem'
      fontWeight='800'
      fontSize='0.9rem'
      letterSpacing='0.04em'
      userSelect='none'
    >
      {initials}
    </Flex>
  );
}

export function Header({handlers, viewerContext, organization}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const displayName = getDisplayName(viewerContext);
  const avatarSrc = viewerContext?.avatar_url || viewerContext?.avatar || viewerContext?.photo_url || viewerContext?.photo || '';
  const avatarFallback = getInitials(displayName);

  return (
<>
  <header className="header">
    <div className="header-left">
      <div className="header-logo">
        <a href="/">
          <img src="/app/media/constructor.svg" alt="Рекод Конструктор макросов" />
        </a>
      </div>
      <div className="divider" />
      <div className="project-info" onClick={handlers.openProjectEditModal}>
        <span className="status-dot" />
        <span>Проект:</span>
        <span className="project-name">Без_названия_01</span>
      </div>
    </div>
    <div className="header-right">
      <button className="support-btn" type="button" onClick={onOpen}>Техподдержка</button>
      <a className="lk-btn" href="/lk/dashboard">Личный кабинет</a>
      <div className="divider"/>
      <div className="user">
        <div className="avatar">
          {avatarSrc ? <img src={avatarSrc} alt="" /> : <AvatarFallback initials={avatarFallback} />}
        </div>
        <div className="user-info">
          <p className="name">{displayName}</p>
          <p className="role">{getCompanyName(organization) || 'Пользователь'}</p>
        </div>
      </div>
    </div>
  </header>
  <nav className="top-nav">
    <a className="active">Рабочая область</a>
    <a onClick={handlers.openModal}>Проекты</a>
    <a href="https://app.recode-group.ru/documentation" target="_blank" rel="noreferrer">Документация</a>
    <a onClick={handlers.openProjectEditModal}>Настройки</a>
  </nav>
  <CreateSupportTicketModal isOpen={isOpen} onClose={onClose} onEmailSent={() => {}} />
</>
  );
}
