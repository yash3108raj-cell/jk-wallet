let num1, num2, correctAns;

// generate captcha
function generateCaptcha() {
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = Math.floor(Math.random() * 10) + 1;
  correctAns = num1 + num2;

  document.getElementById("q").innerText =
    num1 + " + " + num2 + " = ?";
}

document.addEventListener("DOMContentLoaded", () => {
  generateCaptcha();

  // invite code support (unchanged)
  const params = new URLSearchParams(window.location.search);
  const invite = params.get("invite");
  if (invite) {
    const input = document.getElementById("inviteInput");
    if (input) input.value = invite;
  }
});

// LOGIN FUNCTION
function login() {
  const mobile = document.getElementById("m").value.trim();
  const password = document.getElementById("p").value.trim();
  const ans = document.getElementById("a").value.trim();

  if (!mobile  !password  !ans) {
    alert("All fields required");
    return;
  }

  if (Number(ans) !== correctAns) {
    alert("Captcha incorrect");
    generateCaptcha();
    return;
  }

  // fake login success (static hosting safe)
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userMobile", mobile);

  window.location.href = "dashboard.html";
}
