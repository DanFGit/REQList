function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function logCookies(cookies){
  var cook_Auth = cookies.find(function(cookie){
    return cookie.name === "Auth";
  });

  console.log(cook_Auth);

  //ARRAffinity, Auth, PL, SSO, ST, UP, _RequestVerificationToken, ai_session,
  //ai_user, analyticsId, s_cc, s_fid, sessionId
}

function sendRequest(method, url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.send();

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      callback(xhr.status, xhr.responseText);
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {

  renderStatus("Bonjour!");

  chrome.cookies.getAll({
    'domain': '.halowaypoint.com'
  }, logCookies);

});
