//Store all the REQ Cards
//Can be accessed as reqs['Helmet']['Common']
var reqs = [];

//Store the number of REQs and how many the user owns
//Can be accessed as totals['Common']
var totals = [],
    owned = [];

//Keep track of how many of the requests are left
var waiting = 2;

//Sends a HTTP Request to the given URL, calls the callback function when the request is finished
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

//Loads all the REQs from Halo Waypoint, calls the onFinish function when all REQs are loaded
function loadREQs(){

  //Get the 'Customization' Requisitions from Halo Waypoint
  sendRequest("GET", "https://www.halowaypoint.com/en-gb/games/halo-5-guardians/xbox-one/requisitions/categories/customization", function(status, response){

    //Check for errors
    if(status != 200){
      $('#status').text("Error connecting to halowaypoint.com - " + status);
    } else {
      if(!waiting) {
        $('#status').fadeOut();
      } else {
        waiting--;
      }
      parseREQs(response);
    }

  });

  //Get the 'Loadout' Requisitions from Halo Waypoint
  sendRequest("GET", "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/loadout", function(status, response){

    //Check for errors
    if(status != 200){
      $('#status').text("Error connecting to halowaypoint.com - " + status);
    } else {
      if(!waiting) {
        $('#status').fadeOut();
      } else {
        waiting--;
      }
      parseREQs(response);
    }

  });

  //Get the 'Power Weapon and Vehicle' Requisitions from Halo Waypoint
  sendRequest("GET", "https://www.halowaypoint.com/en-us/games/halo-5-guardians/xbox-one/requisitions/categories/powerandvehicle", function(status, response){

    //Check for errors
    if(status != 200){
      $('#status').text("Error connecting to halowaypoint.com - " + status);
    } else {
      if(!waiting) {
        $('#status').fadeOut();
      } else {
        waiting--;
      }
      parseREQs(response);
    }

  });

}

//Parses the responses from Halo Waypoint to find all the REQ Cards
function parseREQs(response){

  //Convert the response from HaloWaypoint into a jQuery object we can manipulate
  var html = $('<div/>').append(response);

  //Find all the REQ Cards in the response
  var REQs = html.find('.req-collection').find('.reqs-row').find('button');

  //Loop through all the REQ Cards
  REQs.each(function(i, el){

    //Store common attributes in variables
    var card = $(el);
    var subcategory = card.data('subcategory').replace(/ /g,'');
    var rarity = card.data('rarity').replace(/ /g,'');
    var name = card.data('name');

    if(subcategory == "PowerWeapon" || subcategory == "Vehicle" || subcategory == "Equipment"){
      var isOwned = card.data('has-certification') == "True";
    } else {
      var isOwned = card.data('have-owned') == "True";
    }

    if(name == "Random Weapon" || name == "Random Vehicle") return;

    //Fix for all the loadout REQs sorting into individual categories
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

      var readable = "";

      switch(subcategory){
        case "AssaultRifle":
        case "BattleRifle":
        case "Halo2BattleRifle":
          readable = name;
          break;
        case "ArmorMods":
          readable = "Armor Mods";
          break;
        case "Equipment":
          readable = "Power Ups";
          break;
        case "ArmorSuit":
          readable = "Armor";
          break;
        case "WeaponSkin":
          readable = "Weapon Skin";
          break;
        case "PowerWeapon":
          readable = "Power Weapon";
          break;
        default:
          readable = subcategory;
          break;
      }

      $('#req-subcategories').append("<div class='subcategory' id='" + subcategory + "'><h2>" + readable + " <span class='totalOwned'>0</span>/<span class='totalCount'>0</span></h2><div class=toggle><span class=flex-wrapper></span></div></div>")
      $('#' + subcategory + ' h2').click(slideCategory);
    }

    //If this is the first item of a certain rarity in the sub-category, create a reference to the rarity
    if(!(rarity in reqs[subcategory])){
      reqs[subcategory][rarity] = [];
      var readable = (rarity == "UltraRare" ? "Ultra Rare" : rarity);
      $('#' + subcategory + ' .flex-wrapper').append("<div class='" + rarity + "'><h3>" + readable + " <span class='totalOwned'>0</span>/<span class='totalCount'>0</span></h3></div>");
    }

    //Store the REQ card in an array organised into subcategories and rarities
    reqs[subcategory][rarity].push(card);

    //If this is the first time the rarity has been seen, create a reference to the rarity
    if(!(subcategory in totals)){
      totals[subcategory] = [];
      owned[subcategory] = [];

      totals[subcategory]["Common"] = 0;
      owned[subcategory]["Common"] = 0;
      totals[subcategory]["Uncommon"] = 0;
      owned[subcategory]["Uncommon"] = 0;
      totals[subcategory]["Rare"] = 0;
      owned[subcategory]["Rare"] = 0;
      totals[subcategory]["UltraRare"] = 0;
      owned[subcategory]["UltraRare"] = 0;
      totals[subcategory]["Legendary"] = 0;
      owned[subcategory]["Legendary"] = 0;
    }

    //Increment the totals and owned count if necessary
    totals[subcategory][rarity]++;
    if(isOwned) owned[subcategory][rarity]++;

    //Append the REQ Card to the DOM
    $('#' + subcategory + " ." + rarity ).append("<div class='" + (isOwned ? "owned" : "unowned") + " req'><img height='120px' src='" + card.children().data('src') + "' /></div>");

  });

  if(!waiting) calculateTotals();
}

function calculateTotals(){
  var total = [];
      total['Common'] = 0,
      total['Uncommon'] = 0,
      total['Rare'] = 0,
      total['UltraRare'] = 0,
      total['Legendary'] = 0;

  var totalOwned = [];
      totalOwned['Common'] = 0,
      totalOwned['Uncommon'] = 0,
      totalOwned['Rare'] = 0,
      totalOwned['UltraRare'] = 0,
      totalOwned['Legendary'] = 0;

  for(subcategory in reqs){
    $('#' + subcategory + ' h2 .totalOwned').text(owned[subcategory]["Common"] + owned[subcategory]["Uncommon"] + owned[subcategory]["Rare"] + owned[subcategory]["UltraRare"] + owned[subcategory]["Legendary"]);
    $('#' + subcategory + ' h2 .totalCount').text(totals[subcategory]["Common"] + totals[subcategory]["Uncommon"] + totals[subcategory]["Rare"] + totals[subcategory]["UltraRare"] + totals[subcategory]["Legendary"]);

    for(rarity in reqs[subcategory]){
      $('#' + subcategory + ' .' + rarity + ' h3 .totalOwned').text(owned[subcategory][rarity]);
      $('#' + subcategory + ' .' + rarity + ' h3 .totalCount').text(totals[subcategory][rarity]);

      total[rarity] += totals[subcategory][rarity];
      totalOwned[rarity] += owned[subcategory][rarity];
    }
  }

  $('#totals #Common .ownedTotal').text(totalOwned['Common']);
  $('#totals #Uncommon .ownedTotal').text(totalOwned['Uncommon']);
  $('#totals #Rare .ownedTotal').text(totalOwned['Rare']);
  $('#totals #UltraRare .ownedTotal').text(totalOwned['UltraRare']);
  $('#totals #Legendary .ownedTotal').text(totalOwned['Legendary']);

  $('#totals #Common .totalCount').text(total['Common']);
  $('#totals #Uncommon .totalCount').text(total['Uncommon']);
  $('#totals #Rare .totalCount').text(total['Rare']);
  $('#totals #UltraRare .totalCount').text(total['UltraRare']);
  $('#totals #Legendary .totalCount').text(total['Legendary']);

  var bronzeNeeded = Math.ceil((total['Common'] - totalOwned['Common']) / 0.66),
      silverNeeded = Math.ceil(((total['Uncommon'] + total['Rare']) - (totalOwned['Uncommon'] + totalOwned['Rare'])) / 2.66),
      goldNeeded = Math.ceil(((total['UltraRare'] + total['Legendary']) - (totalOwned['UltraRare'] + totalOwned['Legendary'])) / 2.66);

  //TODO: Remove 'magic number' of 0.66, 2.66
  $('#totals #Bronze .packsNeeded').text(bronzeNeeded);
  $('#totals #Silver .packsNeeded').text(silverNeeded);
  $('#totals #Gold .packsNeeded').text(goldNeeded);

  $('#totals #Bronze .pointsNeeded').text("(" + (bronzeNeeded * 1250).toLocaleString() + " REQ points)");
  $('#totals #Silver .pointsNeeded').text("(" + (silverNeeded * 5000).toLocaleString() + " REQ points)");
  $('#totals #Gold .pointsNeeded').text("(" + (goldNeeded * 10000).toLocaleString() + " REQ points)");
}

//Wait until the extension tab has loaded before doing anything
document.addEventListener('DOMContentLoaded', function() {

  //Check the user is logged in to Halo Waypoint by checking the 'Auth' cookie
  chrome.cookies.get({
    'url': 'https://www.halowaypoint.com',
    'name': 'Auth'
  }, function(cookie){

    if(!cookie) {
      $('#status').addClass('error').html("Please log in to <a target='_blank' href='https://www.halowaypoint.com'>HaloWaypoint.com</a>");
    } else {

      loadREQs();

    }
  });
});

//Show/Hide the REQ Cards when the subcategories are clicked
function slideCategory(event){
  $(event.target.nextSibling).slideToggle();
  $(event.target).toggleClass('expanded');
}
