// Log when popup loads
console.log("Popup loaded");

// Run when popup opens
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  loadUsage();
  setupPomodoroButton();
});

// Load today's usage from chrome.storage
function loadUsage() {
  console.log("Loading usage data...");

  chrome.storage.local.get(["usage"], data => {
    const usage = data.usage || {};
    const container = document.getElementById("usageList");

    container.innerHTML = ""; // Clear previous entries

    Object.keys(usage).forEach(site => {
      const count = usage[site];
      const item = document.createElement("div");
      item.textContent = `${site}: ${count} visits`;
      container.appendChild(item);
    });

    console.log("Usage data loaded:", usage);
  });
}

// Pomodoro button logic
function setupPomodoroButton() {
  const btn = document.getElementById("pomodoroBtn");

  if (!btn) {
    console.error("Pomodoro button not found in popup.html");
    return;
  }

  btn.addEventListener("click", () => {
    console.log("Pomodoro button clicked");

    chrome.runtime.sendMessage({ action: "startPomodoro" }, response => {
      console.log("Background response:", response);
    });
  });
}
