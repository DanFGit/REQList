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

var reqs = [],
    totals = [],
    owned = [];

function parseREQs(REQs){
  REQs.each(function(i, el){

    //Store common attributes in variables
    var card = $(el);
    var subcategory = card.data('subcategory').replace(/ /g,'');
    var rarity = card.data('rarity').replace(/ /g,'');
    var name = card.data('name');
    var isOwned = card.data('have-owned') == "True";

    if(subcategory == ""){
      switch(name){
        case 'Assault Rifle':
        case 'Recon AR':
        case 'Hybrid AR':
        case 'Longshot AR':
          subcategory = "AssaultRifle";
          break;
        case 'Battle Rifle':
        case 'Classic BR':
        case 'Hybrid BR':
        case 'Sentinel BR':
        case 'Longshot BR':
          subcategory = "BattleRifle";
          break;
        case 'DMR':
        case 'Recon DMR':
        case 'Hybrid DMR':
        case 'Sentinel DMR':
          subcategory = "DMR";
          break;
        case 'Magnum':
          subcategory = "Magnum";
          break;
        case 'Halo 2 Battle Rifle':
          subcategory = "Halo2BattleRifle";
          break;
        case 'SMG':
        case 'Projection SMG':
        case 'Hybrid SMG':
        case 'Recon SMG':
          subcategory = "SMG";
          break;
        case 'Advanced Sensors':
        case 'Auto-Medic':
        case 'Death From Above':
        case 'Upgraded Shields':
        case 'Frag Grenade Expert':
        case 'Grenadier':
        case 'Reflex Enhancers':
        case 'Splinter Grenade Expert':
        case 'Wheelman':
        case 'Plasma Grenade Expert':
        case 'Speed Booster':
        case 'Upgraded Thrusters':
        case 'Increased Strength':
          subcategory = "ArmorMods";
          break;
        default:
          subcategory = "Unknown";
          console.log(name);
          break;
      }
    }


    //If this is the first item in the sub-category, create a reference to the sub-category
    if(!(subcategory in reqs)){
      reqs[subcategory] = [];
      $('#req-subcategories').append("<div class='subcategory' id='" + subcategory + "'><h2>" + subcategory + "</h2><div class=toggle><span class=flex-wrapper></span></div></div>")
      $('#' + subcategory + ' h2').click(slideCategory);
    }

    //If this is the first item of a certain rarity in the sub-category, create a reference to the rarity
    if(!(rarity in reqs[subcategory])){
      reqs[subcategory][rarity] = [];
      $('#' + subcategory + ' .flex-wrapper').append("<div class='" + rarity + "'><h3>" + rarity + "</h3></div>");
    }

    //Store the REQ card in an array organised into subcategories and rarities
    reqs[subcategory][rarity].push(card);

    //If this is the first time the rarity has been seen, create a reference to the rarity
    if(!(rarity in totals)){
      totals[rarity] = 0;
      owned[rarity] = 0;
    }

    //Increment the totals and owned count if necessary
    totals[rarity]++;
    if(isOwned) owned[rarity]++;

    //Append the REQ Card to the DOM
    $('#' + subcategory + " ." + rarity ).append("<div class='" + (isOwned ? "owned" : "unowned") + " req'><img height='100px' src='" + card.children().data('src') + "' /></div>");

  });
}

document.addEventListener('DOMContentLoaded', function() {

  //Get the 'Customization' Requisitions from Halo Waypoint
  sendRequest("GET", "https://www.halowaypoint.com/en-gb/games/halo-5-guardians/xbox-one/requisitions/categories/customization", function(status, response){

    //Check for errors
    if(status != 200){
      $('#status').text("Error connecting to halowaypoint.com - " + status);
    } else {
      $('#status').fadeOut();
    }

    //Convert the response from HaloWaypoint into a jQuery object we can manipulate
    var html = $('<div/>').append(response);

    //Loop through all the REQ cards in the response
    var REQs = html.find('.req-collection').find('.reqs-row').find('button');

    parseREQs(REQs);

  });

  sendRequest("GET", "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/loadout", function(status, response){
    //Check for errors
    if(status != 200){
      $('#status').text("Error connecting to halowaypoint.com - " + status);
    } else {
      $('#status').fadeOut();
    }

    //Convert the response from HaloWaypoint into a jQuery object we can manipulate
    var html = $('<div/>').append(response);

    //Loop through all the REQ cards in the response
    var REQs = html.find('.req-collection').find('.reqs-row').find('button');

    parseREQs(REQs);

  });

  sendRequest("GET", "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/powerandvehicle", function(status, response){
    //Check for errors
    if(status != 200){
      $('#status').text("Error connecting to halowaypoint.com - " + status);
    } else {
      $('#status').fadeOut();
    }

    //Convert the response from HaloWaypoint into a jQuery object we can manipulate
    var html = $('<div/>').append(response);

    //Loop through all the REQ cards in the response
    var REQs = html.find('.req-collection').find('.reqs-row').find('button');

    parseREQs(REQs);

  });

  //Work out number of REQ Packs needed

});

function slideCategory(event){
  $(event.target.nextSibling).slideToggle();
}
