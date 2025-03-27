$(document).ready(function () {
    console.log('DashBoadController.js is ready!');

    updateDateTime();
    updateDashboardMetrics();
    setInterval(updateDateTime, 60000);


    $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
        const tabId = $(e.target).attr('id');

        switch (tabId) {
            case "pills-home-tab":
                $(".navbar-brand").text(" / DashBoard");
                break;
            case "pills-customer-tab":
                $(".navbar-brand").text(" / Customers ");
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

    $("#refreshDashboard").on("click", function() {
        updateDashboardMetrics();
    });

    
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

      function updateDateTime() {
        console.log("Updating date and time...");
        const now = new Date();
    
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
        const day = days[now.getDay()];
        const month = months[now.getMonth()];
        const date = now.getDate();
    
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12 || 12;
    
        const formatted = `${day} ${month} ${date} | ${hours}:${minutes} ${ampm}`;
        $('#datetime').text(formatted);
      }
    
});

