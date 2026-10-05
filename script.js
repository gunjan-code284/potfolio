/**
 * Sahil Singh Portfolio - Interactive Functionality & AI Playground Logic
 * B.Tech in Artificial Intelligence & Machine Learning (AIML)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // 1. Dynamic Typewriter Effect
  // ==========================================
  const typewriterElement = document.getElementById('typewriterText');
  const roles = [
    'B.Tech AI & ML Undergrad (2026)',
    'Deep Learning & Vision Practitioner',
    'Generative AI & LLM Systems Builder',
    'PyTorch & Low-Latency MLOps Specialist'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    if (!typewriterElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(typeRole, typingSpeed);
  }

  if (typewriterElement) {
    setTimeout(typeRole, 500);
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

  const savedTheme = localStorage.getItem('sahil_portfolio_theme');
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
      localStorage.setItem('sahil_portfolio_theme', newTheme);
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
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
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
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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
    }, { threshold: 0.25 });

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
  // 9. Interactive AI Playground Demo Logic
  // ==========================================
  const playgroundTabs = document.querySelectorAll('.playground-tab-btn');
  const playgroundPanels = document.querySelectorAll('.playground-tab-content');

  playgroundTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      playgroundTabs.forEach(b => b.classList.remove('active'));
      playgroundPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        if (targetId === 'synapse-demo' && !synapseInitialized) {
          initSynapseCanvas();
        }
      }
    });
  });

  // AI Sentiment & Intent Inference Demo
  const aiDemoInput = document.getElementById('aiDemoInput');
  const runAiInferenceBtn = document.getElementById('runAiInferenceBtn');
  const clearAiInputBtn = document.getElementById('clearAiInputBtn');
  const presetPills = document.querySelectorAll('.preset-pill');

  const teleTokens = document.getElementById('teleTokens');
  const teleLatency = document.getElementById('teleLatency');
  const teleConfidence = document.getElementById('teleConfidence');

  const probPosNum = document.getElementById('probPosNum');
  const probPosBar = document.getElementById('probPosBar');
  const probAnaNum = document.getElementById('probAnaNum');
  const probAnaBar = document.getElementById('probAnaBar');
  const probCritNum = document.getElementById('probCritNum');
  const probCritBar = document.getElementById('probCritBar');
  const tokenChipsContainer = document.getElementById('tokenChipsContainer');

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const text = pill.getAttribute('data-text');
      if (aiDemoInput) {
        aiDemoInput.value = text;
        runNeuralInference();
      }
    });
  });

  if (clearAiInputBtn && aiDemoInput) {
    clearAiInputBtn.addEventListener('click', () => {
      aiDemoInput.value = '';
      aiDemoInput.focus();
    });
  }

  function runNeuralInference() {
    const text = (aiDemoInput ? aiDemoInput.value : '').trim();
    if (!text) {
      showToast('Please type some text or click a prompt pill.', 'error');
      return;
    }

    if (runAiInferenceBtn) {
      runAiInferenceBtn.disabled = true;
      runAiInferenceBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processing Tensors...';
    }

    // Tokenize text into simulated BPE tokens
    const words = text.split(/\s+/).filter(Boolean);
    const subwords = ['[CLS]'];
    words.forEach(w => {
      if (w.length > 7) {
        subwords.push(w.substring(0, 4));
        subwords.push('##' + w.substring(4));
      } else {
        subwords.push(w);
      }
    });
    subwords.push('[SEP]');

    setTimeout(() => {
      // Analyze text semantics
      const lower = text.toLowerCase();
      let posScore = 30;
      let anaScore = 50;
      let critScore = 20;

      if (lower.includes('accuracy') || lower.includes('breakthrough') || lower.includes('achieved') || lower.includes('optimal') || lower.includes('success') || lower.includes('converged') || lower.includes('amazing')) {
        posScore = 94;
        anaScore = 78;
        critScore = 4;
      } else if (lower.includes('cuda') || lower.includes('error') || lower.includes('crash') || lower.includes('bug') || lower.includes('fail') || lower.includes('oom')) {
        critScore = 92;
        anaScore = 65;
        posScore = 6;
      } else {
        anaScore = 88;
        posScore = 62;
        critScore = 18;
      }

      // Latency simulation (8ms - 18ms)
      const latency = (10 + Math.random() * 6).toFixed(1);
      const conf = Math.max(posScore, anaScore, critScore);

      if (teleTokens) teleTokens.textContent = subwords.length;
      if (teleLatency) teleLatency.textContent = `${latency} ms`;
      if (teleConfidence) teleConfidence.textContent = `${conf}.8%`;

      if (probPosNum && probPosBar) {
        probPosNum.textContent = `${posScore}%`;
        probPosBar.style.width = `${posScore}%`;
      }
      if (probAnaNum && probAnaBar) {
        probAnaNum.textContent = `${anaScore}%`;
        probAnaBar.style.width = `${anaScore}%`;
      }
      if (probCritNum && probCritBar) {
        probCritNum.textContent = `${critScore}%`;
        probCritBar.style.width = `${critScore}%`;
      }

      // Render token chips
      if (tokenChipsContainer) {
        tokenChipsContainer.innerHTML = '';
        subwords.slice(0, 16).forEach(token => {
          const chip = document.createElement('span');
          chip.className = 'token-chip';
          chip.textContent = token;
          tokenChipsContainer.appendChild(chip);
        });
        if (subwords.length > 16) {
          const more = document.createElement('span');
          more.className = 'token-chip';
          more.textContent = `+${subwords.length - 16} more`;
          tokenChipsContainer.appendChild(more);
        }
      }

      if (runAiInferenceBtn) {
        runAiInferenceBtn.disabled = false;
        runAiInferenceBtn.innerHTML = '<i class="ri-play-circle-line"></i> Run Neural Inference';
      }

      showToast(`Inference Complete in ${latency}ms (Confidence: ${conf}%)`, 'success');
    }, 450);
  }

  if (runAiInferenceBtn) {
    runAiInferenceBtn.addEventListener('click', runNeuralInference);
  }

  // Synapse Canvas Visualizer
  let synapseInitialized = false;
  let canvasAnimId = null;

  function initSynapseCanvas() {
    const canvas = document.getElementById('synapseCanvas');
    if (!canvas) return;
    synapseInitialized = true;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Define 4 layers: Input(4), Hidden1(7), Hidden2(7), Output(3)
    const layerSizes = [4, 7, 7, 3];
    const layers = [];
    const layerSpacing = width / (layerSizes.length + 1);

    layerSizes.forEach((size, lIndex) => {
      const x = (lIndex + 1) * layerSpacing;
      const nodes = [];
      const nodeSpacing = height / (size + 1);
      for (let n = 0; n < size; n++) {
        nodes.push({
          x: x,
          y: (n + 1) * nodeSpacing,
          radius: 9,
          energy: Math.random()
        });
      }
      layers.push(nodes);
    });

    // Create synapse pulses
    const pulses = [];
    function spawnPulse(lIndex, fromNode, toNode) {
      pulses.push({
        x: fromNode.x,
        y: fromNode.y,
        startX: fromNode.x,
        startY: fromNode.y,
        targetX: toNode.x,
        targetY: toNode.y,
        progress: 0,
        speed: 0.02 + Math.random() * 0.015,
        color: lIndex === 0 ? '#00f2fe' : lIndex === 1 ? '#8b5cf6' : '#ec4899'
      });
    }

    // Interactive button: stimulate
    const stimulateBtn = document.getElementById('stimulatePulseBtn');
    if (stimulateBtn) {
      stimulateBtn.addEventListener('click', () => {
        // Trigger pulses across all layers
        for (let l = 0; l < layers.length - 1; l++) {
          const current = layers[l];
          const next = layers[l + 1];
          current.forEach(cNode => {
            const pick = next[Math.floor(Math.random() * next.length)];
            spawnPulse(l, cNode, pick);
          });
        }
        showToast('Propagated Forward Activation Pulse through Synapses!', 'info');
      });
    }

    // Periodic spontaneous firing
    setInterval(() => {
      if (pulses.length < 25) {
        const l = Math.floor(Math.random() * (layers.length - 1));
        const from = layers[l][Math.floor(Math.random() * layers[l].length)];
        const to = layers[l + 1][Math.floor(Math.random() * layers[l + 1].length)];
        spawnPulse(l, from, to);
      }
    }, 280);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw synapse connections
      for (let l = 0; l < layers.length - 1; l++) {
        const current = layers[l];
        const next = layers[l + 1];

        current.forEach(c => {
          next.forEach(n => {
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });
        });
      }

      // Update and draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        p.x = p.startX + (p.targetX - p.startX) * p.progress;
        p.y = p.startY + (p.targetY - p.startY) * p.progress;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.progress >= 1) {
          pulses.splice(i, 1);
        }
      }

      // Draw neuron nodes
      layers.forEach((layer, lIdx) => {
        layer.forEach(node => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          
          let fillColor = '#131724';
          let strokeColor = '#00f2fe';
          if (lIdx === 1) strokeColor = '#6366f1';
          if (lIdx === 2) strokeColor = '#a855f7';
          if (lIdx === 3) strokeColor = '#ec4899';

          ctx.fillStyle = fillColor;
          ctx.fill();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = strokeColor;
          ctx.stroke();

          // Inner glow
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = strokeColor;
          ctx.fill();
        });
      });

      canvasAnimId = requestAnimationFrame(draw);
    }

    draw();
  }

  // ==========================================
  // 10. Interactive Project Case Study Modal
  // ==========================================
  const projectData = {
    'neurovision': {
      title: 'NeuroVision — Thoracic Pathology AI & Grad-CAM Visualizer',
      category: 'Medical Computer Vision & Explainable AI',
      image: 'assets/project1-neurovision.jpg',
      summary: 'NeuroVision is a multimodal diagnostic computer vision suite designed to detect 14 distinct chest pathologies from radiography scans. It features custom Vision Transformer (ViT) and DenseNet-121 backbones paired with real-time Grad-CAM interpretability heatmaps, empowering clinicians with sub-25ms diagnosis verification.',
      challenges: [
        'Mitigating extreme class imbalance across rare thoracic conditions (e.g. pneumothorax vs. cardiomegaly).',
        'Generating clinically faithful gradient-weighted class activation heatmaps (Grad-CAM) at high resolution.',
        'Exporting heavy PyTorch model checkpoints to lightweight runtimes for deployment on hospital edge servers.'
      ],
      solutions: [
        'Implemented Focal Loss and class-weighted contrastive pre-training to boost sensitivity on rare pathologies.',
        'Engineered an automated ONNX Runtime and TensorRT FP16 quantization pipeline cutting latency by 62%.',
        'Built an asynchronous FastAPI microservice with WebSockets streaming progressive diagnostic heatmaps.'
      ],
      metrics: [
        { num: '98.4%', label: 'ROC-AUC Score' },
        { num: '14 ms', label: 'Inference Latency' },
        { num: '14 Classes', label: 'Thoracic Pathologies' }
      ],
      demoLink: '#playground',
      githubLink: 'https://github.com/gunjan-code284'
    },
    'nexusrag': {
      title: 'NexusRAG — Autonomous Multi-Agent Knowledge Retrieval Engine',
      category: 'Generative AI, LLMs & Vector Retrieval',
      image: 'assets/project2-nexusrag.jpg',
      summary: 'NexusRAG is an enterprise-ready agentic RAG system built on top of quantized open-weights models (Llama-3-8B). It leverages hybrid dense/sparse vector retrieval (BM25 + ChromaDB embeddings) and Cohere cross-encoder reranking to answer complex technical queries with high factual grounding.',
      challenges: [
        'Overcoming hallucinations and citation inaccuracies in large technical document corpora.',
        'Balancing retrieval recall and low-latency token streaming for live conversational chats.',
        'Managing memory footprint of 8B parameter models on single GPU instances.'
      ],
      solutions: [
        'Integrated multi-query expansion and Cohere semantic reranking, boosting retrieval precision by 34%.',
        'Implemented 4-bit GGUF quantization with vLLM PagedAttention serving sub-18ms time-to-first-token (TTFT).',
        'Added dynamic context window pruning and automated citation hallucination guardrails.'
      ],
      metrics: [
        { num: '34%', label: 'Precision Boost' },
        { num: '<18ms', label: 'Time To First Token' },
        { num: '7.8M', label: 'Vector Embeddings' }
      ],
      demoLink: '#playground',
      githubLink: 'https://github.com/gunjan-code284'
    },
    'deepdrive': {
      title: 'DeepDrive-RL — Sensor Fusion Autonomous Driving Agent',
      category: 'Deep Reinforcement Learning & Robotics',
      image: 'assets/project3-deepdrive.jpg',
      summary: 'DeepDrive-RL is an end-to-end deep reinforcement learning policy trained in the CARLA simulator. It fuses 3D LiDAR point clouds and semantic segmentation camera masks into a unified latent bird-eye representation, successfully steering, braking, and avoiding collisions in dense urban environments.',
      challenges: [
        'Reward shaping instability and sparse rewards in complex multi-lane highway scenarios.',
        'Fusing multi-sensor asynchronous streams (3D LiDAR + RGB camera) without temporal latency.',
        'Sim-to-real domain gap and erratic pedestrian behavior in unpredictable weather.'
      ],
      solutions: [
        'Trained using Soft Actor-Critic (SAC) and Proximal Policy Optimization (PPO) with entropy regularization.',
        'Architected a PointNet-based LiDAR spatial encoder fused with a ResNet vision backbone.',
        'Applied aggressive data augmentation including simulated rain, fog, and sensor occlusion.'
      ],
      metrics: [
        { num: '99.2%', label: 'Collision-Free Safety' },
        { num: '30 FPS', label: 'Simulation Steer Loop' },
        { num: '1.2M', label: 'Simulated Miles' }
      ],
      demoLink: '#projects',
      githubLink: 'https://github.com/gunjan-code284'
    },
    'croppulse': {
      title: 'CropPulse — Hyperspectral Drone Crop Pathology AI',
      category: 'Computer Vision & Edge Agriculture',
      image: 'assets/project4-croppulse.jpg',
      summary: 'CropPulse is a precision agriculture diagnostic platform engineered to detect 38+ plant diseases and pest infestations using aerial drone multispectral imagery and mobile phone snapshots. Designed specifically for offline edge execution in remote farming communities.',
      challenges: [
        'Operating in remote rural areas with zero internet connectivity and budget Android hardware.',
        'Differentiating subtle visual blight symptoms across overlapping plant leaves in varied lighting.',
        'Rapid geo-tagging and blight propagation velocity prediction.'
      ],
      solutions: [
        'Trained dual YOLOv8 for lesion bounding boxes and EfficientNet-B4 for multi-label fungal classification.',
        'Exported to INT8 TFLite & ONNX runtimes running entirely in-browser and offline on smartphones.',
        'Awarded First Prize & National Top 5 Finalist for societal impact and farmer usability.'
      ],
      metrics: [
        { num: '98.1%', label: 'F1 Classification' },
        { num: '38+', label: 'Crop Pathologies' },
        { num: 'Offline', label: 'Zero-Cloud Inference' }
      ],
      demoLink: '#projects',
      githubLink: 'https://github.com/gunjan-code284'
    },
    'alphaforecaster': {
      title: 'AlphaForecaster — High-Frequency Order Book ML',
      category: 'Time-Series & Financial Machine Learning',
      image: 'assets/project2-crypto-wallet.jpg',
      summary: 'AlphaForecaster utilizes Temporal Fusion Transformers (TFT) with multi-head attention to analyze limit order book microstructure imbalances and predict short-horizon volatility spikes with sub-10ms latency.',
      challenges: [
        'Processing nanosecond-level market ticks without backpressure or dropping frames.',
        'Non-stationarity and extreme market noise in high-frequency trading regimes.'
      ],
      solutions: [
        'Engineered an in-memory streaming consumer buffer with Redis Streams and C++ bindings.',
        'Applied bidirectional LSTM and Temporal Transformer heads with quantile loss calibration.'
      ],
      metrics: [
        { num: '<10ms', label: 'Prediction Latency' },
        { num: '72.4%', label: 'Directional Accuracy' },
        { num: '100k+', label: 'Ticks / Second' }
      ],
      demoLink: '#projects',
      githubLink: 'https://github.com/gunjan-code284'
    },
    'synthvoice': {
      title: 'SynthVoice — Real-Time Multilingual Neural Speech AI',
      category: 'Speech & Audio Deep Learning',
      image: 'assets/project4-cybernex-3d.jpg',
      summary: 'SynthVoice is a conversational speech recognition and neural synthesis pipeline fine-tuned on regional Indian accents. Combines a modified Whisper acoustic model with a FastSpeech2 vocoder for sub-120ms conversational audio latency.',
      challenges: [
        'High Word Error Rate (WER) on code-mixed Hinglish and regional dialects.',
        'Audio streaming buffer latency on standard mobile connections.'
      ],
      solutions: [
        'Fine-tuned OpenAI Whisper with LoRA on 400+ hours of localized regional Indian speech datasets.',
        'Implemented WebRTC voice streaming buffers directly into browser audio decoders.'
      ],
      metrics: [
        { num: '7.8%', label: 'Word Error Rate' },
        { num: '<120ms', label: 'Voice Latency' },
        { num: '4 Languages', label: 'Supported Accents' }
      ],
      demoLink: '#projects',
      githubLink: 'https://github.com/gunjan-code284'
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
        <a href="${data.demoLink}" class="btn btn-primary">
          <i class="ri-sparkling-line"></i> Launch System Demo
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
  // 11. Interactive ATS Resume Modal Logic
  // ==========================================
  const resumeModal = document.getElementById('resumeModal');
  const viewResumeNavBtn = document.getElementById('viewResumeNavBtn');
  const viewResumeMobileBtn = document.getElementById('viewResumeMobileBtn');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const resumeModalCloseBtn = document.getElementById('resumeModalCloseBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (viewResumeNavBtn) viewResumeNavBtn.addEventListener('click', openResumeModal);
  if (viewResumeMobileBtn) viewResumeMobileBtn.addEventListener('click', openResumeModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);
  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener('click', closeResumeModal);

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
        closeResumeModal();
      }
    });
  }

  // ==========================================
  // 12. Copy Email to Clipboard
  // ==========================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'sahilsingh.aiml26@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email (sahilsingh.aiml26@gmail.com) copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Could not copy email automatically.', 'error');
      });
    });
  }

  // ==========================================
  // 13. Contact Form Real-Time Validation & Submit
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
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (subjectError) subjectError.textContent = '';
      if (messageError) messageError.textContent = '';
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name or organization.';
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
        messageError.textContent = 'Please write a message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        contactForm.reset();

        showToast(
          'Message Delivered! Sahil Singh will review and get back to you shortly.',
          'success'
        );
      }, 1000);
    });
  }

  // ==========================================
  // 14. Toast Notification Utility
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
      titleText = 'Attention';
    }

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-body">
        <div class="toast-title">${titleText}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

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
  // 15. Dynamic Year & Back To Top
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
