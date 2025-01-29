/*
* This is a file for routes that used only in assignments part of our project.
* By this I mean unnecessary parts for project to function, but the project must contain them by requirements of
* the assignments
* */

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/weather', async function (req, res, next) {
    const fetch = require('node-fetch');
    const apiKey = '8073d4dea5b12517f22802a8c791a2f3'; // who cares.
    const city = req.query.city || 'London'; // Default city if no query parameter is provided

    try {
        // Fetch weather data from OpenWeatherAPI
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherResponse.json();

        if (weatherResponse.status !== 200) {
            return res.status(weatherResponse.status).json({error: weatherData.message});
        }

        // Prepare weather information to return
        const weatherInfo = {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            coordinates: {
                lat: weatherData.coord.lat,
                lon: weatherData.coord.lon
            },
            feels_like: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            wind_speed: weatherData.wind.speed,
            country: weatherData.sys.country,
            rain_volume_3h: weatherData.rain ? weatherData.rain['3h'] || 0 : 0  // If no rain, default to 0
        };

        // Render the weather information on a map (or use a view)
        res.json({
            title: 'Weather Information',
            weather: weatherInfo,
            mapUrl: `https://www.google.com/maps/@${weatherData.coord.lat},${weatherData.coord.lon},10z`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Failed to fetch weather information.'});
    }
});

router.get('/crypto/trump', async function (req, res) {
    try {
        // Fetch TrumpCoin data from CoinGecko
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=trump&vs_currencies=usd');
        const cryptoData = await cryptoResponse.json();

        if (!cryptoData.trump) {
            return res.status(404).json({ error: 'Trump Coin data not found' });
        }

        res.json({
            title: 'Trump Coin Information',
            price: cryptoData.trump.usd,
            source: 'CoinGecko'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch Trump Coin price.' });
    }
});

module.exports = router;
