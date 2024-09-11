# bonzai-powernappers-cloud
Gruppuppgift Bonz.ai

Här är våra endpoints : 

  GET - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/rooms
  POST - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/rooms
  POST - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking
  PUT - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking/{id}
  DELETE - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking/{id}
  GET - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking

  Förtydligande : För att Göra en bokning i vårat api behövs detta : 
  
  POST - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking
  {
   "checkIn": "checkIn",
   "checkOut": "checkOut",
   "roomTypes": "roomTypes",
   "guestName": "guestname", 
   "guestEmail" : "guestEmail"
   "nmbOfGuests": nmbrOfGuests

  }

  Lägga till rum :
  POST - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/rooms

  [
    {
        "roomType": "single",
        "roomNmbr": "01",
        "floorNmbr": "1"
    }
    ]
våra rumstyper är : "single","double","suit"

    

  Ändra en bokning:
  PUT - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking/{id} - { bookingId }
 
  {
   "checkIn": "checkIn",
   "checkOut": "checkOut",
   "roomTypes": "roomTypes",
   "guestName": "guestname", 
   "guestEmail" : "guestEmail"
   "nmbOfGuests": nmbrOfGuests

  }
  
  Ta bort en bokning:
  DELETE - https://ju3la8czha.execute-api.eu-north-1.amazonaws.com/api/booking/{id} -  { bookingId }
