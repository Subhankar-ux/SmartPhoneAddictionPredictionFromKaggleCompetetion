/*
  ScreenSense frontend
  Change API_URL to your Render FastAPI service URL.

  Example:
  const API_URL = "https://your-api-name.onrender.com/predict";
*/
const API_URL = "https://smartphone-addiction-api-hgbh.onrender.com/predict";

const form = document.getElementById("assessmentForm");
const predictBtn = document.getElementById("predictBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const resultEmpty = document.getElementById("resultEmpty");
const resultContent = document.getElementById("resultContent");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");
const livePill = document.getElementById("livePill");

const probabilityEl = document.getElementById("probability");
const probabilityText = document.getElementById("probabilityText");
const thresholdText = document.getElementById("thresholdText");
const resultLabel = document.getElementById("resultLabel");
const resultDescription = document.getElementById("resultDescription");
const scoreRing = document.getElementById("scoreRing");
const metricBar = document.getElementById("metricBar");
const resetBtn = document.getElementById("resetBtn");

const fields = [...form.querySelectorAll("input, select")];

function updateProgress() {
  const filled = fields.filter(field => String(field.value).trim() !== "").length;
  const total = fields.length;
  const percent = (filled / total) * 100;

  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${filled} / ${total}`;
}

fields.forEach(field => {
  field.addEventListener("input", () => {
    field.closest(".field")?.classList.remove("invalid");
    updateProgress();
  });

  field.addEventListener("change", () => {
    field.closest(".field")?.classList.remove("invalid");
    updateProgress();
  });
});

function validateForm() {
  let valid = true;

  fields.forEach(field => {
    const wrapper = field.closest(".field");
    if (!field.checkValidity() || String(field.value).trim() === "") {
      wrapper?.classList.add("invalid");
      valid = false;
    } else {
      wrapper?.classList.remove("invalid");
    }
  });

  if (!valid) {
    const firstInvalid = fields.find(field => !field.checkValidity() || String(field.value).trim() === "");
    firstInvalid?.focus();
  }

  return valid;
}

function buildPayload() {
  return {
    age: Number(document.getElementById("age").value),
    daily_screen_time_hours: Number(document.getElementById("daily_screen_time_hours").value),
    social_media_hours: Number(document.getElementById("social_media_hours").value),
    gaming_hours: Number(document.getElementById("gaming_hours").value),
    work_study_hours: Number(document.getElementById("work_study_hours").value),
    sleep_hours: Number(document.getElementById("sleep_hours").value),
    notifications_per_day: Number(document.getElementById("notifications_per_day").value),
    app_opens_per_day: Number(document.getElementById("app_opens_per_day").value),
    weekend_screen_time: Number(document.getElementById("weekend_screen_time").value),
    gender: document.getElementById("gender").value,
    stress_level: document.getElementById("stress_level").value,
    academic_work_impact: document.getElementById("academic_work_impact").value
  };
}

function setLoading(isLoading) {
  predictBtn.disabled = isLoading;
  predictBtn.classList.toggle("loading", isLoading);
  predictBtn.querySelector(".button-text").textContent = isLoading ? "Analyzing..." : "Run assessment";
  livePill.textContent = isLoading ? "RUNNING" : "READY";
}

function showError(message) {
  errorBox.classList.remove("hidden");
  resultEmpty.classList.add("hidden");
  resultContent.classList.add("hidden");
  livePill.textContent = "ERROR";
  errorMessage.textContent = message;
}

function animateNumber(element, from, to, duration = 900, suffix = "%") {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + (to - from) * eased;
    element.textContent = `${value.toFixed(1)}${suffix}`;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function showResult(data) {
  const probability = Number(data.default_probability);
  const threshold = Number(data.threshold);
  const isAddicted = Number(data.default_prediction) === 1;
  const percentage = Math.max(0, Math.min(100, probability * 100));

  errorBox.classList.add("hidden");
  resultEmpty.classList.add("hidden");
  resultContent.classList.remove("hidden");
  livePill.textContent = "COMPLETE";

  probabilityEl.textContent = "0%";
  probabilityText.textContent = "0%";
  thresholdText.textContent = `${(threshold * 100).toFixed(1)}%`;

  scoreRing.style.setProperty("--score", "0%");
  metricBar.style.width = "0%";

  requestAnimationFrame(() => {
    scoreRing.style.setProperty("--score", `${percentage}%`);
    metricBar.style.width = `${percentage}%`;
  });

  animateNumber(probabilityEl, 0, percentage, 900);
  animateNumber(probabilityText, 0, percentage, 900);

  if (isAddicted) {
    resultLabel.textContent = "Higher-risk pattern detected";
    resultLabel.style.color = "var(--danger)";
    resultDescription.textContent =
      "The model classified this input as addicted using your saved decision threshold.";
    metricBar.style.background = "var(--danger)";
  } else {
    resultLabel.textContent = "Lower-risk pattern detected";
    resultLabel.style.color = "var(--accent)";
    resultDescription.textContent =
      "The model classified this input as not addicted using your saved decision threshold.";
    metricBar.style.background = "var(--accent)";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) return;

  if (API_URL.includes("YOUR-BACKEND-NAME")) {
    showError("Set your Render FastAPI URL in script.js before deploying the frontend.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildPayload())
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Server returned HTTP ${response.status} without valid JSON.`);
    }

    if (!response.ok) {
      const detail = typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail || data);
      throw new Error(detail);
    }

    showResult(data);
  } catch (error) {
    console.error(error);
    showError(
      error.message ||
      "The request failed. Check your API URL, Render service, and CORS configuration."
    );
  } finally {
    setLoading(false);
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  fields.forEach(field => field.closest(".field")?.classList.remove("invalid"));
  resultContent.classList.add("hidden");
  errorBox.classList.add("hidden");
  resultEmpty.classList.remove("hidden");
  livePill.textContent = "READY";
  progressBar.style.width = "0%";
  progressText.textContent = `0 / ${fields.length}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateProgress();
