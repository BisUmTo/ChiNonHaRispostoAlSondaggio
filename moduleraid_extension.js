// Custom code by Ami Hanya and BisUmTo

var pulsanti_abilitati = false;

const initInterval = setInterval(() => {
  console.log("waiting for webpackChunk to load...")
  if (window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client) {
    window.mR = moduleRaid();
    window.Store = Object.assign({}, (!window.mR.findModule((m) => (m.Call && m.Chat)).length ? window.mR.findModule((m) => ( m.default && m.default.Chat))[0].default : window.mR.findModule((m) => (m.Call && m.Chat))[0]));
    clearInterval(initInterval);
    pulsanti_abilitati = true;
    console.log('webpackChunk found, modules loaded')
  }
}, 1000);

window.addEventListener('message', (e) => {
  if (e.data.export){
    if (!pulsanti_abilitati) {
      alert("Estensione non ancora caricata, riprova tra qualche secondo");
      return;
    }
    
    const votes = Store.PollVote.getModelsArray().filter(x=>e.data.export.includes(x.__x_parentMsgKey._serialized));
    console.log("Voti:", votes);
    const poll = Store.Msg.getModelsArray().filter(m=>m.type == "poll_creation").find(m=>e.data.export.includes(m.__x_id.id));
    console.log("Sondaggio:", poll);

    const chat_id = poll.__x_id.remote;
    if (chat_id.server.startsWith("g")) {
      var group = Store.GroupMetadata.getModelsArray().find(x=>x.__x_id.user==chat_id.user);
      console.log("Gruppo:", group);
      var partecipants = group.participants._models;
    } else {
      const chat = Store.Chat._models.find(x=>x.__x_id.user==chat_id.user);
      console.log("Chat:", chat);
      var partecipants = [{id: poll.__x_from}, {id: poll.__x_to}];
    }
    console.log("Partecipanti:", partecipants);
    const unvotes = partecipants.filter(x=>!votes.map(x=>x.__x_sender.user).includes(x.id.user))
    console.log("Non votanti:", unvotes);
    
    const voteAccumulator = votes.reduce((acc, x) => {
      x.__x_selectedOptionLocalIds.forEach(y => acc[y] = (acc[y] || 0) + 1)
      return acc
    }, {});

    // Intestazione
    let csv = sanitizeString(poll.__x_pollName)+",," + poll.__x_pollOptions.map(x=>sanitizeString(x.name)).join(",") + ",Numero voti\n"
    
    // Voti
    csv += votes.map(x=>({
      phone: '+'+x.__x_sender.user,
      votes: x.__x_selectedOptionLocalIds,
      name:
        Store.Contact.getModelsArray().find(y=>y.__x_id.user == x.__x_sender.user).__x_name || 
        Store.Contact.getModelsArray().find(y=>y.__x_id.user == x.__x_sender.user).__x_pushname
    })).map(x=>{
      let res = sanitizeString(x.name) + "," + sanitizeString(x.phone)
      for (let i = 0; i < poll.__x__pollOptionsToLinks.size; i++) {
        res += x.votes && x.votes.includes(i) ? ",X": ","
      }
      res += "," + x.votes.length
      return res
    }).join("\n");

    // Non votanti
    if (unvotes.length > 0) csv += "\n";
    csv += unvotes.map(x=>({
      phone: '+' + x.id.user,
      name:
        Store.Contact.getModelsArray().find(y=>y.__x_id.user == x.id.user).__x_name || 
        Store.Contact.getModelsArray().find(y=>y.__x_id.user == x.id.user).__x_pushname
    })).map(x=>`${sanitizeString(x.name)},${sanitizeString(x.phone)}`).join("\n");

    // Totale
    csv += "\n,TOTALE,"
    let tot = 0
    for (let i = 0; i < poll.__x__pollOptionsToLinks.size; i++) {
      csv += voteAccumulator[i] ? voteAccumulator[i] : 0;
      tot += voteAccumulator[i] ? voteAccumulator[i] : 0;
      csv += ",";
    }
    csv += tot + "\n";

    // Download
    const a = document.createElement("a");
    a.href = 'data:text/csv; charset=utf-8,' + encodeURIComponent("\uFEFF" + csv)
    a.download = `voti_${getFormattedTime()}.csv`
    a.click();
  }
})

// SANITIZZA STRINGA PER CSV
function sanitizeString (desc) {
  var itemDesc;
  if (desc) {
      itemDesc = desc.replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm,' ');
      itemDesc = itemDesc.replace(/"/g, '""');
  } else {
      itemDesc = '';
  }
  return `"${itemDesc}"`;
}

// DATA CORRENTE
function getFormattedTime() {
  var today = new Date();
  var y = today.getFullYear();
  var m = `${today.getMonth() + 1}`.padStart(2, '0');
  var d = `${today.getDate()}`.padStart(2, '0');
  var h =  today.getHours();
  var mi = `${today.getMinutes()}`.padStart(2, '0');
  var s = `${today.getSeconds()}`.padStart(2, '0');
  return `${y}-${m}-${d}_${h}-${mi}-${s}`;
}

// ABILITA BOTTONI
setInterval(()=>{
  if (!pulsanti_abilitati) return;
  const bottoni = document.querySelectorAll(".esporta-voti.xchv7qt") 
  if (bottoni) {
    bottoni.forEach(bw => {
      bw.classList.remove("xchv7qt");
      bw.classList.add("x1tvq4uy");
      bw.disabled = false;
    });
  }
},1000);