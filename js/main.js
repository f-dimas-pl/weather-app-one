const API_KEY = '4d0acb5c587ea09e45d027229439b325';
const form = document.querySelector('#form');
const weatherWrapper = document.querySelector('.weather');
const formInput = document.querySelector('.form__input');
const img = document.querySelector('.weather__img');


form.onsubmit = submitHandler;

async function submitHandler (event) {
	event.preventDefault();

	if (!formInput.value.trim()) {
		console.log('Enter City name');
		return
	}

	const cityName = formInput.value.trim();

	// Очистка инпута
	formInput.value = '';

	const cityInfo = await getGeo(cityName);

	if (!cityInfo.length) {
		return
	}

	const weatherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon']);

	const weatherData = {
		name: weatherInfo.name,
		temp: weatherInfo.main.temp,
		humidity: weatherInfo.main.humidity,
		speed: weatherInfo.wind.speed,
		main: weatherInfo.weather[0]['main'],
	};

	renderWeatherData(weatherData);
}

async function getGeo (name) {
	const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
	const response = await fetch(geoUrl);
	const data = await response.json();
	console.log(data);
	return data;
}

async function getWeather (lat, lon) {
	const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	const response = await fetch(weatherUrl);
	const data = await response.json();
	console.log(data);
	return data;
}

function renderWeatherData (data) {
	const weatherInfo = document.querySelector('.weather__info');
	// weatherInfo.classList.remove('none');
	weatherInfo.style.cssText = 'margin-top: 50px;';

	// const weatherDetails = document.querySelector('.weather__details');
	// weatherDetails.classList.remove('none');
	
	const temp = document.querySelector('.weather__temp');
	const city = document.querySelector('.weather__city');
	const humidity = document.querySelector('#humidity');
	const speed = document.querySelector('#speed');

	temp.innerText = Math.round(data.temp)+ ' °C';
	city.innerText = data.name;
	humidity.innerText = data.humidity + ' %';
	speed.innerText = data.speed + ' км / ч';

	const fileNames = {
		'Clouds': 'clouds',
		'Clear': 'clear',
		'Rain': 'rain',
		'Mist': 'mist',
		'Drizzle': 'drizzle',
		'Snow': 'snow',
	}

	if (fileNames[data.main]) {
		img.src = `./img/weather/${fileNames[data.main]}.png`;
	}
}

