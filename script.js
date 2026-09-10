/**
 * Alex Morgan Portfolio - Interactive Functionality & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. Dynamic Typewriter Effect
  // ==========================================
  const typewriterElement = document.getElementById('typewriterText');
  const roles = [
    'Senior Full-Stack Engineer',
    'Cloud Architecture Specialist',
    'Creative Web Developer & Designer',
    'High-Performance Systems Builder'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeRole, typingSpeed);
  }

  if (typewriterElement) {
    setTimeout(typeRole, 600);
  }

  // ==========================================
  // 2. Cursor Glow Follower
  // ==========================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  // ==========================================
  // 3. Theme Toggle (Dark / Light Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('am_portfolio_theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('am_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  // ==========================================
  // 4. Sticky Header & Scroll Spy Active Links
  // ==========================================
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Header shadow & height compression
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Scroll spy
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // ==========================================
  // 5. Mobile Navigation Drawer
  // ==========================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 6. Metrics & Stats Counter Animation
  // ==========================================
  const statsSection = document.getElementById('statsSection');
  const metricValues = document.querySelectorAll('.metric-value');
  let metricsAnimated = false;

  function animateMetrics() {
    metricValues.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out expo
        const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentCount = Math.floor(easeVal * target);

        counter.textContent = currentCount;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetrics();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // Animate skill progress bars on scroll
  const skillCards = document.querySelectorAll('.skill-card');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.progress-bar');
        if (bar) {
          const targetWidth = bar.style.getPropertyValue('--progress') || '90%';
          bar.style.width = targetWidth;
        }
      }
    });
  }, { threshold: 0.15 });

  skillCards.forEach(card => skillsObserver.observe(card));

  // ==========================================
  // 7. Skills Tab Filtering
  // ==========================================
  const skillPills = document.querySelectorAll('[data-skill-tab]');
  skillPills.forEach(pill => {
    pill.addEventListener('click', () => {
      skillPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const tab = pill.getAttribute('data-skill-tab');
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (tab === 'all' || category === tab) {
          card.classList.remove('hidden');
          // Re-trigger animation
          const bar = card.querySelector('.progress-bar');
          if (bar) {
            const targetWidth = bar.style.getPropertyValue('--progress');
            bar.style.width = targetWidth;
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 8. Projects Filter Tabs
  // ==========================================
  const projectFilterPills = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      projectFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-project-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 9. Interactive Case Study Modal
  // ==========================================
  const projectData = {
    'aura-ai': {
      title: 'AURA — Enterprise AI Predictive Analytics Engine',
      category: 'AI & Data Intelligence Platform',
      image: 'assets/project1-aura-ai.jpg',
      summary: 'AURA is a high-throughput, enterprise-grade AI analytics platform designed to aggregate metrics from over 20,000 edge IoT devices and generate real-time predictive health indices using PyTorch and FastAPI microservices.',
      challenges: [
        'Ingesting over 50,000 telemetry events per second without dropping message frames.',
        'Visualizing multi-dimensional neural network forecast confidence bands at 60 FPS in modern browsers.',
        'Providing zero-latency failover across multi-region Kubernetes deployments.'
      ],
      solutions: [
        'Engineered an event-driven ingestion pipeline utilizing Apache Kafka & Redis Pub/Sub buffers.',
        'Built custom Canvas & WebGL data visualizers reducing memory overhead by 68%.',
        'Implemented automated predictive anomaly alerts via WebSockets with sub-80ms client propagation.'
      ],
      metrics: [
        { num: '4.1M', label: 'Predictions / Month' },
        { num: '96.2%', label: 'Model Accuracy' },
        { num: '45ms', label: 'Query Latency' }
      ],
      demoLink: '#',
      githubLink: 'https://github.com'
    },
    'apex-wallet': {
      title: 'Apex — Institutional Web3 & Crypto Portfolio Terminal',
      category: 'FinTech & Institutional Crypto',
      image: 'assets/project2-crypto-wallet.jpg',
      summary: 'Apex is a cross-platform institutional trading terminal and crypto wealth management hub. It provides multi-chain balance monitoring, automated tax reporting, and high-frequency order routing with hardware-level security.',
      challenges: [
        'Synchronizing blockchain transaction state across Ethereum, Solana, and Bitcoin without stale balances.',
        'Passing strict SOC2 Type II compliance and bank-grade biometric enclave cryptographic requirements.',
        'Handling high network congestion during market flash volatility events.'
      ],
      solutions: [
        'Developed custom indexing nodes in Go to stream finalized blockchain states to clients in real-time.',
        'Integrated WebAuthn biometric authentication with secure enclave key generation.',
        'Architected a distributed rate limiter and automatic RPC node fallback cluster.'
      ],
      metrics: [
        { num: '$125M+', label: 'Volume Processed' },
        { num: '99.99%', label: 'Gateway Uptime' },
        { num: '<120ms', label: 'Order Execution' }
      ],
      demoLink: '#',
      githubLink: 'https://github.com'
    },
    'cloud-ops': {
      title: 'C-Ops — Multi-Region Kubernetes Telemetry & Topology Mesh',
      category: 'DevOps & Cloud Observability',
      image: 'assets/project3-cloud-ops.jpg',
      summary: 'C-Ops is an observability control plane mapping global microservice communication, pod health, and latency bottlenecks across hybrid multi-cloud AWS and bare-metal Kubernetes clusters.',
      challenges: [
        'Rendering dynamic, real-time node topology networks with thousands of interconnected services.',
        'Correlating distributed OpenTelemetry traces with metric spikes without saturating network bandwidth.',
        'Instant disaster remediation triggers to divert live customer traffic in under 5 seconds.'
      ],
      solutions: [
        'Built a custom GPU-accelerated force-directed graph renderer using D3.js & WebGL shaders.',
        'Implemented Prometheus histogram aggregation with dynamic sampling rate adapters.',
        'Created automated eBPF network packet probes to detect packet drops and latency spikes proactively.'
      ],
      metrics: [
        { num: '54+', label: 'Kubernetes Nodes' },
        { num: '12ms', label: 'Avg Telemetry Latency' },
        { num: '28%', label: 'Cloud Cost Saved' }
      ],
      demoLink: '#',
      githubLink: 'https://github.com'
    },
    'cybernex-3d': {
      title: 'Cybernex — 3D Interactive Spatial Web Experience',
      category: 'Creative Technology & WebGL',
      image: 'assets/project4-cybernex-3d.jpg',
      summary: 'Cybernex is an experiential web showcase created for an avant-garde digital arts agency. It blends custom Three.js GLSL shaders, kinetic typography, and reactive spatial audio to redefine brand presentation online.',
      challenges: [
        'Maintaining a locked 60 FPS performance across lower-tier mobile hardware and high-res Retina displays.',
        'Streaming heavy 3D GLTF models and normal maps without causing initial load delays.',
        'Synchronizing web audio synthesized soundscapes with interactive cursor physics.'
      ],
      solutions: [
        'Created custom level-of-detail (LOD) shaders and texture compression using Draco & KTX2.',
        'Implemented a progressive asset streaming pipeline with instant interactive placeholder geometry.',
        'Connected the Web Audio API oscillator nodes to mouse velocity vectors for responsive sound feedback.'
      ],
      metrics: [
        { num: '60 FPS', label: 'Locked Framerate' },
        { num: 'Awwwards', label: 'Site of the Day' },
        { num: '< 1.4s', label: 'First Contentful Paint' }
      ],
      demoLink: '#',
      githubLink: 'https://github.com'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');
  const detailButtons = document.querySelectorAll('.view-details-btn');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-header-img">
      <span class="modal-tag">${data.category}</span>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-summary">${data.summary}</p>

      <div class="modal-metrics-grid">
        ${data.metrics.map(m => `
          <div class="modal-metric-card">
            <div class="modal-metric-num">${m.num}</div>
            <div class="modal-metric-text">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <h3 class="modal-section-title">Key Architectural Challenges</h3>
      <ul class="modal-list">
        ${data.challenges.map(c => `<li><i class="ri-alert-line"></i> <span>${c}</span></li>`).join('')}
      </ul>

      <h3 class="modal-section-title">Solutions & Engineering Impact</h3>
      <ul class="modal-list">
        ${data.solutions.map(s => `<li><i class="ri-checkbox-circle-line"></i> <span>${s}</span></li>`).join('')}
      </ul>

      <div class="modal-actions">
        <a href="${data.demoLink}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          <i class="ri-external-link-line"></i> Launch Live System
        </a>
        <a href="${data.githubLink}" class="btn btn-glass" target="_blank" rel="noopener noreferrer">
          <i class="ri-github-fill"></i> View GitHub Repo
        </a>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  // ==========================================
  // 10. Copy Email to Clipboard
  // ==========================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'alex.morgan.dev@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Could not copy email automatically.', 'error');
      });
    });
  }

  // ==========================================
  // 11. Contact Form Real-Time Validation & Submit
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const subjectInput = document.getElementById('userSubject');
    const messageInput = document.getElementById('userMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
      nameError.textContent = '';
      emailError.textContent = '';
      subjectError.textContent = '';
      messageError.textContent = '';
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please provide your email address.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please provide a valid email address.';
        isValid = false;
      }

      if (!subjectInput.value.trim()) {
        subjectError.textContent = 'Please specify a subject.';
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please write a brief message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 15) {
        messageError.textContent = 'Message should be at least 15 characters long.';
        isValid = false;
      }

      if (!isValid) return;

      // Show loading spinner
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate asynchronous form delivery
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();

        showToast(
          'Message Sent Successfully! Alex will get back to you within 24 hours.',
          'success'
        );
      }, 1200);
    });
  }

  // ==========================================
  // 12. Toast Notification Utility
  // ==========================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'ri-information-line';
    let titleText = 'Notice';
    if (type === 'success') {
      iconClass = 'ri-checkbox-circle-line';
      titleText = 'Success';
    } else if (type === 'error') {
      iconClass = 'ri-error-warning-line';
      titleText = 'Error';
    }

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-body">
        <div class="toast-title">${titleText}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Trigger transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 400);
    }, 4500);
  }

  // ==========================================
  // 13. Dynamic Year & Back To Top
  // ==========================================
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
