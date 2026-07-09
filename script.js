document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('contact-btn');
  if (!btn) return;

  const encoded = 'dGFuZ2VudGVuQHBtLm1l';

  btn.addEventListener('click', () => {
    const email = atob(encoded);
    window.location.href = `mailto:${email}`;
  });
});
