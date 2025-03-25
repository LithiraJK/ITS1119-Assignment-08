$(document).ready(function () {
    console.log('App.js is ready!');
    
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
});
