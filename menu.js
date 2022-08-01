async function cerrarSesion() {
  await guardarFavoritos();
  sessionStorage.clear();
  window.location.href = "index.html";
}

async function guardarFavoritos() {
  const perrosFavoritos = JSON.parse(sessionStorage.getItem("favoritos"));
  const body = {
    perrosFavoritos,
  };

  const response = await fetch(
    "https://parseapi.back4app.com/users/" + userInfo.objectId,
    {
      method: "PUT",
      headers: {
        "X-Parse-Application-Id": "4s8lgIwS6KXzlwY53PmTFZK6GhNHc0ScoX6hWFwR",
        "X-Parse-Javascript-Key": "67Oz9KqI7nMUGXL5WafZM6uRt9vZ68gOLrLtKAfD",
        "X-Parse-Revocable-Session": "1",
        "X-Parse-Session-Token": userInfo.sessionToken,
      },
      body: JSON.stringify(body),
    }
  );
}

const userInfoString = sessionStorage.getItem("user-info");
const userInfo = userInfoString ? JSON.parse(userInfoString) : undefined;

if (userInfo) {
  const botonLogin = document.getElementById("boton-login");
  const botonSignup = document.getElementById("boton-signup");
  const saludo = document.getElementById("saludo");

  if (botonLogin) {
    botonLogin.style.display = "none";
  }

  if (botonSignup) {
    botonSignup.style.display = "none";
  }

  if (saludo) {
    saludo.innerHTML = `Hola ${userInfo.username}`;
  }
} else {
  const menu = document.getElementById("menu");
  const nuevoPerro = document.getElementById("nuevo-perro");
  const botonFav = document.getElementById("boton-mostrar-favoritos");

  if (menu) {
    menu.style.display = "none";
  }

  if (nuevoPerro) {
    nuevoPerro.style.display = "none";
  }

  if (botonFav) {
    botonFav.style.display = "none";
  }
}

const buttonLogout = document.getElementById("boton-logout");
buttonLogout.addEventListener("click", cerrarSesion);
