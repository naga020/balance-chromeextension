document.getElementById("startPomodoro").addEventListener("click", () => {
  let minutes = 25;
  let display = document.getElementById("timerDisplay");
  display.textContent = `Focus for ${minutes} minutes...`;

  setTimeout(() => {
    alert("🎉 Focus session complete! Take a 5-minute break.");
  }, minutes * 60000);
});

// Show usage report
chrome.storage.local.get(["siteUsage"], (data) => {
  const usage = data.siteUsage || {};
  const list = document.getElementById("usageList");
  for (let site in usage) {
    const li = document.createElement("li");
    li.textContent = `${site}: ${usage[site]} visits`;
    list.appendChild(li);
  }
});
