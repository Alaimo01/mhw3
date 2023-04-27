const numpage = 10;


function onResponce(response){
    console.log('json ricevuto correttamente');
    return response.json();
}


function onJson_stmp_pkm(json){
  console.log('json immagine ricevuto correttamente');
  const libreria = document.querySelector('#album-view');
  const risultato = json.data[0];
  console.log('risultato json della ricerca pokemon');
  console.log(json);

    const immagine = risultato.images.large;
    const nom= risultato.name;
    const album = document.createElement('div');
    album.classList.add('album');
    const img = document.createElement('img');
    const nome = document.createElement('text');
    img.src=immagine;
    nome.textContent='pokemon: '+nom;
    album.appendChild(img);
    album.appendChild(nome);
    libreria.appendChild(album);
}



function onJson(json){
    console.log('json tipo ricevuto correttamente');
    const library = document.querySelector('#album-view');
    library.innerHTML = '';
    const results = json.pokemon;
    console.log('risultato della prima json');
    console.log(json);
    let conta = 0;

    for(result of results){
      const pokemon = result.pokemon.name;
      const album = document.createElement('div');
      album.classList.add('album');
      const lista = document.createElement('text');
      if(conta < 12){
      const url_immagine = 'https://api.pokemontcg.io/v2/cards?q=name:'+pokemon;
      console.log(url_immagine);
      fetch(url_immagine).then(onResponce).then(onJson_stmp_pkm);
      conta = conta + 1;
      }else break;
    }
    
}


function onJson_lol(json){
  console.log('json di lol ricevuto correttamente');
  const libreria = document.querySelector('#album-view');
  libreria.innerHTML='';
  console.log(json);
  const id_account = json.accountId
  const nome = json.name;
  const id_summoner = json.id;
  const livello = json.summonerLevel;
  const album = document.createElement('div');
  album.classList.add('lol');
  const ele1 = document.createElement('text');
  const ele2 = document.createElement('text');
  const ele3 = document.createElement('text');
  const ele4 = document.createElement('text');
  ele1.textContent = 'ID ACCOUNT: '+id_account;
  ele2.textContent = 'NOME: '+nome;
  ele3.textContent = 'ID SUMMONER:'+id_summoner;
  ele4.textContent = 'LIVELLO SUMMONER: '+livello;
  album.appendChild(ele1);
  album.appendChild(ele2);
  album.appendChild(ele3);
  album.appendChild(ele4);
  libreria.appendChild(album);
}

function onJson_ricerca(json){
  console.log('sto stampando la funzione di ricerca: '+token);
  console.log(json);
  libreria = document.querySelector('#album-view');
  libreria.innerHTML = '';
  const results = json.data;
  let conta = 0;
  for(result of results){
    if (conta <= 15){
    const game_name = result.game_name;
    const url_stream = result.thumbnail_url;
    const titolo = result.title;
    const spettatori = result.viewer_count;
    const album = document.createElement('div');
    album.classList.add('album');
    const ele0 = document.createElement('text');
    const ele1 = document.createElement('text');
    const ele2 = document.createElement('text');
    const ele3 = document.createElement('text');
    const ele4 = document.createElement('text');
    ele0.textContent = 'NUMBER STREAM: ' + conta;
    ele1.textContent = 'GAME NAME: '+ game_name;
    ele2.textContent = 'URL STREAM: '+ url_stream;
    ele3.textContent = 'TITLE: '+ titolo;
    ele4.textContent = 'VIEWER: '+ spettatori;
    album.appendChild(ele0);
    album.appendChild(ele1);
    album.appendChild(ele2);
    album.appendChild(ele3);
    album.appendChild(ele4);
    libreria.appendChild(album);
    conta = conta +1;
  }else break;
  }
}

function getToken(json)
{
	token = json.access_token;
	console.log(json);
  console.log('token: '+token);
}

function onTokenResponse(response) {
  return response.json();
}

// All'apertura della pagina, richiediamo il token
let token;
fetch('https://id.twitch.tv/oauth2/token',
{
	method: 'post',
	body: 'client_id=i7g1mwhnw6hiim4aqjrpl5vk7ua71q&client_secret=7vbs0wdpwxpnqhw023k8fktebx3c9a&grant_type=client_credentials',
	headers:
	{
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}
).then(onTokenResponse).then(getToken);

function search(event){

//preveniamo la submit del form
event.preventDefault();

//adesso leggiamo cio che vogliemo cercare se immagine o altro
const ricerca = document.querySelector('#tipo').value;
const ele = document.querySelector('#content').value;
const elemento = encodeURIComponent(ele);

if(ricerca === 'tipo'){
    console.log('esegue la ricerca di '+ elemento);
    const rest_url = 'https://pokeapi.co/api/v2/type/'+ elemento+'?limit='+numpage;
    console.log(rest_url);
    fetch(rest_url).then(onResponce).then(onJson);
}

if(ricerca === 'summoner'){
  console.log('eseguo la ricerca di '+ elemento);
  fetch('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+elemento+'?api_key=RGAPI-e3ccb941-eaed-4504-8b7e-deb58d8435c2').then(onResponce).then(onJson_lol);
}

if(ricerca === 'Ricerca'){
  
  fetch('https://api.twitch.tv/helix/streams',{
    headers: {
      'Authorization': 'Bearer ' + token,
      'Client-Id' : 'i7g1mwhnw6hiim4aqjrpl5vk7ua71q' 
    }
  }).then(onResponce).then(onJson_ricerca);
  console.log('il token dentro la search è: '+token);
}

}
const form = document.querySelector('form');
form.addEventListener('submit',search);