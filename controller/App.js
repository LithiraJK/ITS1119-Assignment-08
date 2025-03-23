$(document).ready(function () {
    console.log('App.js is ready!');
    
  
    $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
      const tabId = $(e.target).attr('id');
  
      switch (tabId) {
        case "pills-home-tab":
          $("nav h2").text("DashBoard");
          break;
        case "pills-customer-tab":
          $("nav h2").text("Customer Manage");
          break;
        case "pills-item-tab":
          $("nav h2").text("Item Manage");
          break;
        case "pills-orders-tab":
          $("nav h2").text("Order Manage");
          break;
        default:
          $("nav h2").text("POS System");
      }
    });
  
  });
  