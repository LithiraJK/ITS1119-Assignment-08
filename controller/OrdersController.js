$(document).ready(function () {
    console.log("OrdersController.js is ready!");
  
    const today = new Date().toISOString().split('T')[0];
    $("#o_inputOrderDate").val(today);
  
    $("#orderId").val(getNextOrderID());
  
    loadCustomerDropdown();
    loadItemDropdown();
    getAllOrders();
  
    $("#orderCustomerId").on("change", function () {
      const selectedId = $(this).val();
      const customer = customerDB.find(c => c.customerId === selectedId);
      if (customer) {
        $("#orderCustomerName").val(customer.customerName);
        $("#orderCustomerAddress").val(customer.customerAddress);
      } else {
        $("#orderCustomerName").val("");
        $("#orderCustomerAddress").val("");
      }
    });
  
    $("#orderItemCode").on("change", function () {
      const selectedCode = $(this).val();
      const item = itemDB.find(i => i.itemCode === selectedCode);
      if (item) {
        $("#orderItemName").val(item.itemName);
        $("#orderItemQty").val(item.itemQty);
        $("#orderItemPrice").val(item.unitPrice);
      } else {
        $("#orderItemName").val("");
        $("#orderItemQty").val("");
        $("#orderItemPrice").val("");
      }
    });


  
    $("#btnAddToCart").on("click", function () {
      const itemCode = $("#orderItemCode").val();
      const itemName = $("#orderItemName").val();
      const unitPrice = parseFloat($("#orderItemPrice").val());
      const orderedQty = parseInt($("#orderQty").val(), 10);
  
      if (!itemCode) {
        alert("Please select an item.");
        return;
      }
      if (isNaN(orderedQty) || orderedQty <= 0) {
        alert("Please enter a valid ordered quantity.");
        return;
      }
  
      const availableQty = parseInt($("#orderItemQty").val(), 10);
      if (orderedQty > availableQty) {
        alert("Ordered quantity exceeds available quantity.");
        return;
      }
  
      const total = unitPrice * orderedQty;
      const newRow = `
        <tr>
          <td>${itemCode}</td>
          <td>${itemName}</td>
          <td>${unitPrice.toFixed(2)}</td>
          <td>${orderedQty}</td>
          <td>${total.toFixed(2)}</td>
        </tr>
      `;
      $("#orderCart tbody").append(newRow);
      updateTotals();
    });
  
    function validateDiscount(value) {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 && num <= 100;
    }
  
    function validateCash(value) {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }
  
    function updateBalance() {
      let subTotal = parseFloat($("#subTotalPrice").text());
      let discount = parseFloat($("#discountInput").val()) || 0;
      let cash = parseFloat($("#cashInput").val()) || 0;
  
      const discountAmount = subTotal * (discount / 100);
      const finalTotal = subTotal - discountAmount;
      const balance = cash - finalTotal;
  
      $("#discountAmount").text(discountAmount.toFixed(2));
      $("#totalPrice").text(finalTotal.toFixed(2));
      $("#balanceInput").val(balance.toFixed(2));
    }
  
    $("#discountInput").on("keyup change", function () {
      const value = $(this).val().trim();
      if (validateDiscount(value)) {
        $(this).removeClass("is-invalid").addClass("is-valid");
        $("#discountError").text("");
      } else {
        $(this).removeClass("is-valid").addClass("is-invalid");
        $("#discountError").text("Enter a valid discount (0 - 100)");
      }
      updateBalance();
    });
  
    $("#cashInput").on("keyup change", function () {
      const value = $(this).val().trim();
      const total = parseFloat($("#totalPrice").text()) || 0;
      const cash = parseFloat(value);
  
      if (validateCash(value)) {
        if (cash <= total) {
          $(this).removeClass("is-valid").addClass("is-invalid");
          $("#cashError").text("Insufficient cash. Must be greater than total.");
        } else {
          $(this).removeClass("is-invalid").addClass("is-valid");
          $("#cashError").text("");
        }
      } else {
        $(this).removeClass("is-valid").addClass("is-invalid");
        $("#cashError").text("Enter a valid cash amount");
      }
      updateBalance();
    });
  
    $("#btnPlaceOrder").on("click", function () {
      const discount = parseFloat($("#discountInput").val());
      const cash = parseFloat($("#cashInput").val());
      const total = parseFloat($("#totalPrice").text());
  
      let hasError = false;
  
      if (!validateDiscount(discount)) {
        $("#discountError").text("Enter a valid discount (0 - 100)");
        hasError = true;
      } else {
        $("#discountError").text("");
      }
  
      if (!validateCash(cash)) {
        $("#cashError").text("Enter a valid cash amount");
        hasError = true;
      } else if (cash <= total) {
        $("#cashError").text("Insufficient cash. Must be greater than total.");
        hasError = true;
      } else {
        $("#cashError").text("");
      }
  
      if (hasError) return;
  
      const balance = cash - total;
      $("#balanceInput").val(balance.toFixed(2));
  
      saveOrders();
      getAllOrders();
      
      
    });

    let orderDetails = [];
    function saveOrders() {
        const orderId = $("#orderId").val();
        const orderDate = $("#o_inputOrderDate").val();
        const customerId = $('#orderCustomerId').val();
        const discount = $("#discountInput").val();
        const totalPrice = parseFloat($("#totalPrice").text());

        const itemCode = $("#orderItemCode").val();
        const unitPrice = parseFloat($("#orderItemPrice").val());
        const orderedQty = parseInt($("#orderQty").val(), 10);

        const orderDetails = [
            {
                itmCode: itemCode,
                unitPrice: unitPrice,
                qty: orderedQty
            }
        ];

        if (confirm("Do you really want to place this order?")) {
            const order = new Order(orderId, orderDate, customerId, discount, totalPrice, orderDetails);
            ordersDB.push(order);
            console.log(order);
            alert("Order placed successfully!");
        }
        getAllOrders();
    }

    function getAllOrders() {
        const $container = $("#ordersList");
        $container.empty(); 
      
        ordersDB.forEach((order, index) => {
          const collapseId = `orderDetails${index}`;
      
          const $card = $(`
            <div class="card order-card mb-3 shadow-sm">
              <div class="card-header bg-dark text-white" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}" style="cursor: pointer;">
                <h5 class="mb-0">Order ID: ${order.orderId}</h5>
              </div>
              <div id="${collapseId}" class="collapse">
                <div class="card-body">
                  <p><strong>Order Date :</strong> ${order.orderDate}</p>
                  <p><strong>Customer ID :</strong> ${order.customerId}</p>
                  <p><strong>Discount :</strong> ${order.discount}%</p>
                  <p><strong>Total :</strong> Rs. ${order.totalPrice.toFixed(2)}</p>
                  <details class="mt-3">
                    <summary class="bg-secondary text-white p-2 rounded">View Order Items</summary>
                    <div class="mt-2">
                      <!-- Order items will be appended here -->
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `);
      
          const $itemsContainer = $card.find("details > div");
          order.orderDetails.forEach(detail => {
            const $item = $(`
              <div class="border-bottom pb-2 mb-2">
                <p><strong>Item Code :</strong> ${detail.itmCode}</p>
                <p><strong>Unit Price :</strong> Rs. ${detail.unitPrice.toFixed(2)}</p>
                <p><strong>Quantity :</strong> ${detail.qty}</p>
              </div>
            `);
            $itemsContainer.append($item);
          });
      
          $container.append($card);
        });
      }
      
      

    function validateQtyWhileTyping(input, errorField, errorMsg) {
        const value = parseFloat(input.val());
        if (isNaN(value) || value <= 0) {
          errorField.text(errorMsg);
          input.addClass("is-invalid"); 
          return false;
        } else {
          errorField.text('');
          input.removeClass("is-invalid"); 
          return true;
        }
      }
      
      $("#orderQty").on("keyup", function () {
        validateQtyWhileTyping(
          $(this),
          $("#itemQtyError"),
          "Please enter a valid ordered quantity."
        );
      });
      
  
    function loadCustomerDropdown() {
      const $customerSelect = $("#orderCustomerId");
      $customerSelect.empty().append('<option value="">Select Customer</option>');
      customerDB.forEach(customer => {
        $customerSelect.append(`<option value="${customer.customerId}">${customer.customerId}</option>`);
      });
    }
  
    function loadItemDropdown() {
      const $itemSelect = $("#orderItemCode");
      $itemSelect.empty().append('<option value="">Select Item</option>');
      itemDB.forEach(item => {
        $itemSelect.append(`<option value="${item.itemCode}">${item.itemCode}</option>`);
      });
    }
  
    function getNextOrderID() {
      if (ordersDB.length === 0) return "OID-001";
  
      let maxID = 0;
      ordersDB.forEach(order => {
        const parts = order.orderId.split("-");
        if (parts.length === 2) {
          const num = parseInt(parts[1], 10);
          if (num > maxID) {
            maxID = num;
          }
        }
      });
      const nextNumber = maxID + 1;
      return `OID-${nextNumber.toString().padStart(3, "0")}`;
    }
  
    function updateTotals() {
      let subTotal = 0;
      $("#orderCart tbody tr").each(function () {
        const rowTotal = parseFloat($(this).find("td:eq(4)").text());
        subTotal += rowTotal;
      });
      $("#subTotalPrice").text(subTotal.toFixed(2));
      $("#discountAmount").text("0.00");
      $("#totalPrice").text(subTotal.toFixed(2));
    }

   

  });


