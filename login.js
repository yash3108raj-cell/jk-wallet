let cid = "";
let correctAns = 0;

// generate captcha (frontend)
function generateCaptcha() {
  const n1 = Math.floor(Math.random() * 10) + 1;
  const n2 = Math.floor(Math.random() * 10) + 1;
  correctAns = n1 + n2;

  const q = document.getElementById("q");
  if (q) q.innerText = ${n1} + ${n2} = ?;
}

// expose login globally
window.login = function () {
  const m = document.getElementById("m");
  const p = document.getElementById("p");
  const a = document.getElementById("a");

  if (!m  !p  !a) {
    alert("Input elements missing");
    return;
  }

  if (!m.value  !p.value  !a.value) {
    alert("Please fill all fields");
    return;
  }

  if (Number(a.value) !== correctAns) {
    alert("Captcha incorrect");
    a.value = "";
    generateCaptcha();
    return;
  }

  // demo login success
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", m.value);

  window.location.href = "dashboard.html";
};

document.addEventListener("DOMContentLoaded", generateCaptcha);
