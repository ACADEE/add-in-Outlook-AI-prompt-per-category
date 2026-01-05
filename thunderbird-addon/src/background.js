/**
 * Background script for Thunderbird AI Draft extension
 * Handles message and compose events
 */

console.log("Thunderbird AI Draft extension loaded");

// Listen for extension installation
browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

// You can add background tasks here if needed
