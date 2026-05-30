(function () {
  function bindCalculator() {
    var calculator = document.querySelector('.cleaning-calculator');
    if (!calculator || calculator.dataset.calculatorReady) return;

    calculator.dataset.calculatorReady = 'true';

    var price = calculator.querySelector('.calculator-price');
    var fields = Array.prototype.slice.call(calculator.querySelectorAll('select'));
    var serviceRates = { standard: 0, deep: 85, move: 115, office: 65 };
    var frequencyDiscounts = { onetime: 0, weekly: 0.14, biweekly: 0.1, monthly: 0.05 };

    function calculate() {
      var data = new FormData(calculator);
      var bedrooms = Number(data.get('bedrooms') || 1);
      var bathrooms = Number(data.get('bathrooms') || 1);
      var size = Number(data.get('size') || 1100);
      var service = data.get('service') || 'standard';
      var frequency = data.get('frequency') || 'onetime';
      var estimate = 65;

      estimate += Math.max(0, bedrooms - 1) * 18;
      estimate += Math.max(0, bathrooms - 1) * 22;
      estimate += Math.max(0, size - 900) * 0.035;
      estimate += serviceRates[service] || 0;
      estimate -= estimate * (frequencyDiscounts[frequency] || 0);
      estimate = Math.max(65, Math.round(estimate / 5) * 5);

      if (price) price.textContent = '$' + estimate;
    }

    fields.forEach(function (field) {
      field.addEventListener('change', calculate);
    });

    calculate();
  }

  bindCalculator();
  document.addEventListener('include:loaded', bindCalculator);
})();
