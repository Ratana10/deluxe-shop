"use client";

import { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "Deluxe_kh_bot"); // Replace with your bot's username
    script.setAttribute("data-size", "large"); // Size of the login button (small, medium, large)
    script.setAttribute(
      "data-auth-url",
      "https://your-site-url/api/telegramAuth"
    ); // Replace with your API endpoint
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegram-login")?.appendChild(script);
  }, []);

  return (
    <div>
      <h2>Login with Telegram to Connect Your Account</h2>
      {/* This div will contain the Telegram login button */}
      <div id="telegram-login"></div>
    </div>
  );
};

export default TelegramLogin;
