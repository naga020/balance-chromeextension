console.log("Background script loaded");

// ------------------------------
// ✅ Usage Tracking
// ------------------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    trackUsage(tab.url);
  }
});

function trackUsage(url) {
  const hostname = new URL(url).hostname;

  chrome.storage.local.get(["usage"], data => {
    const usage = data.usage || {};

    usage[hostname] = (usage[hostname] || 0) + 1;

    chrome.storage.local.set({ usage });
    console.log("Updated usage:", usage);
  });
}

// ------------------------------
// ✅ Reset usage at midnight
// ------------------------------
chrome.alarms.create("resetDailyUsage", { when: getNextMidnight(), periodInMinutes: 1440 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "resetDailyUsage") {
    chrome.storage.local.set({ usage: {} });
    console.log("Daily usage reset");
  }
});

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date();

  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

// ------------------------------
// ✅ Pomodoro Timer
// ------------------------------
let pomodoroActive = false;
let pomodoroEndTime = null;

function startPomodoro() {
  const duration = 25 * 60 * 1000; // 25 minutes
  pomodoroEndTime = Date.now() + duration;
  pomodoroActive = true;

  console.log("Pomodoro started. Ends at:", new Date(pomodoroEndTime));

  chrome.alarms.create("pomodoroTimer", { when: pomodoroEndTime });
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "pomodoroTimer") {
    pomodoroActive = false;
    pomodoroEndTime = null;

    console.log("Pomodoro finished");

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Pomodoro Complete",
      message: "Great job! Take a short break."
    });
  }
});

// ------------------------------
// ✅ Listen for messages from popup.js
// ------------------------------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "startPomodoro") {
    startPomodoro();
    sendResponse({ status: "ok", message: "Pomodoro started" });
  }

  return true; // keeps message channel open
});


