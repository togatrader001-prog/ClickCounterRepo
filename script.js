let count = 0;

const counterDisplay = document.getElementById("counter");
const button = document.getElementById("counterbutton");

button.addEventListener("click", () => {
  count += 1;
  counterDisplay.textContent = count;
  button.textContent = `Clicked ${count} times!`;
});