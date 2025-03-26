const ITEM_CODE_REGEX = /^(I00-)[0-9]{3}$/;
const ITEM_NAME_REGEX = /^[A-Za-z0-9 ]{3,20}$/;
const ITEM_QTY_REGEX = /^[0-9]+$/;
const ITEM_PRICE_REGEX = /^(?:\d+|\d+\.\d{2})$/;

function validateItemField($input, regex, $errorEl, errorMsg) {
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

function resetItemValidation(formSelector) {
  $(formSelector).find(".form-control").removeClass("is-valid is-invalid");
}