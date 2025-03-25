$(document).ready(function () {
    console.log("CustomerController.js is ready!");

    getAllCustomers();
    $("#customerId").val(getNextCustomerID());
  
    $("#btnSaveCustomer").prop("disabled", true);
  
    $("#customerId").on("keyup", function (e) {
      const valid = validateField($(this), CUS_ID_REGEX, $("#customerIdError"), "Format: C00-001");
      if (valid && e.key === "Enter") {
        $("#customerName").focus();
      }
    });
  
    $("#customerName").on("keyup", function (e) {
      const valid = validateField($(this), CUS_NAME_REGEX, $("#customerNameError"), "Minimum 4 characters");
      if (valid && e.key === "Enter") {
        $("#customerAddress").focus();
      }
    });
  
    $("#customerAddress").on("keyup", function (e) {
      const valid = validateField($(this), CUS_ADDRESS_REGEX, $("#customerAddressError"), "Minimum 7 characters");
      if (valid && e.key === "Enter") {
        $("#customerSalary").focus();
      }
    });
  
    $("#customerSalary").on("keyup", function (e) {
      const valid = validateField($(this), CUS_SALARY_REGEX, $("#customerSalaryError"), "Format: 100 or 100.00");
      if (valid) {
        $("#btnSaveCustomer").prop("disabled", false);
      } else {
        $("#btnSaveCustomer").prop("disabled", true);
      }
    });
  
    $("#registrationForm").submit(function (e) {
      e.preventDefault();
  
      const isValid =
        validateField($("#customerId"), CUS_ID_REGEX, $("#customerIdError"), "Format: C00-001") &&
        validateField($("#customerName"), CUS_NAME_REGEX, $("#customerNameError"), "Minimum 4 characters") &&
        validateField($("#customerAddress"), CUS_ADDRESS_REGEX, $("#customerAddressError"), "Minimum 7 characters") &&
        validateField($("#customerSalary"), CUS_SALARY_REGEX, $("#customerSalaryError"), "Format: 100 or 100.00");
  
      if (!isValid) return;

      saveCustomer();
      resetForm();

    });

    $("#btnUpdateCustomer").on("click", function (e) {
        e.preventDefault(); 
        updateCustomer();
    }); 

$("#customerTable tbody").on("dblclick", "tr", function () {
    let customerId = $(this).find("td:eq(0)").text();
    deleteCustomer(customerId);
    
  });
  

    $("#btnRestForm").on("click", function (e) {
        e.preventDefault(); 
        resetForm();
    });

$("#customerTable").on("click", "tbody tr", function () {
    const customerId = $(this).find("td:eq(0)").text();
    const customerName = $(this).find("td:eq(1)").text();
    const customerAddress = $(this).find("td:eq(2)").text();
    const customerSalary = $(this).find("td:eq(3)").text();
  
    $("#customerId").val(customerId);
    $("#customerName").val(customerName);
    $("#customerAddress").val(customerAddress);
    $("#customerSalary").val(customerSalary);
  
    $("#btnSaveCustomer").prop("disabled", true); 
  });
  

  function renderTable(customers) {
    $("#customerTable tbody").empty();
    customers.forEach(customer => addToTable(customer));
  }

  function addToTable(customer) {
    const newRow = `
      <tr>
        <td>${customer.customerId}</td>
        <td>${customer.customerName}</td>
        <td>${customer.customerAddress}</td>
        <td>${customer.customerSalary}</td>
      </tr>`;
    $("#customerTable tbody").append(newRow);
  }

  renderTable(customerDB);

  $("#searchButton").on("click", function () {
    let searchTerm = $("#form1").val().toLowerCase();

    let filteredCustomers = customerDB.filter(customer => {
      return customer.customerId.toLowerCase().includes(searchTerm);
    });

    renderTable(filteredCustomers);
  });


    function resetForm() {
        $("#registrationForm")[0].reset();
        resetValidation("#registrationForm");
        $("#btnSaveCustomer").prop("disabled", false);
        $("#customerId").val(getNextCustomerID());
    }

  
    function addToTable(customerDB) {
      const newRow = `
        <tr>
          <td>${customerDB.customerId}</td>
          <td>${customerDB.customerName}</td>
          <td>${customerDB.customerAddress}</td>
          <td>${customerDB.customerSalary}</td>
        </tr>`;
      $("#customerTable tbody").append(newRow);
    }
  
    function getAllCustomers() {
        $("#customerTable tbody").empty();
        customerDB.forEach(addToTable);
    }

    function saveCustomer() {
        const id = $("#customerId").val();
        const name = $("#customerName").val();
        const address = $("#customerAddress").val();
        const salary = $("#customerSalary").val();
    
        if (existCustomer(id)) {
            alert("Customer with this ID already exists!");
            return;
        }
    
        if (confirm('Do you really need to add this Customer...?')) {
            const customer = new Customer(id, name, address, salary);

            customerDB.push(customer);
            getAllCustomers();
            alert("Customer saved successfully!");
        }
    }

    function updateCustomer() {
    const id = $("#customerId").val();
    const name = $("#customerName").val();
    const address = $("#customerAddress").val();
    const salary = $("#customerSalary").val();

    const customer = new Customer(id, name, address, salary);

    const customerIndex = customerDB.findIndex(c => c.customerId === customer.customerId);

    if (customerIndex === -1) {
        showAlert("Customer not found!", "warning");
        return;
    }

    if (confirm("Do you really want to update this customer?")) {
        customerDB[customerIndex] = customer;

        getAllCustomers();

        alert("Customer updated successfully!");

        resetForm();
    }
}


    function deleteCustomer(id) {
        let result = confirm("Are you sure you want to remove this customer?");
        if (result) {
            let index = customerDB.findIndex(c => c.customerId === id);
        
            if (index !== -1) {
                customerDB.splice(index, 1);
                alert("Customer deleted successfully");
                getAllCustomers();
                resetForm();
            } else {
                alert("Customer not removed");
            }
        }
    }
    
    
    
    function existCustomer(id) {
        return customerDB.some(function (customer) {
            return customer.customerId === id;
        });
    }



    function getNextCustomerID() {
        if (customerDB.length === 0) return "C00-001";
      
        let maxID = 0;
      
        $.each(customerDB, function (index, customer) {
          let parts = customer.customerId.split("-");
          if (parts.length === 2) {
            let num = parseInt(parts[1], 10);
            if (num > maxID) {
              maxID = num;
            }
          }
        });
      
        let nextNumber = maxID + 1;
        let formattedNumber = nextNumber.toString().padStart(3, "0");
        return `C00-${formattedNumber}`;
      }
      
   
  
  });
