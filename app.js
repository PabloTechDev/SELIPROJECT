// app.js — Animação do Toggle (sem duplicação de variáveis)
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");

// Evita erro se elementos não existirem
if (sign_up_btn) {
  sign_up_btn.addEventListener("click", () => {
    document.querySelector(".container").classList.add("sign-up-mode");
  });
}

if (sign_in_btn) {
  sign_in_btn.addEventListener("click", () => {
    document.querySelector(".container").classList.remove("sign-up-mode");
  });
}
