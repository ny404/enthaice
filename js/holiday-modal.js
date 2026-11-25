/* =========================================================
   Enthaice Thai Kitchen - Site-Wide ADA Holiday Modal
   ========================================================= */
(function () {
    // ---------------------------------------------------------
    // QUICK CONFIGURATION (Edit here for future holidays)
    // ---------------------------------------------------------
    const MODAL_CONFIG = {
        enabled: true, // Flip to false anytime to turn off site-wide
        storageKey: 'enthaice_thanksgiving_2026_last_seen',
        cooldownMinutes: 30, // Show again after 30 minutes (set to 0 while testing locally)
        openDelayMs: 500,
        expiresAfter: '2026-11-27T23:59:59-05:00', // Auto-retires after Friday, Nov 27 (EST)

        imageSrc: 'images/enthaice-popup-image.jpg',
        imageAlt: 'Warm, inviting dining room at Enthaice Thai Kitchen',
        kicker: 'Holiday Hours',
        title: 'Happy Thanksgiving!',
        message: 'Wishing you and your loved ones a warm and joyful holiday from all of us at Enthaice Thai Kitchen. Please note our special Thanksgiving hours:',
        hours: [
            { datetime: '2026-11-26', date: 'Thu, Nov 26, 2026', status: 'Closed for Thanksgiving Day' },
            { datetime: '2026-11-27', date: 'Fri, Nov 27, 2026', status: 'Opening at 4:00 PM' }
        ],
        ctaLabel: 'Reserve for Friday',
        ctaHref: '/reservation',
        dismissLabel: 'Continue to Site'
    };

    const COOLDOWN_MS = MODAL_CONFIG.cooldownMinutes * 60 * 1000;

    // Stop early if disabled, expired, or still within the 30-minute cooldown
    if (!MODAL_CONFIG.enabled) return;
    if (MODAL_CONFIG.expiresAfter && new Date() > new Date(MODAL_CONFIG.expiresAfter)) return;
    if (COOLDOWN_MS > 0) {
        try {
            const rawLastSeen = localStorage.getItem(MODAL_CONFIG.storageKey);
            if (rawLastSeen !== null) {
                const lastSeen = Number(rawLastSeen);
                if (Number.isFinite(lastSeen) && (Date.now() - lastSeen) < COOLDOWN_MS) {
                    return;
                }
            }
        } catch (e) {
            // Ignore storage restrictions in strict privacy modes
        }
    }

    function injectStyles() {
        if (document.getElementById('enthaice-holiday-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'enthaice-holiday-modal-styles';
        style.textContent = `
            .enthaice-modal-backdrop {
                position: fixed;
                inset: 0;
                background-color: rgba(10, 9, 8, 0.82);
                backdrop-filter: blur(6px);
                z-index: 4000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.35s ease, visibility 0.35s ease;
            }
            .enthaice-modal-backdrop.is-open {
                opacity: 1;
                visibility: visible;
            }
            .enthaice-modal-dialog {
                position: relative;
                width: 100%;
                max-width: 780px;
                max-height: 90vh;
                overflow-y: auto;
                background-color: var(--bg-card, #1c1916);
                border-radius: 6px;
                border: 1px solid rgba(220, 179, 69, 0.55);
                outline: 1px solid rgba(220, 179, 69, 0.15);
                outline-offset: -8px;
                box-shadow: 0 30px 70px rgba(0, 0, 0, 0.75);
                display: grid;
                grid-template-columns: 1fr 1.15fr;
                transform: translateY(18px) scale(0.98);
                transition: transform 0.35s ease;
            }
            .enthaice-modal-backdrop.is-open .enthaice-modal-dialog {
                transform: translateY(0) scale(1);
            }
            .enthaice-modal-flourish {
                position: absolute;
                width: 28px;
                height: 28px;
                pointer-events: none;
                z-index: 3;
            }
            .enthaice-modal-flourish svg {
                fill: var(--accent-gold, #dcb345);
                opacity: 0.65;
                width: 100%;
                height: 100%;
            }
            .enthaice-modal-flourish.top-left { top: 12px; left: 12px; }
            .enthaice-modal-flourish.top-right { top: 12px; right: 12px; transform: scaleX(-1); }
            .enthaice-modal-flourish.bottom-left { bottom: 12px; left: 12px; transform: scaleY(-1); }
            .enthaice-modal-flourish.bottom-right { bottom: 12px; right: 12px; transform: scale(-1, -1); }

            .enthaice-modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background-color: rgba(18, 16, 14, 0.88);
                border: 1px solid rgba(220, 179, 69, 0.5);
                color: var(--text-main, #f5f5f5);
                font-size: 1.5rem;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 4;
                transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
            }
            .enthaice-modal-close:hover {
                background-color: var(--accent-gold, #dcb345);
                color: #000;
                border-color: var(--accent-gold, #dcb345);
            }
            .enthaice-modal-close:focus-visible {
                outline: var(--focus-outline, 2px solid #dcb345);
                outline-offset: 3px;
            }

            .enthaice-modal-media {
                position: relative;
                min-height: 360px;
                overflow: hidden;
            }
            .enthaice-modal-media img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .enthaice-modal-body {
                padding: 48px 40px 44px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: left;
            }
            .enthaice-modal-kicker {
                color: var(--accent-gold, #dcb345);
                text-transform: uppercase;
                letter-spacing: 2px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-bottom: 12px;
                display: inline-block;
            }
            .enthaice-modal-body h2 {
                font-family: var(--font-heading, 'Lora', serif);
                font-size: 2rem;
                line-height: 1.25;
                margin-bottom: 16px;
                color: var(--text-main, #f5f5f5);
            }
            .enthaice-modal-body p {
                font-family: var(--font-body, 'Poppins', sans-serif);
                color: var(--text-muted, #a09d98);
                font-size: 0.96rem;
                line-height: 1.75;
                margin-bottom: 22px;
            }
            .enthaice-modal-hours {
                list-style: none;
                margin: 0 0 28px;
                padding: 16px 18px;
                background-color: rgba(18, 16, 14, 0.75);
                border: 1px solid rgba(220, 179, 69, 0.35);
                border-radius: 4px;
                text-align: left;
            }
            .enthaice-modal-hours li {
                display: flex;
                flex-direction: column;
                gap: 2px;
                padding: 10px 0;
                border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
            }
            .enthaice-modal-hours li:first-child { padding-top: 0; }
            .enthaice-modal-hours li:last-child { padding-bottom: 0; border-bottom: none; }
            .enthaice-holiday-date {
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-main, #f5f5f5);
            }
            .enthaice-holiday-status {
                font-size: 0.95rem;
                font-weight: 500;
                color: var(--accent-gold, #dcb345);
            }

            .enthaice-modal-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 14px;
            }
            .enthaice-modal-dismiss {
                background: none;
                border: none;
                color: var(--text-muted, #a09d98);
                font-family: var(--font-body, 'Poppins', sans-serif);
                font-size: 0.9rem;
                text-decoration: underline;
                text-underline-offset: 4px;
                cursor: pointer;
                padding: 10px 6px;
                transition: color 0.25s ease;
            }
            .enthaice-modal-dismiss:hover {
                color: var(--accent-gold, #dcb345);
            }

            @media (max-width: 720px) {
                .enthaice-modal-backdrop { padding: 16px; }
                .enthaice-modal-dialog {
                    grid-template-columns: 1fr;
                    max-width: 460px;
                    outline-offset: -6px;
                }
                .enthaice-modal-media {
                    min-height: 190px;
                    max-height: 220px;
                }
                .enthaice-modal-body {
                    padding: 28px 24px 32px;
                    text-align: center;
                }
                .enthaice-modal-body h2 { font-size: 1.65rem; }
                .enthaice-modal-actions {
                    flex-direction: column;
                    width: 100%;
                }
                .enthaice-modal-actions .btn-primary {
                    width: 100%;
                    text-align: center;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .enthaice-modal-backdrop,
                .enthaice-modal-dialog {
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function buildModal() {
        const flourishSvg = '<svg viewBox="0 0 100 100" focusable="false"><path d="M0,0 L100,0 C100,55.23 55.23,100 0,100 L0,0 Z"/></svg>';
        const hoursHtml = MODAL_CONFIG.hours
            .map(item => `
                <li>
                    <time datetime="${item.datetime}" class="enthaice-holiday-date">${item.date}</time>
                    <span class="enthaice-holiday-status">${item.status}</span>
                </li>
            `)
            .join('');

        const backdrop = document.createElement('div');
        backdrop.className = 'enthaice-modal-backdrop';
        backdrop.id = 'entryModalBackdrop';
        backdrop.hidden = true;

        backdrop.innerHTML = `
            <div
                class="enthaice-modal-dialog"
                id="entryModalDialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="entryModalTitle"
                aria-describedby="entryModalDesc"
                tabindex="-1"
            >
                <div class="enthaice-modal-flourish top-left" aria-hidden="true">${flourishSvg}</div>
                <div class="enthaice-modal-flourish top-right" aria-hidden="true">${flourishSvg}</div>
                <div class="enthaice-modal-flourish bottom-left" aria-hidden="true">${flourishSvg}</div>
                <div class="enthaice-modal-flourish bottom-right" aria-hidden="true">${flourishSvg}</div>

                <button type="button" class="enthaice-modal-close" id="entryModalClose" aria-label="Close holiday hours announcement">
                    <span aria-hidden="true">&times;</span>
                </button>

                <div class="enthaice-modal-media">
                    <img src="${MODAL_CONFIG.imageSrc}" alt="${MODAL_CONFIG.imageAlt}">
                </div>

                <div class="enthaice-modal-body">
                    <span class="enthaice-modal-kicker">${MODAL_CONFIG.kicker}</span>
                    <h2 id="entryModalTitle">${MODAL_CONFIG.title}</h2>
                    <p id="entryModalDesc">${MODAL_CONFIG.message}</p>
                    <ul class="enthaice-modal-hours" aria-label="Thanksgiving holiday hours">
                        ${hoursHtml}
                    </ul>
                    <div class="enthaice-modal-actions">
                        <a href="${MODAL_CONFIG.ctaHref}" class="btn-primary" id="entryModalCta">${MODAL_CONFIG.ctaLabel}</a>
                        <button type="button" class="enthaice-modal-dismiss" id="entryModalDismiss">${MODAL_CONFIG.dismissLabel}</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        return backdrop;
    }

    function initModal() {
        injectStyles();
        const backdrop = buildModal();
        const dialog = document.getElementById('entryModalDialog');
        const closeBtn = document.getElementById('entryModalClose');
        const dismissBtn = document.getElementById('entryModalDismiss');
        const ctaLink = document.getElementById('entryModalCta');

        const backgroundRegions = [
            document.querySelector('.skip-link'),
            document.getElementById('site-header'),
            document.getElementById('mobile-menu'),
            document.getElementById('main-content'),
            document.querySelector('footer'),
            document.querySelector('.mobile-bottom-bar')
        ].filter(Boolean);

        let previouslyFocusedEl = null;

        function getFocusableElements() {
            return dialog.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
        }

        function markSeen() {
            if (COOLDOWN_MS <= 0) return;
            try {
                localStorage.setItem(MODAL_CONFIG.storageKey, String(Date.now()));
            } catch (e) {
                // Ignore storage errors
            }
        }

        function openModal() {
            previouslyFocusedEl = document.activeElement;
            backdrop.hidden = false;
            void backdrop.offsetWidth;
            backdrop.classList.add('is-open');

            document.body.style.overflow = 'hidden';
            backgroundRegions.forEach(el => {
                el.setAttribute('aria-hidden', 'true');
                el.inert = true;
            });

            // Save the current timestamp so the 30-minute timer starts across the whole site
            markSeen();
            closeBtn.focus();
            document.addEventListener('keydown', handleKeyDown);
        }

        function closeModal(restoreFocus = true) {
            backdrop.classList.remove('is-open');
            document.body.style.overflow = '';

            backgroundRegions.forEach(el => {
                el.removeAttribute('aria-hidden');
                el.inert = false;
            });

            document.removeEventListener('keydown', handleKeyDown);

            setTimeout(() => {
                backdrop.hidden = true;
                if (restoreFocus && previouslyFocusedEl && typeof previouslyFocusedEl.focus === 'function') {
                    previouslyFocusedEl.focus();
                }
            }, 350);
        }

        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
                return;
            }
            if (e.key === 'Tab') {
                const focusable = Array.from(getFocusableElements());
                if (!focusable.length) return;

                const firstEl = focusable[0];
                const lastEl = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }

        closeBtn.addEventListener('click', () => closeModal());
        dismissBtn.addEventListener('click', () => closeModal());

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });

        ctaLink.addEventListener('click', (e) => {
            const resForm = document.getElementById('reservationForm');
            if (resForm) {
                e.preventDefault();
                closeModal(false);
                setTimeout(() => {
                    resForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const nameInput = document.getElementById('resName');
                    if (nameInput) nameInput.focus({ preventScroll: true });
                }, 360);
            }
        });

        setTimeout(openModal, MODAL_CONFIG.openDelayMs);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModal);
    } else {
        initModal();
    }
})();