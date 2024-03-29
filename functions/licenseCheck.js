const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

// Automatically allow cross-origin requests
// app.use(cors({origin: true, credentials: true}));
// allow cross-origin requests
app.use(cors({credentials: true}));

const responseAPI = async (license) => {

    const queryHeaders = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0",
        "Accept": "*/*",
        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-GPC": "1",
    }; // queryHeaders

  const result = fetch("https://cedulaprofesional.sep.gob.mx/cedula/buscaCedulaJson.action", {
    credentials: "include",
    headers: queryHeaders,
    referrer: "https://cedulaprofesional.sep.gob.mx/cedula/presidencia/indexAvanzada.action",
    body: `json=%7B%22maxResult%22%3A%221000%22%2C%22nombre%22%3A%22%22%2C%22paterno%22%3A%22%22%2C%22materno%22%3A%22%22%2C%22idCedula%22%3A%22${license}%22%7D`,
    method: "POST",
    mode: "cors",
  })
        .then((response) => {
            return response.arrayBuffer();
        })
        .then((bufffer) => {
            const decoder = new TextDecoder('iso-8859-1');
            const text = decoder.decode(bufffer);
            return text;
        });
    return JSON.parse(await result);
};

const license = ({
  anioreg,
  curp,
  desins,
  idCedula,
  materno,
  maternoM,
  nombre,
  nombreM,
  paterno,
  paternoM,
  sexo,
  tipo,
  titulo,
} = {}) => ({
  curp,
  gender: sexo,
  licenseNumber: idCedula,
  institution: desins,
  lastname2: `${materno}${maternoM ? " " + maternoM : ""}`,
  lastname: `${paterno}${paternoM ? " " + paternoM : ""}`,
  name: `${nombre}${nombreM ? " " + nombreM : ""}`,
  registrationYear: anioreg,
  title: titulo,
  type: tipo,
});

app.get("/:id", async (req, res) => {
  const {id} = req.params;
  if (!id || isNaN(id)) {
    return res.status(422).json({errors: "malformed id"});
  }
  const dan = license((await responseAPI(id)).items[0]);
  res.status(200).send(dan);
});
// Expose Express API as a single Cloud Function:
exports.licenseAPI = functions.https.onRequest(app);

