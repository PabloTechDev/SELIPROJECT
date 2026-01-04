lucide.createIcons();

const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const dropdownSelected = document.getElementById("dropdown-selected");
const confirmar = document.getElementById("confirmar");

let escolha = null;

// abrir/fechar menu
dropdownBtn.addEventListener("click", () => {
  dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
});

// selecionar opção
dropdownMenu.querySelectorAll("li").forEach(item => {
  item.addEventListener("click", () => {
    escolha = item.dataset.value;
    dropdownSelected.textContent = item.textContent.trim();
    dropdownMenu.style.display = "none";
  });
});

// confirmar
confirmar.addEventListener("click", () => {
  if (!escolha) {
    alert("Por favor, selecione uma deficiência antes de continuar.");
    return;
  }
  window.location.href = `${escolha}.html`;
});

// fechar dropdown se clicar fora
document.addEventListener("click", (e) => {
  if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.style.display = "none";
  }
});
