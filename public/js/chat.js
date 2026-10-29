const form = document.getElementById("formChat");
const nombre = document.getElementById("nombre");
const texto = document.getElementById("texto");
const contenedor = document.getElementById("mensajes");
const estado = document.getElementById("estado");
const usuarioId = crypto.randomUUID();
let ultimaVersion = "";

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const autor = nombre.value.trim();
  const contenido = texto.value.trim();
  if (!autor || !contenido) {
    estado.textContent = "Ingresa tu nombre y un mensaje.";
    return;
  }
  try {
    const respuesta = await fetch("/api/mensajes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: autor, texto: contenido, usuarioId })
    });
    if (!respuesta.ok) throw new Error("No se pudo enviar el mensaje");
    texto.value = "";
    estado.textContent = "";
    await cargarMensajes();
    texto.focus();
  } catch (error) {
    estado.textContent = "Error al enviar. Intenta nuevamente.";
  }
});

async function cargarMensajes() {
  try {
    const respuesta = await fetch("/api/mensajes");
    if (!respuesta.ok) throw new Error("Error de conexión");
    const mensajes = await respuesta.json();
    const version = mensajes.length ? String(mensajes[mensajes.length - 1].id) : "0";
    if (version === ultimaVersion) return;
    ultimaVersion = version;
    const cercaDelFinal = contenedor.scrollHeight - contenedor.scrollTop - contenedor.clientHeight < 90;
    contenedor.replaceChildren();
    mensajes.forEach(mensaje => {
      const div = document.createElement("div");
      div.className = mensaje.usuarioId === usuarioId ? "mensaje propio" : "mensaje";
      div.dataset.id = mensaje.id;
      const info = document.createElement("div");
      info.className = "mensaje-info";
      const autor = document.createElement("strong");
      autor.textContent = mensaje.nombre;
      const hora = document.createElement("small");
      hora.textContent = mensaje.hora;
      const contenido = document.createElement("p");
      contenido.textContent = mensaje.texto;
      info.append(autor, hora);
      div.append(info, contenido);
      contenedor.appendChild(div);
    });
    if (cercaDelFinal) contenedor.scrollTop = contenedor.scrollHeight;
    estado.textContent = "";
  } catch (error) {
    estado.textContent = "No se pudieron actualizar los mensajes.";
  }
}

cargarMensajes();
setInterval(cargarMensajes, 2000);
