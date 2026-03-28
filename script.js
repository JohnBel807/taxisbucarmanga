/**
 * ============================================================
 * TAXI BUCARAMANGA — script.js
 * Módulos: Slider | Nav | Chat Widget | Footer Year
 * Estándar: ES6+ · Vanilla JS · Sin dependencias
 * ============================================================
 */

'use strict';

/* ============================================================
   1. HERO SLIDER
   ============================================================ */
const SliderModule = (() => {
  const slides     = document.querySelectorAll('.slide');
  const dots       = document.querySelectorAll('.dot');
  const btnPrev    = document.querySelector('.slider-btn--prev');
  const btnNext    = document.querySelector('.slider-btn--next');

  if (!slides.length) return;

  let current  = 0;
  let timer    = null;
  const INTERVAL = 5500; // ms entre slides automáticos

  /**
   * Activa el slide indicado y actualiza los dots.
   * @param {number} idx - Índice del slide a mostrar
   */
  function goTo(idx) {
    // Normalizar índice (circular)
    const next = (idx + slides.length) % slides.length;

    // Desactivar slide actual
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    // Activar nuevo slide
    current = next;
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  /** Inicia el ciclo automático */
  function startAuto() {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  /** Detiene y reinicia el ciclo (al interactuar) */
  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  // Eventos de los botones prev/next
  btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Eventos de los dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Pausa al hacer hover sobre el slider
  document.querySelector('.slider')?.addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.slider')?.addEventListener('mouseleave', startAuto);

  // Soporte de teclado (← →) cuando el slider tiene foco
  document.querySelector('.slider')?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  // Inicio
  startAuto();
})();


/* ============================================================
   2. HEADER — scroll class + mobile nav toggle
   ============================================================ */
const HeaderModule = (() => {
  const header    = document.querySelector('.site-header');
  const toggle    = document.querySelector('.nav-toggle');
  const nav       = document.querySelector('.main-nav');
  const navLinks  = nav?.querySelectorAll('a');

  if (!header) return;

  // Clase .scrolled para opacidad dinámica
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Toggle menú mobile
  toggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar al hacer clic en un enlace (mobile)
  navLinks?.forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Cerrar al hacer clic fuera (mobile)
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      nav?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   3. CHAT WIDGET
   ============================================================ */
const ChatModule = (() => {
  // Referencias al DOM
  const bubble    = document.getElementById('chatToggle');
  const window_   = document.getElementById('chatWindow');  // 'window' es reservado
  const closeBtn  = document.getElementById('chatCloseBtn');
  const messagesEl = document.getElementById('chatMessages');
  const input     = document.getElementById('chatInput');
  const sendBtn   = document.getElementById('chatSendBtn');
  const typingEl  = document.getElementById('chatTyping');
  const badge     = document.querySelector('.chat-badge');

  if (!bubble) return;

  // ------------------------------------------------------------------
  // 3.1 Función de envío al bot (Rasa / Telegram / webhook custom)
  // INSTRUCCIONES DE INTEGRACIÓN:
  //   - Reemplaza WEBHOOK_URL con tu endpoint real
  //   - Para Rasa: POST /webhooks/rest/webhook { "sender": id, "message": text }
  //   - Para n8n/Make: POST a tu webhook, adapta el body según tu flujo
  //   - Descomenta las líneas de `fetch` cuando conectes el backend
  // ------------------------------------------------------------------

  /**
   * Envía un mensaje al webhook del bot y retorna la respuesta.
   * @param {string} message - Texto del usuario
   * @returns {Promise<string>} - Texto de respuesta del bot
   */
  async function sendMessageToBot(message) {
    // ---- CONFIGURACIÓN (editar antes de producción) ----
    const WEBHOOK_URL = 'https://TU_SERVIDOR/webhooks/rest/webhook';
    const SESSION_ID  = 'user_' + (sessionStorage.getItem('chatId') || (() => {
      const id = Math.random().toString(36).slice(2);
      sessionStorage.setItem('chatId', id);
      return id;
    })());
    // ----------------------------------------------------

    /*
    // BLOQUE FETCH — descomenta para conectar con el backend real
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: SESSION_ID, message }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // Rasa devuelve un array de mensajes: [{ text: "..." }, ...]
      // Adapta este mapeo según la estructura de tu webhook
      const botText = Array.isArray(data)
        ? data.map(msg => msg.text || '').filter(Boolean).join('\n')
        : data.text || data.message || 'Recibido.';

      return botText;
    } catch (error) {
      console.error('[ChatBot] Error al conectar con el webhook:', error);
      return 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.';
    }
    */

    // ---- RESPUESTAS DE DEMOSTRACIÓN (reemplaza con el fetch real) ----
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const msg = message.toLowerCase();
    if (msg.includes('aeropuerto') || msg.includes('vuelo')) {
      return '✈️ Para traslados al aeropuerto Palonegro, confirmamos tu vuelo y ajustamos el horario de recogida. ¿Me das la hora y número de vuelo?';
    }
    if (msg.includes('precio') || msg.includes('tarifa') || msg.includes('costo') || msg.includes('cuánto')) {
      return '💰 Nuestras tarifas son fijas y sin recargos ocultos. Escríbenos por WhatsApp con origen y destino para enviarte la cotización exacta.';
    }
    if (msg.includes('nacional') || msg.includes('viaje largo') || msg.includes('bogotá') || msg.includes('medellín')) {
      return '🚗 Hacemos viajes puerta a puerta a cualquier ciudad del país. ¿Cuál es tu destino y fecha de viaje?';
    }
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
      return '¡Hola! 👋 Soy el asistente de Taxi Bucaramanga. Puedo ayudarte con: traslados al aeropuerto, servicio en el área metropolitana o viajes nacionales. ¿Qué necesitas?';
    }
    return '¡Gracias por escribirnos! Para atención personalizada y reservas, te recomendamos contactarnos por WhatsApp al 📲 +57 316 546 4931. ¿Hay algo más en lo que pueda ayudarte?';
    // ------------------------------------------------------------------
  }

  // ------------------------------------------------------------------
  // 3.2 Helpers de UI
  // ------------------------------------------------------------------

  /** Formatea la hora actual HH:MM */
  function getTime() {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Añade un mensaje al área de mensajes.
   * @param {string} text     - Contenido del mensaje
   * @param {'bot'|'user'} who - Origen del mensaje
   * @param {string[]} [quickReplies] - Botones de respuesta rápida (solo para bot)
   */
  function addMessage(text, who, quickReplies = []) {
    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg chat-msg--${who}`;
    msgEl.setAttribute('role', 'article');

    const bubble_ = document.createElement('p');
    bubble_.className = 'msg-bubble';
    bubble_.textContent = text;

    const time = document.createElement('span');
    time.className = 'msg-time';
    time.textContent = getTime();
    time.setAttribute('aria-label', `Enviado a las ${getTime()}`);

    msgEl.appendChild(bubble_);
    msgEl.appendChild(time);

    // Botones de respuesta rápida
    if (who === 'bot' && quickReplies.length) {
      const wrap = document.createElement('div');
      wrap.className = 'quick-replies';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', 'Respuestas rápidas');

      quickReplies.forEach(label => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          wrap.remove(); // quita los botones al usar uno
          handleSend(label);
        });
        wrap.appendChild(btn);
      });
      msgEl.appendChild(wrap);
    }

    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /** Muestra/oculta el indicador de escritura */
  function setTyping(show) {
    typingEl.hidden = !show;
    if (show) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ------------------------------------------------------------------
  // 3.3 Flujo principal
  // ------------------------------------------------------------------

  /**
   * Gestiona el envío de un mensaje: renderiza burbuja de usuario,
   * muestra typing, llama al bot y renderiza la respuesta.
   * @param {string} [text] - Texto a enviar (override del input)
   */
  async function handleSend(text) {
    const message = (text ?? input?.value ?? '').trim();
    if (!message) return;

    if (!text) input.value = '';     // solo limpia si vino del input
    sendBtn.disabled = true;

    addMessage(message, 'user');
    setTyping(true);

    const botReply = await sendMessageToBot(message);

    setTyping(false);
    addMessage(botReply, 'bot');
    sendBtn.disabled = false;
    input?.focus();
  }

  // Mensaje de bienvenida al abrir el chat (se muestra la primera vez)
  let welcomed = false;
  function showWelcome() {
    if (welcomed) return;
    welcomed = true;
    addMessage(
      '¡Hola! 👋 Soy el asistente de Taxi Bucaramanga. ¿En qué puedo ayudarte hoy?',
      'bot',
      ['Traslado aeropuerto', 'Área metropolitana', 'Viaje nacional', 'Tarifas']
    );
  }

  // ------------------------------------------------------------------
  // 3.4 Eventos del widget
  // ------------------------------------------------------------------

  /** Abre la ventana de chat */
  function openChat() {
    window_.hidden = false;
    bubble.setAttribute('aria-expanded', 'true');
    badge?.classList.add('hidden');
    showWelcome();
    input?.focus();
  }

  /** Cierra la ventana de chat */
  function closeChat() {
    window_.hidden = true;
    bubble.setAttribute('aria-expanded', 'false');
    bubble.focus();
  }

  bubble.addEventListener('click', () => {
    window_.hidden ? openChat() : closeChat();
  });

  closeBtn?.addEventListener('click', closeChat);

  // Enviar con el botón
  sendBtn?.addEventListener('click', () => handleSend());

  // Enviar con Enter (Shift+Enter para salto de línea si fuera textarea)
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Cerrar con Escape
  window_.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChat();
  });

})();


/* ============================================================
   4. FOOTER — año dinámico
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   5. INTERSECTION OBSERVER — animación de entrada suave
   (para secciones y tarjetas)
   ============================================================ */
const AnimModule = (() => {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.destino-card, .stat, .nosotros-text, .nosotros-image-wrap, .trust-item'
  );

  // Preparar estado inicial
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Pequeño delay escalonado para las tarjetas del grid
          const delay = entry.target.closest('.destinos-grid') ? i * 80 : 0;
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
})();