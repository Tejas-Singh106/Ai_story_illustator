


// Main Application Controller: LuminaStory AI
// Coordinates Studio, Storybook Reader, Presentation Deck, and Library

(function () {
  'use strict';

  // --- State Management ---
  const STATE = {
    currentTab: 'studio',
    currentStory: null,
    currentSceneIndex: 0,
    savedStories: [],
    currentSlideIndex: 0,
    teamMetadata: null,
    settings: {
      provider: 'local', // 'local' or 'gemini'
      geminiApiKey: localStorage.getItem('gemini_api_key') || '',
      preferredArtStyle: 'pixar',
      preferredGenre: 'fantasy'
    }
  };

  // Creative Random Prompt Suggestions
  const RANDOM_PROMPTS = [
    { text: "A young stargazer discovers a fallen star that whispers forgotten constellations.", genre: "fantasy", style: "pixar" },
    { text: "A robotic gardener in an underwater dome creates bioluminescent flower species.", genre: "scifi", style: "anime" },
    { text: "A clockmaker finds a golden gear that turns back ten seconds of time whenever wound.", genre: "fairytale", style: "watercolor" },
    { text: "A brave little red panda navigates floating jade islands to find the ancient sky fruit.", genre: "adventure", style: "pixar" },
    { text: "A detective with neon cyber-optics investigates disappearing memories in Neo-Seoul.", genre: "scifi", style: "cyberpunk" },
    { text: "A friendly baby dragon who sneezes harmless starlight sparks instead of fire.", genre: "fantasy", style: "watercolor" }
  ];

  // DOM Elements Cache
  const DOM = {};

  function cacheDOMElements() {
    DOM.navTabs = document.querySelectorAll('.nav-tab-btn');
    DOM.tabPanels = document.querySelectorAll('.tab-panel');
    DOM.ambienceSelect = document.getElementById('ambience-select');
    DOM.btnSettings = document.getElementById('btn-settings');
    DOM.settingsModal = document.getElementById('settings-modal');
    DOM.btnCloseModal = document.getElementById('btn-close-modal');
    DOM.btnSaveSettings = document.getElementById('btn-save-settings');
    DOM.apiKeyInput = document.getElementById('api-key-input');
    DOM.providerSelect = document.getElementById('provider-select');

    // Studio Elements
    DOM.promptInput = document.getElementById('prompt-input');
    DOM.btnRandomPrompt = document.getElementById('btn-random-prompt');
    DOM.genrePills = document.querySelectorAll('.genre-pill');
    DOM.artStyleCards = document.querySelectorAll('.art-style-card');
    DOM.charNameInput = document.getElementById('char-name-input');
    DOM.charSidekickInput = document.getElementById('char-sidekick-input');
    DOM.sceneCountSelect = document.getElementById('scene-count-select');
    DOM.audienceSelect = document.getElementById('audience-select');
    DOM.toneSelect = document.getElementById('tone-select');
    DOM.btnGenerateStory = document.getElementById('btn-generate-story');
    DOM.generationOverlay = document.getElementById('generation-overlay');
    DOM.generationStepText = document.getElementById('generation-step-text');
    DOM.progressBarFill = document.getElementById('progress-bar-fill');
    DOM.quickStoryCards = document.querySelectorAll('.quick-story-card');

    // Reader Elements
    DOM.readerTitle = document.getElementById('reader-title');
    DOM.readerMetaGenre = document.getElementById('reader-meta-genre');
    DOM.readerMetaStyle = document.getElementById('reader-meta-style');
    DOM.readerMetaAudience = document.getElementById('reader-meta-audience');
    DOM.sceneImage = document.getElementById('scene-image');
    DOM.scenePromptSnippet = document.getElementById('scene-prompt-snippet');
    DOM.btnRerollImage = document.getElementById('btn-reroll-image');
    DOM.sceneNumberRibbon = document.getElementById('scene-number-ribbon');
    DOM.sceneTitle = document.getElementById('scene-title');
    DOM.narrationArea = document.getElementById('narration-area');
    DOM.pageIndicatorDots = document.getElementById('page-indicator-dots');
    DOM.btnPrevScene = document.getElementById('btn-prev-scene');
    DOM.btnNextScene = document.getElementById('btn-next-scene');
    DOM.btnPlayPause = document.getElementById('btn-play-pause');
    DOM.btnStopAudio = document.getElementById('btn-stop-audio');
    DOM.audioNarrationBar = document.getElementById('audio-narration-bar');
    DOM.voiceSelect = document.getElementById('voice-select');
    DOM.speedSelect = document.getElementById('speed-select');
    DOM.btnPrintPdf = document.getElementById('btn-print-pdf');
    DOM.btnExportJson = document.getElementById('btn-export-json');
    DOM.btnCopyText = document.getElementById('btn-copy-text');

    // Presentation Elements
    DOM.slideViewport = document.getElementById('slide-viewport');
    DOM.slideContentArea = document.getElementById('slide-content-area');
    DOM.slidePillsNav = document.getElementById('slide-pills-nav');
    DOM.btnPrevSlide = document.getElementById('btn-prev-slide');
    DOM.btnNextSlide = document.getElementById('btn-next-slide');
    DOM.btnFullscreenSlide = document.getElementById('btn-fullscreen-slide');
    DOM.btnEditTeam = document.getElementById('btn-edit-team');
    DOM.editTeamModal = document.getElementById('edit-team-modal');
    DOM.btnCloseTeamModal = document.getElementById('btn-close-team-modal');
    DOM.btnSaveTeam = document.getElementById('btn-save-team');
    DOM.slideNumberBadge = document.getElementById('slide-number-badge');

    // Library Elements
    DOM.libraryGrid = document.getElementById('library-grid');
    DOM.savedCountBadge = document.getElementById('saved-count-badge');
  }

  // --- Initializer ---
  function init() {
    cacheDOMElements();
    loadTeamMetadata();
    loadSavedStories();
    bindEvents();
    populateVoiceList();

    // Load initial showcase story
    if (typeof SAMPLE_STORIES !== 'undefined' && SAMPLE_STORIES.length > 0) {
      loadStory(SAMPLE_STORIES[0]);
    }

    renderPresentationSlidesNav();
    renderSlide(0);
    renderLibrary();
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Navigation Tabs
    DOM.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        switchTab(target);
      });
    });

    // Ambience selector
    DOM.ambienceSelect.addEventListener('change', (e) => {
      window.ttsEngine.setAmbience(e.target.value);
    });

    // Settings Modal
    DOM.btnSettings.addEventListener('click', openSettingsModal);
    DOM.btnCloseModal.addEventListener('click', closeSettingsModal);
    DOM.btnSaveSettings.addEventListener('click', saveSettings);

    // Studio Interactions
    DOM.btnRandomPrompt.addEventListener('click', fillRandomPrompt);

    DOM.genrePills.forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.genrePills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        STATE.settings.preferredGenre = pill.dataset.genre;
      });
    });

    DOM.artStyleCards.forEach(card => {
      card.addEventListener('click', () => {
        DOM.artStyleCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        STATE.settings.preferredArtStyle = card.dataset.style;
      });
    });

    DOM.btnGenerateStory.addEventListener('click', handleGenerateStory);

    // Quick story loaders
    DOM.quickStoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.sampleId;
        const found = SAMPLE_STORIES.find(s => s.id === id);
        if (found) {
          loadStory(found);
          switchTab('reader');
        }
      });
    });

    // Reader Scene Navigation
    DOM.btnPrevScene.addEventListener('click', () => navigateScene(-1));
    DOM.btnNextScene.addEventListener('click', () => navigateScene(1));

    // Audio Narration Controls
    DOM.btnPlayPause.addEventListener('click', toggleAudioNarration);
    DOM.btnStopAudio.addEventListener('click', stopAudioNarration);
    DOM.voiceSelect.addEventListener('change', (e) => {
      window.ttsEngine.setVoice(e.target.value);
    });
    DOM.speedSelect.addEventListener('change', (e) => {
      window.ttsEngine.setRate(e.target.value);
    });

    // Re-roll scene image
    DOM.btnRerollImage.addEventListener('click', handleRerollSceneImage);

    // Reader Export Actions
    DOM.btnPrintPdf.addEventListener('click', () => {
      if (STATE.currentStory) window.ExportUtils.printStorybook(STATE.currentStory);
    });
    DOM.btnExportJson.addEventListener('click', () => {
      if (STATE.currentStory) window.ExportUtils.exportJSON(STATE.currentStory);
    });
    DOM.btnCopyText.addEventListener('click', () => {
      if (STATE.currentStory) window.ExportUtils.copyStoryText(STATE.currentStory);
    });

    // Presentation Slide Navigation
    DOM.btnPrevSlide.addEventListener('click', () => navigateSlide(-1));
    DOM.btnNextSlide.addEventListener('click', () => navigateSlide(1));
    DOM.btnFullscreenSlide.addEventListener('click', toggleSlideFullscreen);
    DOM.btnEditTeam.addEventListener('click', openTeamModal);
    DOM.btnCloseTeamModal.addEventListener('click', closeTeamModal);
    DOM.btnSaveTeam.addEventListener('click', saveTeamMetadata);

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (STATE.currentTab === 'reader') {
        if (e.key === 'ArrowRight') navigateScene(1);
        if (e.key === 'ArrowLeft') navigateScene(-1);
        if (e.key === ' ') {
          e.preventDefault();
          toggleAudioNarration();
        }
      } else if (STATE.currentTab === 'slides') {
        if (e.key === 'ArrowRight') navigateSlide(1);
        if (e.key === 'ArrowLeft') navigateSlide(-1);
        if (e.key === 'f' || e.key === 'F') toggleSlideFullscreen();
      }
    });
  }

  // --- Tab Switcher ---
  function switchTab(tabId) {
    STATE.currentTab = tabId;
    DOM.navTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });
    DOM.tabPanels.forEach(p => {
      p.classList.toggle('active', p.id === `tab-${tabId}`);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Random Prompt Generator ---
  function fillRandomPrompt() {
    const item = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    DOM.promptInput.value = item.text;

    // Auto-select corresponding genre & style
    DOM.genrePills.forEach(pill => {
      if (pill.dataset.genre === item.genre) {
        pill.click();
      }
    });
    DOM.artStyleCards.forEach(card => {
      if (card.dataset.style === item.style) {
        card.click();
      }
    });
  }

  // --- Voice List Populate ---
  function populateVoiceList() {
    setTimeout(() => {
      const voices = window.ttsEngine.getVoices();
      DOM.voiceSelect.innerHTML = '';
      voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name.slice(0, 22)} (${v.lang})`;
        DOM.voiceSelect.appendChild(opt);
      });
    }, 500);
  }

  // --- Generate Story Orchestration ---
  async function handleGenerateStory() {
    const prompt = DOM.promptInput.value.trim();
    const selectedGenreEl = document.querySelector('.genre-pill.selected');
    const genre = selectedGenreEl ? selectedGenreEl.dataset.genre : 'fantasy';
    const selectedStyleEl = document.querySelector('.art-style-card.selected');
    const artStyle = selectedStyleEl ? selectedStyleEl.dataset.style : 'pixar';
    const charName = DOM.charNameInput.value.trim() || 'Aria';
    const charSidekick = DOM.charSidekickInput.value.trim() || 'Pip';
    const sceneCount = DOM.sceneCountSelect.value || '4';
    const audience = DOM.audienceSelect.value || 'All Ages';
    const tone = DOM.toneSelect.value || 'Inspirational';

    // Show Progress Modal with smooth animated stages
    DOM.generationOverlay.classList.add('active');
    updateProgressStep("Initializing Multimodal Neural Pipeline...", 15);

    const stepTimer1 = setTimeout(() => {
      updateProgressStep("Generating Structured Story Arc & Character Anchor...", 40);
    }, 900);

    const stepTimer2 = setTimeout(() => {
      updateProgressStep("Synthesizing Visual Prompts & Conditioning Latent Diffusion...", 70);
    }, 2200);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          genre: genre,
          artStyle: artStyle,
          audience: audience,
          tone: tone,
          characters: { name: charName, companion: charSidekick },
          sceneCount: sceneCount,
          provider: STATE.settings.provider,
          apiKey: STATE.settings.geminiApiKey
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await response.json();
      if (data.success && data.story) {
        updateProgressStep("Finalizing Storybook & Loading High-Resolution Illustrations...", 95);
        setTimeout(() => {
          DOM.generationOverlay.classList.remove('active');
          saveStoryToLibrary(data.story);
          loadStory(data.story);
          switchTab('reader');
        }, 800);
      } else {
        throw new Error(data.error || 'Failed to generate story.');
      }
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error('Story generation failed:', err);
      updateProgressStep("Generation Error: " + err.message, 100);
      setTimeout(() => {
        DOM.generationOverlay.classList.remove('active');
        alert("Story generation error: " + err.message);
      }, 1500);
    }
  }

  function updateProgressStep(text, percent) {
    if (DOM.generationStepText) DOM.generationStepText.textContent = text;
    if (DOM.progressBarFill) DOM.progressBarFill.style.width = percent + '%';
  }

  // --- Load Story into Reader ---
  function loadStory(story) {
    STATE.currentStory = story;
    STATE.currentSceneIndex = 0;

    stopAudioNarration();

    DOM.readerTitle.textContent = story.title || 'Untitled Story';
    DOM.readerMetaGenre.textContent = story.genre || 'Fantasy';
    DOM.readerMetaStyle.textContent = story.artStyle || 'Pixar 3D';
    DOM.readerMetaAudience.textContent = story.audience || 'All Ages';

    renderScene(0);
  }

  // --- Render Specific Scene in Reader ---
  function renderScene(index) {
    if (!STATE.currentStory || !STATE.currentStory.scenes) return;
    const scenes = STATE.currentStory.scenes;
    if (index < 0 || index >= scenes.length) return;

    STATE.currentSceneIndex = index;
    const scene = scenes[index];

    DOM.sceneNumberRibbon.textContent = `SCENE ${index + 1} OF ${scenes.length} • ${scene.mood || 'Uplifting'}`;
    DOM.sceneTitle.textContent = scene.title || `Scene ${index + 1}`;
    DOM.narrationArea.innerHTML = scene.narration;

    // Load Illustration with smooth fade
    DOM.sceneImage.style.opacity = '0.3';
    DOM.sceneImage.src = scene.imageUrl;
    DOM.sceneImage.onload = () => {
      DOM.sceneImage.style.opacity = '1';
    };
    DOM.sceneImage.onerror = () => {
      // SVG Fallback if network drops
      DOM.sceneImage.src = generateSvgFallback(scene.title, STATE.currentStory.artStyle);
      DOM.sceneImage.style.opacity = '1';
    };

    DOM.scenePromptSnippet.textContent = scene.visualPrompt || scene.narration.slice(0, 100);

    // Update Pagination Dots & Arrow State
    renderPaginationDots();
    DOM.btnPrevScene.disabled = (index === 0);
    DOM.btnNextScene.disabled = (index === scenes.length - 1);
  }

  function navigateScene(delta) {
    stopAudioNarration();
    const newIdx = STATE.currentSceneIndex + delta;
    renderScene(newIdx);
  }

  function renderPaginationDots() {
    DOM.pageIndicatorDots.innerHTML = '';
    const scenes = STATE.currentStory.scenes || [];
    scenes.forEach((sc, i) => {
      const dot = document.createElement('div');
      dot.className = `page-dot ${i === STATE.currentSceneIndex ? 'active' : ''}`;
      dot.title = `Scene ${i + 1}: ${sc.title}`;
      dot.addEventListener('click', () => {
        stopAudioNarration();
        renderScene(i);
      });
      DOM.pageIndicatorDots.appendChild(dot);
    });
  }

  // --- Re-roll Single Scene Image ---
  async function handleRerollSceneImage() {
    if (!STATE.currentStory) return;
    const currentScene = STATE.currentStory.scenes[STATE.currentSceneIndex];
    if (!currentScene) return;

    DOM.btnRerollImage.textContent = "⏳ Generating...";
    DOM.btnRerollImage.disabled = true;

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visualPrompt: currentScene.visualPrompt,
          artStyle: STATE.currentStory.artStyle,
          seed: Math.floor(Math.random() * 899999) + 100000
        })
      });

      const data = await response.json();
      if (data.success && data.imageUrl) {
        currentScene.imageUrl = data.imageUrl;
        DOM.sceneImage.src = data.imageUrl;
      }
    } catch (e) {
      console.warn('Re-roll error:', e);
    } finally {
      DOM.btnRerollImage.textContent = "🔄 Re-roll Image";
      DOM.btnRerollImage.disabled = false;
    }
  }

  // --- Audio Narration Controller ---
  function toggleAudioNarration() {
    if (window.ttsEngine.isPlaying && !window.ttsEngine.isPaused) {
      window.ttsEngine.pause();
      DOM.audioNarrationBar.classList.remove('playing');
      DOM.btnPlayPause.textContent = '▶';
    } else if (window.ttsEngine.isPlaying && window.ttsEngine.isPaused) {
      window.ttsEngine.resume();
      DOM.audioNarrationBar.classList.add('playing');
      DOM.btnPlayPause.textContent = '⏸';
    } else {
      startAudioNarration();
    }
  }

  function startAudioNarration() {
    const scene = STATE.currentStory.scenes[STATE.currentSceneIndex];
    if (!scene) return;

    const textToSpeak = `${scene.title}. ${scene.narration}`;
    DOM.audioNarrationBar.classList.add('playing');
    DOM.btnPlayPause.textContent = '⏸';

    window.ttsEngine.speak(
      textToSpeak,
      (charIndex, length) => {
        // Highlight word in narration text
        highlightNarrationWord(charIndex, length);
      },
      () => {
        // When speech finishes, reset controls and optionally move to next scene
        DOM.audioNarrationBar.classList.remove('playing');
        DOM.btnPlayPause.textContent = '▶';
        DOM.narrationArea.innerHTML = scene.narration;
      }
    );
  }

  function stopAudioNarration() {
    window.ttsEngine.stop();
    DOM.audioNarrationBar.classList.remove('playing');
    DOM.btnPlayPause.textContent = '▶';
    if (STATE.currentStory && STATE.currentStory.scenes[STATE.currentSceneIndex]) {
      DOM.narrationArea.innerHTML = STATE.currentStory.scenes[STATE.currentSceneIndex].narration;
    }
  }

  function highlightNarrationWord(charIndex, length) {
    const scene = STATE.currentStory.scenes[STATE.currentSceneIndex];
    if (!scene) return;
    const fullText = `${scene.title}. ${scene.narration}`;
    const offset = scene.title.length + 2;

    if (charIndex >= offset) {
      const narCharIdx = charIndex - offset;
      const before = scene.narration.substring(0, narCharIdx);
      const target = scene.narration.substring(narCharIdx, narCharIdx + length);
      const after = scene.narration.substring(narCharIdx + length);
      DOM.narrationArea.innerHTML = `${before}<span class="highlighted-word">${target}</span>${after}`;
    }
  }

  // --- Academic Presentation Deck Controller (6 Slides) ---
  function renderPresentationSlidesNav() {
    DOM.slidePillsNav.innerHTML = '';
    PROJECT_PRESENTATION.slides.forEach((sl, idx) => {
      const btn = document.createElement('button');
      btn.className = `slide-pill-btn ${idx === STATE.currentSlideIndex ? 'active' : ''}`;
      btn.textContent = `Slide ${sl.number}`;
      btn.title = sl.title;
      btn.addEventListener('click', () => renderSlide(idx));
      DOM.slidePillsNav.appendChild(btn);
    });
  }

  function renderSlide(index) {
    if (index < 0 || index >= PROJECT_PRESENTATION.slides.length) return;
    STATE.currentSlideIndex = index;
    const slide = PROJECT_PRESENTATION.slides[index];

    // Update Nav Pills
    const pills = DOM.slidePillsNav.querySelectorAll('.slide-pill-btn');
    pills.forEach((p, i) => p.classList.toggle('active', i === index));

    DOM.slideNumberBadge.textContent = `${slide.number} / ${PROJECT_PRESENTATION.slides.length}`;
    DOM.btnPrevSlide.disabled = (index === 0);
    DOM.btnNextSlide.disabled = (index === PROJECT_PRESENTATION.slides.length - 1);

    // Build Slide Content HTML depending on type
    let html = '';
    const meta = STATE.teamMetadata;

    if (slide.type === 'title_slide') {
      html = `
        <div class="title-slide-wrapper">
          <div class="title-slide-badge">🎓 ${meta.course} • ${meta.academicYear}</div>
          <h1>${meta.projectTitle}</h1>
          <p class="subtitle">${meta.subtitle}</p>

          <div class="team-grid-cards">
            ${meta.teamMembers.map(m => `
              <div class="team-member-card">
                <div class="member-header">
                  <div class="member-avatar">${m.name[0]}</div>
                  <div>
                    <div class="member-name">${m.name}</div>
                    <div class="member-roll">Roll No: ${m.rollNo}</div>
                  </div>
                </div>
                <div class="member-role">${m.role}</div>
              </div>
            `).join('')}
          </div>

          <div class="academic-info-bar">
            <span><strong>Section:</strong> ${meta.section}</span>
            <span>•</span>
            <span><strong>Department:</strong> ${meta.department}</span>
            <span>•</span>
            <span><strong>Faculty Guide:</strong> ${meta.guide}</span>
          </div>
        </div>
      `;
    } else if (slide.type === 'problem_motivation') {
      html = `
        <div class="slide-header-meta">
          <span class="slide-badge-category">${slide.badge}</span>
          <span class="slide-course-tag">${meta.course}</span>
        </div>
        <h2 class="slide-title-main">${slide.title}</h2>
        <div class="split-content-grid">
          <div class="card-column">
            <div class="column-header">
              <span>⚠️</span>
              <span>Problem Statement & Challenges</span>
            </div>
            ${slide.problemPoints.map(p => `
              <div class="point-item">
                <div class="point-icon">${p.icon}</div>
                <div class="point-details">
                  <h4>${p.title}</h4>
                  <p>${p.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="card-column">
            <div class="column-header">
              <span>🎯</span>
              <span>Research Motivation & Objectives</span>
            </div>
            ${slide.motivationPoints.map(m => `
              <div class="point-item">
                <div class="point-icon">${m.icon}</div>
                <div class="point-details">
                  <h4>${m.title}</h4>
                  <p>${m.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (slide.type === 'architecture') {
      html = `
        <div class="slide-header-meta">
          <span class="slide-badge-category">${slide.badge}</span>
          <span class="slide-course-tag">${meta.course}</span>
        </div>
        <h2 class="slide-title-main">${slide.title}</h2>
        <div class="pipeline-flow-container">
          <div class="flow-step-row">
            ${slide.pipelineSteps.map((st, i) => `
              <div class="flow-step-node">
                <div class="step-tag-badge">${st.tag}</div>
                <div class="step-node-title">${st.step}</div>
                <div class="step-node-desc">${st.desc}</div>
              </div>
              ${i < slide.pipelineSteps.length - 1 ? '<div class="flow-connector-arrow">➔</div>' : ''}
            `).join('')}
          </div>
          <div class="architecture-highlights-box">
            <div class="arch-stat">
              <strong>LLM Narrative Agent</strong>
              <span>Gemini 1.5 Flash / Neural Schema Parser for 4-act plot structure</span>
            </div>
            <div class="arch-stat">
              <strong>Latent Diffusion Engine</strong>
              <span>FLUX.1 & SDXL models with locked seeds and negative prompt filters</span>
            </div>
            <div class="arch-stat">
              <strong>Multimodal Alignment</strong>
              <span>CLIP Text-to-Image embedding alignment & Web Speech TTS synchronization</span>
            </div>
          </div>
        </div>
      `;
    } else if (slide.type === 'dataset_training') {
      html = `
        <div class="slide-header-meta">
          <span class="slide-badge-category">${slide.badge}</span>
          <span class="slide-course-tag">${meta.course}</span>
        </div>
        <h2 class="slide-title-main">${slide.title}</h2>
        <div class="dataset-training-grid">
          <div class="card-column">
            <div class="column-header">
              <span>📚</span>
              <span>Corpora & Visual Datasets</span>
            </div>
            <table class="dataset-table-wrap">
              <thead>
                <tr>
                  <th>Dataset Name</th>
                  <th>Scale / Volume</th>
                  <th>Role in Pipeline</th>
                </tr>
              </thead>
              <tbody>
                ${slide.datasets.map(d => `
                  <tr>
                    <td><strong>${d.name}</strong></td>
                    <td>${d.volume}</td>
                    <td>${d.role}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="card-column">
            <div class="column-header">
              <span>⚙️</span>
              <span>Preprocessing & Training Config</span>
            </div>
            <ul class="specs-list">
              ${slide.preprocessing.map(p => `<li><strong>Preprocessing:</strong> ${p}</li>`).join('')}
              ${slide.trainingDetails.map(t => `<li><strong>Fine-Tuning:</strong> ${t}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    } else if (slide.type === 'results') {
      html = `
        <div class="slide-header-meta">
          <span class="slide-badge-category">${slide.badge}</span>
          <span class="slide-course-tag">${meta.course}</span>
        </div>
        <h2 class="slide-title-main">${slide.title}</h2>
        <div class="results-container-grid">
          <div class="card-column">
            <div class="column-header">
              <span>📊</span>
              <span>Quantitative Performance Benchmarks</span>
            </div>
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Baseline</th>
                  <th>Our Framework</th>
                  <th>Gain / Status</th>
                </tr>
              </thead>
              <tbody>
                ${slide.quantitativeMetrics.map(m => `
                  <tr>
                    <td><strong>${m.metric}</strong></td>
                    <td>${m.baseline}</td>
                    <td><strong style="color:var(--accent-cyan)">${m.ourModel}</strong></td>
                    <td><span class="improvement-badge">${m.improvement}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="card-column">
            <div class="column-header">
              <span>⭐</span>
              <span>Human Subjective Evaluation (N=50)</span>
            </div>
            <div class="human-eval-bars">
              ${slide.humanEvaluations.map(h => `
                <div class="eval-bar-item">
                  <div class="bar-label-row">
                    <span>${h.aspect}</span>
                    <strong>${h.score} / ${h.max}</strong>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill-rating" style="width: ${(h.score / h.max) * 100}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (slide.type === 'repository') {
      html = `
        <div class="slide-header-meta">
          <span class="slide-badge-category">${slide.badge}</span>
          <span class="slide-course-tag">${meta.course}</span>
        </div>
        <h2 class="slide-title-main">${slide.title}</h2>
        <div class="repo-slide-grid">
          <div class="card-column">
            <div class="column-header">
              <span>💻</span>
              <span>Clean Code & Terminal Execution</span>
            </div>
            <div class="code-box-terminal">
              <div class="code-box-header">
                <span class="term-dot term-red"></span>
                <span class="term-dot term-yellow"></span>
                <span class="term-dot term-green"></span>
              </div>
              ${slide.runSteps.map((st, i) => `
                <div class="term-line">
                  # Step ${i + 1}: ${st.label}<br/>
                  <span class="cmd">$ ${st.cmd}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card-column">
            <div class="column-header">
              <span>🔗</span>
              <span>Project Links & Delivery Assets</span>
            </div>
            <div class="repo-links-box">
              <a href="#" class="btn-repo-link" onclick="alert('GitHub Repository: ' + '${meta.githubRepo}'); return false;">
                <span>📦 GitHub Source Code Repository</span>
                <span>➔</span>
              </a>
              <a href="#" class="btn-repo-link" onclick="alert('Google Drive Deliverables: ' + '${meta.driveLink}'); return false;">
                <span>📂 Google Drive Project Report & Slides</span>
                <span>➔</span>
              </a>
              <button class="generate-action-btn" style="margin-top:10px" onclick="document.querySelector('[data-tab=studio]').click()">
                🚀 Launch Live Story Generator Studio
              </button>
            </div>
          </div>
        </div>
      `;
    }

    DOM.slideContentArea.innerHTML = html;
  }

  function navigateSlide(delta) {
    const newIdx = STATE.currentSlideIndex + delta;
    renderSlide(newIdx);
  }

  function toggleSlideFullscreen() {
    if (!document.fullscreenElement) {
      DOM.slideViewport.requestFullscreen().catch(err => {
        alert("Fullscreen error: " + err.message);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // --- Team Metadata Customizer ---
  function loadTeamMetadata() {
    const saved = localStorage.getItem('project_team_meta');
    if (saved) {
      try {
        STATE.teamMetadata = JSON.parse(saved);
        return;
      } catch (e) { }
    }
    STATE.teamMetadata = JSON.parse(JSON.stringify(PROJECT_PRESENTATION.defaultMetadata));
  }

  function openTeamModal() {
    const meta = STATE.teamMetadata;
    document.getElementById('edit-project-title').value = meta.projectTitle;
    document.getElementById('edit-section').value = meta.section;
    document.getElementById('edit-guide').value = meta.guide;
    document.getElementById('edit-department').value = meta.department;

    document.getElementById('edit-m1-name').value = meta.teamMembers[0]?.name || '';
    document.getElementById('edit-m1-roll').value = meta.teamMembers[0]?.rollNo || '';
    document.getElementById('edit-m2-name').value = meta.teamMembers[1]?.name || '';
    document.getElementById('edit-m2-roll').value = meta.teamMembers[1]?.rollNo || '';
    document.getElementById('edit-m3-name').value = meta.teamMembers[2]?.name || '';
    document.getElementById('edit-m3-roll').value = meta.teamMembers[2]?.rollNo || '';

    DOM.editTeamModal.classList.add('active');
  }

  function closeTeamModal() {
    DOM.editTeamModal.classList.remove('active');
  }

  function saveTeamMetadata() {
    const meta = STATE.teamMetadata;
    meta.projectTitle = document.getElementById('edit-project-title').value.trim() || meta.projectTitle;
    meta.section = document.getElementById('edit-section').value.trim() || meta.section;
    meta.guide = document.getElementById('edit-guide').value.trim() || meta.guide;
    meta.department = document.getElementById('edit-department').value.trim() || meta.department;

    meta.teamMembers[0].name = document.getElementById('edit-m1-name').value.trim() || meta.teamMembers[0].name;
    meta.teamMembers[0].rollNo = document.getElementById('edit-m1-roll').value.trim() || meta.teamMembers[0].rollNo;

    meta.teamMembers[1].name = document.getElementById('edit-m2-name').value.trim() || meta.teamMembers[1].name;
    meta.teamMembers[1].rollNo = document.getElementById('edit-m2-roll').value.trim() || meta.teamMembers[1].rollNo;

    meta.teamMembers[2].name = document.getElementById('edit-m3-name').value.trim() || meta.teamMembers[2].name;
    meta.teamMembers[2].rollNo = document.getElementById('edit-m3-roll').value.trim() || meta.teamMembers[2].rollNo;

    localStorage.setItem('project_team_meta', JSON.stringify(meta));
    closeTeamModal();
    renderSlide(STATE.currentSlideIndex);
  }

  // --- Story Library & Persistence ---
  function loadSavedStories() {
    const saved = localStorage.getItem('user_saved_stories');
    if (saved) {
      try {
        STATE.savedStories = JSON.parse(saved);
      } catch (e) {
        STATE.savedStories = [];
      }
    }
  }

  function saveStoryToLibrary(story) {
    if (!story) return;
    const exists = STATE.savedStories.some(s => s.id === story.id);
    if (!exists) {
      STATE.savedStories.unshift(story);
      if (STATE.savedStories.length > 20) STATE.savedStories.pop();
      localStorage.setItem('user_saved_stories', JSON.stringify(STATE.savedStories));
      renderLibrary();
    }
  }

  function renderLibrary() {
    DOM.libraryGrid.innerHTML = '';
    const allStories = [...(SAMPLE_STORIES || []), ...STATE.savedStories];
    DOM.savedCountBadge.textContent = allStories.length;

    allStories.forEach(st => {
      const card = document.createElement('div');
      card.className = 'story-card-item';
      const coverUrl = st.coverImage || (st.scenes && st.scenes[0] && st.scenes[0].imageUrl) || 'assets/samples/dragon_story.jpg';

      card.innerHTML = `
        <img class="story-card-cover" src="${coverUrl}" alt="${st.title}" onerror="this.src='assets/samples/dragon_story.jpg'" />
        <div class="story-card-body">
          <div>
            <div style="font-size:11px;color:var(--accent-cyan);font-weight:700;margin-bottom:4px">${st.genre} • ${st.artStyle}</div>
            <h3>${st.title}</h3>
            <p>${st.summary}</p>
          </div>
          <div class="story-card-actions">
            <span style="font-size:11px;color:var(--text-muted)">${st.scenes?.length || 4} Scenes</span>
            <button class="btn-secondary" style="padding:4px 12px;font-size:12px">Read Story ➔</button>
          </div>
        </div>
      `;

      card.querySelector('button').addEventListener('click', () => {
        loadStory(st);
        switchTab('reader');
      });

      DOM.libraryGrid.appendChild(card);
    });
  }

  // --- Settings Modal ---
  function openSettingsModal() {
    DOM.apiKeyInput.value = STATE.settings.geminiApiKey;
    DOM.providerSelect.value = STATE.settings.provider;
    DOM.settingsModal.classList.add('active');
  }

  function closeSettingsModal() {
    DOM.settingsModal.classList.remove('active');
  }

  function saveSettings() {
    STATE.settings.geminiApiKey = DOM.apiKeyInput.value.trim();
    STATE.settings.provider = DOM.providerSelect.value;
    localStorage.setItem('gemini_api_key', STATE.settings.geminiApiKey);
    closeSettingsModal();
    alert("Settings saved successfully!");
  }

  // Fallback SVG Generator
  function generateSvgFallback(title, style) {
    const encoded = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="576" viewBox="0 0 1024 576">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#312e81"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="1024" height="576" fill="url(#bgGrad)"/>
        <circle cx="512" cy="240" r="100" fill="#6366f1" opacity="0.3"/>
        <text x="512" y="270" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${title || 'AI Story Scene'}</text>
        <text x="512" y="315" font-family="sans-serif" font-size="16" fill="#a5b4fc" text-anchor="middle">${style || 'Pixar 3D Style'} Illustration</text>
      </svg>
    `);
    return `data:image/svg+xml;utf8,${encoded}`;
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
