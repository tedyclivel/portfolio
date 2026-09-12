import React, { useRef, useEffect, useState, useCallback } from "react";
import "../styles/RobotGame.css";

const SCALE    = 2;
const PX_W     = 16;
const PX_H     = 18;
const BLOB_W   = PX_W * SCALE;
const BLOB_H   = PX_H * SCALE;

const GRAVITY        = 0.22;
const JUMP_FORCE     = -7;
const MAX_SPEED      = 1.8;
const FRICTION       = 0.82;
const BLOCK_H        = 8;
const SPAWN_INTERVAL = 22;
const SECTION_NAMES  = ["intro", "about", "experience", "highlights", "projects"];
const CELL_COUNT     = SECTION_NAMES.length;
const CELL_TYPES     = ["core", "rare", "hidden", "core", "rare"];
const CELL_POINTS    = { core: 1, rare: 3, hidden: 2 };
let sharedAudioContext = null;

function playTone(kind = "collect") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    sharedAudioContext ||= new AudioContext();
    const audio = sharedAudioContext;
    if (audio.state === "suspended") audio.resume();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = kind === "win" ? "triangle" : "sine";
    oscillator.frequency.value = kind === "rare" ? 740 : kind === "win" ? 880 : 520;
    gain.gain.setValueAtTime(0.04, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.16);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.16);
  } catch {
    // Audio is optional and must never affect playability.
  }
}

function drawBlob(ctx, x, y, frame, onGround, isIdle, reducedMotion = false) {
  const B  = "#ccd6f6";
  const D  = "#8892b0";
  const EY = "#0a192f";
  const SH = "#64ffda";
  const CK = "#64ffda";

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(SCALE, SCALE);

  const wf  = !reducedMotion && !isIdle && onGround ? Math.floor(frame / 10) % 2 : 0;
  const bob = !reducedMotion && isIdle ? (Math.sin(frame * 0.06) > 0.3 ? 1 : 0) : 0;

  ctx.fillStyle = B;
  ctx.fillRect(4,  0 + bob,  8, 2);
  ctx.fillRect(2,  2 + bob, 12, 2);
  ctx.fillRect(1,  4 + bob, 14, 7);
  ctx.fillRect(0,  6 + bob,  1, 3);
  ctx.fillRect(15, 6 + bob,  1, 3);
  ctx.fillRect(2, 11 + bob, 12, 2);
  ctx.fillRect(4, 13 + bob,  8, 1);

  ctx.fillStyle = D;
  ctx.fillRect(3, 12 + bob, 10, 1);

  ctx.fillStyle = B;
  const lA = wf, lB = 1 - wf;
  ctx.fillRect(3,  14, 3, 2 + lA);
  ctx.fillRect(10, 14, 3, 2 + lB);
  ctx.fillRect(2,  15 + lA, 5, 2);
  ctx.fillRect(9,  15 + lB, 5, 2);

  ctx.fillStyle = EY;
  ctx.fillRect(2,  4 + bob, 4, 4);
  ctx.fillRect(10, 4 + bob, 4, 4);

  ctx.fillStyle = SH;
  ctx.fillRect(2,  4 + bob, 2, 2);
  ctx.fillRect(10, 4 + bob, 2, 2);

  ctx.fillStyle = CK;
  ctx.globalAlpha = 0.18;
  ctx.fillRect(1,  8 + bob, 2, 1);
  ctx.fillRect(13, 8 + bob, 2, 1);
  ctx.globalAlpha = 1;

  ctx.fillStyle = EY;
  ctx.fillRect(5,  9 + bob, 1, 1);
  ctx.fillRect(6, 10 + bob, 4, 1);
  ctx.fillRect(10, 9 + bob, 1, 1);

  ctx.restore();
}

function drawBlock(ctx, bx, by, bw, alpha = 1, kind = "stable") {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(bx + 2, by + BLOCK_H, bw - 2, 3);
  ctx.fillStyle = "#112240";
  ctx.fillRect(bx, by, bw, BLOCK_H);
  ctx.fillStyle = kind === "bounce" ? "rgba(255,209,102,0.85)" : kind === "fragile" ? "rgba(255,107,107,0.8)" : kind === "moving" ? "rgba(191,159,212,0.85)" : "rgba(100,255,218,0.6)";
  ctx.fillRect(bx, by, bw, 2);
  ctx.fillStyle = "rgba(100,255,218,0.09)";
  for (let px = bx + 6; px < bx + bw - 3; px += 10)
    ctx.fillRect(px, by + 3, 2, 2);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(bx, by + BLOCK_H - 1, bw, 1);
  ctx.restore();
}

function drawBrainCell(ctx, ex, ey, scrollY, viewportHeight, idx, type = "core", reducedMotion = false) {
  const sy = ey - scrollY;
  if (sy < -24 || sy > viewportHeight + 24) return;

  const t   = Date.now() * 0.002 + idx * 1.4;
  const bob = reducedMotion ? 0 : Math.sin(t) * 2;
  const cx  = Math.round(ex + 6);
  const cy  = Math.round(sy + bob + 7);

  ctx.save()

  ctx.globalAlpha = type === "hidden" ? 0.06 : 0.12 + (reducedMotion ? 0 : 0.06 * Math.sin(t * 1.6));
  ctx.fillStyle = type === "rare" ? "#ffd166" : "#9060c0";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 14, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = type === "hidden" ? 0.28 : 0.88;
  ctx.fillStyle = type === "rare" ? "#ffd166" : type === "hidden" ? "#64ffda" : "#bf9fd4";
  const DN = [
    [0,    -8.5, 2,   3.5],
    [-5.5, -6,   2.5, 2  ],
    [5.5,  -6,   2.5, 2  ],
    [-8,    0,   3,   2  ],
    [8,     0,   3,   2  ],
    [-4.5,  7,   2.5, 3  ],
    [4.5,   7,   2.5, 3  ],
  ];
  DN.forEach(([dx, dy, rx, ry]) => {
    ctx.beginPath();
    ctx.ellipse(cx + dx, cy + dy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = type === "rare" ? "#ffd166" : type === "hidden" ? "#64ffda" : "#bf9fd4";
  ctx.beginPath();
  ctx.ellipse(cx, cy, 5.5, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#edddf8";
  ctx.beginPath();
  ctx.ellipse(cx - 1.5, cy - 2, 2, 2.5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function generateCellLayout(nb, vw, sectionZones = []) {
  const fallbackZones = [
    [nb + 400,  nb + 620 ],
    [nb + 1000, nb + 1280],
    [nb + 1780, nb + 2100],
    [nb + 2700, nb + 3060],
    [nb + 3640, nb + 4160],
  ];
  const yZones = sectionZones.length === CELL_COUNT ? sectionZones : fallbackZones;

  const cells       = [];
  const extraLedges = [];
  const mk = (x, docY, w, kind = "stable") => ({
    x, originX: x, docY, w, kind, isSpawn: false, isGoal: false, alpha: 0, revealed: false,
  });

  const platformWidth = Math.min(220, Math.max(150, vw - 48));
  const leftX = 24;
  const rightX = Math.min(94, Math.max(24, vw - platformWidth - 24));
  let previousY = nb + 200;
  let step = 0;

  yZones.forEach(([yMin, yMax], i) => {
    const ledgeDocY = Math.round((yMin + yMax) / 2);
    while (previousY + 125 < ledgeDocY - 60) {
      previousY += 115;
      const kind = step > 0 && step % 11 === 0 ? "bounce" : step > 0 && step % 7 === 0 ? "fragile" : step > 0 && step % 5 === 0 ? "moving" : "stable";
      extraLedges.push(mk(step % 2 === 0 ? leftX : rightX, previousY, platformWidth, kind));
      step += 1;
    }
    const platformX = i % 2 === 0 ? leftX : rightX;
    const cellX = platformX + platformWidth / 2 - 6;
    const type = CELL_TYPES[i];
    cells.push({ x: cellX, docY: ledgeDocY - 16, collected: false, type, section: SECTION_NAMES[i], checkpoint: { x: platformX + 24, docY: ledgeDocY - BLOB_H } });
    extraLedges.push(mk(platformX, ledgeDocY, platformWidth, "stable"));
    previousY = ledgeDocY;
  });

  return { cells, extraLedges };
}

function getNavbarBottom() {
  const nb = document.querySelector(".navbar");
  return nb ? nb.getBoundingClientRect().bottom : 60;
}

function getSectionZones(navbarBottom) {
  const scrollY = window.scrollY;
  return SECTION_NAMES.map((name, index) => {
    const section = document.getElementById(name);
    if (!section) return [navbarBottom + 400 + index * 780, navbarBottom + 560 + index * 780];
    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const bottom = rect.bottom + scrollY;
    const safeTop = Math.max(navbarBottom + 260, top + 110);
    const safeBottom = Math.max(safeTop + 40, Math.min(bottom - 100, safeTop + 180));
    return [safeTop, safeBottom];
  });
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const RobotGame = ({ active, language = "en" }) => {
  const canvasRef    = useRef(null);
  const animRef      = useRef(null);
  const blobRef      = useRef(null);
  const blocksRef    = useRef([]);
  const cellsRef     = useRef([]);
  const keysRef      = useRef(new Set());
  const jumpLatchRef = useRef(false);
  const frameRef     = useRef(0);
  const checkpointRef = useRef(null);
  const startedAtRef = useRef(0);
  const pausedRef = useRef(false);
  const scoreRef = useRef(0);
  const bestTimeRef = useRef(Number(localStorage.getItem("robot-game-best-time")) || 0);
  const lastFrameAtRef = useRef(0);
  const pauseStartedAtRef = useRef(0);
  const rewardTimeoutRef = useRef(null);
  const layoutWidthRef = useRef(window.innerWidth);

  const [gameStatus,      setGameStatus]      = useState("playing");
  const [restartKey,      setRestartKey]      = useState(0);
  const [cellsCollected,  setCellsCollected]  = useState(0);
  const [gameStarted,     setGameStarted]     = useState(false);
  const [paused,          setPaused]          = useState(false);
  const [score,           setScore]           = useState(0);
  const [elapsed,         setElapsed]         = useState(0);
  const [bestTime,        setBestTime]        = useState(() => Number(localStorage.getItem("robot-game-best-time")) || 0);
  const [zone,            setZone]            = useState(SECTION_NAMES[0]);
  const [reward,          setReward]          = useState("");
  const [reducedMotion,   setReducedMotion]   = useState(() => {
    const saved = localStorage.getItem("robot-game-reduced-motion");
    return saved === null ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : saved === "true";
  });

  const text = language === "fr" ? {
    title: "quête du portfolio", intro: "Restaure cinq neurones à travers le portfolio. Les neurones rares rapportent plus de points.", start: "commencer", reduce: "réduire les animations", reduced: "animations réduites", hint: "← → ou A D pour bouger · espace pour sauter · P pour mettre en pause", zone: "zone", best: "record", pause: "pause", resume: "reprendre", paused: "en pause", pausedSub: "Ta progression est conservée.", fell: "chute détectée", fellSub: "Le signal a été perdu avant le premier checkpoint.", retry: "réessayer", space: "ou appuie sur espace", won: "neurones restaurés", unlocked: "Signal restauré — explore les projets déverrouillés.", replay: "rejouer", controls: "Commandes du jeu", core: "standard", hidden: "caché", rare: "rare", sections: { intro: "accueil", about: "à propos", experience: "expérience", highlights: "ingénierie", projects: "projets" },
  } : {
    title: "portfolio quest", intro: "Restore five neurons across the portfolio. Rare neurons are worth extra points.", start: "start quest", reduce: "reduce motion", reduced: "motion: reduced", hint: "← → or A D to move · space to jump · P to pause", zone: "zone", best: "best", pause: "pause", resume: "resume", paused: "paused", pausedSub: "Take a breath. Your progress is safe.", fell: "you fell", fellSub: "The signal was lost before the first checkpoint.", retry: "try again", space: "or press space", won: "neurons restored", unlocked: "Portfolio signal restored — explore the projects you unlocked.", replay: "play again", controls: "Game controls", core: "core", hidden: "hidden", rare: "rare", sections: { intro: "intro", about: "about", experience: "experience", highlights: "engineering", projects: "projects" },
  };

  const restart = useCallback(() => {
    pausedRef.current = false;
    pauseStartedAtRef.current = 0;
    setPaused(false);
    setRestartKey((k) => k + 1);
  }, []);
  const startGame = useCallback(() => { playTone("start"); setGameStarted(true); setPaused(false); pausedRef.current = false; restart(); }, [restart]);
  const togglePause = useCallback(() => {
    const nextPaused = !pausedRef.current;
    const now = performance.now();
    if (nextPaused) {
      pauseStartedAtRef.current = now;
      keysRef.current.clear();
    } else if (pauseStartedAtRef.current) {
      startedAtRef.current += now - pauseStartedAtRef.current;
      pauseStartedAtRef.current = 0;
    }
    pausedRef.current = nextPaused;
    setPaused(nextPaused);
  }, []);

  const announceReward = useCallback((message) => {
    setReward(message);
    window.clearTimeout(rewardTimeoutRef.current);
    rewardTimeoutRef.current = window.setTimeout(() => setReward(""), 2400);
  }, []);

  const pressMobileKey = (event, code) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    keysRef.current.add(code);
  };
  const releaseMobileKey = (event, code) => {
    keysRef.current.delete(code);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const getPlatforms = useCallback(() => {
    return blocksRef.current
      .filter((b) => b.alpha > 0.5)
      .map((b) => ({ x: b.x, y: b.docY, w: b.w, kind: b.kind, source: b }));
  }, []);

  useEffect(() => {
    localStorage.setItem("robot-game-reduced-motion", String(reducedMotion));
    document.documentElement.classList.toggle("game-reduced-motion", reducedMotion);
    return () => document.documentElement.classList.remove("game-reduced-motion");
  }, [reducedMotion]);

  useEffect(() => {
    if (!active || !gameStarted) { cancelAnimationFrame(animRef.current); return; }

    window.scrollTo(0, 0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx     = canvas.getContext("2d");
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewport.width = window.innerWidth;
      viewport.height = window.innerHeight;
      canvas.width = Math.round(viewport.width * dpr);
      canvas.height = Math.round(viewport.height * dpr);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();
    layoutWidthRef.current = viewport.width;

    const nb = getNavbarBottom();
    frameRef.current = 0;
    setCellsCollected(0);
    scoreRef.current = 0;
    setScore(0);
    setElapsed(0);
    setReward("");
    setZone(SECTION_NAMES[0]);
    startedAtRef.current = performance.now();
    checkpointRef.current = null;
    lastFrameAtRef.current = performance.now();
    pauseStartedAtRef.current = 0;

    const sectionZones = getSectionZones(nb);
    const { cells, extraLedges } = generateCellLayout(nb, window.innerWidth, sectionZones);
    cellsRef.current = cells;

    blocksRef.current = [
      { x: 30,  docY: nb + 200, w: 80, isSpawn: true, spawnIdx: 0, isGoal: false, alpha: 0, revealed: false },
      { x: 170, docY: nb + 155, w: 76, isSpawn: true, spawnIdx: 1, isGoal: false, alpha: 0, revealed: false },
      { x: 315, docY: nb + 235, w: 76, isSpawn: true, spawnIdx: 2, isGoal: false, alpha: 0, revealed: false },
      { x: 450, docY: nb + 175, w: 76, isSpawn: true, spawnIdx: 3, isGoal: false, alpha: 0, revealed: false },
      ...extraLedges,
    ];

    const b0 = blocksRef.current[0];
    blobRef.current = {
      x:        Math.round(b0.x + b0.w / 2 - BLOB_W / 2),
      docY:     b0.docY - BLOB_H - 280,
      vx:       0,
      vy:       0,
      onGround: false,
      frame:    0,
      status:   "playing",
      spawning: true,
      bounces:  0,
    };

    setGameStatus("playing");

    const onKeyDown = (e) => {
      if (e.target instanceof Element && e.target.closest("a, button, input, textarea, select, [role='dialog']")) return;
      if ((e.code === "KeyP" || e.code === "Escape") && blobRef.current?.status === "playing") {
        togglePause();
        return;
      }
      if (e.code === "Space" && blobRef.current?.status === "dead") {
        restart();
        return;
      }
      if (blobRef.current?.status !== "playing") return;
      keysRef.current.add(e.code);
      if (["Space","ArrowUp","ArrowLeft","ArrowRight","ArrowDown"].includes(e.code))
        e.preventDefault();
    };
    const onKeyUp = (e) => keysRef.current.delete(e.code);
    const onVisibilityChange = () => {
      if (document.hidden && !pausedRef.current && blobRef.current?.status === "playing") togglePause();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const loop = () => {
      const a = blobRef.current;
      if (!a || a.status !== "playing") return;

      if (pausedRef.current) {
        lastFrameAtRef.current = performance.now();
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      const scrollY = window.scrollY;
      const now = performance.now();
      const delta = Math.min(2, Math.max(0.25, (now - lastFrameAtRef.current) / (1000 / 60)));
      lastFrameAtRef.current = now;
      frameRef.current += delta;
      if (Math.floor(frameRef.current) % 20 === 0) setElapsed(Math.floor((now - startedAtRef.current) / 1000));

      blocksRef.current.forEach((b) => {
        if (b.kind === "moving") {
          const previousX = b.x;
          b.x = reducedMotion ? b.originX : b.originX + Math.sin(frameRef.current * 0.025 + b.docY) * 24;
          b.deltaX = b.x - previousX;
        }
        if (!b.revealed) {
          if (b.isSpawn) {
            if (frameRef.current >= b.spawnIdx * SPAWN_INTERVAL) b.revealed = true;
          } else {
            if (b.docY - scrollY < viewport.height + 80) b.revealed = true;
          }
        }
        if (b.revealed && !b.broken && b.alpha < 0.62) b.alpha = Math.min(b.alpha + 0.05 * delta, 0.62);
      });

      ctx.clearRect(0, 0, viewport.width, viewport.height);

      blocksRef.current.forEach((b) => {
        if (b.alpha <= 0) return;
        const sy = b.docY - scrollY;
        if (sy > -BLOCK_H - 4 && sy < viewport.height + 4)
          drawBlock(ctx, b.x, sy, b.w, b.alpha, b.kind);
      });

      cellsRef.current.forEach((cell, idx) => {
        if (!cell.collected) drawBrainCell(ctx, cell.x, cell.docY, scrollY, viewport.height, idx, cell.type, reducedMotion);
      });

      if (a.spawning) {
        a.vy = Math.min(a.vy + GRAVITY * delta, 8);
        a.docY += a.vy * delta;
        a.frame += delta;

        const b = blocksRef.current[0];
        if (b.alpha > 0.5) {
          const rBot = a.docY + BLOB_H, prev = rBot - a.vy * delta;
          if (a.x + BLOB_W > b.x && a.x < b.x + b.w &&
              prev <= b.docY + 4 && rBot >= b.docY && a.vy > 0) {
            a.docY = b.docY - BLOB_H;
            a.bounces++;
            if      (a.bounces === 1) { a.vy = -4.5; }
            else if (a.bounces === 2) { a.vy = -1.8; }
            else    { a.vy = 0; a.onGround = true; a.spawning = false; }
          }
        }

        const sy = a.docY - scrollY;
        if (sy > -BLOB_H && sy < viewport.height)
          drawBlob(ctx, a.x, sy, a.frame, a.onGround, false, reducedMotion);
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      const keys  = keysRef.current;
      const left  = keys.has("ArrowLeft")  || keys.has("KeyA");
      const right = keys.has("ArrowRight") || keys.has("KeyD");
      const jump  = keys.has("Space") || keys.has("ArrowUp") || keys.has("KeyW");

      if (left)       a.vx = Math.max(a.vx - 0.32 * delta, -MAX_SPEED);
      else if (right) a.vx = Math.min(a.vx + 0.32 * delta,  MAX_SPEED);
      else            a.vx *= Math.pow(FRICTION, delta);

      if (jump && a.onGround && !jumpLatchRef.current) {
        a.vy = JUMP_FORCE; a.onGround = false; jumpLatchRef.current = true;
      }
      if (!jump) jumpLatchRef.current = false;

      a.vy = Math.min(a.vy + GRAVITY * delta, 8);
      a.x += a.vx * delta;
      a.docY += a.vy * delta;
      a.frame += delta;

      // Follow down during exploration and back up after jumps or checkpoint restores.
      const screenY = a.docY - scrollY;
      if (screenY > viewport.height * 0.62 || screenY < viewport.height * 0.24) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewport.height);
        const targetScroll = Math.min(maxScroll, Math.max(0, Math.round(a.docY - viewport.height * 0.48)));
        if (Math.abs(targetScroll - scrollY) > 3) window.scrollTo({ top: targetScroll, behavior: "auto" });
      }

      if (a.x < 0)                      { a.x = 0;                      a.vx = 0; }
      if (a.x + BLOB_W > viewport.width)  { a.x = viewport.width - BLOB_W;  a.vx = 0; }

      const platforms = getPlatforms();
      a.onGround = false;
      for (const p of platforms) {
        const rBot = a.docY + BLOB_H, prev = rBot - a.vy * delta;
        if (a.x + BLOB_W > p.x + 2 && a.x < p.x + p.w - 2 &&
            prev <= p.y + 5 && rBot >= p.y - 1 && a.vy >= 0) {
          a.docY = p.y - BLOB_H;
          if (p.kind === "bounce") {
            a.vy = -9;
            a.onGround = false;
            playTone("rare");
          } else {
            a.vy = 0;
            a.onGround = true;
            if (p.kind === "moving" && p.source) a.x += p.source.deltaX || 0;
            if (p.kind === "fragile" && p.source) {
              p.source.broken = true;
              p.source.alpha = 0;
            }
          }
          break;
        }
      }

      const liveScrollY = window.scrollY;
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - viewport.height);
      const fellPastViewport = liveScrollY >= maxScrollY - 2 && a.docY - liveScrollY > viewport.height + 100;
      const fellPastWorld = a.docY > document.documentElement.scrollHeight + 140;
      if (fellPastViewport || fellPastWorld) {
        if (checkpointRef.current) {
          a.x = checkpointRef.current.x;
          a.docY = checkpointRef.current.docY;
          a.vx = 0;
          a.vy = 0;
          a.onGround = false;
          window.scrollTo({ top: Math.max(0, a.docY - viewport.height * 0.48), behavior: "auto" });
          announceReward(language === "fr" ? "checkpoint restauré" : "checkpoint restored");
          animRef.current = requestAnimationFrame(loop);
          return;
        }
        a.status = "dead"; setGameStatus("dead"); return;
      }

      const aCx = a.x + BLOB_W / 2;
      const aCy = a.docY + BLOB_H / 2;
      cellsRef.current.forEach((cell) => {
        if (cell.collected) return;
        const cCx = cell.x + 6;
        const cCy = cell.docY + 8;
        // A forgiving pickup radius keeps section objectives reachable without pixel-perfect jumps.
        if (Math.abs(aCx - cCx) < 120 && Math.abs(aCy - cCy) < 72) {
          cell.collected = true;
          setCellsCollected((c) => c + 1);
          const points = CELL_POINTS[cell.type] || 1;
          scoreRef.current += points;
          setScore(scoreRef.current);
          checkpointRef.current = cell.checkpoint;
          setZone(cell.section);
          const sectionLabel = language === "fr" ? ({ intro: "accueil", about: "à propos", experience: "expérience", highlights: "ingénierie", projects: "projets" })[cell.section] : cell.section;
          announceReward(`${sectionLabel} ${language === "fr" ? "déverrouillé" : "unlocked"} +${points}`);
          playTone(cell.type);
        }
      });

      if (cellsRef.current.length > 0 && cellsRef.current.every((c) => c.collected)) {
        const finalTime = Math.floor((performance.now() - startedAtRef.current) / 1000);
        setElapsed(finalTime);
        if (!bestTimeRef.current || finalTime < bestTimeRef.current) {
          localStorage.setItem("robot-game-best-time", String(finalTime));
          bestTimeRef.current = finalTime;
          setBestTime(finalTime);
        }
        playTone("win");
        a.status = "won"; setGameStatus("won"); return;
      }

      const sy     = a.docY - scrollY;
      const isIdle = a.onGround && Math.abs(a.vx) < 0.25;
      if (sy > -BLOB_H && sy < viewport.height + 40)
        drawBlob(ctx, a.x, sy, a.frame, a.onGround, isIdle, reducedMotion);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      const widthChanged = Math.abs(window.innerWidth - layoutWidthRef.current) > 32;
      resizeCanvas();
      if (widthChanged) {
        layoutWidthRef.current = window.innerWidth;
        restart();
      }
    };
    window.addEventListener("resize", onResize);
    const keys = keysRef.current;

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      window.removeEventListener("resize",  onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      keys.clear();
      jumpLatchRef.current = false;
      window.clearTimeout(rewardTimeoutRef.current);
    };
  }, [active, gameStarted, restartKey, getPlatforms, restart, reducedMotion, togglePause, announceReward, language]);

  if (!active) return null;

  return (
    <div className={`robot-game-layer${reducedMotion ? " robot-game-layer--reduced" : ""}`}>
      <canvas ref={canvasRef} className="robot-game-canvas" aria-hidden="true" />

      {!gameStarted && (
        <div className="robot-game-status robot-game-status--start">
          <div className="robot-game-status-title">{text.title}</div>
          <div className="robot-game-status-sub">{text.intro}</div>
          <div className="robot-game-legend"><span>● {text.core} +1</span><span>● {text.hidden} +2</span><span>● {text.rare} +3</span></div>
          <button className="robot-game-status-btn" onClick={startGame}>{text.start}</button>
          <button className="robot-game-text-btn" onClick={() => setReducedMotion((value) => !value)}>{reducedMotion ? text.reduced : text.reduce}</button>
          <div className="robot-game-status-hint">{text.hint}</div>
        </div>
      )}

      {gameStarted && gameStatus === "playing" && !paused && <>
        <div className="cell-counter">
          <span className="cell-counter-pip" />
          <span className="cell-counter-text">{cellsCollected} / {CELL_COUNT} · {score} pts · {formatTime(elapsed)}</span>
        </div>
        <div className="robot-game-hud">
          <span>{text.zone} // {text.sections[zone]}</span>
          {bestTime > 0 && <span>{text.best} // {formatTime(bestTime)}</span>}
          <button type="button" onClick={togglePause} aria-label={paused ? text.resume : text.pause}>{paused ? text.resume : text.pause}</button>
        </div>
        {reward && <div className="robot-game-reward" role="status">{reward}</div>}
        <div className="mobile-game-controls" aria-label={text.controls}>
          <button type="button" onPointerDown={(event) => pressMobileKey(event, "ArrowLeft")} onPointerUp={(event) => releaseMobileKey(event, "ArrowLeft")} onPointerCancel={(event) => releaseMobileKey(event, "ArrowLeft")} aria-label={language === "fr" ? "Aller à gauche" : "Move left"}>←</button>
          <button type="button" onPointerDown={(event) => pressMobileKey(event, "Space")} onPointerUp={(event) => releaseMobileKey(event, "Space")} onPointerCancel={(event) => releaseMobileKey(event, "Space")} aria-label={language === "fr" ? "Sauter" : "Jump"}>↑</button>
          <button type="button" onPointerDown={(event) => pressMobileKey(event, "ArrowRight")} onPointerUp={(event) => releaseMobileKey(event, "ArrowRight")} onPointerCancel={(event) => releaseMobileKey(event, "ArrowRight")} aria-label={language === "fr" ? "Aller à droite" : "Move right"}>→</button>
        </div>
      </>}

      {paused && <div className="robot-game-status robot-game-status--pause"><div className="robot-game-status-title">{text.paused}</div><div className="robot-game-status-sub">{text.pausedSub}</div><button className="robot-game-status-btn" onClick={togglePause}>{text.resume}</button></div>}

      {gameStatus === "dead" && (
        <div className="robot-game-status robot-game-status--dead">
          <div className="robot-game-status-title">{text.fell}</div>
          <div className="robot-game-status-sub">{text.fellSub}</div>
          <button className="robot-game-status-btn" onClick={restart}>{text.retry}</button>
          <div className="robot-game-status-hint">{text.space}</div>
        </div>
      )}

      {gameStatus === "won" && (
        <div className="robot-game-status robot-game-status--won">
          <div className="robot-game-status-title">{text.won}</div>
          <div className="robot-game-status-sub">all {CELL_COUNT} neurons recovered · {score} points · {formatTime(elapsed)}</div>
          <div className="robot-game-status-unlock">{text.unlocked}</div>
          <button className="robot-game-status-btn" onClick={restart}>{text.replay}</button>
        </div>
      )}
    </div>
  );
};

export default RobotGame;
