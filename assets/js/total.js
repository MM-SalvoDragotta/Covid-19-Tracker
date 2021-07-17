const totalArray = [];

function totalData (){
	const endpointUrl = `https://covid-19-data.p.rapidapi.com/totals`;
	
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
}