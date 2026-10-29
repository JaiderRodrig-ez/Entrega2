import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./util.js";
import path from "node:path";

const app = express();
const port = 3000;
const mensajes = [];
let siguienteId = 1;

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("chat", { title: "Chat en vivo", mensajes });
});

app.get("/productos", (req, res) => {
  const products = [
    { name_product: "Hamburger chimbisecchions", price: 10 },
    { name_product: "Coke", price: 3 },
    { name_product: "Pancake", price: 8 }
  ];
  res.render("index", { title: "Motores", username: "Muchachos", admin: true, product: products });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Motores/contacto", dato: "Por jugar" });
});

app.get("/api/mensajes", (req, res) => res.json(mensajes));

app.post("/api/mensajes", (req, res) => {
  const { nombre, texto, usuarioId } = req.body || {};
  if (typeof nombre !== "string" || typeof texto !== "string" ||
      typeof usuarioId !== "string" || !nombre.trim() || !texto.trim() ||
      !usuarioId.trim() || nombre.length > 30 || texto.length > 500 || usuarioId.length > 100) {
    return res.status(400).json({ error: "Ingresa un nombre y mensaje válidos" });
  }
  const nuevoMensaje = {
    id: siguienteId++,
    nombre: nombre.trim(),
    texto: texto.trim(),
    usuarioId,
    hora: new Date().toLocaleTimeString("es-CO", {
      timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit"
    })
  };
  mensajes.push(nuevoMensaje);
  res.status(201).json(nuevoMensaje);
});

app.listen(port, () => console.log(`Chat disponible en http://localhost:${port}`));
