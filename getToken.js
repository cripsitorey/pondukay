import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
const { UserAgent, random } = require('user-agents');

let url = 'https://idukay.net/api/students?__sort={"relational_data.name.order":"asc"}&populate={"user":"photo name surname second_name second_surname"}&select=user'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      let notas = "";  // Variable para almacenar la respuesta
      let authToken = null;
      let studentID = null;
      let schooolID = null;
      let lectiveID = null;
      let profileID = null;
      const targetEndpoint = 'https://idukay.net/api/login'; // Endpoint donde se obtiene el token
      
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      );
      // Intercepta las respuestas para capturar el token
      page.on('response', async (response) => {
        try {
          if (response.url().includes(targetEndpoint)) {
            
            const responseBody = await response.json();
            try {
              if (responseBody.response.token) {
                authToken = responseBody.response.token;
                schooolID = responseBody.response.user.school;
                lectiveID = responseBody.response.user.preferences.working_year._id;
                profileID = responseBody.response.user.preferences.working_profile._id;
                studentID = responseBody.response.user.preferences.selected_student._id;
                console.log('Token de autorización capturado:', authToken);
              }
            } catch (err) {
              console.log('No es JSON válido:', err);
            }
          }
        } catch (err) {
          console.error('Error al procesar la respuesta:', err);
        }
      });
      // Navega al sitio y realiza el inicio de sesión
      await page.goto('https://idukay.net/', { waitUntil: 'networkidle2' });
      await page.waitForSelector('input[type="password"]');
      await page.type('input[type="text"]', username);
      await page.type('input[type="password"]', password);
      
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.click('button[type="submit"]'),
      ]);
      
      // Espera a que se capture el token
      await delay(500);

      if (studentID == profileID) {
        url = "https://idukay.net/api/my_year_summary?include_averages=true";
        const headers = {
          "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          "Authorization": authToken,
          "WorkingYear": lectiveID,
          "WorkingSchool": schooolID,
          "WorkingProfile": profileID,
          "SelectedStudent": studentID,
          "ClientVersion": "7.0.3",
        };
        const response = await fetch(url, { method: "GET", headers });
        notas = await response.json();
      } else {
        const headerss = {
          "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          "Authorization": authToken,
          "WorkingYear": lectiveID,
          "WorkingSchool": schooolID,
          "WorkingProfile": profileID,
          "ClientVersion": "7.0.3",
        };
        const urll = 'https://idukay.net/api/students?__sort={"relational_data.name.order":"asc"}&populate={"user":"photo name surname second_name second_surname"}&select=user'
        let lujus = null;
        const responses = await fetch(urll, { method: "GET", headerss });
        lujus = await responses.json();
        for (let i = 0; i < lujus.response.length; i++) {
          console.log("Datos almacenados:", lujus.response[i].user._id + " " + lujus.response[i].user.name + " " + lujus.response[i].user.surname);
          url = "https://idukay.net/api/student_year_summary?include_averages=true&student=" + lujus.response[i]._id;
          const headers = {
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            "Authorization": authToken,
            "WorkingYear": lectiveID,
            "WorkingSchool": schooolID,
            "WorkingProfile": profileID,
            "SelectedStudent": lujus.response[i]._id,
            "ClientVersion": "7.0.3",
          };
          const response = await fetch(url, { method: "GET", headers });
          notas = await response.json();
        }
      }
      res.status(200).json({ success: true, notas });
      await browser.close();
      
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Método no permitido.' });
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// console.log(notas.response.subjects[1].courses[0].year_summary.terms[0].parts[0].activity_types[0].activities[2].score)