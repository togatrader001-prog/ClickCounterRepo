let count = 0;
const API_KEY = "8cf3933f2de96db597af8f3cbd1605cb";
const SYMBOL = "AAPL";

const counterDisplay = document.getElementById("counter");
const stockDisplay = document.getElementById("stock-display");
const button = document.getElementById("counterbutton");

button.addEventListener("click", () => {
  count += 1;
  counterDisplay.textContent = count;
  button.textContent = `Clicked ${count} times!`;

  stockDisplay.textContent = "Fetching latest stock price...";

  fetch(`https://api.apilayer.net/marketstack/v1/eod?access_key=${API_KEY}&symbols=${SYMBOL}`)
    .then((response) => response.json())
    .then((json) => {
      if (json.data && json.data.length > 0) {
        const latest = json.data[0];
        stockDisplay.textContent = `${latest.symbol} Close: $${latest.close} (Date: ${latest.date.split("T")[0]})`;
      } else {
        stockDisplay.textContent = "Error: No data returned from API.";
      }
    })
    .catch((err) => {
      console.error("API error:", err);
      stockDisplay.textContent = "Failed to load stock data.";
    });
});