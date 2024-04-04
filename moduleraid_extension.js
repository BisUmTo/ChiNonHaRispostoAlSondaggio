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

    if (!poll.remote || !poll.remote.user) {
      alert("Attualmente non è possibile esportare i voti dei sondaggi privati");
      return;
    }

    const group = Store.GroupMetadata.getModelsArray().filter(x=>x.__x_id.user==poll.remote.user)[0];
    console.log("Gruppo:", group);
    const partecipants = group.participants._models;
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
    csv += "\n";
    csv += unvotes.map(x=>({
      phone: '+'+x.id.user,
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
    a.download = `voti_${(new Date().toJSON().slice(0,16))}.csv`
    a.click();
  }
})

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