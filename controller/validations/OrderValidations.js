$(document).ready(function () {
    // -----------------------
    // Regex Constants
    // -----------------------
    const ORDER_ID_REGEX = /^OID-[0-9]{3}$/;
    const ORDER_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
    const ORDER_QTY_REGEX = /^[1-9]\d*$/;
  
    // -----------------------
    // Validation Functions
    // -----------------------

    
    function validateOrderField($input, regex, $errorEl, errorMsg) {
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
  
    // Validate discount input (0-100)
    function validateDiscount(discount) {
      return !isNaN(discount) && discount >= 0 && discount <= 100;
    }
  
    // Validate cash input (> 0)
    function validateCash(cash) {
      return !isNaN(cash) && cash > 0;
    }
  
    // -----------------------
    // Price & Balance Calculations
    // -----------------------
    // Calculate discount amount and total price
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
  
      if (cash && cash > total) {
        $("#balanceInput").val(balance.toFixed(2));
        $("#cashError").text("");
      } else {
        $("#balanceInput").val("0.00");
      }
    }
  
 
  
    $("#discountInput").on("input", function () {
      const discount = parseFloat($(this).val());
      if (!validateDiscount(discount)) {
        $("#discountError").text("Enter a valid discount (0 - 100)");
      } else {
        $("#discountError").text("");
        updatePrices();
        updateBalance();
      }
    });
  
    $("#cashInput").on("input", function () {
      const cash = parseFloat($(this).val());
      if (!validateCash(cash)) {
        $("#cashError").text("Enter a valid cash amount");
      } else {
        $("#cashError").text("");
      }
      updateBalance();
    });
  
 
    function resetOrderValidation(formSelector) {
      $(formSelector).find(".form-control").removeClass("is-valid is-invalid");
    }
  });
  