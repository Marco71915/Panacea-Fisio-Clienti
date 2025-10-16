const API_KEY = "AIzaSyAV-_lx_VCuvVsSwolvq_3zjdbHfLQtEME";
const SPREADSHEET_ID = "1jfNEDFUAsmEKiPws6dQ_HNdWQTrHDYTmvg-nrX5kH1E";
const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Foglio1?key=${API_KEY}`;

async function caricaDati(clienteID) {
    try {
        const res = await fetch(sheetURL);
        const json = await res.json();

        const intestazioni = json.values[0];
        const righe = json.values.slice(1);

        const clienti = righe.map(riga => {
            let appuntamenti = [];
            for(let i=0; i<4; i++){
                const app = riga[2 + i*2];       // Appuntamento i+1
                const ora = riga[3 + i*2];       // Orario App. i+1
                if(app) appuntamenti.push(`${app} - ${ora || ''}`);
            }
            return {
                id: String(riga[0]),
                nome: riga[1],
                appuntamenti
            };
        });

        const cliente = clienti.find(c => c.id === clienteID);

        const nomeElemento = document.getElementById("nome-cliente");
        const listaElemento = document.getElementById("lista-appuntamenti");
        listaElemento.innerHTML = "";

        if (!cliente) {
            nomeElemento.textContent = "Cliente non trovato";
            return;
        }

        nomeElemento.textContent = cliente.nome;

        cliente.appuntamenti.forEach(app => {
            const li = document.createElement("li");
            li.textContent = app;
            listaElemento.appendChild(li);
        });

    } catch (err) {
        console.error("Errore nel caricamento:", err);
        document.getElementById("nome-cliente").textContent = "Errore nel caricamento dati";
    }
}

document.getElementById("cerca").addEventListener("click", () => {
    const idInserito = document.getElementById("inputID").value.trim();
    if (idInserito) {
        caricaDati(idInserito);
    } else {
        alert("Per favore inserisci un ID valido.");
    }
});
