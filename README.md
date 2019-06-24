# WestJet Seatmap

> Basic service to get and print seats for an specific flight.

- This POC only gets the seat map of one specyfic flight which is 
```json
{
  "segment": 1,
  "flightInfo": {
    "flight": [
      {
        "fareClass": "E",
        "flightNumber": "1508",
        "airlineCodeOperating": "WS",
        "operatingFlightNumber": "1508",
        "airlineCodeMarketing": "WS",
        "departureDateTime": "2019-07-27T10:30:00",
        "arrivalDateTime": "2019-07-26T12:26:00",
        "arrival": "SFO",
        "departure": "YYC"
      }
    ]
  },
  "pointOfSale": "QkFC"
}
```

### Pre-Requisites
- Nodejs v8.1 or above. You can get it [here](https://nodejs.org/fa/blog/release/v8.10.0/).
  - If you preffer you can install it through nvm, this repo already has a `.nvmrc` specifying version.

### How to start?

- Install npm dependencies
```bash
npm install
```

- Run the service
```bash
npm run start
```

- 🎉 Voilá, you are now seeing a printed view of the seat map for this flight.


![DEMO](https://github.com/Angel-Mu/westjet-seatmap/blob/develop/demo-result.png


### Annotations

+ MAGENTA = Seats Index
+ RED = Seat is already occupied
+ GREEN = Preferred seats (seats at the front with more leg space)
+ BLUE = Seat at exit row
+ CYAN = Regular seat
+ WHITE = Numbers at the begining/end of each row specifying the number of the row in the plane
