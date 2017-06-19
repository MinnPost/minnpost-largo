/**
 * @file
 * Main JS file for the MinnPost Weather module.
 */
  
var iconPrefix = 'https://s3.amazonaws.com/data.minnpost/icons/ham-weather-icons/';

function minnpostWeatherTop(resp) {
  var output = '';
  output += '<a href="https://www.minnpost.com/weather" class="a-minnpost-weather-inner" title="Weather around ' + resp.place.name + ': ' + resp.ob.weather + '">';
  output += '  <img src="' + iconPrefix + resp.ob.icon + '" class="weather-icon" />';
  output += '  <span class="weather-temperature">' + resp.ob.tempF + '&deg;F</span>';
  output += '</a>';
  return output;
};

function minnpostWeather() {
  // The usual behavior check to ensure this doesn't get called
  // multiple times
  if ($('body').hasClass('minnpost-weather')) {
    return;
  } else {
    $('body').addClass('minnpost-weather')
  }

  // Check for hostname to determine which key to use.  Keys are
  // in the repository as they are out in the open anyway, and
  // HAM Weather checks domains and will stop widget if it
  // comes from a domain that is not registered.
  var api = {
    client_id: 'fGr6zBenMa6pU6ahS3RVm',
    client_secret: 'gS3Bmj4vuhA9ZvLPaLLtiMdUbg6wcsiokHTMIYoS'
  };
  
  if (document.location.hostname === 'stage.minnpost.com') {
    api = {
      client_id: 'fGr6zBenMa6pU6ahS3RVm',
    client_secret: 'IWdo9yudrvvKgGwzLsioVpdytiU6lLxfY2mjwd3R'
    };
  } else if (document.location.hostname === 'localhost' || document.location.hostname === 'minnpost.dev' || document.location.hostname === 'minnpost-wordpress.dev') {
    api = {
      client_id: 'fGr6zBenMa6pU6ahS3RVm',
      client_secret: 'IWdo9yudrvvKgGwzLsioVpdytiU6lLxfY2mjwd3R'
    };
  }

  var request = '//api.aerisapi.com/observations/?p=:auto';
  request += '&client_id=' + api.client_id + '&client_secret=' + api.client_secret;

  try {
    $.getJSON(request, function(data) {
      if (data.success === true) {
        $('.a-minnpost-weather').html(minnpostWeatherTop(data.response));
        $('.a-minnpost-weather').fadeIn();
      }
    });
  } catch (e) {
    window.console && console.log(e);
  }
};


$(document).ready(function() {
  minnpostWeather();
});
