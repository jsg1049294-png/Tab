/**
 * TAP – All-in-One Control Center
 * AutoClicker logic adapted from jsg1049294-png/autoclicker (read-only source)
 */
(function () {
  "use strict";

  const win = document.getElementById("tap-window");
  const titlebar = document.getElementById("tap-titlebar");
  const restoreBtn = document.getElementById("tap-restore");
  let drag = null;

  function onDown(e) {
    if (e.target.closest(".tap-win-btns")) return;
    const t = e.touches ? e.touches[0] : e;
    const r = win.getBoundingClientRect();
    drag = { x: t.clientX, y: t.clientY, l: r.left, t: r.top };
    if (e.touches) e.preventDefault();
  }
  function onMove(e) {
    if (!drag) return;
    const t = e.touches ? e.touches[0] : e;
    if (e.touches) e.preventDefault();
    win.style.left = drag.l + (t.clientX - drag.x) + "px";
    win.style.top = drag.t + (t.clientY - drag.y) + "px";
    win.style.transform = "none";
  }
  function onUp() { drag = null; }
  titlebar.addEventListener("mousedown", onDown);
  titlebar.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("mousemove", onMove);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchend", onUp);

  document.getElementById("tap-min").onclick = () => {
    win.classList.add("minimized");
    restoreBtn.hidden = false;
  };
  document.getElementById("tap-close").onclick = () => {
    win.classList.add("hidden");
    restoreBtn.hidden = false;
    acStop();
  };
  restoreBtn.onclick = () => {
    win.classList.remove("hidden", "minimized");
    restoreBtn.hidden = true;
  };

  function showView(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    const el = document.getElementById("view-" + name);
    if (el) el.classList.add("active");
  }
  document.getElementById("tap-nav").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (btn) showView(btn.dataset.view);
  });
  document.querySelectorAll(".home-card").forEach((c) => {
    c.addEventListener("click", () => showView(c.dataset.view));
  });

  const ac = {
    positions: [], intervalMs: 500, maxClicks: 0, running: false, paused: false,
    clickCount: 0, startTime: 0, elapsedBeforePause: 0, timerId: null, posIndex: 0, picking: false,
  };
  const positionsEl = document.getElementById("ac-positions");
  const overlay = document.getElementById("ac-picker-overlay");
  const intervalDisplay = document.getElementById("ac-interval-display");
  const clearPosBtn = document.getElementById("ac-clear-pos");
  const nextPosWrap = document.getElementById("ac-next-pos-wrap");
  const nextPosEl = document.getElementById("ac-next-pos");

  function formatInterval(ms) {
    if (ms < 1000) return (ms / 1000).toString().replace(".", ",") + " s";
    if (ms % 1000 === 0) return ms / 1000 + " s";
    return (ms / 1000).toFixed(2).replace(".", ",") + " s";
  }
  function setIntervalMs(ms) {
    ac.intervalMs = ms;
    intervalDisplay.textContent = formatInterval(ms);
  }
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      setIntervalMs(+chip.dataset.ms);
    });
  });
  document.getElementById("ac-set-custom").onclick = () => {
    const v = parseInt(document.getElementById("ac-custom-ms").value, 10);
    if (!isNaN(v) && v >= 50) {
      setIntervalMs(v);
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    }
  };

  function removeMarkers() {
    document.querySelectorAll(".ac-marker").forEach((m) => m.remove());
  }
  function placeMarkers() {
    removeMarkers();
    ac.positions.forEach((p, i) => {
      const m = document.createElement("div");
      m.className = "ac-marker";
      m.textContent = String(i + 1);
      m.style.left = p.x + "px";
      m.style.top = p.y + "px";
      document.body.appendChild(m);
    });
  }
  function highlightMarker(i) {
    document.querySelectorAll(".ac-marker").forEach((m, j) => m.classList.toggle("active", j === i));
    document.querySelectorAll(".ac-pos-item").forEach((el, j) => el.classList.toggle("active", j === i));
  }
  function renderPositions() {
    positionsEl.innerHTML = "";
    if (!ac.positions.length) {
      positionsEl.innerHTML = '<div style="font-size:12px;color:var(--muted)">Noch keine Positionen</div>';
      clearPosBtn.hidden = true;
      removeMarkers();
      return;
    }
    clearPosBtn.hidden = false;
    ac.positions.forEach((p, i) => {
      const row = document.createElement("div");
      row.className = "ac-pos-item";
      row.innerHTML = `<span class="ac-pos-num">${i + 1}</span><span class="coords">x:${Math.round(p.x)} · y:${Math.round(p.y)}</span><button type="button">×</button>`;
      row.querySelector("button").onclick = () => {
        ac.positions = ac.positions.filter((x) => x.id !== p.id);
        renderPositions();
        placeMarkers();
      };
      positionsEl.appendChild(row);
    });
    placeMarkers();
  }
  clearPosBtn.onclick = () => {
    ac.positions = [];
    renderPositions();
    if (ac.running) acStop();
  };
  document.getElementById("ac-pick").onclick = () => {
    ac.picking = true;
    overlay.hidden = false;
  };
  function handlePick(e) {
    if (!ac.picking) return;
    if (e.target.closest(".tap-window") || e.target.closest(".tap-restore") || e.target.closest(".ac-marker")) return;
    e.preventDefault();
    e.stopPropagation();
    const pt = e.changedTouches ? e.changedTouches[0] : e;
    ac.positions.push({ id: Date.now() + Math.random(), x: pt.clientX, y: pt.clientY });
    ac.picking = false;
    overlay.hidden = true;
    renderPositions();
  }
  document.addEventListener("click", handlePick, true);
  document.addEventListener("touchend", handlePick, true);

  function showPulse(x, y) {
    const d = document.createElement("div");
    d.className = "ac-click-pulse";
    d.style.left = x + "px";
    d.style.top = y + "px";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 600);
  }
  function simulateClick(x, y) {
    showPulse(x, y);
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const o = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y };
    try {
      el.dispatchEvent(new PointerEvent("pointerdown", { ...o, pointerId: 1, pointerType: "touch", isPrimary: true }));
      el.dispatchEvent(new MouseEvent("mousedown", o));
      el.dispatchEvent(new PointerEvent("pointerup", { ...o, pointerId: 1, pointerType: "touch", isPrimary: true }));
      el.dispatchEvent(new MouseEvent("mouseup", o));
      el.dispatchEvent(new MouseEvent("click", o));
      if (el.click) el.click();
    } catch (_) {
      try { el.click(); } catch (__) {}
    }
  }
  function acUpdateStats() {
    document.getElementById("ac-stat-clicks").textContent = ac.clickCount;
    const elapsed = ac.running && !ac.paused
      ? ac.elapsedBeforePause + (performance.now() - ac.startTime)
      : ac.elapsedBeforePause;
    document.getElementById("ac-stat-time").textContent = (elapsed / 1000).toFixed(1).replace(".", ",") + " s";
    const st = document.getElementById("ac-stat-status");
    if (ac.running && !ac.paused) {
      st.textContent = "Läuft";
      st.style.color = "#3dff9a";
      if (ac.positions.length) {
        nextPosWrap.hidden = false;
        nextPosEl.textContent = "#" + ((ac.posIndex % ac.positions.length) + 1);
      }
    } else if (ac.paused) {
      st.textContent = "Pause";
      st.style.color = "#ffd166";
    } else {
      st.textContent = "Bereit";
      st.style.color = "";
      nextPosWrap.hidden = true;
    }
  }
  function acTick() {
    if (!ac.running || ac.paused || !ac.positions.length) return;
    const idx = ac.posIndex % ac.positions.length;
    const p = ac.positions[idx];
    highlightMarker(idx);
    simulateClick(p.x, p.y);
    ac.clickCount++;
    ac.posIndex++;
    acUpdateStats();
    if (ac.maxClicks > 0 && ac.clickCount >= ac.maxClicks) {
      acStop();
      return;
    }
    ac.timerId = setTimeout(acTick, ac.intervalMs);
  }
  function acStart() {
    if (!ac.positions.length) {
      alert("Bitte zuerst mindestens eine Klickposition auswählen.");
      return;
    }
    ac.maxClicks = parseInt(document.getElementById("ac-count").value, 10) || 0;
    if (!ac.running) {
      ac.clickCount = 0;
      ac.posIndex = 0;
      ac.elapsedBeforePause = 0;
    }
    ac.running = true;
    ac.paused = false;
    ac.startTime = performance.now();
    document.getElementById("ac-start").disabled = true;
    document.getElementById("ac-pause").disabled = false;
    document.getElementById("ac-stop").disabled = false;
    acUpdateStats();
    acTick();
  }
  function acPause() {
    if (!ac.running || ac.paused) return;
    ac.paused = true;
    ac.elapsedBeforePause += performance.now() - ac.startTime;
    clearTimeout(ac.timerId);
    document.getElementById("ac-start").disabled = false;
    document.getElementById("ac-pause").disabled = true;
    acUpdateStats();
  }
  function acStop() {
    ac.running = false;
    ac.paused = false;
    clearTimeout(ac.timerId);
    document.getElementById("ac-start").disabled = false;
    document.getElementById("ac-pause").disabled = true;
    document.getElementById("ac-stop").disabled = true;
    document.querySelectorAll(".ac-marker").forEach((m) => m.classList.remove("active"));
    document.querySelectorAll(".ac-pos-item").forEach((el) => el.classList.remove("active"));
    acUpdateStats();
  }
  document.getElementById("ac-start").onclick = acStart;
  document.getElementById("ac-pause").onclick = acPause;
  document.getElementById("ac-stop").onclick = acStop;
  setInterval(() => { if (ac.running && !ac.paused) acUpdateStats(); }, 200);
  window.addEventListener("resize", placeMarkers);
  setIntervalMs(500);
  renderPositions();

  const SONGS = [
    { t: "coachlim (Blackberrysky)", a: "coacheslimes", q: "coachlim Blackberrysky coacheslimes" },
    { t: "BMW3", a: "2hermanoz", q: "BMW3 2hermanoz" },
    { t: "AKON", a: "Jazeek", q: "AKON Jazeek" },
    { t: "3ER BMW", a: "Tream, treamiboii", q: "3ER BMW Tream treamiboii" },
    { t: "500 PS", a: "Bonez MC, RAF Camora", q: "500 PS Bonez MC RAF Camora" },
    { t: "Coachlim (Azet 9 Milly parodie)", a: "coacheslimes", q: "Coachlim Azet 9 Milly coacheslimes" },
    { t: "Coachlim (Fast Life)", a: "coacheslimes", q: "Coachlim Fast Life coacheslimes" },
    { t: "Coachlim - Lelele (Azet)", a: "coacheslimes", q: "Coachlim Lelele Azet coacheslimes" },
    { t: "panzerknacker.wav", a: "LENNSKO", q: "panzerknacker LENNSKO" },
    { t: "VERLIEBT IN MICH", a: "FAYAN, Dalton", q: "VERLIEBT IN MICH FAYAN Dalton" },
    { t: "Leck Sibbi", a: "Nimo", q: "Leck Sibbi Nimo" },
    { t: "Bamba (feat. Aitch & BIA)", a: "Luciano, Aitch, BIA", q: "Bamba Luciano Aitch BIA" },
    { t: "Chabos wissen wer der Babo ist", a: "Haftbefehl", q: "Chabos wissen wer der Babo ist Haftbefehl" },
    { t: "Show Me Love", a: "WizTheMc, bees & honey", q: "Show Me Love WizTheMc bees honey" },
    { t: "H&K", a: "LACAZETTE", q: "H&K LACAZETTE" },
    { t: "Hin und Her", a: "AK AUSSERKONTROLLE", q: "Hin und Her AK AUSSERKONTROLLE" },
    { t: "Von hier an blind", a: "Wir sind Helden", q: "Von hier an blind Wir sind Helden" },
    { t: "All The Way Up (feat. Infared)", a: "Fat Joe, Remy Ma, French Montana, InfaRed", q: "All The Way Up Fat Joe Remy Ma" },
    { t: "Eligella Fick Mich", a: "Lil Koassy", q: "Eligella Fick Mich Lil Koassy" },
  ];

  let musicIdx = 0;
  let shuffle = false;
  let playing = false;

  function spotifySearchUrl(q) {
    return "https://open.spotify.com/search/" + encodeURIComponent(q);
  }
  function renderPlaylist(filter) {
    const list = document.getElementById("music-list");
    list.innerHTML = "";
    const f = (filter || "").toLowerCase().trim();
    SONGS.forEach((s, i) => {
      if (f && !s.t.toLowerCase().includes(f) && !s.a.toLowerCase().includes(f)) return;
      const row = document.createElement("div");
      row.className = "song-row" + (i === musicIdx ? " active" : "");
      row.innerHTML = `<span class="num">${i + 1}</span><div class="meta"><b>${s.t}</b><span>${s.a}</span></div><span class="dur">↗</span>`;
      row.onclick = () => selectSong(i, true);
      list.appendChild(row);
    });
    document.getElementById("music-count").textContent = SONGS.length + " Songs verfügbar";
  }
  function selectSong(i, openSpotify) {
    musicIdx = i;
    const s = SONGS[i];
    document.getElementById("music-title").textContent = s.t;
    document.getElementById("music-artist").textContent = s.a;
    renderPlaylist(document.getElementById("music-search").value);
    if (openSpotify) {
      window.open(spotifySearchUrl(s.q), "_blank", "noopener");
      playing = true;
      document.getElementById("music-play").textContent = "⏸";
    }
  }
  function nextSong() {
    musicIdx = shuffle ? Math.floor(Math.random() * SONGS.length) : (musicIdx + 1) % SONGS.length;
    selectSong(musicIdx, true);
  }
  function prevSong() {
    musicIdx = (musicIdx - 1 + SONGS.length) % SONGS.length;
    selectSong(musicIdx, true);
  }
  document.getElementById("music-play").onclick = () => {
    if (!playing) selectSong(musicIdx, true);
    else {
      playing = false;
      document.getElementById("music-play").textContent = "▶";
    }
  };
  document.getElementById("music-next").onclick = nextSong;
  document.getElementById("music-prev").onclick = prevSong;
  document.getElementById("music-shuffle").onclick = function () {
    shuffle = !shuffle;
    this.classList.toggle("active", shuffle);
  };
  document.getElementById("music-repeat").onclick = function () {
    this.classList.toggle("active");
  };
  document.getElementById("music-search").oninput = (e) => renderPlaylist(e.target.value);
  document.getElementById("music-title").textContent = SONGS[0].t;
  document.getElementById("music-artist").textContent = SONGS[0].a;
  renderPlaylist();

  let calcExpr = "";
  const calcDisp = document.getElementById("calc-display");
  const calcHist = document.getElementById("calc-hist");
  function calcUpdate() { calcDisp.textContent = calcExpr || "0"; }
  document.querySelector(".calc-keys").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-k]");
    if (!btn) return;
    const k = btn.dataset.k;
    if (k === "C") calcExpr = "";
    else if (k === "=") {
      try {
        let ex = calcExpr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
        if (ex.includes("%")) ex = ex.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
        const r = Function('"use strict"; return (' + ex + ")")();
        calcHist.innerHTML = calcExpr + " = " + r + "<br>" + calcHist.innerHTML;
        calcExpr = String(r);
      } catch { calcExpr = "Fehler"; }
    } else {
      if (calcExpr === "Fehler") calcExpr = "";
      calcExpr += k === "*" ? "×" : k === "/" ? "÷" : k === "-" ? "−" : k;
    }
    calcUpdate();
  });

  const adToggle = document.getElementById("adblock-toggle");
  const adStatus = document.getElementById("adblock-status");
  let adStyle = null;
  adToggle.onchange = () => {
    if (adToggle.checked) {
      if (!adStyle) {
        adStyle = document.createElement("style");
        adStyle.id = "tap-adblock";
        adStyle.textContent = 'iframe[src*="doubleclick"], iframe[src*="googlesyndication"], [class*="ad-banner"], [id*="google_ads"], .adsbygoogle { display: none !important; }';
        document.head.appendChild(adStyle);
      }
      adStatus.textContent = "Status: EIN (Filter aktiv in dieser App)";
    } else {
      if (adStyle) { adStyle.remove(); adStyle = null; }
      adStatus.textContent = "Status: AUS";
    }
  };

  const awakeToggle = document.getElementById("awake-toggle");
  const awakeStatus = document.getElementById("awake-status");
  let wakeLock = null;
  async function requestWake() {
    try {
      if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request("screen");
        awakeStatus.textContent = "Status: EIN · Wake Lock aktiv";
        wakeLock.addEventListener("release", () => {
          if (awakeToggle.checked) awakeStatus.textContent = "Status: freigegeben – erneut tippen zum Aktivieren";
        });
      } else {
        awakeStatus.textContent = "Status: Wake Lock API nicht verfügbar";
        awakeToggle.checked = false;
      }
    } catch (err) {
      awakeStatus.textContent = "Status: Fehler – " + (err.message || "nicht erlaubt");
      awakeToggle.checked = false;
    }
  }
  awakeToggle.onchange = async () => {
    if (awakeToggle.checked) await requestWake();
    else {
      if (wakeLock) { await wakeLock.release(); wakeLock = null; }
      awakeStatus.textContent = "Status: AUS";
    }
  };
  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState === "visible" && awakeToggle.checked && !wakeLock) await requestWake();
  });
  awakeStatus.textContent = ("wakeLock" in navigator) ? "Status: AUS · API verfügbar" : "Status: AUS · API nicht unterstützt";

  const frame = document.getElementById("br-frame");
  const fallback = document.getElementById("br-fallback");
  const urlInput = document.getElementById("br-url");
  let lastUrl = "https://example.com";
  function loadUrl(u) {
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    lastUrl = u;
    urlInput.value = u;
    fallback.hidden = true;
    frame.style.display = "block";
    frame.src = u;
  }
  document.getElementById("br-go").onclick = () => loadUrl(urlInput.value.trim());
  urlInput.addEventListener("keydown", (e) => { if (e.key === "Enter") loadUrl(urlInput.value.trim()); });
  document.getElementById("br-reload").onclick = () => loadUrl(lastUrl);
  document.getElementById("br-back").onclick = () => { try { frame.contentWindow.history.back(); } catch (_) {} };
  document.getElementById("br-fwd").onclick = () => { try { frame.contentWindow.history.forward(); } catch (_) {} };
  document.getElementById("br-open-ext").onclick = () => window.open(lastUrl, "_blank", "noopener");
  loadUrl("https://example.com");
})();
