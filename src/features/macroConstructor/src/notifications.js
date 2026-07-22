export function showToast(message, type = 'info') {
  document.querySelectorAll('.notification').forEach((node) => node.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  (document.getElementById('notifications-root') || document.body).appendChild(notification);

  window.setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    window.setTimeout(() => notification.remove(), 300);
  }, 3500);
}
