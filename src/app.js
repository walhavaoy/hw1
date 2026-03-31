(function () {
  var timeEl = document.querySelector('[data-testid="time-display"]');
  var btnEl = document.querySelector('[data-testid="greeting-button"]');
  var greetEl = document.querySelector('[data-testid="greeting-output"]');

  function updateTime() {
    if (timeEl) {
      timeEl.textContent = new Date().toLocaleTimeString();
    }
  }

  updateTime();
  setInterval(updateTime, 1000);

  if (btnEl && greetEl) {
    btnEl.addEventListener('click', function () {
      greetEl.textContent = 'Hello, World! Welcome to the test app.';
    });
  }
})();
