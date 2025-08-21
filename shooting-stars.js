(() => {
  const canvas = document.getElementById('shooting-stars-canvas');
  const ctx = canvas.getContext('2d');

  const SHOOTING_STAR_CHANCE = 0.04; // Tăng tỷ lệ xuất hiện (gấp đôi)
  const MAX_SHOOTING_STARS = 6;     //  Tăng số lượng tối đa trên màn hình

  let shootingStars = [];
  let dpr = 1;

  
  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function draw(now) {
    // 1. Xóa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Lọc và xóa các sao băng đã bay hết
    shootingStars = shootingStars.filter(ss => now - ss.startTime < ss.duration);

    // 3. Tạo sao băng mới nếu có cơ hội
    if (Math.random() < SHOOTING_STAR_CHANCE && shootingStars.length < MAX_SHOOTING_STARS) {
      const startX = rand(0, canvas.width);
      const startY = rand(0, canvas.height * 0.4);
      //  Giảm tốc độ để sao băng bay chậm và mượt hơn
      const speed = rand(200, 500) * dpr;
      const angle = rand(Math.PI * 0.25, Math.PI * 0.15);

      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        startTime: now,
        // tăng thời gian tồn tại để chúng không biến mất giữa chừng
        duration: rand(800, 1800)
      });
    }

    // 4. Vẽ các sao băng hiện có
    ctx.save();
    shootingStars.forEach(ss => {
      const life = (now - ss.startTime) / ss.duration;

      // kéo dài đuôi một chút cho đẹp hơn ở tốc độ chậm
      const tailLengthFactor = 0.18;
      const tailX = ss.x - ss.vx * tailLengthFactor;
      const tailY = ss.y - ss.vy * tailLengthFactor;

      const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${1 - life})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // cập nhật vị trí cho frame tiếp theo
      ss.x += ss.vx * (1 / 60);
      ss.y += ss.vy * (1 / 60);
    });
    ctx.restore();

    // Lặp lại
    requestAnimationFrame(draw);
  }

  // Khởi chạy
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();