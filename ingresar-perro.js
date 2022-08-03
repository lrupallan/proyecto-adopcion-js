const btnCargar = document.getElementById("boton-ingresar-perro");
btnCargar.addEventListener("click", cargarHandler);

async function cargarHandler(event) {
  event.preventDefault();
  

  return await cargarPerro();
}

//funcion para cargar nuevo perro a la db
async function cargarPerro() {
  const nombre = document.getElementById("nombre").value;
  const genero = document.querySelector('input[name="genero"]:checked').value;
  const talla = document.querySelector('input[name="talla"]:checked').value;
  const castrado = document.querySelector(
    'input[name="castrado"]:checked'
  ).value;
  const imageUrl = document.getElementById("foto").value;

  const body = {
    nombre,
    genero,
    talla,
    castrado: castrado === 'true',
    url: imageUrl,
    owner: userInfo.objectId
  };

  const response = await fetch(
    'https://parseapi.back4app.com/classes/perro',
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-Parse-Application-Id': '4s8lgIwS6KXzlwY53PmTFZK6GhNHc0ScoX6hWFwR',
        "X-Parse-Javascript-Key": "67Oz9KqI7nMUGXL5WafZM6uRt9vZ68gOLrLtKAfD",
        "X-Parse-Session-Token": userInfo.sessionToken,
      },
      body: JSON.stringify(body),
    }
  );

  if (response.ok) {
    Swal.fire({
      title: '¡A cruzar los dedos!',
      text: `${nombre} fue cargado/a exitosamente. Está un paso más cerca de encontrar una familia para siempre.`,
      imageUrl,
      imageWidth: 300,
      imageHeight: 350,
      imageAlt: 'Perro cargado',
      confirmButtonColor: 'lightseagreen',
    }).then(
      (result) => {
        if(result.value) {
          window.location.href = 'index.html'
        }
      }
    )
  } else {alert("Error inesperado, vuelva a intentar en unos momentos")}
}
