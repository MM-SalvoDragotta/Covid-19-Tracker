const rapidApiKey = "689cdde1e7mshecdba67d4030dcfp1c88acjsn0cf409ea52a5";
const rapidApiHost = "covid-19-data.p.rapidapi.com"

const options = {
	headers: {
	  "x-rapidapi-host": rapidApiHost,
	  "x-rapidapi-key": rapidApiKey,
	},
  };

var countryName = document.getElementById('results-text');

var country = "USA";
const labels = ['Confirmed', 'Deaths', 'Recovered'];
countryName.textContent = toTitleCas(country);

const endpointUrl = `https://covid-19-data.p.rapidapi.com/country?name=${country}`;

//https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
function toTitleCas (phrase) {
	return phrase
	  .toLowerCase()
	  .split(' ')
	  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
	  .join(' ');
  };

//Fetch country data and display it
fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	  })
	  .then((body) => {
	// console.log(body);
	// console.log(body[0].confirmed)
	renderChart(body[0].confirmed, body[0].deaths, body[0].recovered)	
	  })
	  .catch((err) => {
		console.log(err);
	  });

//helpful tute on how to use charts.js: https://www.youtube.com/watch?v=sE08f4iuOhA 
function renderChart (confirmed, deaths, recovered ){	
	// countryData = [30903, 910, 29466]
	var barChartData ={
		type: 'bar', //bar, horizontalBar, pie, line, donut, radar, polarArea , doughnut
			data: {
			labels: labels,
			datasets: [{
			data: [confirmed, deaths, recovered],
			backgroundColor: ["blue" , "red", "green"],
			borderColor: ["black" , "black" , "black" ],
			borderWidth: 1.5,
			hoverOffset: 4
		}]		 
		},
			options: {
				// events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
				plugins: {
					legend: {
						display: false
					},
					subtitle: {
						display: true,
						text: 'Confirmed Deaths Recovered'
					},
					// customPlugin : {
					// 	id: 'custom_canvas_background_color',
					// 	beforeDraw: (myChart) => {
					// 		const ctx = myChart.canvas.getContext('2d');
					// 		ctx.save();
					// 		ctx.globalCompositeOperation = 'destination-over';
					// 		ctx.fillStyle = 'black';
					// 		ctx.fillRect(0, 0, myChart.width, myChart.height);
					// 		ctx.restore();
					// 	}

				// },
				// tooltip: {
				// 	// Tooltip will only receive click events
				// 	events: ['click']
				//   }
			}
		}


	};	
	var myChart = document.getElementById('myChart').getContext('2d');
	let covidDataChart = new Chart(myChart, barChartData);

}


  
// add event handler on submit button