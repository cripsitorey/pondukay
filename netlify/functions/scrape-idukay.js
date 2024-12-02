import puppeteer from 'puppeteer-core';
import fetch from 'node-fetch';
import chrome from 'chrome-aws-lambda';

const url = 'https://idukay.net/api/students?__sort={"relational_data.name.order":"asc"}&populate={"user":"photo name surname second_name second_surname"}&select=user';

export async function handler(event, context) {
  if (event.httpMethod === 'POST') {
    const { username, password } = JSON.parse(event.body); // Obtener los datos desde el cuerpo de la solicitud
    
    try {
      let notas = [];  // Variable para almacenar la respuesta
      let lujus = "";  // Variable para almacenar la respuesta
      let authToken = null;
      let studentID = null;
      let schooolID = null;
      let lectiveID = null;
      let profileID = null;
      const targetEndpoint = 'https://idukay.net/api/login'; // Endpoint donde se obtiene el token
      
      // Usar chrome-aws-lambda para obtener el ejecutable de Chrome adecuado
      const browser = await puppeteer.launch({
        args: [...chrome.args, '--disable-dev-shm-usage', '--no-sandbox'], // Agregar argumentos de chromium para Lambda
        executablePath: await chrome.executablePath(), // Obtener el ejecutable adecuado
        headless: chrome.headless, // Ejecutar en modo headless
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      );
      
      page.on('response', async (response) => {
        try {
          if (response.url().includes(targetEndpoint)) {
            const responseBody = await response.text();
            const jsonResponse = JSON.parse(responseBody);
            if (jsonResponse.response.token) {
              authToken = jsonResponse.response.token;
              studentID = jsonResponse.response.user.preferences.selected_student._id;
              schooolID = jsonResponse.response.user.school;
              lectiveID = jsonResponse.response.user.preferences.working_year._id;
              profileID = jsonResponse.response.user.preferences.working_profile._id;
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
      await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('button[type="submit"]')]);

      await delay(500);

      if (profileID != studentID) {
        const headers = {
          "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          "Authorization": authToken,
          "WorkingYear": lectiveID,
          "WorkingSchool": schooolID,
          "WorkingProfile": profileID,
          "SelectedStudent": studentID,
          "ClientVersion": "7.0.0",
        };

        const response = await fetch(url, { method: "GET", headers });
        lujus = await response.json(); 
        for (const element of lujus.response) {
          try {
            studentID = element._id;
            const headerse = {
              "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
              "Authorization": authToken,
              "WorkingYear": lectiveID,
              "WorkingSchool": schooolID,
              "WorkingProfile": profileID,
              "SelectedStudent": studentID,
              "ClientVersion": "7.0.0",
            };

            const urll = `https://idukay.net/api/student_year_summary?include_averages=true&student=${studentID}`;
            const response = await fetch(urll, { method: "GET", headers: headerse });
            const resulto = await response.json();
            notas.push({ student: element.user.name + " " + element.user.surname, resulto });
          } catch (error) {
            console.error("Error en la solicitud:", error);
          }
        }
      } else {
        const headers = {
          "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          "Authorization": authToken,
          "WorkingYear": lectiveID,
          "WorkingSchool": schooolID,
          "WorkingProfile": profileID,
          "SelectedStudent": studentID,
          "ClientVersion": "7.0.0",
        };

        const urll = `https://idukay.net/api/my_year_summary?include_averages=true`;
        const response = await fetch(urll, { method: "GET", headers });
        notas = await response.json();
      }

      await browser.close();

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, notas }),
      };
      
    } catch (err) {
      console.error('Error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: err.message }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Método no permitido.' }),
    };
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
