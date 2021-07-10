const rapidApiKey = "689cdde1e7mshecdba67d4030dcfp1c88acjsn0cf409ea52a5";
const rapidApiHost = "covid-19-data.p.rapidapi.com"

const options = {
	headers: {
	  "x-rapidapi-host": rapidApiHost,
	  "x-rapidapi-key": rapidApiKey,
	},
  };

var country = "australia"
const endpointUrl = "https://covid-19-data.p.rapidapi.com/country?name=" + country;


fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	  })
	  .then((body) => {
		console.log(body);
		console.log(body[0].confirmed)
	  })
	  .catch((err) => {
		console.log(err);
	  });

//helpful tute on how to use charts.js: https://www.youtube.com/watch?v=sE08f4iuOhA 
let myChart1 = document.getElementById('myChart').getContext('2d');

	let Population = new Chart(myChart, {
		type: 'line', //bar, horizontalBar, pie, line, donut, radar, polarArea
		data: {
		labels: ['lane cove', 'longuevile', 'crows-nest', 'greenwich'],
		datasets: [{
		   label: 'Population',
		   data: 
		   [1934920, 
			2392395, 
			12849, 
			2911204]
		}]
	}
})



















































































function getCountries() {

	fetch("https://covid-19-data.p.rapidapi.com/help/countries", {
		method: "GET",
		headers: {
			"x-rapidapi-host": rapidApiHost,
			"x-rapidapi-key": rapidApiKey,
		}
	})
	.then(response => {
		return response.json();
	})
	.then((body) => {
		console.log(body);
		console.log(body[0].name)
		for (var i = 0 ; i < body.length ; i++ ) {
			$("#browsers").append("<option value='" + body[i].name + "'>");
		};
	})
	.catch((err) => {
		console.log(err);
	});

};

getCountries();