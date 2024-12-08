const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;


app.get('/', (req, res) => 
{
  res.render('index');
});

app.post('/weather', async (req, res) => 
{
    const zip = req.body.zip;
    const type = req.body.type;
    if (type === 'forecast') 
    {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip},us&units=imperial&appid=${API_KEY}`
        const response = await axios.get(apiUrl)
        const forecastData = response.data
        const groupedForecast = {}
        forecastData.list.forEach((item) => 
        {
            const date = item.dt_txt.split(' ')[0];
            if (!groupedForecast[date])
                groupedForecast[date] = [];
            groupedForecast[date].push({ time: item.dt_txt.split(' ')[1], temp: item.main.temp, description: item.weather[0].description, icon: item.weather[0].icon});
        })

        res.render('weather/forecast',
        {
            city: forecastData.city.name,
            groupedForecast
        })
    }
    else if (type === 'current')
    {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${API_KEY}`;
        const response = await axios.get(apiUrl);
        const weatherData = response.data;
        res.render('weather/show',
        {
            city: weatherData.name,
            temp: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            sunrise: moment.unix(weatherData.sys.sunrise).format('h:mm A'),
            sunset: moment.unix(weatherData.sys.sunset).format('h:mm A'),
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure
        })
    } 
    else
    {
      res.render('error',
    {
        message: 'Invalid weather type selected. Please try again.'
    })
    }
})

app.listen(PORT, () => 
{
  console.log(`Server is running on: ${PORT}`);
})