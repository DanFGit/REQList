// Saves options to chrome.storage
function save_options() {

  var useBronze = document.getElementById('useBronze').checked;
  var bronzePermChance = document.getElementById('bronzePermChance').value;
  var emblemPermChance = document.getElementById('emblemPermChance').value;

  if(bronzePermChance < 0){
    bronzePermChance = 0;
    document.getElementById('bronzePermChance').value = 0;
  } else if(bronzePermChance > 100){
    bronzePermChance = 100;
    document.getElementById('bronzePermChance').value = 100;
  }

  if(emblemPermChance < 0){
    emblemPermChance = 0;
    document.getElementById('emblemPermChance').value = 0;
  } else if(emblemPermChance > 100){
    emblemPermChance = 100;
    document.getElementById('emblemPermChance').value = 100;
  }

  chrome.storage.sync.set({

    useBronze: useBronze,
    bronzePermChance: bronzePermChance,
    emblemPermChance: emblemPermChance

  }, function() {

    // Update status to let user know options were saved.
    var status = document.getElementById('status');

    status.textContent = 'Options saved.';

    setTimeout(function() {
      status.textContent = '';
    }, 750);

  });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {

  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({

    useBronze: true,
    bronzePermChance: 50,
    emblemPermChance: 50

  }, function(items) {

    document.getElementById('useBronze').checked = items.useBronze;
    document.getElementById('bronzePermChance').value = items.bronzePermChance;
    document.getElementById('emblemPermChance').value = items.emblemPermChance;

  });

}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
