<!-- save as ads.js -->
<script>
/*
  ads.js
  - Relies on Monetag SDK function show_9931551 (zone 9931551) which we load in page <head>.
  - Calls window.appHelpers.addCoins(userId, amount) when rewarded.
*/

(function(){
  function ensureMonetag() {
    if(typeof show_9931551 === 'function') return true;
    console.warn("Monetag SDK not ready (show_9931551 missing)");
    return false;
  }

  async function showRewardedFor(userId, amount=10){
    if(!ensureMonetag()) return Promise.reject("Monetag missing");
    return show_9931551().then(() => {
      // after ad finished
      if(window.appHelpers && typeof window.appHelpers.addCoins === 'function'){
        window.appHelpers.addCoins(userId, amount).catch(e=>console.error(e));
      }
    });
  }

  async function showPopupFor(userId, amount=10){
    if(!ensureMonetag()) return Promise.reject("Monetag missing");
    return show_9931551('pop').then(() => {
      if(window.appHelpers && typeof window.appHelpers.addCoins === 'function'){
        window.appHelpers.addCoins(userId, amount).catch(e=>console.error(e));
      }
    });
  }

  function initInApp(){
    if(!ensureMonetag()) return;
    show_9931551({
      type: 'inApp',
      inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false }
    });
  }

  // export
  window.MiniAds = {
    showRewardedFor,
    showPopupFor,
    initInApp
  };
})();
</script>
