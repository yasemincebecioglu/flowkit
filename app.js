/* ===================================================
   FLOWFIT — Application Logic
   Timer · Chart · Interactions · Animations
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ─── Mobile Sidebar Toggles ───
  const sidebarLeft   = document.getElementById('sidebarLeft');
  const sidebarRight  = document.getElementById('sidebarRight');
  const overlay       = document.getElementById('mobileOverlay');
  const toggleLeft    = document.getElementById('mobileToggleLeft');
  const toggleRight   = document.getElementById('mobileToggleRight');

  function closeSidebars() {
    sidebarLeft.classList.remove('open');
    sidebarRight.classList.remove('open');
    overlay.classList.remove('show');
  }

  if (toggleLeft) {
    toggleLeft.addEventListener('click', () => {
      sidebarLeft.classList.toggle('open');
      sidebarRight.classList.remove('open');
      overlay.classList.toggle('show');
    });
  }
  if (toggleRight) {
    toggleRight.addEventListener('click', () => {
      sidebarRight.classList.toggle('open');
      sidebarLeft.classList.remove('open');
      overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', closeSidebars);
  }

  // ─── Navigation Active State & View Switching ───
  const navItems = document.querySelectorAll('.nav-item, #nav-profile');
  const allComponents = [
    'stats-row',
    'daily-plan-card',
    'calorie-analysis-card',
    'live-workout-card',
    'weekly-chart-card',
    'profile-card',
    'empty-view-placeholder'
  ];

  const viewMapping = {
    'nav-dashboard': ['stats-row', 'daily-plan-card', 'calorie-analysis-card', 'live-workout-card', 'weekly-chart-card'],
    'nav-workouts': ['stats-row', 'live-workout-card'],
    'nav-nutrition': ['calorie-analysis-card'],
    'nav-progress': ['weekly-chart-card'],
    'nav-calanalysis': ['calorie-analysis-card'],
    'nav-calendar': ['daily-plan-card'],
    'nav-profile': ['profile-card']
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // 1. Manage Active State
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // 2. Switch Views
      const targetView = item.id;
      const componentsToShow = viewMapping[targetView] || ['empty-view-placeholder'];

      allComponents.forEach(compId => {
        const el = document.getElementById(compId);
        if (el) {
          if (componentsToShow.includes(compId)) {
            el.classList.remove('view-hidden');
            // Support for flex display if it's the placeholder
            if (compId === 'empty-view-placeholder') {
              el.style.display = 'flex';
            } else {
              el.style.display = '';
            }
            
            // Re-trigger animations
            el.style.animation = 'none';
            el.offsetHeight; // trigger reflow
            el.style.animation = '';
          } else {
            el.classList.add('view-hidden');
            el.style.display = 'none';
          }
        }
      });

      // Special case: if showing only one main card, maybe expand it
      const dashboardGrid = document.querySelector('.dashboard-grid');
      if (dashboardGrid) {
        const visibleCards = componentsToShow.filter(c => c !== 'stats-row');
        if (visibleCards.length === 1) {
          dashboardGrid.style.gridTemplateColumns = '1fr';
        } else {
          dashboardGrid.style.gridTemplateColumns = '';
        }
      }

      closeSidebars();
    });
  });

  // ─── Profile Editing Logic ───
  let isEditingProfile = false;
  const btnEditProfile = document.getElementById('btn-edit-profile');
  const profNameDisplay = document.getElementById('prof-name-display');
  const profHeightDisplay = document.getElementById('prof-height-display');
  const profWeightDisplay = document.getElementById('prof-weight-display');
  const profAgeDisplay = document.getElementById('prof-age-display');
  const profGoalDisplay = document.getElementById('prof-goal-display');
  const sidebarUserName = document.querySelector('.sidebar-user .user-name');

  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      if (!isEditingProfile) {
        // Enter Edit Mode
        isEditingProfile = true;
        btnEditProfile.textContent = 'Değişiklikleri Kaydet';
        
        // Convert to inputs
        const currentName = profNameDisplay.textContent;
        const currentHeight = parseInt(profHeightDisplay.textContent);
        const currentWeight = parseInt(profWeightDisplay.textContent);
        const currentAge = profAgeDisplay.textContent;
        const currentGoal = profGoalDisplay.textContent;

        profNameDisplay.innerHTML = `<input type="text" id="edit-name" class="cal-input" value="${currentName}" style="font-size: 1.2rem; width: 100%;">`;
        profHeightDisplay.innerHTML = `<input type="number" id="edit-height" class="cal-input small" value="${currentHeight}" style="font-size:1rem; width:80px;"> cm`;
        profWeightDisplay.innerHTML = `<input type="number" id="edit-weight" class="cal-input small" value="${currentWeight}" style="font-size:1rem; width:80px;"> kg`;
        profAgeDisplay.innerHTML = `<input type="number" id="edit-age" class="cal-input small" value="${currentAge}" style="font-size:1rem; width:80px;">`;
        profGoalDisplay.innerHTML = `<input type="text" id="edit-goal" class="cal-input" value="${currentGoal}" style="width: 100%;">`;
      } else {
        // Save Changes
        const newName = document.getElementById('edit-name').value;
        const newHeight = document.getElementById('edit-height').value;
        const newWeight = document.getElementById('edit-weight').value;
        const newAge = document.getElementById('edit-age').value;
        const newGoal = document.getElementById('edit-goal').value;

        profNameDisplay.textContent = newName;
        profHeightDisplay.textContent = newHeight + ' cm';
        profWeightDisplay.textContent = newWeight + ' kg';
        profAgeDisplay.textContent = newAge;
        profGoalDisplay.textContent = newGoal;

        if (sidebarUserName) sidebarUserName.textContent = newName;

        isEditingProfile = false;
        btnEditProfile.textContent = 'Profili Düzenle';
      }
    });
  }

  // ─── Daily Plan Tabs ───
  const planTabs = document.querySelectorAll('#daily-plan-card .plan-tab');
  const planItems = document.querySelectorAll('.plan-item');

  planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      planTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tab;

      planItems.forEach(item => {
        if (filter === 'all') {
          item.style.display = '';
        } else if (filter === 'workout') {
          item.style.display = (item.classList.contains('workout') || item.classList.contains('rest')) ? '' : 'none';
        } else if (filter === 'nutrition') {
          item.style.display = item.classList.contains('nutrition') ? '' : 'none';
        }
      });
    });
  });

  // ─── Workout Timer ───
  let timerSeconds = 12 * 60 + 45; // 12:45
  let timerRunning = false;
  let timerInterval = null;
  const timerDisplay = document.getElementById('timer-display');
  const timerProgress = document.getElementById('timer-progress');
  const playPauseBtn = document.getElementById('btn-play-pause');
  const totalTime = 15 * 60; // 15 min total set time
  const circumference = 2 * Math.PI * 80; // r=80

  function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    // Update progress ring
    const progress = timerSeconds / totalTime;
    const offset = circumference * (1 - progress);
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = offset;
  }

  function startTimer() {
    timerRunning = true;
    playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
    lucide.createIcons({ nodes: [playPauseBtn] });
    
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        stopTimer();
      }
    }, 1000);
  }

  function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
    lucide.createIcons({ nodes: [playPauseBtn] });
  }

  playPauseBtn.addEventListener('click', () => {
    timerRunning ? stopTimer() : startTimer();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    stopTimer();
    timerSeconds = 15 * 60;
    updateTimerDisplay();
  });

  // Initialize timer display
  updateTimerDisplay();

  // ─── Exercise List Interaction ───
  const exerciseItems = document.querySelectorAll('.exercise-item');
  exerciseItems.forEach(item => {
    item.addEventListener('click', () => {
      exerciseItems.forEach(el => el.classList.remove('active'));
      if (!item.classList.contains('done')) {
        item.classList.add('active');
      }
    });
  });

  // ─── Weekly Activity Chart ───
  const ctx = document.getElementById('weeklyChart');
  if (ctx && typeof Chart !== 'undefined') {
    const chartCtx = ctx.getContext('2d');
    
    // Gradient fills
    const gradBlue = chartCtx.createLinearGradient(0, 0, 0, 200);
    gradBlue.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
    gradBlue.addColorStop(1, 'rgba(0, 212, 255, 0.02)');

    const gradGreen = chartCtx.createLinearGradient(0, 0, 0, 200);
    gradGreen.addColorStop(0, 'rgba(0, 232, 157, 0.3)');
    gradGreen.addColorStop(1, 'rgba(0, 232, 157, 0.02)');

    const chartData = {
      calories: {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [
          {
            label: 'Yakılan (kcal)',
            data: [1650, 1920, 1780, 2100, 1850, 2250, 1847],
            borderColor: '#00d4ff',
            backgroundColor: gradBlue,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: '#00d4ff',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
          },
          {
            label: 'Alınan (kcal)',
            data: [2000, 2150, 1950, 2200, 2100, 2300, 2050],
            borderColor: '#00e89d',
            backgroundColor: gradGreen,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: '#00e89d',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
          }
        ]
      },
      steps: {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [
          {
            label: 'Adım',
            data: [8500, 12000, 9800, 14200, 11500, 15600, 12450],
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167, 139, 250, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: '#a78bfa',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
          }
        ]
      },
      workout: {
        labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
        datasets: [
          {
            label: 'Antrenman (dk)',
            data: [45, 60, 30, 75, 50, 90, 45],
            borderColor: '#00e89d',
            backgroundColor: gradGreen,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointBackgroundColor: '#00e89d',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
          }
        ]
      }
    };

    const weeklyChart = new Chart(chartCtx, {
      type: 'line',
      data: chartData.calories,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#8892b0',
              font: { family: "'Outfit', sans-serif", size: 11, weight: '500' },
              boxWidth: 8,
              boxHeight: 8,
              borderRadius: 4,
              useBorderRadius: true,
              padding: 16,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 20, 40, 0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleFont: { family: "'Outfit', sans-serif", size: 12, weight: '600' },
            bodyFont: { family: "'Outfit', sans-serif", size: 11 },
            titleColor: '#f0f4ff',
            bodyColor: '#8892b0',
            padding: 12,
            cornerRadius: 10,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: {
              color: '#4a5578',
              font: { family: "'Outfit', sans-serif", size: 11 },
              padding: 8,
            },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: {
              color: '#4a5578',
              font: { family: "'Outfit', sans-serif", size: 11 },
              padding: 8,
            },
            border: { display: false },
          }
        }
      }
    });

    // Chart tab switching
    const chartTabs = document.querySelectorAll('#weekly-chart-card .plan-tab');
    chartTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        chartTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const chartType = tab.dataset.chart;
        if (chartData[chartType]) {
          weeklyChart.data = chartData[chartType];
          weeklyChart.update('active');
        }
      });
    });
  }

  // ─── Stat Counter Animations ───
  function animateCounter(element, target, suffix = '') {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      
      if (target >= 1000) {
        element.textContent = current.toLocaleString() + suffix;
      } else {
        element.textContent = current + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Animate stats on load (with Intersection Observer)
  const statsRow = document.getElementById('stats-row');
  if (statsRow) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(document.getElementById('stat-calories'), 1847);
          animateCounter(document.getElementById('stat-steps'), 12450);
          animateCounter(document.getElementById('stat-heart'), 72);
          // Water is a special case
          const waterEl = document.getElementById('stat-water');
          let waterAnim = 0;
          const waterInterval = setInterval(() => {
            waterAnim += 0.1;
            if (waterAnim >= 2.4) {
              waterEl.textContent = '2.4L';
              clearInterval(waterInterval);
            } else {
              waterEl.textContent = waterAnim.toFixed(1) + 'L';
            }
          }, 60);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsRow);
  }

  // ─── XP Bar Animation ───
  const xpBar = document.getElementById('xp-bar');
  if (xpBar) {
    xpBar.style.width = '0%';
    setTimeout(() => {
      xpBar.style.width = '72%';
    }, 500);
  }

  // ─── Coupon Click Feedback ───
  const coupons = document.querySelectorAll('.coupon-card');
  coupons.forEach(coupon => {
    coupon.addEventListener('click', () => {
      const code = coupon.querySelector('.coupon-code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          const original = code.textContent;
          code.textContent = '✓ Kopyalandı!';
          code.style.color = '#00e89d';
          setTimeout(() => {
            code.textContent = original;
            code.style.color = '';
          }, 1500);
        }).catch(() => {
          // Fallback
          const original = code.textContent;
          code.textContent = '✓ Kopyalandı!';
          setTimeout(() => { code.textContent = original; }, 1500);
        });
      }
    });
  });

  // ─── Plan Item Click Interaction ───
  planItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('completed')) {
        item.classList.add('completed');
        const statusEl = item.querySelector('.plan-status');
        if (statusEl) {
          statusEl.className = 'plan-status done';
          statusEl.textContent = '✓ Tamamlandı';
        }
      }
    });
  });

  // ─── Keyboard Shortcuts ───
  document.addEventListener('keydown', (e) => {
    // Space to toggle timer
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      e.preventDefault();
      timerRunning ? stopTimer() : startTimer();
    }
  });

  /* ────────────────────────────────────────────────────
     CUMULATIVE CALORIE ANALYSIS LOGIC
  ──────────────────────────────────────────────────── */
  const CAL_GOAL = 2200;
  const circumCal = 2 * Math.PI * 50;

  let meals = [];

  const calDonutFill    = document.getElementById('cal-donut-fill');
  const calTotalDisplay = document.getElementById('cal-total-display');
  const calConsumed     = document.getElementById('cal-consumed-display');
  const calRemaining    = document.getElementById('cal-remaining-display');
  const calGoalDisp     = document.getElementById('cal-goal-display');
  const chipProtein     = document.getElementById('chip-protein');
  const chipCarbs       = document.getElementById('chip-carbs');
  const chipFat         = document.getElementById('chip-fat');
  const calMealList     = document.getElementById('cal-meal-list');
  const calEmptyState   = document.getElementById('cal-empty-state');
  const calCard         = document.getElementById('calorie-analysis-card');

  if (calGoalDisp) calGoalDisp.textContent = CAL_GOAL.toLocaleString('tr-TR') + ' kcal';

  function getNow() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function updateCalUI() {
    const totalKcal = meals.reduce((s, m) => s + m.kcal, 0);
    const totalP    = meals.reduce((s, m) => s + m.protein, 0);
    const totalC    = meals.reduce((s, m) => s + m.carbs, 0);
    const totalF    = meals.reduce((s, m) => s + m.fat, 0);
    const remaining = CAL_GOAL - totalKcal;
    const progress  = Math.min(totalKcal / CAL_GOAL, 1);
    const isOver    = totalKcal > CAL_GOAL;

    if (calDonutFill) {
      const offset = circumCal * (1 - progress);
      calDonutFill.style.strokeDashoffset = offset;
    }

    if (calTotalDisplay) calTotalDisplay.textContent = totalKcal.toLocaleString('tr-TR');
    if (calConsumed)     calConsumed.textContent = totalKcal.toLocaleString('tr-TR') + ' kcal';
    if (calRemaining) {
      calRemaining.textContent = (isOver ? '+' : '') + Math.abs(remaining).toLocaleString('tr-TR') + ' kcal';
      calRemaining.className = 'cal-stat-val ' + (isOver ? 'over' : 'remaining');
    }

    if (chipProtein) chipProtein.textContent = 'P: ' + totalP + 'g';
    if (chipCarbs)   chipCarbs.textContent   = 'K: ' + totalC + 'g';
    if (chipFat)     chipFat.textContent     = 'Y: ' + totalF + 'g';
    
    if (calCard) calCard.classList.toggle('over-budget', isOver);
  }

  function renderMeals() {
    if (!calMealList) return;
    calMealList.querySelectorAll('.cal-meal-item').forEach(el => el.remove());

    if (meals.length === 0) {
      if (calEmptyState) calEmptyState.style.display = 'flex';
    } else {
      if (calEmptyState) calEmptyState.style.display = 'none';
      meals.forEach((meal, idx) => {
        const item = document.createElement('div');
        item.className = 'cal-meal-item';
        item.innerHTML = `
          <span class="cal-meal-time">${meal.time}</span>
          <span class="cal-meal-name" title="${meal.name}">${meal.name}</span>
          <div style="flex:1"></div>
          <span class="cal-meal-kcal">${meal.kcal} kcal</span>
          <button class="cal-meal-del" data-idx="${idx}">×</button>
        `;
        calMealList.appendChild(item);
      });

      calMealList.querySelectorAll('.cal-meal-del').forEach(btn => {
        btn.addEventListener('click', () => {
          meals.splice(parseInt(btn.dataset.idx), 1);
          renderMeals();
          updateCalUI();
        });
      });
    }
  }

  function addMeal(name, kcal, p, k, y) {
    if (!name || kcal <= 0) return;
    meals.push({ name, kcal: +kcal, protein: +p, carbs: +k, fat: +y, time: getNow() });
    renderMeals();
    updateCalUI();
  }

  const foodSel = document.getElementById('cal-food-select');
  const quickBtn = document.getElementById('cal-add-quick');
  quickBtn?.addEventListener('click', () => {
    if (!foodSel.value) return;
    const [kcal, p, k, y] = foodSel.value.split(',').map(Number);
    const name = foodSel.options[foodSel.selectedIndex].text.split(' —')[0];
    addMeal(name, kcal, p, k, y);
    foodSel.value = '';
  });

  const inName = document.getElementById('cal-food-name');
  const inKcal = document.getElementById('cal-food-kcal');
  const inP    = document.getElementById('cal-food-protein');
  const inK    = document.getElementById('cal-food-carbs');
  const inY    = document.getElementById('cal-food-fat');
  const addBtn = document.getElementById('cal-add-manual');

  function handleManual() {
    const name = inName.value.trim() || 'Öğün';
    const kcal = parseFloat(inKcal.value) || 0;
    const p = parseFloat(inP.value) || 0;
    const k = parseFloat(inK.value) || 0;
    const y = parseFloat(inY.value) || 0;
    if (kcal > 0) {
      addMeal(name, kcal, p, k, y);
      [inName, inKcal, inP, inK, inY].forEach(i => i.value = '');
    }
  }
  addBtn?.addEventListener('click', handleManual);

  const cdBadge = document.getElementById('cal-countdown-badge');
  function updateCD() {
    if (!cdBadge) return;
    const now = new Date();
    const mid = new Date(now);
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const hh = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    cdBadge.textContent = `${hh}:${mm}:${ss} kaldı`;
  }
  setInterval(updateCD, 1000);
  updateCD();

  const resetCals = () => {
    meals = [];
    renderMeals();
    updateCalUI();
    const statCals = document.getElementById('stat-calories');
    if (statCals) statCals.textContent = '0';
  };

  document.getElementById('resetDayCalories')?.addEventListener('click', resetCals);
  document.getElementById('cal-reset-top')?.addEventListener('click', resetCals);

  renderMeals();
  updateCalUI();

  console.log('%c🏋️ FLOWFIT Dashboard Loaded', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
});
