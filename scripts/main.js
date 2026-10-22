/**
 * Felipe Zaratini · Portfolio Scripts
 * Microinterações leves, sem frameworks pesados
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualizar ano automaticamente no footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Funcionalidade de copiar e-mail com feedback visual
  const copyBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');

  if (copyBtn && copyToast) {
    // Lê o e-mail diretamente do atributo data-email do botão no HTML
    const emailToCopy = copyBtn.getAttribute('data-email') || 'felipezaratini@gmail.com';

    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(emailToCopy);
        copyToast.classList.add('show');
        setTimeout(() => {
          copyToast.classList.remove('show');
        }, 2200);
      } catch (err) {
        // Fallback caso clipboard API falhe
        window.location.href = `mailto:${emailToCopy}`;
      }
    });
  }

  // 3. Efeito sutil de elevação no navbar ao scrollar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
        navbar.style.background = 'rgba(10, 13, 20, 0.9)';
      } else {
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        navbar.style.background = 'rgba(10, 13, 20, 0.75)';
      }
    });
  }
});
