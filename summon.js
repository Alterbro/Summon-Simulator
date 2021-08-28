const servant_url = "https://api.atlasacademy.io/export/NA/nice_servant.json";
const ce_url = "https://api.atlasacademy.io/export/NA/nice_equip.json";
const theButton = document.getElementById("myButton");

async function rollgacha() {
  const response_srv = await fetch(servant_url);
  const servants_raw = await response_srv.json();
  const response_ce = await fetch(ce_url);
  const crafting_essences_raw = await response_ce.json();
  const crafting_essences = {
    "3": crafting_essences_raw.filter(essence => essence.rarity == 3),
    "4": crafting_essences_raw.filter(essence => essence.rarity == 4),
    "5": crafting_essences_raw.filter(essence => essence.rarity == 5),
}
  const servants = {
    "3": servants_raw.filter(servant => servant.rarity == 3),
    "4": servants_raw.filter(servant => servant.rarity == 4),
    "5": servants_raw.filter(servant => servant.rarity == 5),
}
weighted_rarity = {
  "3": 40,
  "4": 3,
  "5": 1,
  "3CE": 40,
  "4CE": 12,
  "5CE": 4
}
  var result = '';
  var weighted_rarity = {};
    function weightedChoice(weighted_values){
        var random_value = Math.floor(Math.random()*100);
        var old_bound = 0;
        for (var current_value in weighted_values) {
            var current_weight = weighted_values[current_value];
            var new_bound = old_bound + current_weight;
            if (random_value < new_bound)
            {        
                return current_value;
            }
            old_bound = new_bound;
        }

    }

async function generateRandomRareCard(essences, servants, rarity){
    var cards = null;
    var colors = {
    "3": "#AD8A56",
    "4": "#D7D7D7",
    "5": "#AF9500"
    }
    if (rarity.length > 1){
        cards = essences;
    } else {
        cards = servants;
    }
    var cards_pool = cards[rarity[0]]
    var card = cards_pool[Math.floor(Math.random()*cards_pool.length)];
    var img_url = '';
    var result = '<div style="background-color:' + colors[rarity[0]] + ';">' + card.name;
    if (card.className != null){
        img_url = card.extraAssets.faces.ascension[2];
        result += ', ' + card.className;
    } else {
        img_url = Object.values(card.extraAssets.faces.equip)[0];
    }
    const response_img = await fetch(img_url);
    var blob = await response_img.blob();
    result += '<br><img src="' + URL.createObjectURL(blob) + '"></div>';
    return result;
  }

  async function rollCards(essences, servants, weighted_rarity, len){
    result = (await Promise.all(Array.from({length: len}, async () => await generateRandomRareCard(essences, servants, weightedChoice(weighted_rarity))))).join('');
    theButton.classList.remove("button--loading");
    return result;
}

  var result = await rollCards(crafting_essences, servants, weighted_rarity, 11);
  document.getElementById("Bros, this code...").innerHTML = result;
}
document.getElementById('myButton').addEventListener('click', function(rollgacha) {
  rollgacha.preventDefault();
});

theButton.addEventListener("click", () => {
    theButton.classList.add("button--loading");
});
