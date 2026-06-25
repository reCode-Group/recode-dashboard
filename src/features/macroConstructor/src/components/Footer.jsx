import { Link as RouterLink } from 'react-router-dom';

export function Footer() {
  return (
  <footer className="footer">
    <div className="footer-left">
      <div style={{borderRight: '1px solid #e5e7eb', paddingRight: '0.85rem'}}>
        © ООО «Рекод Решения», {new Date().getFullYear()}
      </div>
      <div className="version">
        <span style={{color: '#22c55e'}}>▧</span> Версия 1.0.2-stable
      </div>
    </div>
    <div className="footer-right">
      <RouterLink to="/privacy-policy">Политика конфиденциальности</RouterLink>
      <RouterLink to="/public-offer">Условия использования</RouterLink>
      <RouterLink to="/blog">Блог</RouterLink>
      <RouterLink to="/contacts">Контакты</RouterLink>
    </div>
  </footer>
  );
}
