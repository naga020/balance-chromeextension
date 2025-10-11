fetch(chrome.runtime.getURL("quotes.json"))
  .then(res => res.json())
  .then(quotes => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.body.innerHTML = `
      <div style="font-size:24px; text-align:center; margin-top:20%; color:white; background:black; padding:20px;">
        🚫 This site is blocked for mindful browsing.<br><br>
        💡 ${quote}
      </div>
    `;
  });
