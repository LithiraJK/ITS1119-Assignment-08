let customerDB = [
    {
      customerId: "C00-001",
      customerName: "Lithira Jayanaka",
      customerAddress: "Baddegama",
      customerSalary: "100000.00",
    },
    {
      customerId: "C00-002",
      customerName: "Dusan Navidu",
      customerAddress: "Mathara Road",
      customerSalary: "85000.00",
    },
    {
        customerId: "C00-003",
        customerName: "Ahasna",
        customerAddress: "Weligama Mathara",
        customerSalary: "80000.00",
    },
  ];

let itemDB = [
    {
        itemCode: "I00-001",
        itemName: "Keeri Samba 1KG",
        itemQty: 50,
        unitPrice:240.00,
    },
    {
        itemCode: "I00-002",
        itemName: "Anchor 400g",
        itemQty: 20,
        unitPrice:640.00,
    },
    {
        itemCode: "I00-003",
        itemName: "Egg",
        itemQty: 100,
        unitPrice:35.00,
    },

]

let ordersDB = [
  {  
    orderId:"OID-001",
    orderDate:"2025/03/24", 
    customerId:"C00-001", 
    discount: 5, 
    totalPrice: 1800,
    orderDetails:[
        {itmCode:"I00-001", unitPrice:1200.00, qty:5},
        {itmCode:"I00-002", unitPrice:640.00, qty:2}
    ]
  },
]