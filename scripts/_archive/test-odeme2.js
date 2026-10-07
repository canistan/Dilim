const http = require('http');

const payload = {
  customerInfo: {
    firstName: "Şemsi",
    lastName: "Albayrak",
    email: "semsicanalbayrak@gmail.com",
    phone: "05077880172",
    address: "Üsküdar, İcadiye mahallesi, Temaşa Sokak, No:31/1",
    district: "Üsküdar",
    isCorporate: false,
    companyName: "",
    taxOffice: "",
    taxNumber: ""
  },
  items: [
    {
      id: 21, // Let's guess a valid ID from the products DB if 44 is invalid. Wait, I should find the real ID for Çikolatin (Kg).
      quantity: 1,
      options: ""
    }
  ],
  totalAmount: 1980,
  couponCode: "CUNEYD10"
};

// ... Wait, I'll fetch the actual ID for 'Çikolatin (Kg)' from the API first.
