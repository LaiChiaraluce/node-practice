const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static("dist")); //PARA EJECUTAR EL FRONTEND

const cors = require("cors");
app.use(cors());

require("dotenv").config(); //PARA USAR VARIABLES DE ENTORNO

const requestLogger = (request, response, next) => {
  //MIDDLEWARE PROPIO USADO EN TODOS LOS METODOS
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const Phone = require("./models/phone");

//? PRACTICA
app.get("/api/notes", (req, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (req, response) => {
  const { id } = req.params;
  const note = notes.find((note) => note.id === Number(id));

  if (note) {
    response.status(200).json(note);
  } else {
    response.statusMessage = "Note not found";
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, response) => {
  const { id } = req.params;
  notes = notes.filter((note) => note.id !== Number(id));

  response.status(204).end();
});

app.post("/api/notes", (req, response) => {
  const { content, important } = req.body;
  if (!content || important === undefined) {
    return response.status(400).json({
      error: "content or important missing",
    });
  } else if (typeof content != "string")
    return response.status(400).json({ error: "content must be a string" });
  else if (typeof important != "boolean")
    return response.status(400).json({ error: "important must be a boolean" });
  else {
    const lastIndex = notes.length - 1;
    const lastId = notes[lastIndex].id;
    const newNote = {
      id: lastId + 1,
      content,
      important,
    };
    notes.push(newNote);
    return response.status(201).json(newNote);
  }
});

//? PRACTICA CON GUIA TELEFONICA
app.get("/api/phones", (req, response) => {
  Phone.find({}).then((res) => {
    response.json(res).status(200);
  });
});

app.get("/api/phones/:id", (req, response) => {
  const { id } = req.params;
  const phone = numbers.find((el) => el.id === Number(id));
  if (phone) response.status(200).json(phone);
  else {
    response.statusMessage = "Phone number not found";
    response.status(404).end();
  }
});

app.delete("/api/phones/:id", (req, response) => {
  const { id } = req.params;
  numbers = numbers.filter((number) => number.id !== Number(id));
  response.status(204).end();
});

app.post("/api/phones/persons", (req, response) => {
  const { name, number } = req.body;
  if (!name || !number)
    return response
      .status(400)
      .json({ error: "You must indicate name and number of the new contact" });
  else if (typeof name != "string")
    return response.status(400).json({ error: "Name must be a string" });
  else if (typeof number != "number")
    return response
      .status(400)
      .json({ error: "Phone number is not in the correct format" });
  const alreadyExist = numbers.find((number) => number.name === name);
  if (alreadyExist)
    return response.status(400).json({ error: "Name contact already exists" });
  const newContact = {
    id: Math.random() * 1502,
    name,
    number,
  };
  numbers.push(newContact);
  response.status(201).json(newContact);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
