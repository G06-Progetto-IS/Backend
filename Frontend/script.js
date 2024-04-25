// Stores the logged in user 
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
	input=document.getElementById("searchBar").value;
    if(e.keyCode === 13){
    	console.log("Input: " + input);
      ricerca()
    }
	return false;
}

function ricerca() {
  var input = document.getElementById("searchBar").value;
  
  // Funzione per effettuare una singola richiesta di ricerca
  function ricercaPerParametro(parametro) {
      var url = '/ricerca?' + parametro + '=' + input;
      console.log(url);
      return fetch(url)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              return data;
          });
  }

  // Effettua la ricerca per parametro=[titolo, nome, cognome]
  ricercaPerParametro('titolo')
      .then(titolo => {
        if (titolo) {
          console.log("Libro trovato: " + titolo);
        } else {
          // Se il titolo non è stato trovato, esegui la ricerca per il nomed dell'autore
          return ricercaPerParametro('Author_name');
        }
      })
      .then(nome => {
        // Se è stato trovato un risultato, mostra il nome dell'autore
        if (nome) {
          console.log("Nome dell'autore trovato: " + nome);
        } else {
          // Altrimenti, effettua la ricerca per cognome
          return ricercaPerParametro('Author_sur');
        }
      })
      .then(cognome => {
          // Se è stato trovato un risultato, mostra il cognome dell'autore
          if (cognome) {
            console.log("Cognome dell'autore trovato: " + cognome);
          } else {
            // Se non ci sono risultati per nessun parametro, mostra un avviso
            console.log("Nessun risultato trovato.");
          }
      })
      .catch(error => {
        console.error('Si è verificato un errore durante la ricerca:', error);
      });
}




// // Ricerca base, fornito sempre e solo il titolo del libro (non funziona con nome o cognome)
// function ricerca() {
//   const input = document.getElementById('searchBar').value;
 
//       //console.log(data)
//       fetch(`../ricerca?titolo=` + input)
//       .then(resp => resp.json())
//       .then(data => console.log(`Risultati per input:`, data))
//       .catch(error => console.error(error));
// }
    