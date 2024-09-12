# bonzai-powernappers-cloud / Gruppuppgift Bonz.ai

### Endpoints :

### GET

Hämta alla rum

```
https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/rooms
```

#### Response

```
{
"success": true,
"data": [{
  "roomNmbr": "01",
  "roomType": "single",
  "roomId": "SR101",
  "price": 500,
  "beds": 1,
  "floorNmbr": "1",
  "isBooked": true
  }]
}
```

### GET

Hämta alla bokningar

```
https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking
```

Response

```
{
"success": true,
"data": [{
  "bookingId": "803c69ec-SR101",
  "checkIn": "\"2024-12-20\"",
  "totalPrice": 1000,
  "orderId": "803c69ec",
  "guestName": "MittNamn",
  "bookedRoom": {
  "roomNmbr": "01",
  "beds": 1,
  "roomType": "single",
  "roomId": "SR101",
  "price": 500,
  "floorNmbr": "1"
  },
    "checkOut": "\"2024-12-22\"",
    "guestEmail": "min@epost.nu"
  }]
}
```

### POST

Här skapar vi alla rum

```
https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/rooms
```

Exempel på hur du kan lägga till tre rum

```
[
  {
  "roomType": "single",
  "roomNmbr": "01",
  "floorNmbr": "1"
  },
  {
  "roomType": "double",
  "roomNmbr": "05",
  "floorNmbr": "1"
  },
  {
  "roomType": "suite",
  "roomNmbr": "06",
  "floorNmbr": "3"
  }
]
```

Response

```
{
  "success": true,
  "data": "All rooms added successfully."
}
```

### POST

För att göra en bokning

```
https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking
```

I body behöver du skicka med detta

```
{
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-22",
  "roomTypes": ["single", "double", "suite"],
  "guestName": "MittNamn",
  "guestEmail": "min@epost.nu",
  "nmbrOfGuests": 6
}
```

Response

```
{
"success": true,
"data": {
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-22",
  "bookingId": "9d6ce106",
  "roomTypes": [
    "single",
    "single",
    "double"
  ],
    "guestName": "MittNamn",
    "guestEmail": "min@epost.nu",
    "nmbrOfGuests": 4,
    "bookedRooms": [
      {
        "roomNmbr": "03",
        "roomType": "single",
        "roomId": "SR103",
        "price": 500,
        "beds": 1,
        "floorNmbr": "1"
      },
      {
        "roomNmbr": "06",
        "roomType": "double",
        "roomId": "DR106",
        "price": 1000,
        "beds": 2,
        "floorNmbr": "1"
      },
      {
        "roomNmbr": "06",
        "roomType": "suite",
        "roomId": "SU306",
        "price": 1500,
        "beds": 3,
        "floorNmbr": "3"
      },
    ],
    "totalPrice": 3000
  }
}
```

### PUT

Uppdatera bokningen

```
https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking/{id}
```

I body behöver du skicka med detta

```
{
  "checkIn": "2024-12-20",
  "checkOut": "2024-12-22",
  "roomTypes": ["double"],
  "nmbrOfGuests": 2
}
```

Response

```
{
  "success": true,
  "data": {
    "roomTypes": [
      "double"
    ],
    "nmbrOfGuests": 2,
    "checkIn": "2024-12-20",
    "checkOut": "2024-12-22",
    "bookingId": "52bd086c",
    "guestEmail": "min@epost.nu",
    "guestName": "MittNamn",
    "bookedRooms": [
      {
        "roomNmbr": "05",
        "roomType": "double",
        "roomId": "DR105",
        "price": 1000,
        "beds": 2,
        "floorNmbr": "1"
      }
    ],
    "totalPrice": 2000
  }
}
```

### DELETE

Skriv in orderId uppe i url på den du vill ta bort

```
https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking/{id}
```

Response

```
{
  "success": true,
  "data": "Booking successfully deleted"
}
```
