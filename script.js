// IDIOMA
function setLang(lang) {
  document.body.classList.toggle('lang-en', lang === 'en');
  document.getElementById('btn-es').classList.toggle('active', lang === 'es');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.documentElement.lang = lang;
  localStorage.setItem('dr-lang', lang);
}

// Detectar idioma guardado o del navegador
const savedLang = localStorage.getItem('dr-lang');
const browserLang = navigator.language.startsWith('en') ? 'en' : 'es';
setLang(savedLang || browserLang);

// FORMULARIO
async function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const data = new FormData(form);
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  try {
    const response = await fetch('https://formspree.io/f/xgodnway', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(function(response) {
      var nombre = data.get('nombre') || '';
      var ciudad = data.get('ciudad') || '';
      var presupuesto = data.get('presupuesto') || '';
      var tipo = data.get('tipo_inmueble') || '';
      var liquidez = data.get('liquidez') || '';
      var tiempo = data.get('tiempo_inversion') || '';
      var isEn = document.body.classList.contains('lang-en');
      var msg = isEn
        ? 'Hi, I just submitted the form on your website. Name: ' + nombre + '. City: ' + ciudad + '. Budget: ' + presupuesto + '. Property type: ' + tipo + '. Timeline: ' + tiempo + '.'
        : 'Hola, acabo de completar el formulario en la pagina de DE REMATE. Nombre: ' + nombre + '. Ciudad: ' + ciudad + '. Presupuesto: ' + presupuesto + '. Tipo: ' + tipo + '. Liquidez: ' + liquidez + '. Tiempo para invertir: ' + tiempo + '.';
      window.open('https://wa.me/573227736393?text=' + encodeURIComponent(msg), '_blank');
      document.getElementById('contactForm').reset();
    }).catch(function() {
      window.open('https://wa.me/573227736393?text=' + encodeURIComponent('Hola, me interesa invertir en remates judiciales en Colombia.'), '_blank');
    });
    if (response.ok) {
      const nombre = data.get('nombre') || '';
      const ciudad = data.get('ciudad') || '';
      const presupuesto = data.get('presupuesto') || '';
      const tipo = data.get('tipo_inmueble') || '';
      const tiempo = data.get('tiempo_inversion') || '';
      const isEn = document.body.classList.contains('lang-en');
      const msg = isEn
        ? 'Hi, I just filled out the form on your website. I am looking for a ' + tipo + ' in ' + ciudad + ' with a budget of ' + presupuesto + '.'
        : 'Hola, acabo de completar el formulario en la pagina web de DE REMATE. Me llamo ' + nombre + ', estoy buscando ' + tipo + ' en ' + ciudad + ' con un presupuesto de ' + presupuesto + '. Quiero invertir: ' + tiempo + '.';
      btn.textContent = 'Enviado — abriendo WhatsApp...';
      setTimeout(() => {
        window.open('https://wa.me/573227736393?text=' + encodeURIComponent(msg), '_blank');
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1000);
    } else {
      btn.textContent = 'Error al enviar. Intenta de nuevo.';
      btn.disabled = false;
    }
  } catch (err) {
    btn.textContent = 'Error al enviar. Intenta de nuevo.';
    btn.disabled = false;
  }
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