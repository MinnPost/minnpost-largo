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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYXRoZXIuanMiXSwibmFtZXMiOlsiaWNvblByZWZpeCIsIm1pbm5wb3N0V2VhdGhlclRvcCIsInJlc3AiLCJvdXRwdXQiLCJwbGFjZSIsIm5hbWUiLCJvYiIsIndlYXRoZXIiLCJpY29uIiwidGVtcEYiLCJtaW5ucG9zdFdlYXRoZXIiLCIkIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImFwaSIsImNsaWVudF9pZCIsImNsaWVudF9zZWNyZXQiLCJkb2N1bWVudCIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJyZXF1ZXN0IiwiZ2V0SlNPTiIsImRhdGEiLCJzdWNjZXNzIiwiaHRtbCIsInJlc3BvbnNlIiwiZmFkZUluIiwiZSIsIndpbmRvdyIsImNvbnNvbGUiLCJsb2ciLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7QUFLQSxJQUFJQSxhQUFhLGlFQUFqQjs7QUFFQSxTQUFTQyxrQkFBVCxDQUE0QkMsSUFBNUIsRUFBa0M7QUFDaEMsTUFBSUMsU0FBUyxFQUFiO0FBQ0FBLFlBQVUsdUdBQXVHRCxLQUFLRSxLQUFMLENBQVdDLElBQWxILEdBQXlILElBQXpILEdBQWdJSCxLQUFLSSxFQUFMLENBQVFDLE9BQXhJLEdBQWtKLElBQTVKO0FBQ0FKLFlBQVUsaUJBQWlCSCxVQUFqQixHQUE4QkUsS0FBS0ksRUFBTCxDQUFRRSxJQUF0QyxHQUE2QywyQkFBdkQ7QUFDQUwsWUFBVSx5Q0FBeUNELEtBQUtJLEVBQUwsQ0FBUUcsS0FBakQsR0FBeUQsZUFBbkU7QUFDQU4sWUFBVSxNQUFWO0FBQ0EsU0FBT0EsTUFBUDtBQUNEOztBQUVELFNBQVNPLGVBQVQsR0FBMkI7QUFDekI7QUFDQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLGtCQUFuQixDQUFKLEVBQTRDO0FBQzFDO0FBQ0QsR0FGRCxNQUVPO0FBQ0xELE1BQUUsTUFBRixFQUFVRSxRQUFWLENBQW1CLGtCQUFuQjtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSUMsTUFBTTtBQUNSQyxlQUFXLHVCQURIO0FBRVJDLG1CQUFlO0FBRlAsR0FBVjs7QUFLQSxNQUFJQyxTQUFTQyxRQUFULENBQWtCQyxRQUFsQixLQUErQixvQkFBbkMsRUFBeUQ7QUFDdkRMLFVBQU07QUFDSkMsaUJBQVcsdUJBRFA7QUFFTkMscUJBQWU7QUFGVCxLQUFOO0FBSUQsR0FMRCxNQUtPLElBQUlDLFNBQVNDLFFBQVQsQ0FBa0JDLFFBQWxCLEtBQStCLFdBQS9CLElBQThDRixTQUFTQyxRQUFULENBQWtCQyxRQUFsQixLQUErQixjQUE3RSxJQUErRkYsU0FBU0MsUUFBVCxDQUFrQkMsUUFBbEIsS0FBK0Isd0JBQWxJLEVBQTRKO0FBQ2pLTCxVQUFNO0FBQ0pDLGlCQUFXLHVCQURQO0FBRUpDLHFCQUFlO0FBRlgsS0FBTjtBQUlEOztBQUVELE1BQUlJLFVBQVUsMENBQWQ7QUFDQUEsYUFBVyxnQkFBZ0JOLElBQUlDLFNBQXBCLEdBQWdDLGlCQUFoQyxHQUFvREQsSUFBSUUsYUFBbkU7O0FBRUEsTUFBSTtBQUNGTCxNQUFFVSxPQUFGLENBQVVELE9BQVYsRUFBbUIsVUFBU0UsSUFBVCxFQUFlO0FBQ2hDLFVBQUlBLEtBQUtDLE9BQUwsS0FBaUIsSUFBckIsRUFBMkI7QUFDekJaLFVBQUUscUJBQUYsRUFBeUJhLElBQXpCLENBQThCdkIsbUJBQW1CcUIsS0FBS0csUUFBeEIsQ0FBOUI7QUFDQWQsVUFBRSxxQkFBRixFQUF5QmUsTUFBekI7QUFDRDtBQUNGLEtBTEQ7QUFNRCxHQVBELENBT0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1ZDLFdBQU9DLE9BQVAsSUFBa0JBLFFBQVFDLEdBQVIsQ0FBWUgsQ0FBWixDQUFsQjtBQUNEO0FBQ0Y7O0FBR0RoQixFQUFFTSxRQUFGLEVBQVljLEtBQVosQ0FBa0IsWUFBVztBQUMzQnJCO0FBQ0QsQ0FGRCIsImZpbGUiOiJtaW5ucG9zdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIE1haW4gSlMgZmlsZSBmb3IgdGhlIE1pbm5Qb3N0IFdlYXRoZXIgbW9kdWxlLlxuICovXG4gIFxudmFyIGljb25QcmVmaXggPSAnaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2RhdGEubWlubnBvc3QvaWNvbnMvaGFtLXdlYXRoZXItaWNvbnMvJztcblxuZnVuY3Rpb24gbWlubnBvc3RXZWF0aGVyVG9wKHJlc3ApIHtcbiAgdmFyIG91dHB1dCA9ICcnO1xuICBvdXRwdXQgKz0gJzxhIGhyZWY9XCJodHRwczovL3d3dy5taW5ucG9zdC5jb20vd2VhdGhlclwiIGNsYXNzPVwiYS1taW5ucG9zdC13ZWF0aGVyLWlubmVyXCIgdGl0bGU9XCJXZWF0aGVyIGFyb3VuZCAnICsgcmVzcC5wbGFjZS5uYW1lICsgJzogJyArIHJlc3Aub2Iud2VhdGhlciArICdcIj4nO1xuICBvdXRwdXQgKz0gJyAgPGltZyBzcmM9XCInICsgaWNvblByZWZpeCArIHJlc3Aub2IuaWNvbiArICdcIiBjbGFzcz1cIndlYXRoZXItaWNvblwiIC8+JztcbiAgb3V0cHV0ICs9ICcgIDxzcGFuIGNsYXNzPVwid2VhdGhlci10ZW1wZXJhdHVyZVwiPicgKyByZXNwLm9iLnRlbXBGICsgJyZkZWc7Rjwvc3Bhbj4nO1xuICBvdXRwdXQgKz0gJzwvYT4nO1xuICByZXR1cm4gb3V0cHV0O1xufTtcblxuZnVuY3Rpb24gbWlubnBvc3RXZWF0aGVyKCkge1xuICAvLyBUaGUgdXN1YWwgYmVoYXZpb3IgY2hlY2sgdG8gZW5zdXJlIHRoaXMgZG9lc24ndCBnZXQgY2FsbGVkXG4gIC8vIG11bHRpcGxlIHRpbWVzXG4gIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ21pbm5wb3N0LXdlYXRoZXInKSkge1xuICAgIHJldHVybjtcbiAgfSBlbHNlIHtcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ21pbm5wb3N0LXdlYXRoZXInKVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGhvc3RuYW1lIHRvIGRldGVybWluZSB3aGljaCBrZXkgdG8gdXNlLiAgS2V5cyBhcmVcbiAgLy8gaW4gdGhlIHJlcG9zaXRvcnkgYXMgdGhleSBhcmUgb3V0IGluIHRoZSBvcGVuIGFueXdheSwgYW5kXG4gIC8vIEhBTSBXZWF0aGVyIGNoZWNrcyBkb21haW5zIGFuZCB3aWxsIHN0b3Agd2lkZ2V0IGlmIGl0XG4gIC8vIGNvbWVzIGZyb20gYSBkb21haW4gdGhhdCBpcyBub3QgcmVnaXN0ZXJlZC5cbiAgdmFyIGFwaSA9IHtcbiAgICBjbGllbnRfaWQ6ICdmR3I2ekJlbk1hNnBVNmFoUzNSVm0nLFxuICAgIGNsaWVudF9zZWNyZXQ6ICdnUzNCbWo0dnVoQTladkxQYUxMdGlNZFViZzZ3Y3Npb2tIVE1JWW9TJ1xuICB9O1xuICBcbiAgaWYgKGRvY3VtZW50LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnc3RhZ2UubWlubnBvc3QuY29tJykge1xuICAgIGFwaSA9IHtcbiAgICAgIGNsaWVudF9pZDogJ2ZHcjZ6QmVuTWE2cFU2YWhTM1JWbScsXG4gICAgY2xpZW50X3NlY3JldDogJ0lXZG85eXVkcnZ2S2dHd3pMc2lvVnBkeXRpVTZsTHhmWTJtandkM1InXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkb2N1bWVudC5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgfHwgZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWUgPT09ICdtaW5ucG9zdC5kZXYnIHx8IGRvY3VtZW50LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbWlubnBvc3Qtd29yZHByZXNzLmRldicpIHtcbiAgICBhcGkgPSB7XG4gICAgICBjbGllbnRfaWQ6ICdmR3I2ekJlbk1hNnBVNmFoUzNSVm0nLFxuICAgICAgY2xpZW50X3NlY3JldDogJ0lXZG85eXVkcnZ2S2dHd3pMc2lvVnBkeXRpVTZsTHhmWTJtandkM1InXG4gICAgfTtcbiAgfVxuXG4gIHZhciByZXF1ZXN0ID0gJy8vYXBpLmFlcmlzYXBpLmNvbS9vYnNlcnZhdGlvbnMvP3A9OmF1dG8nO1xuICByZXF1ZXN0ICs9ICcmY2xpZW50X2lkPScgKyBhcGkuY2xpZW50X2lkICsgJyZjbGllbnRfc2VjcmV0PScgKyBhcGkuY2xpZW50X3NlY3JldDtcblxuICB0cnkge1xuICAgICQuZ2V0SlNPTihyZXF1ZXN0LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5zdWNjZXNzID09PSB0cnVlKSB7XG4gICAgICAgICQoJy5hLW1pbm5wb3N0LXdlYXRoZXInKS5odG1sKG1pbm5wb3N0V2VhdGhlclRvcChkYXRhLnJlc3BvbnNlKSk7XG4gICAgICAgICQoJy5hLW1pbm5wb3N0LXdlYXRoZXInKS5mYWRlSW4oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUubG9nKGUpO1xuICB9XG59O1xuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICBtaW5ucG9zdFdlYXRoZXIoKTtcbn0pO1xuIl19
