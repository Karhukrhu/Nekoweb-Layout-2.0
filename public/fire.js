    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('fire-canvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];
      let mouse = { x: -100, y: -100 };

      function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();

      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle());
        }
      });

      class Particle {
        constructor() {
          // WIDER SPREAD: Changed from * 10 to * 16 for a slightly broader trail
          this.x = mouse.x + (Math.random() - 0.5) * 16;
          this.y = mouse.y + (Math.random() - 0.5) * 4;
          
          // SLIGHTLY LARGER: Changed from * 5 + 2 to * 6 + 3 (3px to 9px)
          this.size = Math.random() * 6 + 3; 
          
          this.speedX = (Math.random() - 0.5) * 1.2;
          this.speedY = Math.random() * -2.5 - 1.5; 
          
          this.life = 1; 
          this.decay = Math.random() * 0.06 + 0.04; 
          
          const rand = Math.random();
          if (rand > 0.6) this.color = '255, 140, 30';   
          else if (rand > 0.3) this.color = '210, 80, 10'; 
          else this.color = '160, 30, 0';               
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.size -= 0.15; 
          this.life -= this.decay; 
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);
          
          // Kept at your preferred ultra-subtle 0.025 opacity
          ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.05})`;
          
          ctx.shadowBlur = 0;
          
          ctx.fill();
        }
      }

      function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over'; 

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();

          if (particles[i].life <= 0 || particles[i].size <= 0) {
            particles.splice(i, 1);
            i--;
          }
        }
        
        requestAnimationFrame(animate);
      }

      animate();
    });

    // Pause the trail when the user switches tabs
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // Clear the trail array or hide the canvas
        trailParticles = []; 
    }
});


// ==========================================
// Toggle Videos Function (Pause/Play only, no hiding)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById('toggle-videos');
    
    // Only run if the button actually exists on the page
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            // 1. Find all video elements on the page
            const videos = document.querySelectorAll('video');
            
            // 2. Check if we are currently turning them off or on
            // We'll use a custom data attribute to keep track of the state
            const arePaused = toggleBtn.getAttribute('data-state') === 'paused';
            
            videos.forEach(v => {
                if (!arePaused) {
                    // STOP the video (freezes it on the current frame)
                    v.pause();
                } else {
                    // PLAY the video again
                    v.play().catch(() => {}); 
                }
            });
            
            // 3. Update the state and button text
            if (!arePaused) {
                toggleBtn.setAttribute('data-state', 'paused');
                toggleBtn.textContent = "turn them on";
            } else {
                toggleBtn.setAttribute('data-state', 'playing');
                toggleBtn.textContent = "turn them off";

            }
        });
    }
});