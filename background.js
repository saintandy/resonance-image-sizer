chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      // Dispatch a custom event to the page so content script can catch it
      window.dispatchEvent(new CustomEvent('extensionIconClicked'));
    }
  });
});