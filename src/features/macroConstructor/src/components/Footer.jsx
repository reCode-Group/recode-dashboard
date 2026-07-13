import { PUBLIC_SITE_URLS } from 'constants/publicSite';

export function Footer() {
  return (
  <footer className="footer">
    <div className="footer-left">
      <div style={{borderRight: '1px solid #e5e7eb', paddingRight: '0.85rem'}}>
        © ООО «Рекод Решения», {new Date().getFullYear()}
      </div>
      <div className="version">
        <span style={{color: '#22c55e'}}>●</span> Версия 1.0.2-stable
      </div>
    </div>
    <div className="footer-right">
      <a href={PUBLIC_SITE_URLS.legal}>Политика конфиденциальности</a>
      <a href={PUBLIC_SITE_URLS.legal}>Условия использования</a>
      <a href={PUBLIC_SITE_URLS.blog}>Блог</a>
      <a href={PUBLIC_SITE_URLS.contacts}>Контакты</a>
    </div>
  </footer>
  );
}
