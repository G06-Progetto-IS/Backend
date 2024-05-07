// INIZIO HANDLER EVENTI
var archivioButton = document.getElementById("archivioButton");
archivioButton.addEventListener("click", function() {
  window.location.href = "archivio.html";
});

var searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    ricerca();
  }
});

var loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", function() {
  window.location.href = "login.html";
})

document.getElementById("formAppuntamento").addEventListener("submit", function(event) {
  event.preventDefault();
  appuntamento();
});

// FINE HANDLER EVENTI

// INIZIO FUNZIONI
var loggedUser = {};

function registrati(){ 
  const nome = document.getElementById('nomeRegistrazione').value;
  const cognome = document.getElementById('cognomeRegistrazione').value;
  const mail = document.getElementById('mailRegistrazione').value;
  const password = document.getElementById('passwordRegistrazione').value;
  const confermaPassword = document.getElementById('confermaPasswordRegistrazione').value;
  
  // Verifica che tutti i campi siano stati compilati
  if (!nome || !cognome || !mail || !password || !confermaPassword) {
    alert("Si prega di compilare tutti i campi.");
    return;
   }

  // Verifica che le password corrispondano
  if (password !== confermaPassword) {
      alert("Le password non corrispondono.");
      return;
  }

  let dati = {
      nome: nome,
      cognome: cognome,
      mail: mail,
      password: password
  }
  //console.log("dati: ", dati);

  fetch('../signUp', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
    window.location.href="homepage.html"
    return;
  })
  .catch(error => console.error(error)); // If there is any error you will catch them here
}

function login(){
  const mail = document.getElementById('mailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  // Verifica che tutti i campi siano stati compilati
  if (!mail || !password) {
    alert("Si prega di compilare tutti i campi.");
    return;
   }

  console.log("dati: ", dati);

  fetch('../login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({mail: mail, password: password}),
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
      loggedUser.token = data.token;
      loggedUser.nome = data.nome;
      loggedUser.cognome = data.cognome;
      loggedUser.id = data.id;
      // Apre la pagina di homepage
      window.location.href="homepage.html"
    return;
  })
  .catch(error => console.error(error));
}

function handle(e){
  input = document.getElementById("searchBar").value;
  if(e.keyCode === 13){
      console.log("Input: " + input);
      ricerca();
  }
  return false;
}

function ricerca() {
  var input = document.getElementById("searchBar").value;
  
  // Funzione per effettuare una singola richiesta di ricerca
  async function ricercaPerParametro(parametro) {
      var url = '../ricerca?' + parametro + '=' + String(input);
      console.log(url);
      return fetch(url, {method : 'GET'})
          .then(response => response.json())
          .then(data => {
              //console.log(data);
              return data;
          });
  }

  var books =[];
  // Effettua la ricerca per parametro=[titolo, nome, cognome]
  ricercaPerParametro('titolo')
      .then(res => {
        if (res && Array(res.libri).lenght>0) {
          console.log("Libro trovato: " + res);
          books=res
          aggiungLibro(res.libri[0])
        } else {
          // Se il titolo non è stato trovato, esegui la ricerca per il nome dell'autore
          console.log("Titolo non trovato.");
          ricercaPerParametro('Author_name')
          .then(res => {
            // Se è stato trovato un risultato, mostra il nome dell'autore
            if (res && Array(res.libri).length >0) {
              console.log("Nome dell'autore trovato: " + res);
              books=res;
              aggiungLibro(res.libri[0])
            } else {
              // Altrimenti, effettua la ricerca per cognome
              console.log("Nome autore non trovato")
              ricercaPerParametro('Author_sur')
              .then(res => {
                  // Se è stato trovato un risultato, mostra il cognome dell'autore
                  if (res && Array(res.libri).lenght >0) {
                    console.log("Cognome dell'autore trovato: " + res);
                    books=res;
                    aggiungLibro(res.libri[0])
                  } else {
                    // Se non ci sono risultati per nessun parametro, mostra un avviso
                    console.log("Nessun risultato trovato.");
                  }
              })
              .catch(error => {
                console.error('Si è verificato un errore durante la ricerca:', error);
              });
            }
          })
        }
      })
  console.log("Libri trovati" + books);
  return books;
}

function aggiungLibro(book) {
  var booksDiv = document.getElementById("bookList");
  if (!booksDiv) {
      console.error("Elemento 'bookList' non trovato.");
      return; // Esci dalla funzione se 'bookList' non è stato trovato
  }

  booksDiv.innerHTML = "";
  var bookDiv = document.createElement('div');
  bookDiv.classList.add('book-section');

  var bookContainer = document.createElement('div');
  bookContainer.classList.add('book-container');

  var copertinaContainer = document.createElement('div');
  copertinaContainer.classList.add('copertina-container');

  var titoloP = document.createElement('div');
  titoloP.classList.add('titolo-libro');
  titoloP.textContent = "di " + book.titolo;

  var copertinaImg = document.createElement('img');
  copertinaImg.classList.add('copertina-libro');
  copertinaImg.src = "photos/" + book.titolo + ".jpeg";

  copertinaContainer.appendChild(titoloP);
  copertinaContainer.appendChild(copertinaImg);

  var infoLibro = document.createElement('div');
  infoLibro.classList.add('info-libro');

  var autoreP = document.createElement('p');
  autoreP.classList.add('autore');
  autoreP.innerHTML = 'di <strong>' + book.Author_name + " " + book.Author_sur + '</strong>';

  var prenotaButton = document.createElement('button');
  prenotaButton.classList.add('bottone-prenota');
  prenotaButton.textContent = "Prenota e ritira";

  infoLibro.appendChild(autoreP);
  infoLibro.appendChild(prenotaButton);

  bookContainer.appendChild(copertinaContainer);
  bookContainer.appendChild(infoLibro);

  bookDiv.appendChild(bookContainer);
  booksDiv.appendChild(bookDiv);
}


function appuntamento() {
  const nome = document.getElementById('nomeAppuntamento').value;
  const cognome = document.getElementById('cognomeAppuntamento').value;
  const mail = document.getElementById('emailAppuntamento').value;
  const data = document.getElementById('dateAppuntamento').value;
  const ora = document.getElementById('timeAppuntamento').value;
  const tipoAppuntamento = document.querySelector('input[name="fav_language"]:checked').value;


  if(!tipoAppuntamento) {
    alert("Seleziona un appuntamento!!")
  }
  // Costruzione dei dati nel formato corretto per lo schema MongoDB
  let dati = {
    nome: nome,
    cognome: cognome,
    mail: mail,
    data_app: new Date(`${data}T${ora}`), // Combina data e ora
    tipo_app: tipoAppuntamento
  };
  
  console.log("dati: ", dati);

  fetch('../Reserve?mail=' + mail, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
    if(data.success){
      alert("Appuntamento Prenotato");
    }
    else{
      alert("Appuntamento non prenotato");
    }
    return;
  })
  .catch(error => console.error(error));
}
    
    