const numButtons = document.querySelectorAll(".number");

numButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.value;
    console.log(value);
  });
});
