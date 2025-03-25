// validation.js

// Regex Patterns
const CUS_ID_REGEX = /^(C00-)[0-9]{3}$/;
const CUS_NAME_REGEX = /^[A-Za-z ]{4,}$/;
const CUS_ADDRESS_REGEX = /^[A-Za-z0-9\s,.\-]{7,}$/;
const CUS_SALARY_REGEX = /^(?:\d+|\d+\.\d{2})$/;

// 🧠 Generic field validator
function validateField($input, regex, $errorEl, errorMsg) {
  const value = $input.val().trim();

  if (regex.test(value)) {
    $input.removeClass("is-invalid").addClass("is-valid");
    $errorEl.text("");
    return true;
  } else {
    $input.removeClass("is-valid").addClass("is-invalid");
    $errorEl.text(errorMsg);
    return false;
  }
}

function resetValidation(formSelector) {
  $(formSelector).find(".form-control").removeClass("is-valid is-invalid");
}
