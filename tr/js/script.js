/* TELICA DIGITAL CONCEPTS — Cohort Application */

const form = document.querySelector("#application-form");
const steps = [...document.querySelectorAll(".form-step")];
const indicators = [...document.querySelectorAll("[data-step-indicator]")];
const progressCount = document.querySelector("#progress-count");
const progressFill = document.querySelector("#progress-fill");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const submitButton = document.querySelector("#submit-button");
const formError = document.querySelector("#form-error");
const successScreen = document.querySelector("#success-screen");
const referenceNumber = document.querySelector("#reference-number");
const reviewList = document.querySelector("#review-list");
const motivation = document.querySelector("#motivation");
const characterCount = document.querySelector("#character-count");
const year = document.querySelector("[data-year]");

let currentStep = 1;
const totalSteps = 5;

const fieldLabels = {
  full_name: "Full name",
  email: "Email address",
  phone: "Phone / WhatsApp",
  location: "Location",
  selected_skill: "Selected skill",
  experience_level: "Experience level",
  occupation: "Occupation / status",
  previous_exposure: "Previous exposure",
  motivation: "Motivation",
  availability: "Availability",
  referral_source: "Referral source"
};

function getValue(name) {
  const field = form.elements[name];
  if (!field) return "";
  if (field instanceof RadioNodeList) return [...field].find(item => item.checked)?.value || "";
  return field.value.trim();
}

function setFieldError(name, message) {
  const error = document.querySelector(`[data-error-for="${name}"]`);
  if (error) error.textContent = message;

  const field = form.elements[name];
  if (field && !(field instanceof RadioNodeList)) {
    field.closest(".field")?.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");
  }
}

function clearErrors() {
  document.querySelectorAll(".field.has-error").forEach(el => el.classList.remove("has-error"));
  document.querySelectorAll("[aria-invalid='true']").forEach(el => el.removeAttribute("aria-invalid"));
  document.querySelectorAll(".field-error, .form-level-error").forEach(el => el.textContent = "");
  formError.textContent = "";
}

function validateStep(stepNumber) {
  clearErrors();
  let valid = true;
  let firstInvalid = null;

  if (stepNumber === 1) {
    [["full_name","Please enter your full name."],["email","Enter a valid email address."],["phone","Please enter your phone or WhatsApp number."],["location","Please enter your location."]].forEach(([name,msg]) => {
      if (!getValue(name)) { setFieldError(name,msg); valid=false; firstInvalid ||= form.elements[name]; }
    });

    const email = getValue("email");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("email","Enter a valid email address."); valid=false; firstInvalid ||= form.elements.email;
    }

    const phone = getValue("phone");
    if (phone && phone.replace(/\D/g,"").length < 7) {
      setFieldError("phone","Enter a valid phone number."); valid=false; firstInvalid ||= form.elements.phone;
    }
  }

  if (stepNumber === 2 && !getValue("selected_skill")) {
    document.querySelector("#skill-error").textContent = "Please select a skill.";
    valid = false;
    firstInvalid = form.elements.selected_skill[0];
  }

  if (stepNumber === 3) {
    if (!getValue("experience_level")) { setFieldError("experience_level","Please select your experience level."); valid=false; firstInvalid=form.elements.experience_level[0]; }
    if (!getValue("occupation")) { setFieldError("occupation","Please tell us your current occupation or status."); valid=false; firstInvalid ||= form.elements.occupation; }
  }

  if (stepNumber === 4) {
    const motivationValue = getValue("motivation");
    if (!motivationValue) { setFieldError("motivation","Please tell us why you want to join."); valid=false; firstInvalid=form.elements.motivation; }
    else if (motivationValue.length < 20) { setFieldError("motivation","Please give us a little more detail."); valid=false; firstInvalid=form.elements.motivation; }
    if (!getValue("availability")) { setFieldError("availability","Please select your availability."); valid=false; firstInvalid ||= form.elements.availability; }
  }

  if (!valid) {
    formError.textContent = "Please check the highlighted fields before continuing.";
    firstInvalid?.focus();
  }
  return valid;
}

function updateProgress() {
  progressCount.textContent = `${String(currentStep).padStart(2,"0")} / ${String(totalSteps).padStart(2,"0")}`;
  progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
  indicators.forEach(indicator => {
    const n = Number(indicator.dataset.stepIndicator);
    indicator.classList.toggle("is-active", n === currentStep);
    indicator.classList.toggle("is-complete", n < currentStep);
  });
}

function showStep(number) {
  currentStep = number;
  steps.forEach(step => {
    const active = Number(step.dataset.step) === currentStep;
    step.hidden = !active;
    step.classList.toggle("is-active", active);
  });
  backButton.hidden = currentStep === 1;
  nextButton.hidden = currentStep === totalSteps;
  submitButton.hidden = currentStep !== totalSteps;
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

function stepForField(name) {
  if (["full_name","email","phone","location"].includes(name)) return 1;
  if (name === "selected_skill") return 2;
  if (["experience_level","occupation","previous_exposure"].includes(name)) return 3;
  return 4;
}

function buildReview() {
  const names = ["full_name","email","phone","location","selected_skill","experience_level","occupation","previous_exposure","motivation","availability","referral_source"];
  reviewList.innerHTML = names.filter(name => getValue(name)).map(name => `
    <div class="review-row">
      <span class="review-label">${fieldLabels[name]}</span>
      <span class="review-value">${escapeHtml(getValue(name))}</span>
      <button class="review-edit" type="button" data-edit-step="${stepForField(name)}">Edit</button>
    </div>
  `).join("");

  reviewList.querySelectorAll(".review-edit").forEach(button => {
    button.addEventListener("click", () => showStep(Number(button.dataset.editStep)));
  });
}

function applicationPayload() {
  return {
    full_name: getValue("full_name"),
    email: getValue("email"),
    phone: getValue("phone"),
    location: getValue("location"),
    selected_skill: getValue("selected_skill"),
    experience_level: getValue("experience_level"),
    occupation: getValue("occupation"),
    previous_exposure: getValue("previous_exposure"),
    motivation: getValue("motivation"),
    availability: getValue("availability"),
    referral_source: getValue("referral_source"),
    submitted_at: new Date().toISOString()
  };
}

function createReferenceNumber() {
  return `TELICA-${Math.floor(100000 + Math.random() * 900000)}`;
}

nextButton.addEventListener("click", () => {
  if (!validateStep(currentStep)) return;
  if (currentStep === 4) buildReview();
  showStep(Math.min(currentStep + 1, totalSteps));
});

backButton.addEventListener("click", () => showStep(Math.max(currentStep - 1, 1)));

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!validateStep(4)) { showStep(4); return; }

  buildReview();
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  formError.textContent = "";

  /*
    BACKEND INTEGRATION POINT:
    Replace this simulated request with the real POST /api/applications call.
    The backend should validate/sanitize data, prevent duplicate applications,
    create the unique application ID and return it.
  */
  try {
    await new Promise(resolve => setTimeout(resolve, 900));
    referenceNumber.textContent = createReferenceNumber();
    form.hidden = true;
    successScreen.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Application payload ready for backend:", applicationPayload());
  } catch {
    formError.textContent = "We could not submit your application. Please check your connection and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Submit Application <span aria-hidden="true">→</span>';
  }
});

motivation.addEventListener("input", () => {
  characterCount.textContent = motivation.value.length;
});

form.querySelectorAll("input, textarea, select").forEach(field => {
  field.addEventListener("input", () => {
    field.closest(".field")?.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
  });
  field.addEventListener("change", () => {
    field.closest(".field")?.classList.remove("has-error");
    field.removeAttribute("aria-invalid");
    formError.textContent = "";
  });
});

year.textContent = new Date().getFullYear();
updateProgress();
