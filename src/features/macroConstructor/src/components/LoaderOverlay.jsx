import { loaderLogoUrl } from '../assets.js';

export function LoaderOverlay({visible}) {
  if (!visible) return null;

  return (
  <div className="loader-overlay">
    <div className="loader-container">
      <div className="logo">
        <img src={loaderLogoUrl} alt="" />
      </div>
      <div className="loader" />
      <div className="loading-text">Загрузка конструктора макросов</div>
      <div className="subtext">
        Инициализация рабочей области... Пожалуйста, подождите
      </div>
    </div>
  </div>
  );
}
