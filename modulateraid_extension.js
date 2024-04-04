
// Custom code by Ami Hanya

const initInterval = setInterval(() => {
    if ((window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client)) {
      window.mR = moduleRaid();
      window.Store = Object.assign({}, (!window.mR.findModule((m) => (m.Call && m.Chat)).length ? window.mR.findModule((m) => ( m.default && m.default.Chat))[0].default : window.mR.findModule((m) => (m.Call && m.Chat))[0]));
      clearInterval(initInterval);
    }
  }, 1000);
  
  
  window.addEventListener('message', (e) => {
    if (e.data.export){
      const votes = Store.PollVote.getModelsArray().filter(x=>e.data.export.includes(x.__x_parentMsgKey._serialized))
      const poll = Store.Msg.getModelsArray().filter(m=>m.type == "poll_creation").find(m=>e.data.export.includes(m.__x_id.id))
      console.log(votes);
      console.log(poll);
      let csv = "Name, Phone," + poll.__x_pollOptions.map(x=>`"${x.name}"`).join(",") + "\n"
  
      const voteAccumulator = votes.reduce((acc, x) => {
        x.__x_selectedOptionLocalIds.forEach(y => acc[y] = (acc[y] || 0) + 1)
        return acc
      }, {})
  
      csv += ",סה\"כ,"
  
      for (let i = 0; i < poll.__x__pollOptionsToLinks.size; i++) {
        csv += voteAccumulator[i] ? voteAccumulator[i] : 0
        csv += ","
      }
      csv += "\n"
      
      csv += votes.map(x=>({
        
        phone:x.__x_sender.user,
        votes:x.__x_selectedOptionLocalIds,
        name:Store.Contact.getModelsArray().find(y=>y.__x_id.user == x.__x_sender.user).__x_pushname || Store.Contact.getModelsArray().find(y=>y.__x_id.user == x.__x_sender.user).__x_name}))
          .map(x=>{
  
            let res = `"${x.name}"` + "," + x.phone
            for (let i = 0; i < poll.__x__pollOptionsToLinks.size; i++) {
              res += x.votes && x.votes.includes(i) ? ",X": ","
            }
            return res
          })
          .join("\n")
  
      
  
      const a = document.createElement("a");
      a.href = 'data:text/csv; charset=utf-8,' + encodeURIComponent("\uFEFF" + csv)
      a.download = "votes.csv";
      a.click();
    }
  })
  