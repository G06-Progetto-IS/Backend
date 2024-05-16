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

document.getElementById("formAppuntamento").addEventListener("submit", function(event) {
  event.preventDefault();
  appuntamento();
});

function IsUserLoggedIn() {
  const loggedUserJSON = localStorage.getItem('loggedUser');
  return !!loggedUserJSON; // Restituisce true se l'utente è loggato, altrimenti false
}

function handle(e){
  input = document.getElementById("searchBar").value;
  if(e.keyCode === 13){
      console.log("Input: " + input);
      ricerca();
  }
  return false;
}
// FINE HANDLER EVENTI

// INIZIO FUNZIONI
var loggedUser = {};

// Funzione per creare un nuovo utente
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

// funzione per far loggare un utente inserite le credenziali
function login() {
  const mail = document.getElementById('mailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  // Verifica che tutti i campi siano stati compilati
  if (!mail || !password) {
    alert("Si prega di compilare tutti i campi.");
    return;
  }

  fetch('../login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({mail: mail, password: password}),
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
    // Controlla se il login è riuscito
    if (data && data.token) {
      loggedUser = data;
      // Salva i dati utente nella localStorage
      localStorage.setItem('loggedUser', JSON.stringify(data));
      window.location.href = 'homepage.html';

    } else {
      alert("Credenziali non valide.");
    }
  })
  .catch(error => console.error(error));
}

// funzione per far fare il logout all'utente 
function logout() {
  fetch('../logout', {
    method: 'GET',
    headers: {
      'x-access-token': localStorage.getItem('token')
    }
  })
  .then((resp) => resp.json()) 
  .then(function(data) { 
    if (data && data.success) {
      // Rimuovi i dati utente dalla localStorage
      localStorage.removeItem('loggedUser');

      // reindirizza a homepage.html
      window.location.href = 'homepage.html';
    } else {
      alert("Errore durante il logout.");
    }
  })
  .catch(error => console.error(error));
}

// Inizio funzioni per mostrare pagina risultati (ricerca, filtro)
// ricercaPerParametro e ricercaPerFiltro servono a decidere quale parametro passare all'API
var books = {};
async function ricercaPerParametro(parametro) {
  var url = '../ricerca?' + parametro + '=' + String(input);
  console.log(url);
  try {
      const response = await fetch(url, {method : 'GET'});
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error during search:', error);
      throw error;
  }
}

async function ricercaPerFiltro(parametro, input) {
  var url = '../filter?' + parametro + '=' + String(input);
  console.log(url);
  try {
      const response = await fetch(url, {method : 'GET'});
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error during search:', error);
      throw error;
  }
}

async function ricerca() {
  var input = document.getElementById("searchBar").value;

  try {aggiungLibro
      // Effettua la ricerca per parametro=[titolo, nome, cognome]
      let res = await ricercaPerParametro('titolo');
      console.log(res);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Libro trovato: ", res);
          books = res;
          aggiungLibro(res.libri, IsUserLoggedIn());
          return books;
      }

      console.log("Titolo non trovato.");

      res = await ricercaPerParametro('Author_name');
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Nome dell'autore trovato: ", res);
          books = res;
          aggiungLibro(res.libri, IsUserLoggedIn());
          return books;
      }

      console.log("Nome autore non trovato");

      res = await ricercaPerParametro('Author_sur');
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Cognome dell'autore trovato: ", res);
          books = res;
          aggiungLibro(res.libri, IsUserLoggedIn());
          return books;
      }

      console.log("Nessun risultato trovato.");
  } catch (error) {
      console.error('Errore durante la ricerca:', error);
  }

  // If no books found, return an empty object
  return books;
}

async function filtri() {
  var input = document.querySelector('input[name="filtro"]:checked').value;

  try {aggiungLibro
      // Effettua la ricerca per parametro=[titolo, nome, cognome]
      let res = await ricercaPerFiltro('Genre', input);;
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Genere del libro trovato: ", res);
          aggiungLibro(res.libri, IsUserLoggedIn());
          return res;
      }

      console.log("Genere libro non trovato");

      res = await ricercaPerFiltro('Author_sur', input);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Cognome dell'autore trovato: ", res);
          aggiungLibro(res.libri, IsUserLoggedIn());
          return res;
      }

      console.log("Nessun risultato trovato.");
  } catch (error) {
      console.error('Errore durante il filtro:', error);
  }

  // If no books found, return an empty object
  return book;
}

// Funzione per creare dinamicamente la pagina dei risulati
function aggiungLibro(books, isLoggedIn) {
  var booksDiv = document.getElementById("bookList");
  if (!booksDiv) {
      console.error("Elemento 'bookList' non trovato.");
      return; // Esci dalla funzione se 'bookList' non è stato trovato
  }
  booksDiv.innerHTML = "";
  if (Array.isArray(books)){
    books.forEach(book => {
    
      var bookDiv = document.createElement('div');
      bookDiv.classList.add('book-section');
      bookDiv.setAttribute('book-id', book.book_id);

      var bookContainer = document.createElement('div');
      bookContainer.classList.add('book-container');

      var copertinaContainer = document.createElement('div');
      copertinaContainer.classList.add('copertina-container');

      var titoloP = document.createElement('div');
      titoloP.classList.add('titolo-libro');
      titoloP.textContent = book.titolo;

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

      var genereP = document.createElement('p');
      genereP.classList.add('genere');
      genereP.textContent = "Genere: " + book.Genre;

      var disponibilitaP = document.createElement('p'); // Aggiungi questa riga
      disponibilitaP.classList.add('disponibilità'); // Aggiungi questa riga
      disponibilitaP.innerHTML = '<span class="cerchio-verde"></span> Disponibile'; // Aggiungi questa riga

      var prenotaButton = document.createElement('button');
      prenotaButton.classList.add('bottone-prenota');
      prenotaButton.textContent = "Prenota e ritira";
      // Controllo se l'utente è loggato per mostrare il pulsante
      prenotaButton.style.display = isLoggedIn ? "block" : "none";

      infoLibro.appendChild(autoreP);
      infoLibro.appendChild(genereP);
      infoLibro.appendChild(disponibilitaP); // Aggiungi questa riga
      infoLibro.appendChild(prenotaButton);      
      
      bookContainer.appendChild(copertinaContainer);
      bookContainer.appendChild(infoLibro);

      bookDiv.appendChild(bookContainer);
      booksDiv.appendChild(bookDiv);

      // Aggiungi un event listener a ciascun bottone Prenota e ritira
      prenotaButton.addEventListener("click", function(){
        // Costruisci l'URL con il titolo del libro come parametro
        window.location.href = "appuntamentoLibro.html?titolo=" + encodeURIComponent(book.titolo);
      });
    });
  }
}


// funzione che una volta prenotato l'appuntamento 'prenotazione' aggiorna disponibilità 
// del libro noleggiato a false
function noleggio(mailUtente, titoloLibro){

  let dati = {
    titolo: titoloLibro,
    mail: mailUtente
  };

  fetch('../Rented', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
          console.log('Libro prenotato correttamente')
      }
      else{
          console.log('Libro non prenotato');
      }
      return;
  })
  .catch(error => console.error(error));

}

// funzione per creare un appuntamento per ritirare un libro
function prenotazione() {
  // Recupera il titolo del libro dal parametro dell'URL
  const urlParams = new URLSearchParams(window.location.search);
  const titolo = urlParams.get('titolo');
  if (!titolo) {
      console.error("Titolo del libro non trovato nei parametri dell'URL.");
      return;
  }
  
  console.log('titolo: ', titolo);

  // Recupera gli altri dati del form
  const mail = document.getElementById('emailAppuntamento').value;
  const data = document.getElementById('dateAppuntamento').value;
  const ora = document.getElementById('timeAppuntamento').value;

  // Costruzione dei dati nel formato corretto per lo schema MongoDB
  let dati = {
      titolo: titolo,
      mail: mail,
      data: new Date(`${data}T${ora}`)
  };

  console.log("dati: ", dati);

  fetch('../createPren', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(dati)
  })
  .then((res) => res.json()) 
  .then(function(data) { 
      if(data.success){
        alert("Prenotazione effettuata");
        noleggio(mail, titolo);
      }
      else{
          alert("Prenotazione non effettuata");
      }
      return;
  })
  .catch(error => console.error(error));
}


// funzione per prenotare un appuntamento di tipo donazione o restituire un libro
function appuntamento() {
  const mail = document.getElementById('emailAppuntamento').value;
  const data = document.getElementById('dateAppuntamento').value;
  const ora = document.getElementById('timeAppuntamento').value;
  const tipoAppuntamento = document.querySelector('input[name="fav_language"]:checked').value;

  if(!tipoAppuntamento) {
    alert("Seleziona un appuntamento!!")
  }
  // Costruzione dei dati nel formato corretto per lo schema MongoDB
  let dati = {
    mail: mail,
    data: new Date(`${data}T${ora}`), // Combina data e ora
    tipo_app: tipoAppuntamento
  };
  
  console.log("dati: ", dati);

  fetch('../createApp', {
    method: 'POST',
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
};

// funzione per ottenere i miei noleggi
function ottieniNoleggi(){
  const loggedUserJSON = localStorage.getItem('loggedUser');
  const loggedUser = JSON.parse(loggedUserJSON)
  const mail = loggedUser.mail

  console.log('mail: ', mail);

  fetch('../arrayLibri?mail=' + mail)
  .then((res) => res.json())
  .then(function(data){
    if(data){
      console.log(data.libri);
      iMieiNoleggi(data.libri)
    }
    return;
  })
  .catch(error => console.error(error));
};

// funzione per creare dinamicamente la pagina i miei noleggi
function iMieiNoleggi(books) {
  console.log('books: ', books)
  var booksDiv = document.getElementById("bookList");
  if (!booksDiv) {
      console.error("Elemento 'bookList' non trovato.");
      return; // Esci dalla funzione se 'bookList' non è stato trovato
  }
  booksDiv.innerHTML = "";
  if (Array.isArray(books) && books.length > 0) {
    books.forEach(book => {
    
      var bookDiv = document.createElement('div');
      bookDiv.classList.add('book-section');
      bookDiv.setAttribute('book-id', book.book_id);

      var bookContainer = document.createElement('div');
      bookContainer.classList.add('book-container');

      var copertinaContainer = document.createElement('div');
      copertinaContainer.classList.add('copertina-container');

      var titoloP = document.createElement('div');
      titoloP.classList.add('titolo-libro');
      titoloP.textContent = book.titolo;

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

      var genereP = document.createElement('p');
      genereP.classList.add('genere');
      genereP.textContent = "Genere: " + book.Genre;

      var prenotaButton = document.createElement('button');
      prenotaButton.classList.add('bottone-cancella');
      prenotaButton.textContent = "Termina Prenotazione";

      infoLibro.appendChild(autoreP);
      infoLibro.appendChild(genereP);
      infoLibro.appendChild(prenotaButton);      
      
      bookContainer.appendChild(copertinaContainer);
      bookContainer.appendChild(infoLibro);

      bookDiv.appendChild(bookContainer);
      booksDiv.appendChild(bookDiv);

      // Aggiungi un event listener a ciascun bottone Prenota e ritira
      prenotaButton.addEventListener("click", function(){
        // Costruisci l'URL con il titolo del libro come parametro
        window.location.href = "appuntamentoLibro.html?titolo=" + encodeURIComponent(book.titolo);
      });
    });
  }
}

