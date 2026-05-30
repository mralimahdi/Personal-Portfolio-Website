// ── Build marquee items ──────────────────────────────
const itemsData = [
    { text: 'Creative Designer', accent: false },
    { text: 'Web Developer', accent: true },
    { text: 'UI / UX Designer', accent: false },
    { text: 'Front-End Engineer', accent: true },
    { text: 'Motion Designer', accent: false },
    { text: 'Problem Solver', accent: true },
    { text: 'Creative Designer', accent: false },
    { text: 'Web Developer', accent: true },
    { text: 'UI / UX Designer', accent: false },
    { text: 'Front-End Engineer', accent: true },
    { text: 'Motion Designer', accent: false },
    { text: 'Problem Solver', accent: true },
];

const track = document.getElementById('strip-track');
if (track) {
    [...itemsData, ...itemsData].forEach(it => {
        const div = document.createElement('div');
        div.className = 'strip-item';
        div.innerHTML = `<span class="strip-text${it.accent ? ' accent' : ''}">${it.text}</span><span class="strip-dot"></span>`;
        track.appendChild(div);
    });
}

// ── SVG Ali Logo Animation (Loader) ──────────────────
// Start animation immediately when DOM is ready
(function initLoaderAnimation() {
    const svg = document.querySelector('#loader svg');
    if (!svg) return;

    const upperPart = document.getElementById('upper-part');
    const middlePart = document.getElementById('middle-part');
    const aliFill = document.getElementById('ali-fill');
    const inkTip = document.getElementById('ink-tip');
    const bladeRect = document.getElementById('blade-rect');
    const lowerPart = document.getElementById('lower-part');

    const strokeIds = ['stroke-1', 'stroke-2', 'stroke-3', 'stroke-4'];
    const strokes = strokeIds.map(id => document.getElementById(id));
    let lengths = [];

    function easeOutBack(t) { return 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2); }
    function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    let rafs = [], timers = [];
    function stopAll() {
        rafs.forEach(cancelAnimationFrame); rafs = [];
        timers.forEach(clearTimeout); timers = [];
    }

    function animate(delayMs, durMs, easeFn, tick, done) {
        const id = setTimeout(() => {
            const t0 = performance.now();
            function step(now) {
                const t = Math.min((now - t0) / durMs, 1);
                tick(easeFn(t), t);
                if (t < 1) rafs.push(requestAnimationFrame(step));
                else if (done) done();
            }
            rafs.push(requestAnimationFrame(step));
        }, delayMs);
        timers.push(id);
    }

    function drawStroke(strokeEl, len, delayMs, durMs, onDone) {
        strokeEl.setAttribute('stroke-dasharray', String(len));
        strokeEl.setAttribute('stroke-dashoffset', String(len));
        animate(delayMs, durMs, easeInOutSine, (e, t) => {
            strokeEl.setAttribute('stroke-dashoffset', String(len * (1 - e)));
            try {
                const pt = strokeEl.getPointAtLength(e * len);
                inkTip.setAttribute('cx', pt.x);
                inkTip.setAttribute('cy', pt.y);
                inkTip.setAttribute('opacity', t < 0.88 ? '1' : String((1 - t) / 0.12));
            } catch (_) { }
        }, () => {
            inkTip.setAttribute('opacity', '0');
            if (onDone) onDone();
        });
    }

    function play() {
        stopAll();
        svg.classList.remove('glow');

        upperPart.style.cssText = 'opacity:0;transform:translateY(-150px);';
        middlePart.style.opacity = '0';
        aliFill.setAttribute('opacity', '0');
        inkTip.setAttribute('opacity', '0');
        bladeRect.setAttribute('height', '0');
        lowerPart.style.opacity = '0';
        strokes.forEach((s, i) => {
            s.setAttribute('stroke-dasharray', String(lengths[i] || 0));
            s.setAttribute('stroke-dashoffset', String(lengths[i] || 0));
        });

        animate(280, 680, easeOutBack, (e) => {
            upperPart.style.transform = `translateY(${(1 - Math.max(e, 0)) * -150}px)`;
            upperPart.style.opacity = String(Math.min(e * 3.5, 1));
        });

        const strokeDur = 320;
        const strokeGap = 30;
        const middleStart = 900;

        middlePart.style.opacity = '1';
        try {
            const p0 = strokes[0].getPointAtLength(0);
            inkTip.setAttribute('cx', p0.x);
            inkTip.setAttribute('cy', p0.y);
        } catch (_) { }

        function chainStroke(i, delay) {
            if (i >= strokes.length) {
                animate(60, 300, easeOutCubic, (e) => {
                    aliFill.setAttribute('opacity', String(e));
                });
                return;
            }
            const id = setTimeout(() => {
                try {
                    const p0 = strokes[i].getPointAtLength(0);
                    inkTip.setAttribute('cx', p0.x);
                    inkTip.setAttribute('cy', p0.y);
                    inkTip.setAttribute('opacity', '1');
                } catch (_) { }
            }, delay);
            timers.push(id);

            drawStroke(strokes[i], lengths[i], delay, strokeDur, () => {
                chainStroke(i + 1, strokeGap);
            });
        }

        chainStroke(0, middleStart);

        const bladeStart = middleStart + 4 * (strokeDur + strokeGap) + 400;
        animate(bladeStart, 600, easeOutQuart, (e) => {
            lowerPart.style.opacity = '1';
            bladeRect.setAttribute('height', String(e * 179.46));
        }, () => {
            timers.push(setTimeout(() => {
                svg.classList.add('glow');
                timers.push(setTimeout(() => {
                    svg.classList.remove('glow');
                    play();
                }, 1800));
            }, 120));
        });
    }

    function init() {
        lengths = strokes.map(s => s.getTotalLength());
        strokes.forEach((s, i) => {
            s.setAttribute('stroke-dasharray', String(lengths[i]));
            s.setAttribute('stroke-dashoffset', String(lengths[i]));
        });
        play();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ── Loader fade out ───────────────────────────────────
window.addEventListener('load', () => {
    // Wait for 1 complete animation cycle (~5.5 seconds) before fading
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hide');

        const hero = document.getElementById('hero');
        if (hero) hero.classList.add('show');

        const nav = document.getElementById('nav');
        if (nav) nav.classList.add('show');

        const stripWrapper = document.getElementById('strip-wrapper');
        if (stripWrapper) stripWrapper.classList.add('show');

        const scrollHint = document.getElementById('scroll-hint');
        if (scrollHint) scrollHint.classList.add('show');
    }, 5500);
});

// ── Canvas / Particle Network ────────────────────────
const canvas = document.getElementById('canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const mouse = { x: -9999, y: -9999 };
    const nodes = [];
    let canvasBgColor = 'rgba(13, 31, 60, 0.20)';
    window.setCanvasBgColor = function (color) {
        canvasBgColor = color;
    };
    const COUNT = 110;
    const LINK = 140;
    const MPULL = 175;
    const MINDIST = 34;

    const ZONE = {
        get cx() { return W / 2; },
        get cy() { return H / 2 + 30; },
        rx: 360, ry: 185
    };

    function inZone(x, y, margin) {
        const m = margin || 1;
        const dx = (x - ZONE.cx) / (ZONE.rx * m);
        const dy = (y - ZONE.cy) / (ZONE.ry * m);
        return dx * dx + dy * dy < 1;
    }

    function buildGrid() {
        const cols = Math.round(Math.sqrt(COUNT * (W / H)));
        const rows = Math.ceil(COUNT / cols);
        const cw = W / cols, ch = H / rows;
        const pts = [];
        for (let r = 0; r < rows && pts.length < COUNT; r++) {
            for (let c = 0; c < cols && pts.length < COUNT; c++) {
                let x, y, tries = 0;
                do {
                    x = (c + 0.15 + Math.random() * 0.7) * cw;
                    y = (r + 0.15 + Math.random() * 0.7) * ch;
                    tries++;
                } while (inZone(x, y, 1) && tries < 25);
                if (inZone(x, y, 1)) {
                    x = x < W / 2 ? ZONE.cx - ZONE.rx - 40 - Math.random() * 40
                        : ZONE.cx + ZONE.rx + 40 + Math.random() * 40;
                }
                pts.push({ x, y });
            }
        }
        return pts;
    }

    class Node {
        constructor(pt) {
            this.x = pt.x; this.y = pt.y;
            this.hx = pt.x; this.hy = pt.y;
            const spd = 0.14 + Math.random() * 0.28;
            const ang = Math.random() * Math.PI * 2;
            this.vx = Math.cos(ang) * spd; this.vy = Math.sin(ang) * spd;
            this.r = 1.8 + Math.random() * 2;
            this.alpha = 0.5 + Math.random() * 0.5;
        }
        update() {
            const mdx = mouse.x - this.x, mdy = mouse.y - this.y, md = Math.hypot(mdx, mdy);
            if (md < MPULL && md > 0) {
                const f = (1 - md / MPULL) * 0.055;
                this.vx += mdx / md * f;
                this.vy += mdy / md * f;
            }

            const tdx = this.x - ZONE.cx, tdy = this.y - ZONE.cy;
            const nx = tdx / ZONE.rx, ny = tdy / ZONE.ry, ed = Math.hypot(nx, ny);
            if (ed < 1.1 && window.scrollY < H) {
                const s = (1.1 - ed) * 0.13, l = Math.hypot(tdx, tdy) || 1;
                this.vx += tdx / l * s; this.vy += tdy / l * s;
            }

            this.vx += (this.hx - this.x) * 0.0005; this.vy += (this.hy - this.y) * 0.0005;

            for (let i = 0; i < nodes.length; i++) {
                const o = nodes[i]; if (o === this) continue;
                const rx = this.x - o.x, ry = this.y - o.y, rd = Math.hypot(rx, ry);
                if (rd < MINDIST && rd > 0) {
                    const p = (MINDIST - rd) / MINDIST * 0.032;
                    this.vx += rx / rd * p;
                    this.vy += ry / rd * p;
                }
            }

            this.vx *= 0.974; this.vy *= 0.974;
            const spd = Math.hypot(this.vx, this.vy);
            if (spd < 0.08) { this.vx += (Math.random() - .5) * .07; this.vy += (Math.random() - .5) * .07; }
            if (spd > 1.0) { this.vx *= 1 / spd; this.vy *= 1 / spd; }
            this.x += this.vx; this.y += this.vy;

            const p = 14;
            if (this.x < p) this.vx += 0.14; if (this.x > W - p) this.vx -= 0.14;
            if (this.y < p) this.vy += 0.14; if (this.y > H - p) this.vy -= 0.14;
        }
        draw() {
            const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5);
            g.addColorStop(0, `rgba(79,142,247,${this.alpha * 0.18})`);
            g.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150,200,255,${this.alpha})`; ctx.fill();
        }
    }

    function init() {
        W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight;
        nodes.length = 0;
        buildGrid().forEach(pt => nodes.push(new Node(pt)));
    }

    function drawFrame() {
        ctx.fillStyle = canvasBgColor; ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < LINK) {
                    const al = (1 - d / LINK) * 0.52;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(60,120,240,${al})`; ctx.lineWidth = 0.7; ctx.stroke();
                }
            }
            const md2 = Math.hypot(a.x - mouse.x, a.y - mouse.y);
            if (md2 < MPULL) {
                const al = (1 - md2 / MPULL) * 0.78;
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(126,184,255,${al})`; ctx.lineWidth = 0.9; ctx.stroke();
            }
        }

        nodes.forEach(n => { n.update(); n.draw(); });

        if (mouse.x > 0 && mouse.x < W && mouse.y > 0 && mouse.y < H) {
            const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
            mg.addColorStop(0, 'rgba(79,142,247,0.18)'); mg.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2); ctx.fillStyle = mg; ctx.fill();
            ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(220,235,255,0.95)'; ctx.fill();
        }

        const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.88);
        vig.addColorStop(0, 'transparent'); vig.addColorStop(1, 'rgba(8,18,38,0.58)');
        ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);

        requestAnimationFrame(drawFrame);
    }

    // ── Mouse Cursor Tracker ─────────────────────────────
    const cur = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX; mouse.y = e.clientY;
        if (cur) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }
        if (ring) { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }
    });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', init);

    init();
    ctx.fillStyle = '#0d1f3c'; ctx.fillRect(0, 0, W, H);
    drawFrame();
}

// ── Multi-Section Scroll & Hover Reveal Logic ────────────────
const timelineItems = document.querySelectorAll("#timeline .item");
const line = document.getElementById("line");
const timelineSection = document.getElementById("timeline");
const heroContainer = document.getElementById("hero-container");
const navBar = document.getElementById("nav");
const navTriggerZone = document.getElementById("nav-trigger-zone");

let lastScrollY = window.scrollY;

// HOVER DETECTOR TO RE-APPEAR NAVIGATION AT THE TOP EDGE
if (navTriggerZone && navBar) {
    navTriggerZone.addEventListener("mouseenter", () => {
        navBar.classList.add("nav-hover-reveal");
    });
    navBar.addEventListener("mouseleave", () => {
        navBar.classList.remove("nav-hover-reveal");
    });
}

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Remove hover force class when scrolling begins to avoid sticky locks
    if (navBar) {
        navBar.classList.remove("nav-hover-reveal");

        // 1. SMART AUTO-HIDE NAV CORE
        if (scrollY > lastScrollY && scrollY > 100) {
            navBar.classList.add("nav-hidden");
        } else {
            navBar.classList.remove("nav-hidden");
        }
    }
    lastScrollY = scrollY;

    // 2. HERO BLOCK PARALLAX & OPACITY FADE
    if (heroContainer) {
        if (scrollY < viewportHeight * 0.4) {
            let opacityVal = 1 - (scrollY / (viewportHeight * 0.3));
            heroContainer.style.opacity = Math.max(0, opacityVal);
            heroContainer.style.transform = `translateY(${-scrollY * 0.2}px)`;
            heroContainer.style.pointerEvents = opacityVal <= 0 ? "none" : "all";
        } else {
            heroContainer.style.opacity = 0;
            heroContainer.style.pointerEvents = "none";
        }
    }

    // ── VERTICAL TIMELINE PROGRESS TRACKER & AUTO-EXPANSION ──
    if (timelineSection && line) {
        const rect = timelineSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        let progress = (window.innerHeight / 2 - rect.top) / (sectionHeight - window.innerHeight / 2);
        let finalPercent = Math.min(100, Math.max(0, progress * 100));
        line.style.height = finalPercent + "%";

        // Auto-expand steps on scroll threshold
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            // Expand card when it crosses 65% of viewport height
            const triggerPoint = window.innerHeight * 0.65;
            if (itemRect.top < triggerPoint) {
                item.classList.add("expanded");
            } else {
                // Collapse back if scrolled up, unless we are near the end of the timeline
                if (finalPercent < 95) {
                    item.classList.remove("expanded");
                }
            }
        });

        // Force expand all timeline steps if user has reached the end of the timeline
        if (finalPercent >= 95) {
            timelineItems.forEach(item => item.classList.add("expanded"));
        }
    }
});

// Scroll reveal timeline cards observer
const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

timelineItems.forEach(i => timelineObserver.observe(i));


// ── SECTION 3: DECK SCROLL LOGIC ─────────────────────────────
const section3Track = document.getElementById("capabilities");
const section3Cards = document.querySelectorAll(".transition-card");

let trackTop = 0;
let trackHeight = 0;

function updateTrackMetrics() {
    if (section3Track) {
        const rect = section3Track.getBoundingClientRect();
        trackTop = rect.top + window.scrollY;
        trackHeight = rect.height;
    }
}

// Initial calculation
updateTrackMetrics();

// Recalculate metrics on load and resize
window.addEventListener("load", () => {
    // Wait until loader finishes animations and layout shifts settle
    setTimeout(updateTrackMetrics, 2000);
});
window.addEventListener("resize", updateTrackMetrics);

let currentTheme = 'navy';

if (section3Track && section3Cards && section3Cards.length > 0) {
    window.addEventListener("scroll", () => {
        const viewportHeight = window.innerHeight;
        const totalScrollableDistance = trackHeight - viewportHeight;
        const currentRelativeScroll = window.scrollY - trackTop;

        if (currentRelativeScroll >= 0 && currentRelativeScroll <= totalScrollableDistance) {
            // Smoothly shift to charcoal black theme
            if (currentTheme !== 'charcoal') {
                currentTheme = 'charcoal';
                document.body.style.backgroundColor = '#0c0d10';
                if (window.setCanvasBgColor) window.setCanvasBgColor('rgba(12, 13, 16, 0.20)');
            }

            // Determine progress fraction (0 to 1)
            const globalProgress = currentRelativeScroll / totalScrollableDistance;

            const totalCards = section3Cards.length;
            // Distribute total scroll room evenly among cards
            const activeSegment = 1 / totalCards;

            section3Cards.forEach((card, index) => {
                const cardStart = index * activeSegment;
                const cardEnd = (index + 1) * activeSegment;

                // Inside its dedicated scroll window segment
                if (globalProgress >= cardStart && globalProgress < cardEnd) {
                    // Activate current card
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0px) scale(1)";
                    card.style.zIndex = "100";
                    card.style.pointerEvents = "all"; // Enable pointer events to support hover effects/glow on active card
                }
                // Card has been scrolled past (Stack it cleanly behind or slide up)
                else if (globalProgress >= cardEnd) {
                    const positionFromCurrent = totalCards - 1 - index;
                    const offsetY = -positionFromCurrent * 12; // Stack shifting
                    const scaleVal = 1 - (positionFromCurrent * 0.025);

                    card.style.opacity = "1";
                    card.style.transform = `translateY(${offsetY}px) scale(${scaleVal})`;
                    card.style.zIndex = 10 + index;
                    card.style.pointerEvents = "none"; // Disable pointer events for inactive cards
                }
                // Card is still waiting below
                else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(180px) scale(0.9)";
                    card.style.zIndex = "1";
                    card.style.pointerEvents = "none"; // Disable pointer events for inactive cards
                }
            });
        } else if (currentRelativeScroll < 0) {
            // Smoothly shift back to navy theme
            if (currentTheme !== 'navy') {
                currentTheme = 'navy';
                document.body.style.backgroundColor = '#0d1f3c';
                if (window.setCanvasBgColor) window.setCanvasBgColor('rgba(13, 31, 60, 0.20)');
            }

            // Reset to default starting state if scrolled back up completely
            section3Cards.forEach((card, index) => {
                if (index === 0) {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0px) scale(1)";
                    card.style.zIndex = "100";
                    card.style.pointerEvents = "all";
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(180px) scale(0.9)";
                    card.style.zIndex = "1";
                    card.style.pointerEvents = "none";
                }
            });
        } else if (currentRelativeScroll > totalScrollableDistance) {
            // Smoothly shift to charcoal black theme
            if (currentTheme !== 'charcoal') {
                currentTheme = 'charcoal';
                document.body.style.backgroundColor = '#0c0d10';
                if (window.setCanvasBgColor) window.setCanvasBgColor('rgba(12, 13, 16, 0.20)');
            }

            // Scrolled past: lock all cards into their final stacked state
            const totalCards = section3Cards.length;
            section3Cards.forEach((card, index) => {
                const positionFromCurrent = totalCards - 1 - index;
                const offsetY = -positionFromCurrent * 12;
                const scaleVal = 1 - (positionFromCurrent * 0.025);

                card.style.opacity = "1";
                card.style.transform = `translateY(${offsetY}px) scale(${scaleVal})`;
                card.style.zIndex = 10 + index;
                card.style.pointerEvents = index === totalCards - 1 ? "all" : "none"; // Enable hover events only on the last card which is on top
            });
        }
    });
}

/* ─────────────────────────────────
   CV STAGE SCROLL & REVEAL ANIMATION
 ───────────────────────────────── */
const cvStage = document.getElementById('cv-stage');
const parchEl = document.getElementById('parchment');
const parchWrap = document.getElementById('parchment-wrap');
const cvContent = document.getElementById('cv-scroll-content');
const cvCenter = document.getElementById('cv-center');
const wordTop = document.getElementById('word-top');
const wordBot = document.getElementById('word-bot');
const stampEl = document.getElementById('stamp-overlay');
const stampContainer = document.getElementById('stamp-container');

let stampDone = false;
let stampTimeout = null, shakeTimeout = null;

function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }

function updateCvLayout() {
    if (!cvStage || !parchWrap) {
        console.warn("CV stage or parchment wrap elements missing from layout.");
        return;
    }
    const vh = window.innerHeight;
    const wrapH = parchWrap.offsetHeight;
    cvStage.style.height = (vh + wrapH) + 'px';
    console.log("CV Layout update:", { vh, wrapH, stageHeight: cvStage.style.height });
}

function onCvScroll() {
    if (!cvStage || !parchEl || !parchWrap || !cvContent || !cvCenter || !wordTop || !wordBot || !stampEl || !stampContainer) {
        console.warn("Some CV scroll elements are missing from the DOM:", {
            cvStage: !!cvStage,
            parchEl: !!parchEl,
            parchWrap: !!parchWrap,
            cvContent: !!cvContent,
            cvCenter: !!cvCenter,
            wordTop: !!wordTop,
            wordBot: !!wordBot,
            stampEl: !!stampEl,
            stampContainer: !!stampContainer
        });
        return;
    }

    const sy = window.scrollY;
    const stT = cvStage.offsetTop;
    const vh = window.innerHeight;

    // Relative scroll calculation to support being placed as the 4th section
    const relativeScroll = sy - stT;
    const raw = Math.max(0, Math.min(1, relativeScroll / vh));
    const e = ease(raw);

    // Occasional debugging logs during normal scroll, or active logs when close/inside the CV section
    if (Math.random() < 0.05 || (relativeScroll >= -100 && relativeScroll <= vh + 100)) {
        console.log("CV Scroll math:", { sy, stT, relativeScroll, raw, e, parchHeight: parchWrap.offsetHeight });
    }

    /* clip parchment from top to bottom */
    const clipBottom = (1 - e) * 100;
    if (e >= 1) {
        parchEl.style.clipPath = 'none';
    } else {
        parchEl.style.clipPath = `inset(0 0 ${clipBottom}% 0 round 2px)`;
    }

    /* translate parchment-wrap so it unrolls exactly from the middle of the center gap */
    let currentTranslate = 0;
    if (relativeScroll <= vh) {
        // Phase 1: Unrolling animation (starts centered, slides to top)
        const maxTranslate = vh / 2 - 25;
        currentTranslate = (1 - e) * maxTranslate;
    } else {
        // Phase 2: Natural scroll of the fully unrolled document and all future sections
        currentTranslate = -(relativeScroll - vh);
    }
    parchWrap.style.transform = `translateY(${currentTranslate}px)`;

    /* split CURRICULUM up, VITAE down */
    const split = e * 120;
    wordTop.style.transform = `translateY(-${split}px)`;
    wordBot.style.transform = `translateY(${split}px)`;

    /* fade centre text */
    const fade = Math.max(0, 1 - e * 1.9);
    cvCenter.style.opacity = fade;

    /* cv content fades in */
    cvContent.style.opacity = Math.max(0, Math.min(1, (e - .18) / .32));

    /* STAMP — fires exactly when the stamp container enters the viewport */
    const stampBox = stampContainer.getBoundingClientRect();
    if (e >= 0.99 && stampBox.top <= vh - 40) {
        if (!stampDone) {
            stampDone = true;
            if (stampTimeout) clearTimeout(stampTimeout);
            if (shakeTimeout) clearTimeout(shakeTimeout);
            stampTimeout = setTimeout(() => {
                stampEl.classList.add('stamp-hit');
                parchEl.classList.add('stamp-shake');
                shakeTimeout = setTimeout(() => parchEl.classList.remove('stamp-shake'), 420);
            }, 260);
        }
    } else if (stampBox.top > vh || e < 0.9) {
        if (stampDone) {
            stampDone = false;
            if (stampTimeout) clearTimeout(stampTimeout);
            if (shakeTimeout) clearTimeout(shakeTimeout);
            stampEl.classList.remove('stamp-hit');
            parchEl.classList.remove('stamp-shake');
        }
    }
}

// Event Listeners for CV
window.addEventListener('scroll', onCvScroll, { passive: true });
window.addEventListener('resize', () => {
    updateCvLayout();
    onCvScroll();
}, { passive: true });
window.addEventListener('load', () => {
    setTimeout(() => {
        updateCvLayout();
        onCvScroll();
    }, 2000);
});

// Use ResizeObserver to dynamically update stage bounds as fonts/images load
if (window.ResizeObserver && parchWrap) {
    const ro = new ResizeObserver(() => {
        updateCvLayout();
        onCvScroll();
    });
    ro.observe(parchWrap);
}

/* ──────────────────────────────────────────────────────────
   3D CARD TILT & GLOWING ORB INTERACTIVITY
   ────────────────────────────────────────────────────────── */
const afterCvSection = document.getElementById('after-cv');
const glassCard = document.querySelector('.glass-card.landscape-card');
const cardOrbEl = document.getElementById('card-orb');

if (afterCvSection && glassCard) {
    afterCvSection.addEventListener('mousemove', (e) => {
        const cardRect = glassCard.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        // Reduced tilt: max ±5° for subtle premium effect
        const angleX = Math.max(-5, Math.min(5, (e.clientY - cardCenterY) / 40));
        const angleY = Math.max(-5, Math.min(5, -(e.clientX - cardCenterX) / 40));

        glassCard.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;

        // Move DOM orb to cursor position relative to card
        if (cardOrbEl) {
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            cardOrbEl.style.left = x + 'px';
            cardOrbEl.style.top = y + 'px';
        }
    });

    afterCvSection.addEventListener('mouseleave', () => {
        glassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        if (cardOrbEl) {
            cardOrbEl.style.left = '50%';
            cardOrbEl.style.top = '50%';
        }
    });
}

/* ── FIELD ANIMATIONS ── */
const cardInputs = document.querySelectorAll('.card-field input');
cardInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'all 0.3s';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

/* ──────────────────────────────────────────────────────────
   SMOOTH NAVIGATION FOR STICKY/TRANSFORMED SECTIONS
   ────────────────────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (targetId === '#cv-stage') {
                if (cvStage) {
                    window.scrollTo({ top: cvStage.offsetTop, behavior: 'smooth' });
                }
            } else if (targetId === '#after-cv') {
                if (cvStage) {
                    // Contact form is at the bottom of the CV scroll path
                    const targetScroll = cvStage.offsetTop + cvStage.offsetHeight - window.innerHeight;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
            } else {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    window.scrollTo({ top: targetEl.offsetTop, behavior: 'smooth' });
                }
            }
        }
    });
});

/* ─── CUSTOM CURSOR FADE CONTROLS FOR INPUTS ─── */
document.addEventListener('mouseover', (e) => {
    const cur = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    if (!cur || !ring) return;

    const isInput = e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT' ||
        e.target.closest('.card-field');

    if (isInput) {
        cur.style.opacity = '0';
        ring.style.opacity = '0';
    } else {
        cur.style.opacity = '1';
        ring.style.opacity = '1';
    }
});

/* ─── EMAILJS CONTACT FORM CONFIGURATION ─── */
// Keys are injected from config.js (which is gitignored)
// See .env.example for setup instructions
const EMAILJS_SERVICE_ID = window._ENV?.EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = window._ENV?.EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = window._ENV?.EMAILJS_PUBLIC_KEY || '';

// Robust init
function tryInitEmailJS() {
    if (typeof emailjs !== 'undefined' && typeof emailjs.init === 'function') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
        return true;
    }
    return false;
}
if (!tryInitEmailJS()) {
    document.addEventListener('DOMContentLoaded', tryInitEmailJS);
}

/* ─── INTERACTIVE INQUIRY FORM SUBMISSION ─── */
const cardForm = document.querySelector('.card-form');
if (cardForm) {
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const projectInput = document.getElementById('contact-project');
        const submitBtn = cardForm.querySelector('.card-btn');

        if (!nameInput || !emailInput || !submitBtn) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const project = projectInput ? projectInput.value.trim() : '';

        if (!name || !email) {
            alert('Please provide your Name and Email so we can connect!');
            return;
        }

        tryInitEmailJS();

        const emailjsReady = typeof emailjs !== 'undefined' && typeof emailjs.send === 'function';

        // Variable names match ALL fields used across the EmailJS template
        const now = new Date();
        const templateParams = {
            name: name,
            email: email,
            title: project || 'General Inquiry',
            message: `Email: ${email}\nProject: ${project || 'Not specified'}`,
            time: now.toLocaleString('en-PK', { dateStyle: 'full', timeStyle: 'short' }),
        };

        const sendPromise = emailjsReady
            ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
            : Promise.reject(new Error('EmailJS not loaded'));

        submitBtn.disabled = true;
        submitBtn.style.background = 'rgba(79, 142, 247, 0.4)';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.innerHTML = `
            <svg class="btn-spinner" viewBox="0 0 50 50" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 8px; animation: spinner-spin 1s linear infinite; display: inline-block;">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" style="stroke-dasharray: 1, 150; stroke-dashoffset: 0; animation: spinner-dash 1.5s ease-in-out infinite;"></circle>
            </svg>Sending Inquiry...
        `;

        sendPromise
            .then(() => {
                setTimeout(() => {
                    cardForm.style.transition = 'opacity 0.4s ease';
                    cardForm.style.opacity = '0';

                    setTimeout(() => {
                        cardForm.innerHTML = `
                            <div class="success-message" style="text-align: center; padding: 24px 0; animation: fadeUp 0.6s ease forwards; opacity: 0;">
                                <div style="font-size: 3rem; margin-bottom: 16px; color: var(--accent2); text-shadow: 0 0 25px rgba(126,184,255,0.4)">✓</div>
                                <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 8px; font-family: 'Montserrat', sans-serif;">Inquiry Received!</h3>
                                <p style="color: var(--muted); font-size: 0.88rem; line-height: 1.6; max-width: 380px; margin: 0 auto; font-family: 'Montserrat', sans-serif;">
                                    Thank you for reaching out, <strong>${name}</strong>! I'll follow up with you at <strong>${email}</strong> as soon as possible.
                                </p>
                                <button class="card-btn card-btn-primary" onclick="window.location.reload()" style="margin-top: 24px; max-width: 200px; font-size: 0.72rem; padding: 10px 20px;">Send Another Message</button>
                            </div>
                        `;
                        const msg = cardForm.querySelector('.success-message');
                        if (msg) msg.style.opacity = '1';
                        cardForm.style.opacity = '1';
                    }, 400);
                }, 600);
            })
            .catch((err) => {
                console.error('[EmailJS] Error:', err);
                const errMsg = err && err.text ? err.text : (err && err.message ? err.message : JSON.stringify(err));
                alert('Failed to send message: ' + errMsg);
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.cursor = '';
                submitBtn.innerHTML = 'Send Inquiry';
            });
    });
}

/* ──────────────────────────────────────────────────────────
   IRIS WHEEL SECTION - Interactive Skill Wheel
   ────────────────────────────────────────────────────────── */

// Initialize canvas for iris wheel section with neural network
(function initIrisWheelCanvas() {
    const canvasWheel = document.getElementById('canvas-wheel');
    if (!canvasWheel) return;

    const ctx = canvasWheel.getContext('2d');
    let W, H;
    const mouse = { x: -9999, y: -9999 };
    const nodes = [];
    const COUNT = 60;
    const LINK = 100;
    const MPULL = 120;
    const MINDIST = 25;

    function buildGrid() {
        const cols = Math.round(Math.sqrt(COUNT * (W / H)));
        const rows = Math.ceil(COUNT / cols);
        const cw = W / cols, ch = H / rows;
        const pts = [];
        for (let r = 0; r < rows && pts.length < COUNT; r++) {
            for (let c = 0; c < cols && pts.length < COUNT; c++) {
                const x = (c + 0.15 + Math.random() * 0.7) * cw;
                const y = (r + 0.15 + Math.random() * 0.7) * ch;
                pts.push({ x, y });
            }
        }
        return pts;
    }

    class Node {
        constructor(pt) {
            this.x = pt.x;
            this.y = pt.y;
            this.hx = pt.x;
            this.hy = pt.y;
            const spd = 0.08 + Math.random() * 0.16;
            const ang = Math.random() * Math.PI * 2;
            this.vx = Math.cos(ang) * spd;
            this.vy = Math.sin(ang) * spd;
            this.r = 1;
            this.alpha = 0.4 + Math.random() * 0.4;
        }

        update() {
            const mdx = mouse.x - this.x, mdy = mouse.y - this.y, md = Math.hypot(mdx, mdy);
            if (md < MPULL && md > 0) {
                const f = (1 - md / MPULL) * 0.04;
                this.vx += mdx / md * f;
                this.vy += mdy / md * f;
            }

            this.vx += (this.hx - this.x) * 0.0003;
            this.vy += (this.hy - this.y) * 0.0003;

            for (let i = 0; i < nodes.length; i++) {
                const o = nodes[i];
                if (o === this) continue;
                const rx = this.x - o.x, ry = this.y - o.y, rd = Math.hypot(rx, ry);
                if (rd < MINDIST && rd > 0) {
                    const p = (MINDIST - rd) / MINDIST * 0.02;
                    this.vx += rx / rd * p;
                    this.vy += ry / rd * p;
                }
            }

            this.vx *= 0.98;
            this.vy *= 0.98;
            const spd = Math.hypot(this.vx, this.vy);
            if (spd < 0.05) {
                this.vx += (Math.random() - 0.5) * 0.04;
                this.vy += (Math.random() - 0.5) * 0.04;
            }
            if (spd > 0.8) {
                this.vx *= 1 / spd;
                this.vy *= 1 / spd;
            }
            this.x += this.vx;
            this.y += this.vy;

            const p = 12;
            if (this.x < p) this.vx += 0.1;
            if (this.x > W - p) this.vx -= 0.1;
            if (this.y < p) this.vy += 0.1;
            if (this.y > H - p) this.vy -= 0.1;
        }
    }

    function resize() {
        W = canvasWheel.width = canvasWheel.offsetWidth;
        H = canvasWheel.height = canvasWheel.offsetHeight;
        nodes.length = 0;
        const pts = buildGrid();
        pts.forEach(pt => nodes.push(new Node(pt)));
    }

    function draw() {
        ctx.fillStyle = 'rgba(8, 13, 32, 0.1)';
        ctx.fillRect(0, 0, W, H);

        nodes.forEach(n => n.update());

        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const o = nodes[j];
                const d = Math.hypot(n.x - o.x, n.y - o.y);
                if (d < LINK) {
                    ctx.strokeStyle = `rgba(79, 142, 247, ${0.15 * (1 - d / LINK)})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(o.x, o.y);
                    ctx.stroke();
                }
            }
        }

        nodes.forEach(n => {
            ctx.fillStyle = `rgba(79, 142, 247, ${n.alpha})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);

    setTimeout(resize, 100);
    draw();
})();

// Iris wheel interaction
(function initIrisWheel() {
    const icons = {
        HTML: `<path d="M-9-11l2 22 7 2 7-2 2-22zm1.5 3.5h14l-.5 5.5h-6.5v3h6l-.8 8.5-5.7 1.6-5.7-1.6-.4-4.5h3.5l.2 2.3 2.4.6 2.4-.6.3-3.3h-9.7z" fill="white"/>`,
        CSS: `<path d="M-10-11l2 22 8 2 8-2 2-22zm2 3.5h13l-.5 5h-5.5v2.5h5l-.6 7-4.4 1.3-4.4-1.3-.3-3.5h3l.1 1.8 1.6.4 1.6-.4.2-2.8h-8.5z" fill="white"/>`,
        Java: `<path d="M-3 8c-4 1.5-7 1.2-5.5.2 4-2.5 9-7.5 6-11-3.5-4 1 5-6 8.8C-13 8.8-11 11-3 8zm5-14c2.5 4-1 7.5-8 10.5-5.5 2-1.5 5 0 5C-9 6-17 4-12.5 1-8 .5 6.5-5.5 2-6z" fill="white"/><path d="M-6 13c4 .5 11-.3 11-2.3 0-1-2-2-2-2s.5 1.5-9.5 2c-8.5.5-3 2.5.5 2.3z" fill="white"/>`,
        DOM: `<rect x="-11" y="-11" width="8" height="6" rx="1" fill="white"/><rect x="3" y="-11" width="8" height="6" rx="1" fill="white"/><rect x="-5" y="5" width="10" height="6" rx="1" fill="white"/><line x1="-7" y1="-5" x2="0" y2="5" stroke="white" stroke-width="1.5"/><line x1="7" y1="-5" x2="0" y2="5" stroke="white" stroke-width="1.5"/>`,
        JS: `<rect x="-11" y="-11" width="22" height="22" rx="2" fill="none" stroke="white" stroke-width="1.5"/><path d="M-5 4V-4h3v7.5c0 3-4.5 3.5-4.5 1" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2-4h5l-2.5 4 2.5 4H2" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
        React: `<circle cx="0" cy="0" r="2.5" fill="white"/><ellipse cx="0" cy="0" rx="10" ry="4" fill="none" stroke="white" stroke-width="1.4"/><ellipse cx="0" cy="0" rx="10" ry="4" fill="none" stroke="white" stroke-width="1.4" transform="rotate(60)"/><ellipse cx="0" cy="0" rx="10" ry="4" fill="none" stroke="white" stroke-width="1.4" transform="rotate(120)"/>`,
        Figma: `<rect x="-7" y="-11" width="8" height="8" rx="2" fill="white" opacity=".9"/><rect x="1" y="-11" width="8" height="8" rx="4" fill="white" opacity=".7"/><rect x="-7" y="-3" width="8" height="8" rx="2" fill="white" opacity=".8"/><rect x="-7" y="5" width="8" height="8" rx="2" fill="white" opacity=".6"/><circle cx="5" cy="1" r="4" fill="white" opacity=".5"/>`,
        GSAP: `<path d="M-10 0 Q-5-10 0-5 Q5-10 10 0 Q5 10 0 5 Q-5 10-10 0z" fill="none" stroke="white" stroke-width="1.5"/><circle cx="0" cy="0" r="2.5" fill="white"/><path d="M0 0L8-4" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
        Express: `<text x="0" y="4" font-family="Montserrat,sans-serif" font-weight="900" font-size="9" fill="white" text-anchor="middle">EX</text>`,
        Node: `<polygon points="0,-11 9.5,5.5 -9.5,5.5" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><circle cx="0" cy="-4" r="2" fill="white"/><circle cx="-6" cy="4" r="2" fill="white"/><circle cx="6" cy="4" r="2" fill="white"/>`,
        MongoDB: `<path d="M0-11c0 0-7 8-7 14a7 7 0 0014 0C7-3 0-11 0-11z" fill="none" stroke="white" stroke-width="1.5"/><line x1="0" y1="-2" x2="0" y2="12" stroke="white" stroke-width="1.5"/>`,
        Tailwind: `<path d="M-10-2c1.5-6 5-9 10-8 5 1 6 5 4 8-1.5 6-5 9-10 8-5-1-6-5-4-8z" fill="none" stroke="white" stroke-width="1.5"/><path d="M0-2c1.5-6 5-9 10-8" fill="none" stroke="white" stroke-width="1.5"/>`,
    };

    const skills = [
        { label: "HTML", icon: icons.HTML, desc: "Semantic markup, accessibility, SEO & modern HTML5 APIs", tag: "MARKUP", colors: ["#4f8ef7", "#3a72d4"] },
        { label: "CSS", icon: icons.CSS, desc: "Grid, Flexbox, custom properties, animations & responsive design", tag: "STYLING", colors: ["#ffffff", "#d0d8f0"] },
        { label: "Java", icon: icons.Java, desc: "OOP principles, data structures, algorithms & backend logic", tag: "LANGUAGE", colors: ["#4f8ef7", "#3a72d4"] },
        { label: "DOM", icon: icons.DOM, desc: "Dynamic manipulation, events & browser APIs", tag: "BROWSER", colors: ["#ffffff", "#d0d8f0"] },
        { label: "JS", icon: icons.JS, desc: "ES6+, async/await, closures, functional patterns & modules", tag: "LANGUAGE", colors: ["#4f8ef7", "#3a72d4"] },
        { label: "React", icon: icons.React, desc: "Hooks, context, custom hooks, SPA & Next.js SSR", tag: "FRONTEND", colors: ["#ffffff", "#d0d8f0"] },
        { label: "Figma", icon: icons.Figma, desc: "UI/UX design, prototyping, component libraries & systems", tag: "DESIGN", colors: ["#4f8ef7", "#3a72d4"] },
        { label: "GSAP", icon: icons.GSAP, desc: "Timelines, ScrollTrigger, morphing & high-perf animations", tag: "ANIMATION", colors: ["#ffffff", "#d0d8f0"] },
        { label: "Express", icon: icons.Express, desc: "Routing, middleware, REST APIs, auth & error handling", tag: "BACKEND", colors: ["#4f8ef7", "#3a72d4"] },
        { label: "Node", icon: icons.Node, desc: "Server runtime, streams, file system & npm ecosystem", tag: "RUNTIME", colors: ["#ffffff", "#d0d8f0"] },
        { label: "MongoDB", icon: icons.MongoDB, desc: "Document modeling, Atlas, aggregation pipelines & Mongoose", tag: "DATABASE", colors: ["#4f8ef7", "#3a72d4"] },
        { label: "Tailwind", icon: icons.Tailwind, desc: "Utility-first CSS, responsive variants, dark mode & themes", tag: "STYLING", colors: ["#ffffff", "#d0d8f0"] },
    ];

    const N = skills.length, CX = 260, CY = 260, INNER = 96, OUTER = 228, ARC_R = 310, ARC_LEN = 487;
    const petalsG = document.getElementById('iris-petals-g');
    const arcFg = document.getElementById('iris-arc-fg');
    const thumb = document.getElementById('iris-arc-thumb');
    const lsvg = document.querySelector('.iris-lens-svg');
    const dragHint = document.getElementById('iris-drag-hint');
    const hD = document.getElementById('iris-hub-default');
    const hH = document.getElementById('iris-hub-hover');
    const hTag = document.getElementById('iris-hub-tag');
    const hName = document.getElementById('iris-hub-name');
    const hD1 = document.getElementById('iris-hub-d1');
    const hD2 = document.getElementById('iris-hub-d2');
    const hPill = document.getElementById('iris-hub-pill');

    if (!petalsG || !arcFg || !thumb || !lsvg) return;

    let visible = 0, dragging = false, petalPaths = [], petalIcons = [];
    let spinRaf, spinning = false, rot = 0;

    function wd(desc, mc) {
        const ws = desc.split(' ');
        let l1 = '', l2 = '';
        for (const w of ws) {
            if ((l1 + ' ' + w).trim().length <= mc) l1 = (l1 + ' ' + w).trim();
            else l2 = (l2 + ' ' + w).trim();
        }
        return [l1, l2];
    }

    skills.forEach((sk, i) => {
        const sa = 360 / N, deg = -90 + i * sa, nDeg = deg + sa, sw = sa * 0.42;
        function ptR(r, a) {
            const rad = a * Math.PI / 180;
            return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
        }
        const [ix1, iy1] = ptR(INNER, deg), [ix2, iy2] = ptR(INNER, nDeg), [ox1, oy1] = ptR(OUTER, deg + sw), [ox2, oy2] = ptR(OUTER, nDeg + sw);
        const la = sa > 180 ? 1 : 0;
        const pathD = [`M${ix1},${iy1}`, `A${INNER},${INNER} 0 ${la},1 ${ix2},${iy2}`, `L${ox2},${oy2}`, `A${OUTER},${OUTER} 0 ${la},0 ${ox1},${oy1}`, `Z`].join(' ');
        const gid = 'iris-bg' + i, defs = lsvg.querySelector('defs');
        const lg = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        lg.setAttribute("id", gid);
        const ga = (deg + sa / 2 + 90) * Math.PI / 180;
        lg.setAttribute("x1", "0.5");
        lg.setAttribute("y1", "0.5");
        lg.setAttribute("x2", (Math.cos(ga) / 2 + 0.5).toString());
        lg.setAttribute("y2", (Math.sin(ga) / 2 + 0.5).toString());
        lg.setAttribute("gradientUnits", "objectBoundingBox");
        const s1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        s1.setAttribute("offset", "0%");
        s1.setAttribute("stop-color", sk.colors[0]);
        const s2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        s2.setAttribute("offset", "100%");
        s2.setAttribute("stop-color", sk.colors[1]);
        lg.appendChild(s1);
        lg.appendChild(s2);
        defs.appendChild(lg);
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathD);
        path.setAttribute("fill", `url(#${gid})`);
        path.setAttribute("stroke", "rgba(0,0,0,0.35)");
        path.setAttribute("stroke-width", "1.5");
        path.classList.add("blade-path");
        path.style.visibility = "hidden";
        const ma = deg + sa / 2 + sw * 0.5, ir = INNER + (OUTER - INNER) * 0.52;
        const ix = CX + ir * Math.cos(ma * Math.PI / 180), iy = CY + ir * Math.sin(ma * Math.PI / 180);
        const ic = i % 2 === 0 ? "white" : "#1e294f";
        const iconG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        iconG.setAttribute("transform", `translate(${ix},${iy})`);
        iconG.innerHTML = sk.icon.replace(/fill="white"/g, `fill="${ic}"`).replace(/stroke="white"/g, `stroke="${ic}"`);
        iconG.style.opacity = "0";
        iconG.style.transition = "opacity 0.3s";
        iconG.style.pointerEvents = "none";
        iconG.dataset.ix = ix;
        iconG.dataset.iy = iy;
        g.appendChild(path);
        g.appendChild(iconG);
        petalsG.appendChild(g);
        petalPaths.push(path);
        petalIcons.push({ iconG });

        path.addEventListener("mouseenter", () => {
            if (i >= visible) return;
            path.style.filter = "brightness(1.18) drop-shadow(0 0 8px rgba(255,255,255,0.2))";
            dragHint.classList.add('hidden');
            hTag.textContent = sk.tag;
            hName.textContent = sk.label;
            const [d1, d2] = wd(sk.desc, 28);
            hD1.textContent = d1;
            hD2.textContent = d2;
            const tw = sk.tag.length * 4.5 + 14;
            hPill.setAttribute('x', 260 - tw / 2);
            hPill.setAttribute('width', tw);
            hD.style.opacity = '0';
            hH.style.opacity = '1';
        });

        path.addEventListener("mouseleave", () => {
            path.style.filter = "";
            dragHint.classList.remove('hidden');
            hD.style.opacity = '1';
            hH.style.opacity = '0';
        });
    });

    function arcPt(t) {
        const a = -(Math.PI / 2) * t;
        return { x: CX + ARC_R * Math.cos(a), y: CY + ARC_R * Math.sin(a) };
    }

    function setThumb(t) {
        const p = arcPt(t);
        thumb.setAttribute("cx", p.x);
        thumb.setAttribute("cy", p.y);
        document.querySelectorAll('.iris-rp').forEach(c => {
            c.setAttribute("cx", p.x);
            c.setAttribute("cy", p.y);
        });
        arcFg.setAttribute("stroke-dashoffset", ARC_LEN * (1 - t));
    }

    function reveal(count) {
        visible = Math.max(0, Math.min(N, count));
        petalPaths.forEach((p, i) => {
            const s = i < visible;
            p.style.visibility = s ? "visible" : "hidden";
            petalIcons[i].iconG.style.opacity = s ? "1" : "0";
        });
        if (visible === N) startSpin();
        else stopSpin();
    }

    function tFromPointer(e) {
        const rect = lsvg.getBoundingClientRect(), sc = 520 / rect.width;
        const mx = (e.clientX - rect.left) * sc, my = (e.clientY - rect.top) * sc;
        let best = 0, bestD = Infinity;
        for (let t = 0; t <= 1; t += 0.004) {
            const p = arcPt(t);
            const d = (p.x - mx) ** 2 + (p.y - my) ** 2;
            if (d < bestD) { bestD = d; best = t; }
        }
        return best;
    }

    thumb.addEventListener("pointerdown", e => {
        dragging = true;
        thumb.classList.add("dragging");
        lsvg.setPointerCapture(e.pointerId);
        e.stopPropagation();
    });

    lsvg.addEventListener("pointermove", e => {
        if (!dragging) return;
        const t = tFromPointer(e);
        setThumb(t);
        reveal(Math.round(t * N));
    });

    lsvg.addEventListener("pointerup", () => {
        dragging = false;
        thumb.classList.remove("dragging");
    });

    // Track scroll for wheel responsiveness
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;

        const irisSection = document.getElementById('iris-wheel');
        if (irisSection) {
            const sectionRect = irisSection.getBoundingClientRect();
            const visibleHeight = Math.min(sectionRect.bottom, window.innerHeight) - Math.max(sectionRect.top, 0);
            const visibleRatio = visibleHeight / sectionRect.height;
            const inView = visibleRatio >= 0.3 && sectionRect.top < window.innerHeight * 0.85 && sectionRect.bottom > window.innerHeight * 0.15;

            if (inView && Math.abs(deltaY) > 10) {
                const nv = Math.round(Math.max(0, Math.min(N, visible + (deltaY > 0 ? 1 : -1))));
                setThumb(nv / N);
                reveal(nv);
            }
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    lsvg.addEventListener("wheel", e => {
        e.preventDefault();
        const nv = visible + (e.deltaY > 0 ? 1 : -1);
        setThumb(Math.max(0, Math.min(1, nv / N)));
        reveal(nv);
    }, { passive: false });

    function startSpin() {
        if (spinning) return;
        spinning = true;
        (function step() {
            rot += 0.022;
            petalsG.style.transform = `rotate(${rot}deg)`;
            petalIcons.forEach(({ iconG }) => {
                const x = parseFloat(iconG.dataset.ix), y = parseFloat(iconG.dataset.iy);
                iconG.setAttribute("transform", `translate(${x},${y}) rotate(${-rot},0,0)`);
            });
            spinRaf = requestAnimationFrame(step);
        })();
    }

    function stopSpin() {
        if (!spinning) return;
        spinning = false;
        cancelAnimationFrame(spinRaf);
    }

    setThumb(0);
    reveal(0);
})();