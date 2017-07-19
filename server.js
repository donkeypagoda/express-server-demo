'use strict';

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const bodyParse = require("body-parser");

const app = express();
const animalsPATH = path.join(__dirname, "animals.JSON");

app.disable('x-powered-by');

app.use(morgan("short"));
app.use(bodyParse.json());

// TODO: get all animals
app.get("/animals", (req, res) => {
  fs.readFile(animalsPATH, 'utf8', (err, data) => {
    if (err) {
      console.error(err.stack);
      res.status(500)
      res.send(err.message);
    }
    const animals = JSON.parse(data);

    res.send(animals);
  });
});

// TODO: get one animal
app.get("/animals/:id", (req, res) => {
  fs.readFile(animalsPATH, "utf8", (err, data) => {
    if (err) {
      console.error(err.stack);
      res.status(500);
      res.send(err.message);
    }

    const animals = JSON.parse(data);
    const id = Number.parseInt(req.params.id);

    if (id < 0 || id >= animals.length || Number.isNaN(id)){
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'text/plain');
    res.send(animals[id]);
  });
});
// TODO: post one animal
app.post("/animals", (req, res) => {
  const name = req.body.name;
  const kind = req.body.kind;
  if (!name || !kind){
    res.sendStatus(400);
  }
  fs.readFile(animalsPATH, "utf8", (err, data) => {
    if (err) {
      console.error(err.stack);
      res.status(500);
      res.send(err.message);
    }
    const animals = JSON.parse(data);
    const newAnimal = {"name": name, "kind": kind};
    animals.push(newAnimal);
    const newAnimalJSON = JSON.stringify(animals);
    fs.writeFile(animalsPATH, newAnimalJSON, "utf8", (err) => {
      if (err) {
        console.error(err.stack);
        res.status(500);
        res.send(err.message);
      }
      res.set('Content-Type', 'text/plain');
      res.send(newAnimal);

    });
  });
});

const port = process.env.PORT || 8000;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
