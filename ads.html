// ads.js
// include after Monetag SDK script (in head).
// <script async src="https://alwingulla.com/88/tag.min.js" data-zone="9931551" data-cfasync="false"></script>
// <script src="ads.js"></script>

function rewardUserCoins(amount = 10, userId = null) {
  // prefer firebase helper if available
  try {
    userId = userId || (window.appHelpers && window.appHelpers.getTelegramUser && window.appHelpers.getTelegramUser()?.id) || localStorage.getItem('guest_user');
    if (window.appHelpers && window.appHelpers.addCoinsToUser) {
      window.appHelpers.addCoinsToUser(userId, amount);
    } else {
      // fallback local
      let c = parseInt(localStorage.getItem('coins') || 0);
      c += amount;
      localStorage.setItem('coins', c);
    }
  } catch (e) {
    console.warn('rewardUserCoins error', e);
  }
}

// Rewarded Interstitial
function showRewardedInterstitial() {
  if (typeof show_9931551 !== 'function') {
    console.warn('Monetag SDK not loaded');
    return Promise.reject('Monetag missing');
  }
  return show_9931551().then(() => {
    rewardUserCoins(10);
  });
}

// Rewarded Popup
function showRewardedPopup() {
  if (typeof show_9931551 !== 'function') return Promise.reject('Monetag missing');
  return show_9931551('pop').then(() => {
    rewardUserCoins(10);
  });
}

// In-App Interstitial (auto)
function initInAppInterstitial() {
  if (typeof show_9931551 !== 'function') {
    console.warn('Monetag SDK not loaded');
    return;
  }
  show_9931551({
    type: 'inApp',
    inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false }
  });
}

// export globally
window.ADS = {
  showRewardedInterstitial,
  showRewardedPopup,
  initInAppInterstitial,
  rewardUserCoins
};
