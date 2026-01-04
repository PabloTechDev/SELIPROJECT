/* === ACESSIBILIDADE.JS === */

document.addEventListener("DOMContentLoaded", () => {
  // 1. INJETAR HTML DO BOTÃO E VLIBRAS
  const accessHTML = `
    <div class="accessibility-fab">
        <button class="fab-button" aria-label="Abrir Menu de Acessibilidade" id="fabToggle">
            <i class="fas fa-universal-access"></i>
        </button>
        <ul class="fab-menu" id="fabMenu">
            <li><button onclick="window.toggleTheme('light-mode')"><i class="fas fa-sun"></i> Modo Claro</button></li>
            <li><button onclick="window.toggleTheme('high-contrast-mode')"><i class="fas fa-adjust"></i> Alto Contraste</button></li>
            <li><button onclick="window.toggleTheme('color-blind-mode')"><i class="fas fa-eye"></i> Daltonismo</button></li>
            
            <li><button onclick="window.toggleTheme('focus-mode')"><i class="fas fa-crosshairs"></i> Modo Foco</button></li>
            <li><button onclick="window.toggleMagnetMode()" id="btn-magnet"><i class="fas fa-magnet"></i> Deficiência Motora</button></li>
            
            <hr>
            
            <li><button onclick="window.adjustZoom(10)"><i class="fas fa-search-plus"></i> Aumentar Texto</button></li>
            <li><button onclick="window.adjustZoom(-10)"><i class="fas fa-search-minus"></i> Diminuir Texto</button></li>
            
            <li><button onclick="window.toggleSpeech()" id="btn-speech"><i class="fas fa-volume-up"></i> Ler Texto</button></li>
            <li><button onclick="window.resetAccessibility()"><i class="fas fa-undo"></i> Restaurar Padrão</button></li>
        </ul>
    </div>

    <div vw class="enabled">
        <div vw-access-button class="active"></div>
        <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
        </div>
    </div>
    `;

  document.body.insertAdjacentHTML("beforeend", accessHTML);

  // 2. CARREGAR SCRIPT DO VLIBRAS DINAMICAMENTE
  const scriptVlibras = document.createElement("script");
  scriptVlibras.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  scriptVlibras.onload = () => {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  };
  document.head.appendChild(scriptVlibras);

  // 3. LÓGICA DO FAB (ABRIR/FECHAR)
  const fabBtn = document.getElementById("fabToggle");
  const fabContainer = document.querySelector(".accessibility-fab");
  fabBtn.addEventListener("click", () =>
    fabContainer.classList.toggle("active")
  );
});

// === FUNÇÕES GLOBAIS DE ACESSIBILIDADE ===

// Temas
window.toggleTheme = function (themeClass) {
  const body = document.body;
  const themes = [
    "light-mode",
    "high-contrast-mode",
    "color-blind-mode",
    "focus-mode",
  ];

  if (themeClass === "focus-mode") {
    body.classList.toggle("focus-mode");
    return;
  }

  if (body.classList.contains(themeClass)) {
    body.classList.remove(themeClass);
  } else {
    themes.forEach((t) => {
      if (t !== "focus-mode") body.classList.remove(t);
    });
    body.classList.add(themeClass);
  }
};

// Zoom
let currentZoom = 100;
window.adjustZoom = function (amount) {
  currentZoom += amount;
  if (currentZoom < 80) currentZoom = 80;
  if (currentZoom > 150) currentZoom = 150;
  document.documentElement.style.setProperty(
    "--base-font-size",
    `${currentZoom}%`
  );
  // Define variável CSS para controle em outros arquivos
  document.documentElement.style.fontSize = `${currentZoom}%`;
};

// Deficiência Motora (Magnetismo)
let magnetEnabled = false;
window.toggleMagnetMode = function () {
  magnetEnabled = !magnetEnabled;
  const btn = document.getElementById("btn-magnet");
  btn.style.color = magnetEnabled ? "#007BFF" : "inherit";

  if (!magnetEnabled) {
    document.querySelectorAll(".magnetic-active").forEach((el) => {
      el.style.transform = "translate(0, 0)";
      el.classList.remove("magnetic-active");
    });
  }
};

document.addEventListener("mousemove", (e) => {
  if (!magnetEnabled) return;
  // Alvos: botões, links e cards
  const targets = document.querySelectorAll(
    "a, button, .course-card, .step-card, input"
  );
  const magnetRange = 60; // Distância do imã

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < magnetRange) {
      const pull = 0.4;
      const moveX = (e.clientX - centerX) * pull;
      const moveY = (e.clientY - centerY) * pull;
      el.classList.add("magnetic-active");
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    } else {
      el.style.transform = "translate(0, 0)";
    }
  });
});

// Leitura de Texto
let speechEnabled = false;
const synth = window.speechSynthesis;

window.toggleSpeech = function () {
  speechEnabled = !speechEnabled;
  const btn = document.getElementById("btn-speech");
  if (speechEnabled) {
    btn.style.color = "#007BFF";
    alert("Leitura Ativada: Selecione texto com o mouse ou use TAB.");
  } else {
    btn.style.color = "inherit";
    synth.cancel();
  }
};

function speak(text) {
  if (!speechEnabled || !text) return;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  synth.speak(utterance);
}

document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) speak(selectedText);
});

document.addEventListener("focusin", (e) => {
  if (!speechEnabled) return;
  const el = e.target;
  let text =
    el.innerText || el.placeholder || el.getAttribute("aria-label") || "";
  if (el.tagName === "A") text += " Link";
  if (el.tagName === "BUTTON") text += " Botão";
  if (text) speak(text);
});

// Reset
window.resetAccessibility = function () {
  document.body.className = "";
  currentZoom = 100;
  document.documentElement.style.fontSize = "100%";
  if (speechEnabled) window.toggleSpeech();
  if (magnetEnabled) window.toggleMagnetMode();
  document.querySelectorAll("*").forEach((el) => (el.style.transform = ""));
};
