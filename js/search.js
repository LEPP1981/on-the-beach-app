document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const resultContainer = document.getElementById('results');
    const bestHolidayResult = document.getElementById('results');

    searchForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const destination = document.getElementById('destination').value;
        const departureDate = document.getElementById('departureDate').value;
        const nights = parseInt(document.getElementById('nights').value);

        const flightData = await fetchFlightData();
        const hotelData = await fetchHotelData();

        let bestHoliday = null;
        let bestPrice = Infinity;

        for (const flight of flightData) {
            if (flight.to === destination && flight.departure_date === departureDate) {
                for (const hotel of hotelData) {
                    if (hotel.local_airports.includes(destination)) {
                        const totalPrice = flight.price + (hotel.price_per_night * nights);
                        if (totalPrice < bestPrice) {
                            bestHoliday = {
                                flight,
                                hotel,
                                totalPrice
                            };
                            bestPrice = totalPrice;
                        }
                    }
                }
            }
        }

        if (bestHoliday) {
            bestHolidayResult.innerHTML = `
          <h3>Best Value Holiday Bundle:</h3>
          <p>Flight: ${bestHoliday.flight.airline} (From: ${bestHoliday.flight.from}, To: ${bestHoliday.flight.to})</p>
          <p>Hotel: ${bestHoliday.hotel.name}</p>
          <p>Total Price: $${bestHoliday.totalPrice}</p>
        `;
        } else {
            bestHolidayResult.innerHTML = '<p>No matching holiday bundle found.</p>';
        }

        resultContainer.style.display = 'block';
    });

    async function fetchFlightData() {
        try {
            const response = await fetch('../sources/flightData.json');
            return response.json();
        } catch (error) {
            console.error('Error fetching flight data:', error);
            return [];
        }
    }

    async function fetchHotelData() {
        try {
            const response = await fetch('../sources/hotelData.json');
            return response.json();
        } catch (error) {
            console.error('Error fetching hotel data:', error);
            return [];
        }
    }
});