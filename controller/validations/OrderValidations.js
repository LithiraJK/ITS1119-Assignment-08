$(document).ready(function () {
  // Constants
  const DISCOUNT_MIN = 0;
  const DISCOUNT_MAX = 100;
  const CASH_MIN = 0;

  const ORDER_ID_REGEX = /^OID-[0-9]{3}$/;

  function validateDiscount(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= DISCOUNT_MIN && num <= DISCOUNT_MAX;
  }

  function validateCash(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > CASH_MIN;
  }

  function validateOrderField($input, validateFnOrRegex, $errorEl, errorMsg, callback) {
    const value = $input.val().trim();
    let isValid;

    if (typeof validateFnOrRegex === "function") {
      isValid = validateFnOrRegex(value);
    } else {
      isValid = validateFnOrRegex.test(value);
    }

    if (isValid) {
      $input.removeClass("is-invalid").addClass("is-valid");
      $errorEl.text("");
      if (callback) callback();
      return true;
    } else {
      $input.removeClass("is-valid").addClass("is-invalid");
      $errorEl.text(errorMsg);
      return false;
    }
  }

  function updatePrices() {
    const subTotal = parseFloat($("#subTotalPrice").text()) || 0;
    const discount = parseFloat($("#discountInput").val()) || 0;
    const discountAmount = (subTotal * discount) / 100;
    const total = subTotal - discountAmount;

    $("#discountAmount").text(discountAmount.toFixed(2));
    $("#totalPrice").text(total.toFixed(2));
    return total;
  }

  function updateBalance() {
    const cash = parseFloat($("#cashInput").val()) || 0;
    const total = updatePrices();
    const balance = cash - total;

    if (cash > total) {
      $("#balanceInput").val(balance.toFixed(2));
      $("#cashError").text("");
    } else {
      $("#balanceInput").val("0.00");
    }
  }


  $("#discountInput").on("input", function () {
    validateOrderField(
      $(this),
      validateDiscount,
      $("#discountError"),
      `Enter a valid discount (${DISCOUNT_MIN} - ${DISCOUNT_MAX})`,
      () => {
        updatePrices();
        updateBalance();
      }
    );
  });

  $("#cashInput").on("input", function () {
    validateOrderField(
      $(this),
      validateCash, 
      $("#cashError"),
      "Enter a valid cash amount",
      updateBalance
    );
  });

  $("#orderIdInput").on("input", function () {
    validateOrderField(
      $(this),
      ORDER_ID_REGEX,
      $("#orderIdError"),
      "Invalid Order ID format (e.g., OID-001)"
    );
  });


});
