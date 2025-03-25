$(document).ready(function () {
    console.log("ItemController.js is ready!");

    if (typeof itemDB === "undefined") {
        window.itemDB = [];
    }

    getAllItems();
    $("#itemCode").val(getNextItemID());
    $("#btnSaveItem").prop("disabled", true);

    $("#itemCode").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_CODE_REGEX, $("#itemCodeError"), "Format: I00-001");
        if (valid && e.key === "Enter") {
            $("#itemName").focus();
        }
    });

    $("#itemName").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_NAME_REGEX, $("#itemNameError"), "Minimum 3 characters Max 20");
        if (valid && e.key === "Enter") {
            $("#itemQty").focus();
        }
    });

    $("#itemQty").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_QTY_REGEX, $("#itemQtyError"), "Enter a valid quantity");
        if (valid && e.key === "Enter") {
            $("#itemPrice").focus();
        }
    });

    $("#itemPrice").on("keyup", function (e) {
        const valid = validateItemField($(this), ITEM_PRICE_REGEX, $("#itemPriceError"), "Format: 100 or 100.00");
        $("#btnSaveItem").prop("disabled", !valid);
    });

    // Submit form to save item
    $("#itemForm").submit(function (e) {
        e.preventDefault();

        const isValid =
            validateItemField($("#itemCode"), ITEM_CODE_REGEX, $("#itemCodeError"), "Format: I00-001") &&
            validateItemField($("#itemName"), ITEM_NAME_REGEX, $("#itemNameError"), "Minimum 3 characters Max 20") &&
            validateItemField($("#itemQty"), ITEM_QTY_REGEX, $("#itemQtyError"), "Enter a valid quantity") &&
            validateItemField($("#itemPrice"), ITEM_PRICE_REGEX, $("#itemPriceError"), "Format: 100 or 100.00");

        if (!isValid) return;

        saveItem();
        resetItemForm();
    });

    $("#btnUpdateItem").on("click", function (e) {
        e.preventDefault();
        updateItem();
    });

    $("#itemTable tbody").on("dblclick", "tr", function () {
        const code = $(this).find("td:eq(0)").text();
        deleteItem(code);
    });

    $("#itemTable").on("click", "tbody tr", function () {
        const code = $(this).find("td:eq(0)").text();
        const name = $(this).find("td:eq(1)").text();
        const qty = $(this).find("td:eq(2)").text();
        const price = $(this).find("td:eq(3)").text();

        $("#itemCode").val(code);
        $("#itemName").val(name);
        $("#itemQty").val(qty);
        $("#itemPrice").val(price);

        $("#btnSaveItem").prop("disabled", true);
    });

    $("#btnResetItemForm").on("click", function (e) {
        e.preventDefault();
        resetItemForm();
    });

    $("#itemSearchButton").on("click", function () {
        const searchTerm = $("#itemSearchInput").val().toLowerCase();
        const filtered = itemDB.filter(item =>
            item.itemCode.toLowerCase().includes(searchTerm)
        );
        renderItemTable(filtered);
    });

    // ---------- Functions ----------

    function renderItemTable(items) {
        $("#itemTable tbody").empty();
        items.forEach(addItemToTable);
    }

    function addItemToTable(item) {
        const newRow = `
            <tr>
                <td>${item.itemCode}</td>
                <td>${item.itemName}</td>
                <td>${item.itemQty}</td>
                <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
            </tr>`;
        $("#itemTable tbody").append(newRow);
    }

    function getAllItems() {
        $("#itemTable tbody").empty();
        itemDB.forEach(addItemToTable);
    }

    function resetItemForm() {
        $("#itemForm")[0].reset();
        resetItemValidation("#itemForm");
        $("#btnSaveItem").prop("disabled", false);
        $("#itemCode").val(getNextItemID());
    }

    function saveItem() {
        const code = $("#itemCode").val();
        const name = $("#itemName").val();
        const qty = parseInt($("#itemQty").val(), 10);
        const price = parseFloat($("#itemPrice").val());

        if (existItem(code)) {
            alert("Item with this code already exists!");
            return;
        }

        if (confirm("Do you really want to add this item?")) {
            const item = new Item(code, name, qty, price);
            itemDB.push(item);
            getAllItems();
            alert("Item saved successfully!");
        }
    }

    function updateItem() {
        const code = $("#itemCode").val();
        const name = $("#itemName").val();
        const qty = parseInt($("#itemQty").val(), 10);
        const price = parseFloat($("#itemPrice").val());

        const index = itemDB.findIndex(item => item.itemCode === code);

        if (index === -1) {
            alert("Item not found!");
            return;
        }

        if (confirm("Do you really want to update this item?")) {
            itemDB[index] = new Item(code, name, qty, price);
            getAllItems();
            alert("Item updated successfully!");
            resetItemForm();
        }
    }

    function deleteItem(code) {
        if (confirm("Are you sure you want to remove this item?")) {
            const index = itemDB.findIndex(item => item.itemCode === code);
            if (index !== -1) {
                itemDB.splice(index, 1);
                alert("Item deleted successfully");
                getAllItems();
                resetItemForm();
            } else {
                alert("Item not found");
            }
        }
    }

    function existItem(code) {
        return itemDB.some(item => item.itemCode === code);
    }

    function getNextItemID() {
        if (itemDB.length === 0) return "I00-001";

        let maxID = 0;
        itemDB.forEach(item => {
            const parts = item.itemCode.split("-");
            if (parts.length === 2) {
                const num = parseInt(parts[1], 10);
                if (num > maxID) maxID = num;
            }
        });

        const nextNumber = (maxID + 1).toString().padStart(3, "0");
        return `I00-${nextNumber}`;
    }
});
