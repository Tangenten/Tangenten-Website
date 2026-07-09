document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('contact-btn');
  if (!btn) return;

  const encoded = 'dGFuZ2VudGVuQHBtLm1l';
  btn.addEventListener('click', () => {
    window.location.href = `mailto:${atob(encoded)}`;
  });

  const main = document.querySelector('main');
  if (!main) return;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    const dx = ((e.clientX - cx) / cx) * 3;
    const dy = ((e.clientY - cy) / cy) * 3;
    main.style.backgroundImage = `radial-gradient(ellipse 50% 30% at ${50 + dx}% ${50 + dy}%, rgba(86,200,255,0.04) 0%, transparent 100%)`;
  });
});
