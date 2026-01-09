
/* ===============================
   SIMPLE CAPTCHA (NO BACKEND)
================================ */

let num1 = 0;
let num2 = 0;
let correctAns = 0;

// generate captcha
function generateCaptcha() {
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = Math.floor(Math.random() * 10) + 1;
  correctAns = num1 + num2;

  document.getElementById("q").innerText = ${num1} + ${num2} = ?;
}

// LOGIN FUNCTION (GLOBAL)
function login() {
  const m = document.getElementById("m");
  const p = document.getElementById("p");
  const a = document.getElementById("a");

  if (!m.value  !p.value  !a.value) {
    alert("Please fill all fields");
    return;
  }

  if (Number(a.value) !== correctAns) {
    alert("Captcha incorrect");
    generateCaptcha();
    a.value = "";
    return;
  }

  // ✅ SUCCESS (demo login)
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", m.value);

  window.location.href = "dashboard.html";
}

// ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  generateCaptcha();
});

