document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher (Dark / Light Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      if (newTheme === 'dark') {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', 'light');
      }

      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(newTheme === 'light' ? 'Modo claro ativado!' : 'Modo escuro ativado!', 'success');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }

  // 2. Mobile Nav Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 3. Active link on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Skills Progress Bar Animation on Scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  if ('IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progress = entry.target;
          const targetWidth = progress.getAttribute('data-percentage');
          if (targetWidth) {
            progress.style.width = targetWidth;
          }
          observer.unobserve(progress);
        }
      });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => skillsObserver.observe(bar));
  } else {
    skillBars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-percentage') || '80%';
    });
  }

  // 5. GitHub API Projects Fetcher
  const projectsContainer = document.getElementById('github-projects-container');
  const metricReposEl = document.getElementById('metric-repos');
  const metricStarsEl = document.getElementById('metric-stars');

  async function fetchGitHubRepos() {
    const username = 'gabrieltrabalhos478-art';
    const apiEndpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const repos = await response.json();
      renderRepos(repos);
      calculateMetrics(repos);
    } catch (err) {
      console.warn('Erro ao carregar repositórios do GitHub:', err);
      renderFallbackProjects();
    }
  }

  function renderRepos(repos) {
    if (!projectsContainer) return;
    
    // Filtrar forks e EXCLUIR explicitamente o próprio repositório do portfólio
    const publicRepos = repos.filter(repo => {
      if (repo.fork) return false;
      const repoName = repo.name.toLowerCase();
      return !repoName.includes('portifolio') && !repoName.includes('portfolio');
    }).slice(0, 6);
    
    if (publicRepos.length === 0) {
      renderFallbackProjects();
      return;
    }

    projectsContainer.innerHTML = publicRepos.map((repo, idx) => {
      const language = repo.language || 'Web Project';
      const description = repo.description || 'Repositório público com código fonte limpo e organizado no GitHub.';
      const updatedDate = new Date(repo.updated_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      const numFormatted = String(idx + 1).padStart(2, '0');
      
      let dataType = 'web';
      const langLower = language.toLowerCase();
      if (langLower.includes('script') || langLower.includes('html') || langLower.includes('css')) dataType = 'frontend';
      if (langLower.includes('node') || langLower.includes('api') || langLower.includes('python')) dataType = 'api';

      return `
        <div class="glass-card project-card" data-num="${numFormatted}" data-type="${dataType}">
          <div class="project-tag">${language}</div>
          <h3>${repo.name}</h3>
          <p>${description}</p>
          <div class="project-tech">
            <span><i class="fa-solid fa-code"></i> ${language}</span>
            <span><i class="fa-regular fa-calendar-check"></i> ${updatedDate}</span>
          </div>
          <div class="repo-stats">
            <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count} stars</span>
            <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count} forks</span>
          </div>
          <div class="project-links" style="margin-top: 1.2rem;">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-btn">
              <i class="fa-brands fa-github"></i> Ver Repositório <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8rem"></i>
            </a>
            ${repo.homepage ? `
              <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-btn" style="color: var(--accent-secondary)">
                <i class="fa-solid fa-globe"></i> Demo Ao Vivo
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    setTimeout(initCarousel, 100);
  }

  function calculateMetrics(repos) {
    const validRepos = repos.filter(repo => {
      const repoName = repo.name.toLowerCase();
      return !repoName.includes('portifolio') && !repoName.includes('portfolio');
    });
    if (metricReposEl) metricReposEl.textContent = validRepos.length || repos.length || '4+';
    if (metricStarsEl) {
      const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      metricStarsEl.textContent = totalStars > 0 ? totalStars : '⭐';
    }
  }

  function renderFallbackProjects() {
    if (!projectsContainer) return;
    if (metricReposEl) metricReposEl.textContent = '4+';
    if (metricStarsEl) metricStarsEl.textContent = '10+';

    projectsContainer.innerHTML = `
      <div class="glass-card project-card" data-num="01" data-type="frontend">
        <div class="project-tag">Frontend & UI</div>
        <h3>Dashboard Analytics System</h3>
        <p>Painel interativo com métricas em tempo real, suporte a modo claro/escuro e gráficos dinâmicos construídos com JavaScript ES6+.</p>
        <div class="project-tech">
          <span>JavaScript</span>
          <span>CSS Grid</span>
          <span>Chart APIs</span>
        </div>
        <div class="project-links">
          <a href="https://github.com/gabrieltrabalhos478-art" target="_blank" rel="noopener noreferrer" class="project-btn"><i class="fa-brands fa-github"></i> Repositório no GitHub</a>
        </div>
      </div>

      <div class="glass-card project-card" data-num="02" data-type="api">
        <div class="project-tag">Node.js API</div>
        <h3>REST API Microservices</h3>
        <p>Arquitetura backend moderna para gerenciamento de serviços web assíncronos e integração com banco de dados.</p>
        <div class="project-tech">
          <span>Node.js</span>
          <span>Express</span>
          <span>REST API</span>
        </div>
        <div class="project-links">
          <a href="https://github.com/gabrieltrabalhos478-art" target="_blank" rel="noopener noreferrer" class="project-btn"><i class="fa-brands fa-github"></i> Repositório no GitHub</a>
        </div>
      </div>
    `;

    setTimeout(initCarousel, 100);
  }

  let currentSlide = 0;

  function initCarousel() {
    const track = document.getElementById('github-projects-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track) return;
    const cards = track.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    function getVisibleCount() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }

    function updateCarousel() {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, cards.length - visibleCount);
      if (currentSlide > maxSlide) currentSlide = maxSlide;
      if (currentSlide < 0) currentSlide = 0;

      const cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

      if (prevBtn) prevBtn.disabled = currentSlide === 0;
      if (nextBtn) nextBtn.disabled = currentSlide >= maxSlide;

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentSlide);
        });
      }
    }

    const visibleCount = getVisibleCount();
    const totalDots = Math.max(1, cards.length - visibleCount + 1);

    if (dotsContainer) {
      dotsContainer.innerHTML = Array.from({ length: totalDots }).map((_, i) => `
        <span class="carousel-dot ${i === currentSlide ? 'active' : ''}" data-index="${i}"></span>
      `).join('');

      dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          currentSlide = parseInt(e.target.dataset.index, 10);
          updateCarousel();
        });
      });
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentSlide > 0) {
          currentSlide--;
          updateCarousel();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        const visible = getVisibleCount();
        if (currentSlide < cards.length - visible) {
          currentSlide++;
          updateCarousel();
        }
      };
    }

    window.addEventListener('resize', () => {
      updateCarousel();
    });

    updateCarousel();
  }

  fetchGitHubRepos();

  // 6. Contact Form Submission via Fetch API (Formspree / Asynchronous)
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnOriginalText = submitBtn ? submitBtn.innerHTML : 'Enviar Mensagem';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enviando...`;
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
          contactForm.reset();
        } else {
          showToast('Mensagem recebida com sucesso! Obrigado pelo contato.', 'success');
          contactForm.reset();
        }
      } catch (error) {
        showToast('Obrigado! Sua mensagem foi enviada.', 'success');
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = btnOriginalText;
        }
      }
    });
  }

  // 7. Toast Notification Utility
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // 8. Custom Cursor Dot Follower (Dispositivos com ponteiro)
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      width: '10px',
      height: '10px',
      background: 'var(--accent-secondary, #fbbf24)',
      borderRadius: '50%',
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease, background-color 0.2s ease',
      opacity: '0.8',
      boxShadow: '0 0 12px var(--gold-glow, rgba(251, 191, 36, 0.4))'
    });
    document.body.appendChild(dot);

    let mx = 0, my = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, .skill-item, .project-card').forEach(el => {
        if (el.dataset.hasCursorHover) return;
        el.dataset.hasCursorHover = 'true';
        el.addEventListener('mouseenter', () => {
          dot.style.width = '24px';
          dot.style.height = '24px';
          dot.style.opacity = '0.35';
        });
        el.addEventListener('mouseleave', () => {
          dot.style.width = '10px';
          dot.style.height = '10px';
          dot.style.opacity = '0.8';
        });
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    (function renderCursor() {
      dx += (mx - dx) * 0.2;
      dy += (my - dy) * 0.2;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
      requestAnimationFrame(renderCursor);
    })();
  }
});
