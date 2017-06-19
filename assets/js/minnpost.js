'use strict';

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
    $('body').addClass('minnpost-weather');
  }

  // Check for hostname to determine which key to use.  Keys are
  // in the repository as they are out in the open anyway, and
  // HAM Weather checks domains and will stop widget if it
  // comes from a domain that is not registered.
  var api = {
    client_id: 'fGr6zBenMa6pU6ahS3RVm',
    client_secret: 'gS3Bmj4vuhA9ZvLPaLLtiMdUbg6wcsiokHTMIYoS'
  };

  /*if (document.location.hostname === 'stage.minnpost.com') {
    api = {
      client_id: 'fGr6zBenMa6pU6ahS3RVm',
    client_secret: 'IWdo9yudrvvKgGwzLsioVpdytiU6lLxfY2mjwd3R'
    };
  } else if (document.location.hostname === 'localhost' || document.location.hostname === 'minnpost.dev' || document.location.hostname === 'minnpost-wordpress.dev') {
    api = {
      client_id: 'fGr6zBenMa6pU6ahS3RVm',
      client_secret: 'IWdo9yudrvvKgGwzLsioVpdytiU6lLxfY2mjwd3R'
    };
  }*/

  var request = '//api.aerisapi.com/observations/?p=:auto';
  request += '&client_id=' + api.client_id + '&client_secret=' + api.client_secret;

  try {
    $.getJSON(request, function (data) {
      if (data.success === true) {
        $('.a-minnpost-weather').html(minnpostWeatherTop(data.response));
        $('.a-minnpost-weather').fadeIn();
      }
    });
  } catch (e) {
    window.console && console.log(e);
  }
};

$(document).ready(function () {
  minnpostWeather();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYXRoZXIuanMiXSwibmFtZXMiOlsiaWNvblByZWZpeCIsIm1pbm5wb3N0V2VhdGhlclRvcCIsInJlc3AiLCJvdXRwdXQiLCJwbGFjZSIsIm5hbWUiLCJvYiIsIndlYXRoZXIiLCJpY29uIiwidGVtcEYiLCJtaW5ucG9zdFdlYXRoZXIiLCIkIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwaSIsImNsaWVudF9pZCIsImNsaWVudF9zZWNyZXQiLCJyZXF1ZXN0IiwiZ2V0SlNPTiIsImRhdGEiLCJzdWNjZXNzIiwiaHRtbCIsInJlc3BvbnNlIiwiZmFkZUluIiwiZSIsIndpbmRvdyIsImNvbnNvbGUiLCJsb2ciLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBLElBQUlBLGFBQWEsaUVBQWpCOztBQUVBLFNBQVNDLGtCQUFULENBQTRCQyxJQUE1QixFQUFrQztBQUNoQyxNQUFJQyxTQUFTLEVBQWI7QUFDQUEsWUFBVSx1R0FBdUdELEtBQUtFLEtBQUwsQ0FBV0MsSUFBbEgsR0FBeUgsSUFBekgsR0FBZ0lILEtBQUtJLEVBQUwsQ0FBUUMsT0FBeEksR0FBa0osSUFBNUo7QUFDQUosWUFBVSxpQkFBaUJILFVBQWpCLEdBQThCRSxLQUFLSSxFQUFMLENBQVFFLElBQXRDLEdBQTZDLDJCQUF2RDtBQUNBTCxZQUFVLHlDQUF5Q0QsS0FBS0ksRUFBTCxDQUFRRyxLQUFqRCxHQUF5RCxlQUFuRTtBQUNBTixZQUFVLE1BQVY7QUFDQSxTQUFPQSxNQUFQO0FBQ0Q7O0FBRUQsU0FBU08sZUFBVCxHQUEyQjtBQUN6QjtBQUNBO0FBQ0EsTUFBSUMsRUFBRSxNQUFGLEVBQVVDLFFBQVYsQ0FBbUIsa0JBQW5CLENBQUosRUFBNEM7QUFDMUM7QUFDRCxHQUZELE1BRU87QUFDTEQsTUFBRSxNQUFGLEVBQVVFLFFBQVYsQ0FBbUIsa0JBQW5CO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFJQyxNQUFNO0FBQ1JDLGVBQVcsdUJBREg7QUFFUkMsbUJBQWU7QUFGUCxHQUFWOztBQUtBOzs7Ozs7Ozs7Ozs7QUFZQSxNQUFJQyxVQUFVLDBDQUFkO0FBQ0FBLGFBQVcsZ0JBQWdCSCxJQUFJQyxTQUFwQixHQUFnQyxpQkFBaEMsR0FBb0RELElBQUlFLGFBQW5FOztBQUVBLE1BQUk7QUFDRkwsTUFBRU8sT0FBRixDQUFVRCxPQUFWLEVBQW1CLFVBQVNFLElBQVQsRUFBZTtBQUNoQyxVQUFJQSxLQUFLQyxPQUFMLEtBQWlCLElBQXJCLEVBQTJCO0FBQ3pCVCxVQUFFLHFCQUFGLEVBQXlCVSxJQUF6QixDQUE4QnBCLG1CQUFtQmtCLEtBQUtHLFFBQXhCLENBQTlCO0FBQ0FYLFVBQUUscUJBQUYsRUFBeUJZLE1BQXpCO0FBQ0Q7QUFDRixLQUxEO0FBTUQsR0FQRCxDQU9FLE9BQU9DLENBQVAsRUFBVTtBQUNWQyxXQUFPQyxPQUFQLElBQWtCQSxRQUFRQyxHQUFSLENBQVlILENBQVosQ0FBbEI7QUFDRDtBQUNGOztBQUdEYixFQUFFaUIsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7QUFDM0JuQjtBQUNELENBRkQiLCJmaWxlIjoibWlubnBvc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlXG4gKiBNYWluIEpTIGZpbGUgZm9yIHRoZSBNaW5uUG9zdCBXZWF0aGVyIG1vZHVsZS5cbiAqL1xuICBcbnZhciBpY29uUHJlZml4ID0gJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9kYXRhLm1pbm5wb3N0L2ljb25zL2hhbS13ZWF0aGVyLWljb25zLyc7XG5cbmZ1bmN0aW9uIG1pbm5wb3N0V2VhdGhlclRvcChyZXNwKSB7XG4gIHZhciBvdXRwdXQgPSAnJztcbiAgb3V0cHV0ICs9ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubWlubnBvc3QuY29tL3dlYXRoZXJcIiBjbGFzcz1cImEtbWlubnBvc3Qtd2VhdGhlci1pbm5lclwiIHRpdGxlPVwiV2VhdGhlciBhcm91bmQgJyArIHJlc3AucGxhY2UubmFtZSArICc6ICcgKyByZXNwLm9iLndlYXRoZXIgKyAnXCI+JztcbiAgb3V0cHV0ICs9ICcgIDxpbWcgc3JjPVwiJyArIGljb25QcmVmaXggKyByZXNwLm9iLmljb24gKyAnXCIgY2xhc3M9XCJ3ZWF0aGVyLWljb25cIiAvPic7XG4gIG91dHB1dCArPSAnICA8c3BhbiBjbGFzcz1cIndlYXRoZXItdGVtcGVyYXR1cmVcIj4nICsgcmVzcC5vYi50ZW1wRiArICcmZGVnO0Y8L3NwYW4+JztcbiAgb3V0cHV0ICs9ICc8L2E+JztcbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmZ1bmN0aW9uIG1pbm5wb3N0V2VhdGhlcigpIHtcbiAgLy8gVGhlIHVzdWFsIGJlaGF2aW9yIGNoZWNrIHRvIGVuc3VyZSB0aGlzIGRvZXNuJ3QgZ2V0IGNhbGxlZFxuICAvLyBtdWx0aXBsZSB0aW1lc1xuICBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCdtaW5ucG9zdC13ZWF0aGVyJykpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdtaW5ucG9zdC13ZWF0aGVyJylcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBob3N0bmFtZSB0byBkZXRlcm1pbmUgd2hpY2gga2V5IHRvIHVzZS4gIEtleXMgYXJlXG4gIC8vIGluIHRoZSByZXBvc2l0b3J5IGFzIHRoZXkgYXJlIG91dCBpbiB0aGUgb3BlbiBhbnl3YXksIGFuZFxuICAvLyBIQU0gV2VhdGhlciBjaGVja3MgZG9tYWlucyBhbmQgd2lsbCBzdG9wIHdpZGdldCBpZiBpdFxuICAvLyBjb21lcyBmcm9tIGEgZG9tYWluIHRoYXQgaXMgbm90IHJlZ2lzdGVyZWQuXG4gIHZhciBhcGkgPSB7XG4gICAgY2xpZW50X2lkOiAnZkdyNnpCZW5NYTZwVTZhaFMzUlZtJyxcbiAgICBjbGllbnRfc2VjcmV0OiAnZ1MzQm1qNHZ1aEE5WnZMUGFMTHRpTWRVYmc2d2NzaW9rSFRNSVlvUydcbiAgfTtcbiAgXG4gIC8qaWYgKGRvY3VtZW50LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnc3RhZ2UubWlubnBvc3QuY29tJykge1xuICAgIGFwaSA9IHtcbiAgICAgIGNsaWVudF9pZDogJ2ZHcjZ6QmVuTWE2cFU2YWhTM1JWbScsXG4gICAgY2xpZW50X3NlY3JldDogJ0lXZG85eXVkcnZ2S2dHd3pMc2lvVnBkeXRpVTZsTHhmWTJtandkM1InXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkb2N1bWVudC5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgfHwgZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWUgPT09ICdtaW5ucG9zdC5kZXYnIHx8IGRvY3VtZW50LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbWlubnBvc3Qtd29yZHByZXNzLmRldicpIHtcbiAgICBhcGkgPSB7XG4gICAgICBjbGllbnRfaWQ6ICdmR3I2ekJlbk1hNnBVNmFoUzNSVm0nLFxuICAgICAgY2xpZW50X3NlY3JldDogJ0lXZG85eXVkcnZ2S2dHd3pMc2lvVnBkeXRpVTZsTHhmWTJtandkM1InXG4gICAgfTtcbiAgfSovXG5cbiAgdmFyIHJlcXVlc3QgPSAnLy9hcGkuYWVyaXNhcGkuY29tL29ic2VydmF0aW9ucy8/cD06YXV0byc7XG4gIHJlcXVlc3QgKz0gJyZjbGllbnRfaWQ9JyArIGFwaS5jbGllbnRfaWQgKyAnJmNsaWVudF9zZWNyZXQ9JyArIGFwaS5jbGllbnRfc2VjcmV0O1xuXG4gIHRyeSB7XG4gICAgJC5nZXRKU09OKHJlcXVlc3QsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT09IHRydWUpIHtcbiAgICAgICAgJCgnLmEtbWlubnBvc3Qtd2VhdGhlcicpLmh0bWwobWlubnBvc3RXZWF0aGVyVG9wKGRhdGEucmVzcG9uc2UpKTtcbiAgICAgICAgJCgnLmEtbWlubnBvc3Qtd2VhdGhlcicpLmZhZGVJbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5sb2coZSk7XG4gIH1cbn07XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIG1pbm5wb3N0V2VhdGhlcigpO1xufSk7XG4iXX0=
