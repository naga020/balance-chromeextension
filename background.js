let blockedSites = ["youtube.com", "instagram.com"];
let distractionLog = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const now = new Date();
  const hour = now.getHours();

  // Smart scheduler: block only between 9 AM–5 PM
  if (hour >= 9 && hour <= 17) {
    if (blockedSites.some(site => tab.url.includes(site))) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"]
      });

      // Log distraction
      distractionLog.push({ site: tab.url, time: now.toLocaleTimeString() });
      chrome.storage.local.set({ distractionLog });
    }
  }

  // Usage tracking
  chrome.storage.local.get(["siteUsage"], (data) => {
    let usage = data.siteUsage || {};
    let domain = new URL(tab.url).hostname;
    usage[domain] = (usage[domain] || 0) + 1;
    chrome.storage.local.set({ siteUsage: usage });
  });
});
