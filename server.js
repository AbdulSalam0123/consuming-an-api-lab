const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => 
{
    res.render('index');
});

app.post('/weather', async (req, res) => 
{
    const zip = req.body.zip;
    const apiKey = process.env.API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${apiKey}`;

    try 
    {
        const response = await axios.get(url);
        const weatherData = response.data;
        res.redirect(`/weather/show?city=${weatherData.name}&temp=${weatherData.main.temp}&desc=${weatherData.weather[0].description}`);
    } 
    catch (error) 
    {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
    }
});

app.get('/weather/show', (req, res) => 
{
    const { city, temp, desc } = req.query;
    res.render('weather/show', { city, temp, desc });
});

app.listen(port, () => 
{
    console.log(`Server is running on port ${port}`);
});
