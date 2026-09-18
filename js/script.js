const form = document.getElementById("converter-form");
const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const swapBtn = document.getElementById("swap-btn");
const clearBtn = document.getElementById("clear-btn");

const errorMessage = document.getElementById("error-message");
const resultValue = document.getElementById("result-value");
const resultDescription = document.getElementById("result-description");
const temperatureStatus = document.getElementById("temperature-status");
const statusIcon = document.getElementById("status-icon");
const statusText = document.getElementById("status-text");

const unitNames = {
  C: "Celsius",
  F: "Fahrenheit",
  K: "Kelvin"
};

const unitSymbols = {
  C: "°C",
  F: "°F",
  K: "K"
};

function convertTemperature(value, from, to) {
  if (from === to) return value;

  // Primero convertimos a Celsius.
  let celsius;

  switch (from) {
    case "C":
      celsius = value;
      break;
    case "F":
      celsius = (value - 32) * 5 / 9;
      break;
    case "K":
      celsius = value - 273.15;
      break;
  }

  // Desde Celsius convertimos a la unidad destino.
  switch (to) {
    case "C":
      return celsius;
    case "F":
      return (celsius * 9 / 5) + 32;
    case "K":
      return celsius + 273.15;
    default:
      return NaN;
  }
}

function formatNumber(value) {
  if (Math.abs(value) < 1e-12) value = 0;
  return Number(value.toFixed(2)).toString();
}

function validateTemperature(value, from) {
  if (temperatureInput.value.trim() === "") {
    return "Ingresa una temperatura para realizar la conversión.";
  }

  if (!Number.isFinite(value)) {
    return "Ingresa un valor numérico válido.";
  }

  if (from === "K" && value < 0) {
    return "La temperatura en Kelvin no puede ser inferior a 0 K.";
  }

  return "";
}

function updateStatus(result, unit) {
  // Umbrales orientativos expresados en Celsius.
  let celsius = convertTemperature(result, unit, "C");

  temperatureStatus.className = "temperature-status";

  if (celsius < 10) {
    temperatureStatus.classList.add("cold");
    statusIcon.textContent = "❄️";
    statusText.textContent = "Temperatura fría";
  } else if (celsius < 30) {
    temperatureStatus.classList.add("warm");
    statusIcon.textContent = "🌤️";
    statusText.textContent = "Temperatura templada";
  } else {
    temperatureStatus.classList.add("hot");
    statusIcon.textContent = "🔥";
    statusText.textContent = "Temperatura caliente";
  }
}

function showError(message) {
  errorMessage.textContent = message;
  resultValue.textContent = "—";
  resultDescription.textContent = "Revisa el valor ingresado.";
  temperatureStatus.className = "temperature-status neutral";
  statusIcon.textContent = "⚠️";
  statusText.textContent = "Valor no válido";
}

function clearError() {
  errorMessage.textContent = "";
}

function performConversion() {
  const value = Number(temperatureInput.value);
  const error = validateTemperature(value, fromUnit.value);

  if (error) {
    showError(error);
    return;
  }

  clearError();

  const result = convertTemperature(value, fromUnit.value, toUnit.value);

  if (!Number.isFinite(result)) {
    showError("No fue posible realizar la conversión.");
    return;
  }

  resultValue.textContent = `${formatNumber(result)} ${unitSymbols[toUnit.value]}`;
  resultDescription.textContent =
    `${formatNumber(value)} ${unitSymbols[fromUnit.value]} equivalen a ` +
    `${formatNumber(result)} ${unitSymbols[toUnit.value]}.`;

  updateStatus(result, toUnit.value);

  resultValue.classList.remove("animate");
  void resultValue.offsetWidth;
  resultValue.classList.add("animate");
}

function clearForm() {
  temperatureInput.value = "";
  fromUnit.value = "C";
  toUnit.value = "F";
  clearError();

  resultValue.textContent = "—";
  resultDescription.textContent = "Ingresa una temperatura para comenzar.";
  temperatureStatus.className = "temperature-status neutral";
  statusIcon.textContent = "🌡️";
  statusText.textContent = "Esperando temperatura";
  temperatureInput.focus();
}

function swapUnits() {
  const currentFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = currentFrom;

  if (temperatureInput.value.trim() !== "") {
    performConversion();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  performConversion();
});

temperatureInput.addEventListener("input", performConversion);
fromUnit.addEventListener("change", performConversion);
toUnit.addEventListener("change", performConversion);
swapBtn.addEventListener("click", swapUnits);
clearBtn.addEventListener("click", clearForm);
