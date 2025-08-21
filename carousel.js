// --- CAROUSEL CLASS ---
class ReflectionCarousel {
  constructor() {
    this.currentIndex = 0;
    this.images = document.querySelectorAll(".image-container");
    this.totalImages = this.images.length;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    this.images.forEach((img, index) => {
      img.addEventListener("click", () => {
        if (index === this.currentIndex) {
          const movieTitle = img.querySelector(".movie-title")?.innerText || "phim này";
          const imageSrc = img.querySelector("img")?.getAttribute("src");

          if (imageSrc === "/munnn.jpg") {
            alert("⚡⚡ Bạn biết chọn ghê nha =)) Mà có người đặt trước rồi muahahahaha");
            return;
          }

          const message = `Bạn chắc chứ muốn chọn "${movieTitle}"?`;
          const confirmChoice = confirm(message);

          if (confirmChoice) {
            // ⭐ GỌI HÀM GỬI THÔNG BÁO Ở ĐÂY ⭐
            sendNotification(movieTitle);

            // Các hành động còn lại để hiển thị card
            const carouselContainer = document.getElementById('movie-carousel-container');
            const notificationCard = document.getElementById('notification-card');
            const notificationText = document.getElementById('notification-text');

            carouselContainer.classList.add('hidden');
            notificationText.innerText = `Vậy là chốt kèo xem phim "${movieTitle}" nheee`;
            notificationCard.classList.remove('hidden');
            this.stopAutoPlay();
          }

        } else {
          this.goToSlide(index);
        }
      });
    });

    this.startAutoPlay();
    const container = document.querySelector(".carousel-container");
    container.addEventListener("mouseenter", () => this.stopAutoPlay());
    container.addEventListener("mouseleave", () => this.startAutoPlay());
    this.updateCarousel();
  }

  goToSlide(index) {
    if (index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    this.images.forEach((img, index) => {
      img.className = "image-container";
      if (index === this.currentIndex) {
        img.classList.add("center");
      } else if (index === this.getPrevIndex()) {
        img.classList.add("left");
      } else if (index === this.getNextIndex()) {
        img.classList.add("right");
      } else {
        img.classList.add("hidden");
      }
    });
  }

  getPrevIndex() {
    return (this.currentIndex - 1 + this.totalImages) % this.totalImages;
  }

  getNextIndex() {
    return (this.currentIndex + 1) % this.totalImages;
  }

  nextSlide() {
    const nextIndex = this.getNextIndex();
    this.goToSlide(nextIndex);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
  new ReflectionCarousel();
});

// Background effect
document.addEventListener("mousemove", (e) => {
  const carouselContainer = document.getElementById('movie-carousel-container');
  if (carouselContainer && !carouselContainer.classList.contains('hidden')) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    carouselContainer.style.background = `radial-gradient(ellipse at ${x}% ${y}%, #3a3a3a 0%, #0a0a0a 100%)`;
  }
});

function closeCard() {
  const notificationCard = document.getElementById('notification-card');
  notificationCard.classList.add('hidden');

  setTimeout(() => {
    const gifContainer = document.getElementById('final-gif-container');
    if (gifContainer) {
      gifContainer.classList.remove('hidden');
    }
  }, 500);
}

// Hàm gửi thông báo Discord
async function sendNotification(movieTitle) {
  // ❗❗❗ NHỚ THAY THẾ BẰNG URL WEBHOOK THẬT CỦA BẠN ❗❗❗
  const webhookUrl = 'https://discord.com/api/webhooks/1408159407539355678/bWCG3lahtR4GGdVlbNzotK1tyZ8FWI4AM8VyfRnTGnrsrNwjH___X2U3I0RX9lDHENy9'; 

  const message = {
    content: `🔔 Ding Dong! Có người vừa chốt kèo đi xem phim với bạn!`,
    embeds: [{
      title: "🎬 Phim được chọn:",
      description: `**${movieTitle}**`,
      color: 15258703,
      footer: {
        text: `Thời gian: ${new Date().toLocaleString('vi-VN')}`
      }
    }]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (response.ok) {
      console.log('Thông báo đã được gửi thành công!');
    } else {
      console.error('Gửi thông báo thất bại:', response.status);
    }
  } catch (error) {
    console.error('Lỗi khi gửi thông báo:', error);
  }
}