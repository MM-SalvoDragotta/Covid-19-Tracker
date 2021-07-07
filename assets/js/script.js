fetch("https://covid-19-data.p.rapidapi.com/country?name=australia", {
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "689cdde1e7mshecdba67d4030dcfp1c88acjsn0cf409ea52a5",
			"x-rapidapi-host": "covid-19-data.p.rapidapi.com"
		}
	})
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
	