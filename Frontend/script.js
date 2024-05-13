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

function handle(e){
  input = document.getElementById("searchBar").value;
  if(e.keyCode === 13){
      console.log("Input: " + input);
      ricerca();
  }
  return false;
}

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

var books = {};
async function ricerca() {
  var input = document.getElementById("searchBar").value;

  try {aggiungLibro
      // Effettua la ricerca per parametro=[titolo, nome, cognome]
      let res = await ricercaPerParametro('titolo');
      console.log(res);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Libro trovato: ", res);
          books = res;
          aggiungLibro(res.libri);
          return books;
      }

      console.log("Titolo non trovato.");

      res = await ricercaPerParametro('Author_name');
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Nome dell'autore trovato: ", res);
          books = res;
          aggiungLibro(res.libri);
          return books;
      }

      console.log("Nome autore non trovato");

      res = await ricercaPerParametro('Author_sur');
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Cognome dell'autore trovato: ", res);
          books = res;
          aggiungLibro(res.libri);
          return books;
      }

      console.log("Nessun risultato trovato.");
  } catch (error) {
      console.error('Errore durante la ricerca:', error);
  }

  // If no books found, return an empty object
  return books;
}

function aggiungLibro(books) {
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

      var prenotaButton = document.createElement('button');
      prenotaButton.classList.add('bottone-prenota');
      prenotaButton.textContent = "Prenota e ritira";

      infoLibro.appendChild(autoreP);
      infoLibro.appendChild(prenotaButton);      
      
      bookContainer.appendChild(copertinaContainer);
      bookContainer.appendChild(infoLibro);

      bookDiv.appendChild(bookContainer);
      booksDiv.appendChild(bookDiv);

      // Aggiungi un event listener a ciascun bottone Prenota e ritira
      prenotaButton.addEventListener("click", function(){
        window.location.href = "appuntamento.html";
      });
    });
  }
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
};

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
var book = {}
async function filtri() {
  var input = document.querySelector('input[name="filtro"]:checked').value;

  try {aggiungLibro
      // Effettua la ricerca per parametro=[titolo, nome, cognome]
      let res = await ricercaPerFiltro('titolo', input);
      console.log(res);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Libro trovato: ", res);
          aggiungLibro(res.libri);
          return res;
      }

      console.log("Titolo non trovato.");

      res = await ricercaPerFiltro('Genre', input);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Genere del libro trovato: ", res);
          aggiungLibro(res.libri);
          return res;
      }

      console.log("Nome autore non trovato");

      res = await ricercaPerFiltro('Author_sur', input);
      if (res && Array.isArray(res.libri) && res.libri.length > 0) {
          console.log("Cognome dell'autore trovato: ", res);
          aggiungLibro(res.libri);
          return res;
      }

      console.log("Nessun risultato trovato.");
  } catch (error) {
      console.error('Errore durante il filtro:', error);
  }

  // If no books found, return an empty object
  return book;
}