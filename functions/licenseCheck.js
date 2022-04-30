const functions = require('firebase-functions')
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch')
// import fetch from 'node-fetch'
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true, credentials: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);
const responseAPI = async (license) => {
  const query = fetch("https://cedulaprofesional.sep.gob.mx/cedula/buscaCedulaJson.action", {
    credentials: "include",
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0",
      "Accept": "*/*",
      "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1"
    },
    referrer: "https://cedulaprofesional.sep.gob.mx/cedula/presidencia/indexAvanzada.action",
    body: `json=%7B%22maxResult%22%3A%221000%22%2C%22nombre%22%3A%22%22%2C%22paterno%22%3A%22%22%2C%22materno%22%3A%22%22%2C%22idCedula%22%3A%22${license}%22%7D`,
    method: "POST",
    mode: "cors"
  })
  return (await query).json()
}

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
  titulo
} = {}) => ({
  registrationYear: anioreg,
  curp,
  institution: desins,
  id: idCedula,
  lastname2: `${materno}${maternoM ? ' ' + maternoM : ''}`,
  name: `${nombre}${nombreM ? ' ' + nombreM : ''}`,
  lastname: `${paterno}${paternoM ? ' ' + paternoM : ''}`,
  gender: sexo,
  type: tipo,
  title: titulo
})

app.get('/:id', async (req, res) => {
  const { id } = req.params
  if (!id || isNaN(id)) {
    return res.status(422).json({ errors: 'malformed id' })
  }
  const dan = license((await responseAPI(id)).items[0])
  res.status(200).send(dan)
})
// Expose Express API as a single Cloud Function:
exports.licenseAPI = functions.https.onRequest(app);

// const functions = require('firebase-functions')
// const cors = require('cors')({ origin: true })

// exports.licenseAPI = functions.https.onRequest((request, response) => {
//   if (request.method !== "GET") {
//     res.status(400).send('Please send a GET request')
//     return
//   }
//   let data = request.body
//   functions.logger.log('data from http',)
//     .then(apiResponse => { response.status(200).send(apiResponse) })
//   // res.status(200).send(data)
// })
