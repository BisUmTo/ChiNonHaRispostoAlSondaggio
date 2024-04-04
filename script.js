function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    console.log("injected " + file_path)
}

injectScript(chrome.runtime.getURL('moduleraid.js'), 'body');
injectScript(chrome.runtime.getURL('moduleraid_extension.js'), 'body');


setInterval(()=>{
    const bottoni = document.querySelectorAll(".xaw8158") 
    if (bottoni) {
        bottoni.forEach(bw => {
            if (bw.isExportVoted) return;
            const clonedclass = bw.querySelector(".x10b6aqq:not(.xchv7qt)");
            if (!clonedclass) return; // Check if clonedclass is null
            let cloned = clonedclass.cloneNode(true);
            if (!cloned) return; // Check if cloned is null
            bw.isExportVoted = true;
            cloned.textContent = "Esporta voti";
            cloned.setAttribute("title", "Esporta i voti in un file CSV");
            cloned.addEventListener("click", (e) => {
                console.log("exported");
                const messageId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id;
                console.log(messageId);
                window.postMessage({ "export": messageId });
                e.stopPropagation();
            });
            cloned.classList.add("xchv7qt");
            cloned.classList.add("esporta-voti");
            cloned.disabled = true;

            bw.appendChild(cloned);
            bw.style.justifyContent = "space-evenly";
        });
    }
},1000)