'use strict';

$(document).ready(function() {
  //get location of user
  var startPosition,
    latitude,
    longitude,
    currently,
    icon,
    imageURL,
    unitTemp,
    temperature = $('#temperature'),
    windData = $('#wind-data'),
    summaryIcon = $('#summary-icon'),
    geoOptions = {
      maximumAge: 5 * 60 * 1000,
      timeout: 10 * 1000
    },
    APIKEY_forecast = '4c0201f38184db4de3d293a5bbd6cf3e',
    APIKEY_google = 'AIzaSyAHWewHxp-UFBGRZrKFXzlQtTXFDl8UDAU';


  var geoSuccess = function(position) {

    //provide location information to API, receive weather information back
    //using forecast.io's API
    startPosition = position;
    latitude = startPosition.coords.latitude;
    longitude = startPosition.coords.longitude;
    console.log(startPosition.coords.latitude, startPosition.coords.longitude);

    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + APIKEY_google)
      .success(function(address) {
        console.log(address);

        $('#location').html('in ' + address.results[2].formatted_address);
      });

    $.getJSON('https://api.forecast.io/forecast/' + APIKEY_forecast + '/' + latitude + ',' + longitude + '?callback=?')
      .success(function(weather) {
        console.log(weather);

        unitTemp = 'F';
        currently = weather.currently;
        icon = currently.icon;
        imageURL = './img/' + icon + '.jpg';

        var imperial = {
          temp: Math.round(currently.temperature),
          wind: Math.round(currently.windSpeed) + ' mph'
        };

        var metric_temp = Math.round((imperial.temp - 32) * 5/9);
        var metric_wind = Math.round(parseInt(imperial.wind) * 1.61);

        var metric = {
          temp: metric_temp,
          wind: metric_wind + ' km/h'
        };

        temperature.html(imperial.temp);
        $('#summary').html(currently.summary);
        $('#image').css('background', 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(\'' + imageURL + '\') center/100%');
        windData.html(imperial.wind);
        $('#precip-data').html(currently.precipProbability + ' %');

        //change units to F or C
        $('#celcius').on('click', function() {
          temperature.html(metric.temp);
          windData.html(metric.wind);
        });

        $('#fahrenheit').on('click', function() {
          temperature.html(imperial.temp);
          windData.html(imperial.wind);
        });
        
        switch(icon) {
          case 'clear-day':
            summaryIcon.removeClass().addClass('wi wi-day-sunny');
            break;
          case 'clear-night':
            summaryIcon.removeClass().addClass('wi wi-night-clear');
            break;
          case 'rain':
            summaryIcon.removeClass().addClass('wi wi-rain');
            break;
          case 'snow':
            summaryIcon.removeClass().addClass('wi wi-snow');
            break;
          case 'sleet':
            summaryIcon.removeClass().addClass('wi wi-sleet');
            break;
          case 'wind':
            summaryIcon.removeClass().addClass('wi wi-cloudy-gusts');
            break;
          case 'fog':
            summaryIcon.removeClass().addClass('wi wi-fog');
            break;
          case 'cloudy':
            summaryIcon.removeClass().addClass('wi wi-cloudy');
            break;
          case 'partly-cloudy-day':
            summaryIcon.removeClass().addClass('wi wi-day-sunny-overcast');
            break;
          case 'partly-cloudy-night':
            summaryIcon.removeClass().addClass('wi wi-night-alt-cloudy');
            break;
          default:
        }
      });
  };

  var geoError = function(error) {
    console.log('error occurred: ', error.code);
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);

  //display information on webpage
});

//find icons to match icon text
//determine what info goes inside the card reveal
//determine what info goes inside the card image
//determine what info goes inside the card content
