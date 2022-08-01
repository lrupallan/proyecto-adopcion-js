const btnSignup = document.getElementById("boton-registro");
btnSignup.addEventListener("click", signupHandler);

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const isLogin = !(params.f && params.f === "registrar");

const elemNombreyapellido = document.getElementById("input-nombre");
const elemUsuario = document.getElementById("input-usuario");
const elemEmail = document.getElementById("input-email");
const elemPassword = document.getElementById("input-password");
const elemRepetirPassword = document.getElementById("input-repetir-password");
const botonRegistro = document.getElementById("boton-registro");

if (isLogin) {
  //ocultar coso
  elemNombreyapellido.style.display = "none";
  elemEmail.style.display = "none";
  elemRepetirPassword.style.display = "none";
  document.getElementById("label-nombre").style.display = "none";
  document.getElementById("label-email").style.display = "none";
  document.getElementById("label-repetir-password").style.display = "none";
  //cambiar boton
  botonRegistro.innerHTML = `INGRESAR`;
  //cambiar mensaje de bienvenida
  document.getElementById("titulo").innerHTML = "BIENVENIDO OTRA VEZ&#128075;";
  document.getElementById("mensaje-bienvenida").innerHTML =
    "Para iniciar sesión ingresá tu usuario y contraseña";
}

async function signupHandler(event) {
  event.preventDefault();

  if (isLogin) {
    return await ingresarUsuario(elemUsuario.value, elemPassword.value);
  }

  return await cargarUsuario(
    elemNombreyapellido.value,
    elemUsuario.value,
    elemEmail.value,
    elemPassword.value
  );
}

async function ingresarUsuario(username, password) {
  const response = await fetch(
    "https://parseapi.back4app.com/login?username=" +
      username +
      "&password=" +
      password,
    {
      method: "GET",
      headers: {
        "X-Parse-Application-Id": "4s8lgIwS6KXzlwY53PmTFZK6GhNHc0ScoX6hWFwR",
        "X-Parse-Javascript-Key": "67Oz9KqI7nMUGXL5WafZM6uRt9vZ68gOLrLtKAfD",
        "X-Parse-Revocable-Session": "1",
      },
    }
  );

  if (response.ok) {
    const body = await response.json();
    sessionStorage.setItem("user-info", JSON.stringify(body));
    sessionStorage.setItem("favoritos", JSON.stringify(body.perrosFavoritos));

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Iniciaste sesion de manera exitosa',
        showConfirmButton: false,
        timer: 3000
      }).then(
        (result) => {
          if(result) {
            window.location.href = 'index.html'
          }
        }
      )

      window.location.href = 'index.html'
  } else {alert("Error inesperado, vuelva a intentar en unos momentos")}
}

async function cargarUsuario(fullname, username, email, password) {
  const body = {
    fullname,
    username,
    email,
    password,
  };

  const response = await fetch("https://parseapi.back4app.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Parse-Application-Id": "4s8lgIwS6KXzlwY53PmTFZK6GhNHc0ScoX6hWFwR",
      "X-Parse-Javascript-Key": "67Oz9KqI7nMUGXL5WafZM6uRt9vZ68gOLrLtKAfD",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    Swal.fire({
      title: "¡Gracias por unirte!",
      text: `Te registraste exitosamente`,
      imageUrl:
        "https://st.depositphotos.com/1146092/3462/i/600/depositphotos_34626909-stock-photo-ok-fingers-dog.jpg",
      imageWidth: 350,
      imageHeight: 350,
      imageAlt: "Nuevo usuario registrado",
      confirmButtonColor: "lightseagreen",
    }).then((result) => {
      if (result.value) {
        window.location.href = "index.html";
      }
    });
  } else {
    alert("Error inesperado, vuelva a intentar en unos momentos");
  }
}
