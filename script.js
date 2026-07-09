document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const encodedEmail = 'dGFuZ2VudGVuQHBtLm1l';
  const encodedDiscord = 'dGFuZ2VudGVu';

  function copy(text, label) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    toast.textContent = label;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  const contactBtn = document.getElementById('contact-btn');
  const contactDesc = contactBtn?.querySelector('.link-desc');
  if (contactBtn && toast) {
    contactBtn.addEventListener('click', () => {
      const email = atob(encodedEmail);
      copy(email, 'Email copied to clipboard');
      if (contactDesc) contactDesc.textContent = email;
    });
  }

  const discordBtn = document.getElementById('discord-btn');
  const discordDesc = discordBtn?.querySelector('.link-desc');
  if (discordBtn && toast) {
    discordBtn.addEventListener('click', () => {
      const user = atob(encodedDiscord);
      copy(user, 'Discord username copied to clipboard');
      if (discordDesc) discordDesc.textContent = user;
    });
  }

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const baseFreq = 0.008;
  const baseAmp = 40;

  function pickCenterY(existing) {
    const occupied = existing.map(w => w.centerY);
    for (let attempt = 0; attempt < 20; attempt++) {
      const y = h * (0.15 + Math.random() * 0.7);
      if (occupied.every(oy => Math.abs(y - oy) > h * 0.2)) return y;
    }
    return h * (0.15 + Math.random() * 0.7);
  }

  function randomWave(existing) {
    const dir = Math.random() > 0.5 ? 1 : -1;
    return {
      startX: dir === 1 ? -80 - Math.random() * 120 : w + 80 + Math.random() * 120,
      dir,
      centerY: existing ? pickCenterY(existing) : h * (0.3 + Math.random() * 0.4),
      phase: Math.random() * Math.PI * 2,
      freq: baseFreq * (0.5 + Math.random()),
      amp: baseAmp * (0.5 + Math.random() * 1.5),
      drawHead: 0,
      opacity: 0.5,
      fading: false,
      tangents: [],
      tangentProgress: [],
      nextTangent: 0,
    };
  }

  let waves = [randomWave(null)];
  let spawnTimer = 0;
  const tangentInterval = 300;
  const spacing = 6;

  function getY(x, wave) {
    return wave.centerY + Math.sin(x * wave.freq + wave.phase) * wave.amp;
  }

  function getSlope(x, wave) {
    return Math.cos(x * wave.freq + wave.phase) * wave.amp * wave.freq;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const speed = 2.5;

    spawnTimer++;
    const maxWaves = 3;
    if (spawnTimer > 300 && waves.length < maxWaves) {
      waves.push(randomWave(waves));
      spawnTimer = 0;
    }

    for (let wi = waves.length - 1; wi >= 0; wi--) {
      const wave = waves[wi];
      wave.drawHead += speed;

      const start = wave.startX;
      const end = start + wave.dir * wave.drawHead;
      const minX = Math.min(start, end);
      const maxX = Math.max(start, end);

      const clampedMin = Math.max(0, minX);
      const clampedMax = Math.min(w, maxX);

      if (wave.fading) {
        wave.opacity -= 0.0006;
        if (wave.opacity <= 0) {
          waves.splice(wi, 1);
          continue;
        }
      } else if (wave.drawHead > w + 200) {
        wave.fading = true;
      }

      const alpha = wave.opacity;

      ctx.beginPath();
      let started = false;
      for (let x = clampedMin; x <= clampedMax; x += spacing) {
        const y = getY(x, wave);
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(139,92,246,${0.4 * alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      while (wave.nextTangent + tangentInterval < wave.drawHead) {
        wave.nextTangent += tangentInterval;
        const tx = start + wave.dir * wave.nextTangent;
        if (tx < 0 || tx > w) continue;
        const ty = getY(tx, wave);
        const slope = getSlope(tx, wave);
        const len = 140;
        const dx = len / Math.sqrt(1 + slope * slope);
        const dy = slope * dx;
        wave.tangents.push({ x: tx, y: ty, dx, dy, startX: tx - dx, startY: ty - dy, endX: tx + dx, endY: ty + dy });
        wave.tangentProgress.push(0);
      }

      for (let i = 0; i < wave.tangents.length; i++) {
        const t = wave.tangents[i];
        wave.tangentProgress[i] = Math.min(wave.tangentProgress[i] + 0.5, 100);
        const p = wave.tangentProgress[i] / 100;
        const cx = t.startX + (t.endX - t.startX) * p;
        const cy = t.startY + (t.endY - t.startY) * p;

        ctx.beginPath();
        ctx.moveTo(t.startX, t.startY);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(255,255,255,${0.3 * alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.5 * alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
});
