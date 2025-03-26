$(document).ready(function () {
    console.log('DashBoadController.js is ready!');

    $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
        const tabId = $(e.target).attr('id');

        switch (tabId) {
            case "pills-home-tab":
                $(".navbar-brand").text(" / DashBoard");
                break;
            case "pills-customer-tab":
                $(".navbar-brand").text(" / Customer Manage");
                break;
            case "pills-item-tab":
                $(".navbar-brand").text(" / Item Manage");
                break;
            case "pills-orders-tab":
                $(".navbar-brand").text(" / Order Manage");
                break;
            default:
                $(".navbar-brand").text("POS System");
        }
    });

    updateDashboardMetrics();

    function updateDashboardMetrics() {
        let totalSales = ordersDB.reduce((sum, order) => sum + order.totalPrice, 0);
        
        let totalOrders = ordersDB.length;
        
        let totalCustomers = customerDB.length;
        
        let inventoryStatus = itemDB.some(item => item.itemQty < 30) ? "Low Stock" : "Sufficient Stock";
      
        $("#totalSalesMetric").text(`Rs.${totalSales.toFixed(2)}`);
        $("#totalOrdersMetric").text(totalOrders);
        $("#allCustomersMetric").text(totalCustomers);
        $("#inventoryMetric").text(inventoryStatus);
      }

       $("#refreshDashboard").on("click", function() {
        updateDashboardMetrics();
      });
      
});

