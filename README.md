
# Covid-19-Tracker

## Description
```md
The COVID-19-Tracker allows users to select a country 
and view COVID-19 data including confirmed cases, deaths and recoveries. 
Data is fetched from the Covid-19 Rapid API and rendered via js.charts. 
Users can also select a previous date and view the COVID-19 totals up to that date. 
User searches are stored in local storage and appended below the search bar.
```

## User Story 

```md
As A businessman 
I WANT to see the number of Covid-19 Infections, Deaths and Recoveries
SO THAT I can see which countries are safe to travel for business.
```

## Acceptance Criteria 

```md
GIVEN I need to see Covid-19 data for every country.
WHEN I enter the page 
THEN I am presented with a well polished and easy to navigate page.
WHEN I click the dropdown 
THEN I am presented with a list of all the world countries.
WHEN I type a specific letter into the search bar 
THEN I am presented with countries with the specified letter
WHEN I click the date selector 
THEN I am presented with a calender to choose a specific date.
WHEN I click the submit button
THEN I am presented with the results of the specified country and timeframe.
WHEN I have searched for specific countries 
THEN all previously searched countries are displayed on the page
WHEN I click on a country in the search history
THEN I am again presented with results of the specified country and timeframe.
```

## Mock up

You can view the deployed App at this link. [Covid-19-Tracker](https://mm-salvodragotta.github.io/Covid-19-Tracker/).

## Technologies Used

**Chart.js**

A free JS library that allows users to represent data in 8 different responsive graphs. It is easy to use and allows for animated, interactive charts. We have used the bar chart.
link to Chart.js: https://www.chartjs.org/ 

**Covid-19 Rapid API**

An API that collects COVID-19 data from several reliable sources (i.e., John Hopkins, CDC, WHO). We have used 2 endpoints from this API - ‘get latest country data by name’ and ‘get latest totals.’
link to Covid-19 Rapid API: https://rapidapi.com/Gramzivi/api/covid-19-data/

**Bulma**

Bulma is a CSS Framework that allows you to style your webpage through pre-assigned classes. It is similar to Bootstrap in its functionality.
link to Bulma: https://bulma.io/

