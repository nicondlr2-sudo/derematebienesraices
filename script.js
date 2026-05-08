// IDIOMA
function setLang(lang) {
  document.body.classList.toggle('lang-en', lang === 'en');
  document.getElementById('btn-es').classList.toggle('active', lang === 'es');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.documentElement.lang = lang;
  localStorage.setItem('dr-lang', lang);

  if (window.propertyOptionsReady) {
    updateSelectOptions(lang);
  }
}

// Detectar idioma guardado o del navegador
const savedLang = localStorage.getItem('dr-lang');
const browserLang = navigator.language.startsWith('en') ? 'en' : 'es';
setLang(savedLang || browserLang);

// FORMULARIO
const SELECT_OPTIONS = {
  tipo_inmueble: {
    es: {
      placeholder: 'Selecciona una opción',
      options: ['Apartamento', 'Casa', 'Finca', 'Local comercial', 'Lote', 'Otro']
    },
    en: {
      placeholder: 'Select an option',
      options: ['Apartment', 'House', 'Farm / Rural property', 'Commercial space', 'Land / Lot', 'Other']
    }
  },
  presupuesto: {
    es: {
      placeholder: 'Selecciona un rango',
      options: ['Menos de $100M', '$100M - $300M', '$300M - $600M', '$600M - $1.000M', 'Más de $1.000M']
    },
    en: {
      placeholder: 'Select a range',
      options: ['Under $100M COP', '$100M - $300M COP', '$300M - $600M COP', '$600M - $1.000M COP', 'Over $1.000M COP']
    }
  },
  liquidez: {
    es: {
      placeholder: 'Selecciona una opción',
      options: ['Sí, tengo capital líquido', 'Sí, pero necesito revisar la oportunidad', 'Parcialmente', 'No, necesito financiación', 'No estoy seguro']
    },
    en: {
      placeholder: 'Select an option',
      options: ['Yes, I have liquid capital', 'Yes, but I need to review the opportunity', 'Partially', 'No, I need financing', 'Not sure']
    }
  },
  tiempo_inversion: {
    es: {
      placeholder: 'Selecciona una opción',
      options: ['Inmediatamente si aparece una buena oportunidad', 'En 1 a 3 meses', 'En 3 a 6 meses', 'Estoy explorando']
    },
    en: {
      placeholder: 'Select an option',
      options: ['Immediately if there is a good opportunity', 'In 1 to 3 months', 'In 3 to 6 months', 'I am exploring']
    }
  }
};

function updateSelectOptions(lang) {
  Object.entries(SELECT_OPTIONS).forEach(([name, config]) => {
    const select = document.querySelector(`select[name="${name}"]`);
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = config[lang].placeholder;
    select.appendChild(placeholder);

    config[lang].options.forEach(label => {
      const option = document.createElement('option');
      option.value = label;
      option.textContent = label;
      select.appendChild(option);
    });

    if ([...select.options].some(option => option.value === currentValue)) {
      select.value = currentValue;
    }
  });
}

window.propertyOptionsReady = true;
updateSelectOptions(savedLang || browserLang);

async function submitForm(e) {
  e.preventDefault();

  const form = document.getElementById('contactForm');
  const data = new FormData(form);
  const btn = e.submitter || form.querySelector('button[type="submit"]:not(.en):not(.es), body.lang-en button[type="submit"].en, body:not(.lang-en) button[type="submit"].es') || form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  const nombre = (data.get('nombre') || '').trim();
  const whatsapp = (data.get('whatsapp') || '').trim();
  const ciudad = (data.get('ciudad') || '').trim();
  const presupuesto = data.get('presupuesto') || '';
  const tipo = data.get('tipo_inmueble') || '';
  const liquidez = data.get('liquidez') || '';
  const tiempo = data.get('tiempo_inversion') || '';
  const isEn = document.body.classList.contains('lang-en');

  if (!nombre || !whatsapp) {
    btn.textContent = isEn ? 'Complete name and WhatsApp' : 'Completa nombre y WhatsApp';
    setTimeout(() => { btn.textContent = originalText; }, 2500);
    return;
  }

  btn.textContent = isEn ? 'Opening WhatsApp...' : 'Abriendo WhatsApp...';
  btn.disabled = true;

  const msg = isEn
    ? `Hi DE REMATE, I want advice about real estate auction opportunities.\n\nMy information:\nName: ${nombre}\nWhatsApp: ${whatsapp}\nProperty type: ${tipo}\nCity: ${ciudad}\nBudget: ${presupuesto}\nAvailable capital: ${liquidez}\nInvestment timeline: ${tiempo}`
    : `Hola DE REMATE, quiero recibir asesoría sobre oportunidades en remates judiciales.\n\nMis datos:\nNombre: ${nombre}\nWhatsApp: ${whatsapp}\nTipo de inmueble: ${tipo}\nCiudad de interés: ${ciudad}\nPresupuesto: ${presupuesto}\nCapital líquido: ${liquidez}\nTiempo para invertir: ${tiempo}`;

  const whatsappUrl = 'https://wa.me/573227736393?text=' + encodeURIComponent(msg);

  // 1. WhatsApp siempre abre primero. No depende de Formspree.
  window.open(whatsappUrl, '_blank');

  // 2. Google Sheets guarda el lead en segundo plano. Si falla, no bloquea al cliente.
  const leadData = new URLSearchParams();
  leadData.append('nombre', nombre);
  leadData.append('whatsapp', whatsapp);
  leadData.append('tipo_inmueble', tipo);
  leadData.append('ciudad', ciudad);
  leadData.append('presupuesto', presupuesto);
  leadData.append('liquidez', liquidez);
  leadData.append('tiempo_inversion', tiempo);
  leadData.append('source', 'Web DE REMATE');

  fetch('https://script.google.com/macros/s/AKfycbzOun5pCgW9f2Y_W5ZT2xv6geE-k1xQkCGAl63FJGSw08W8PpLRqrZAdVzzkgqnB5lNTg/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: leadData
  }).catch(function(error) {
    console.warn('Google Sheets falló, pero WhatsApp ya fue abierto:', error);
  });

  btn.textContent = isEn ? 'Done. Continue on WhatsApp.' : 'Listo. Continúa en WhatsApp.';

  setTimeout(() => {
    form.reset();
    btn.textContent = originalText;
    btn.disabled = false;
  }, 3000);
}

// ANIMACIONES SCROLL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// NAV SCROLL
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow =
    window.scrollY > 50 ? '0 4px 24px rgba(0,0,0,0.3)' : 'none';
});