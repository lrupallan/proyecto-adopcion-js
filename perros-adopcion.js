//Defino mi arreglo de objetos (en este caso, perros)
class Perro {
  constructor(id, nombre, genero, tamaño, castrado, url, owner, adoptante) {
    this.id = id;
    this.nombre = nombre;
    this.genero = genero;
    this.tamaño = tamaño;
    this.castrado = castrado;
    this.url = url;
    this.owner = owner;
    this.adoptante = adoptante;
  }
}

async function getPerros() {
  const response = await fetch("https://parseapi.back4app.com/classes/perro", {
    method: "GET",
    headers: {
      "X-Parse-Application-Id": "4s8lgIwS6KXzlwY53PmTFZK6GhNHc0ScoX6hWFwR",
      "X-Parse-Javascript-Key": "67Oz9KqI7nMUGXL5WafZM6uRt9vZ68gOLrLtKAfD",
    },
  });

  const responseJson = await response.json();
  const perros = [];
  responseJson.results.forEach((perro) => {
    perros.push(
      new Perro(
        perro.objectId,
        perro.nombre,
        perro.genero,
        perro.talla,
        perro.castrado,
        perro.url,
        perro.owner,
        perro.adoptante
      )
    );
  });

  return perros;
}

//filtra el array perros de acuerdo a las caracteristicas seleccionadas por el usuario
async function filtrarPerros(event) {
  //Prevengo el comportamiento por defecto del evento
  // en este caso seria submit => envio de los datos del formulario
  event.preventDefault();

  const perros = await getPerros();

  //llamo a las funciones que obtienen cada parametro de la busqueda
  const genero = elegirGenero();
  const tamaño = elegirTamaño();
  const castrado = elegirCastrado();
  const favoritos = getPerrosStorage();

  let resultado = [];
  //si el target del evento es mostrar perros favoritos
  if (event.target.id === "boton-mostrar-favoritos") {
    //filtro los elementos que no son favoritos
    resultado = perros.filter((perro) => favoritos.includes(perro.id));
  } else {
    //filtro los elementos de mi arreglo segun los parametros obtenidos
    resultado = perros.filter((perro) =>
      filtrarPerro(perro, genero, tamaño, castrado)
    );
  }

  //creo el container principal para mostrar el resultado de la busqueda
  const mainContainer = document.getElementById("resultado-perros");
  mainContainer.innerHTML = "";

  //creo el div para mostrar un mensaje
  let div = document.createElement("div");
  div.className = "titulo-resultado";
  div.innerHTML = `<h2>Resultado de tu busqueda:</h2>`;

  mainContainer.append(div);

  //muestro los elementos resultado de la busqueda
  const containerPerros = document.createElement("div");
  containerPerros.className = "container-perros";

  //establezco condiciones para mostrar las caracteristicas de cada objeto
  if (resultado.length > 0) {
    for (const perro of resultado) {
      const genero = perro.genero === "M" ? "Macho" : "Hembra";
      const tamaño =
        perro.tamaño === "C"
          ? "Chico"
          : perro.tamaño === "M"
          ? "Mediano"
          : "Grande";
      const castrado = perro.castrado ? "Si" : "No";

      //creo las cards contenedoras de los objetos a mostrar
      //si el perro es marcado como favorito, agrego la clase "favorito" para diferenciarlo
      let div = document.createElement("div");
      div.className = "card";
      let card = `
      <img class= "img-card" src="${perro.url}" alt="">
      <p class="title-card">${perro.nombre}</p>
      <p class="genero-card">Genero: ${genero}</p>
      <p class="tamaño-card">Tamaño: ${tamaño}</p>
      <p class="castrado-card">Castrado: ${castrado}</p>
      `;

      if (userInfo) {
        const classFavorito = favoritos.includes(perro.id) ? "favorito" : "";
        //el id de los botones generados dinamicamente contienen el objectId del perro al cual hace referencia
        card += `<button class="boton-fav ${classFavorito}" id="boton-fav-${perro.id}">Favorito</button>`;
        if (!(perro.owner === userInfo.objectId || perro.adoptante)) {
          card += `<button class="adoptar" id= "boton-adoptar-${perro.id}">Adoptar</button>`;
        } else {
          if(perro.owner === userInfo.objectId) {
            card += `<p class="owner">Cargaste este perro&#128077;</p>`;
          }
        }
      }
      if (perro.adoptante) {
        card += "<p class='estado-adoptado'>Adoptado&#127881;</p>";
      }

      div.innerHTML = card;
      //agrego un handler al evento click
      div.addEventListener("click", clickHandlerFavoritos);
      div.addEventListener("click", clickHandlerAdoptar);
      containerPerros.append(div);
    }
  } else {
    //Mensaje de busqueda sin coincidencias
    containerPerros.innerHTML =
      "Ninguno de nuestros perros coincide con tu busqueda. Por favor, intenta nuevamente con otras caracteristicas.";
  }

  mainContainer.append(containerPerros);
}

function clickHandlerFavoritos(event) {
  //me fijo que el target del evento sea un boton de favorito chequeando la clase "boton-fav"
  if (event.target.classList.contains("boton-fav")) {
    //parseo el id numerico del boton que fue apretado a partir del id del objeto
    const id = event.target.id.split("-")[2];
    let favoritos = getPerrosStorage();

    //si el perro no esta incluido en favoritos
    if (!favoritos.includes(id)) {
      //lo agrego al arreglo de favoritos
      favoritos.push(id);
      //y le agrego la clase "favorito"
      event.target.classList.add("favorito");
    } else {
      //si el perro ya esta en favoritos, lo filtro
      favoritos = favoritos.filter((element) => element !== id);
      //y remuevo la clase "favorito"
      event.target.classList.remove("favorito");
    }

    //guardo los elementos en session storage
    sessionStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
}

async function clickHandlerAdoptar(event) {
  //me fijo que el target del evento sea un boton de adoptar chequeando la clase correspondiente
  if (event.target.classList.contains("adoptar")) {
    const id = event.target.id.split("-")[2];
    const body = {
      adoptante: userInfo.objectId,
    };
    const response = await fetch(
      "https://parseapi.back4app.com/classes/perro/" + id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Parse-Application-Id": "4s8lgIwS6KXzlwY53PmTFZK6GhNHc0ScoX6hWFwR",
          "X-Parse-Javascript-Key": "67Oz9KqI7nMUGXL5WafZM6uRt9vZ68gOLrLtKAfD",
          "X-Parse-Revocable-Session": "1",
          "X-Parse-Session-Token": userInfo.sessionToken,
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      event.target.classList.add("ADOPTADO");
      Swal.fire({
        title: "¡Felicidades!",
        text: "Elegiste a un amigo para toda la vida. Su apadrinador se comunicará con vos a la brevedad.",
        imageUrl:
          "https://us.123rf.com/450wm/manonteravest/manonteravest1811/manonteravest181100006/116011832-tarjeta-del-feliz-cumplea%C3%B1os-el-perro-loco-con-gorro-de-fiesta-est%C3%A1-sonriendo-en-la-c%C3%A1mara-contra-el.jpg?ver=6",
        imageWidth: 300,
        imageHeight: 350,
        imageAlt: "Perro celebrando",
        confirmButtonColor: "lightseagreen",
      });
    } else {
      alert("Error inesperado, intente nuevamente mas tarde.");
    }
  }
}

//busco los elementos favoritos en la memoria y los devuelvo como objeto
function getPerrosStorage() {
  const favoritosValue = sessionStorage.getItem("favoritos");
  if (favoritosValue !== null) {
    try {
      const parsed = JSON.parse(favoritosValue);

      return parsed;
    } catch (error) {
      return [];
    }
  }
}

function elegirGenero() {
  let radioMacho = document.getElementById("radio-macho");
  let radioHembra = document.getElementById("radio-hembra");

  //determino que valor toma el parametro dependiendo de que opcion se haya seleccionado en el radio button
  if (radioMacho.checked == true) {
    return "M";
  }

  if (radioHembra.checked == true) {
    return "H";
  }

  return undefined;
}

function elegirTamaño() {
  let radioChico = document.getElementById("radio-chico");
  let radioMediano = document.getElementById("radio-mediano");
  let radioGrande = document.getElementById("radio-grande");

  if (radioChico.checked == true) {
    return "C";
  }
  if (radioMediano.checked == true) {
    return "M";
  }
  if (radioGrande.checked == true) {
    return "G";
  }

  return undefined;
}

function elegirCastrado() {
  let radioCastrado = document.getElementById("radio-castrado");
  let radioNoCastrado = document.getElementById("radio-no-castrado");

  if (radioCastrado.checked == true) {
    return true;
  }
  if (radioNoCastrado.checked == true) {
    return false;
  }

  return undefined;
}

//Declaro la funcion con las condiciones para filtrar los objetos de mi arreglo
function filtrarPerro(perro, genero, tamaño, castrado) {
  return (
    (genero === undefined || perro.genero.toUpperCase() === genero) &&
    (tamaño === undefined || perro.tamaño.toUpperCase() === tamaño) &&
    (castrado === undefined || perro.castrado === castrado)
  );
}

//Obtengo el objeto formulario
const form = document.getElementById("form-bucar-perros");

//Agrego el listener para el evento submit del formulario
form.addEventListener("submit", filtrarPerros);

//obtengo el objeto boton favoritos y agrego el listener al evento click
const buttonFavoritos = document.getElementById("boton-mostrar-favoritos");
buttonFavoritos.addEventListener("click", filtrarPerros);

// const userInfo = sessionStorage.getItem("user-info");
