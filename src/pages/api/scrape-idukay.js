import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
///opt/render/.cache/puppeteer/chrome/linux-131.0.6778.69/chrome-linux64/chrome
const url = 'https://idukay.net/api/students?__sort={"relational_data.name.order":"asc"}&populate={"user":"photo name surname second_name second_surname"}&select=user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      let notas = [];  // Variable para almacenar la respuesta
      let lujus = "";  // Variable para almacenar la respuesta
      let authToken = null;
      let studentID = null;
      let schooolID = null;
      let lectiveID = null;
      let profileID = null;
      const targetEndpoint = 'https://idukay.net/api/login'; // Endpoint donde se obtiene el token
      
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless'],
        headless: true,
        timeout: 90000,  // Aumenta el tiempo de espera
      });
      
      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      );
      // Intercepta las respuestas para capturar el token
      page.on('response', async (response) => {
        try {
          // console.log('Interceptando respuesta de URL:', response.url());
          
          // Verifica si la URL contiene alguna parte relevante del endpoint
          if (response.url().includes(targetEndpoint)) {
            console.log('Posible respuesta relevante encontrada.');
            
            // Intenta obtener el cuerpo de la respuesta
            const responseBody = await response.text(); // Cambiar a text para inspeccionar todo
            console.log('Cuerpo de la respuesta:', responseBody);
            
            // Intenta parsear como JSON si es posible
            try {
              const jsonResponse = JSON.parse(responseBody);
              if (jsonResponse.response.token) {
                authToken = jsonResponse.response.token;
                studentID = jsonResponse.response.user.preferences.selected_student._id;
                schooolID = jsonResponse.response.user.school;
                lectiveID = jsonResponse.response.user.preferences.working_year._id;
                profileID = jsonResponse.response.user.preferences.working_profile._id;
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

      // await page.goto('https://idukay.net/#/my_reportcard')
      // Espera a que se capture el token
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
        console.log(headers);
        const response = await fetch(url, { method: "GET", headers });
        lujus = await response.json(); // Almacena la respuesta en la variable
        console.log("Datos almacenados:", lujus);
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
        
            console.log(headerse);
            const urll = `https://idukay.net/api/student_year_summary?include_averages=true&student=${studentID}`;
            console.log(urll);
        
            const response = await fetch(urll, {
              method: "GET",
              headers: headerse, // Cambié "headerse" al nombre correcto: "headers"
            });
        
            const resulto = await response.json(); // Almacena la respuesta en la variable
            notas.push({ student: element.user.name + " " + element.user.surname, resulto });
            console.log("Datos almacenados:", notas);
        
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
        console.log(headers);
        const urll = `https://idukay.net/api/my_year_summary?include_averages=true`;
        const response = await fetch(urll, { method: "GET", headers });
        notas = await response.json(); // Almacena la respuesta en la variable
        console.log("Datos almacenados:", notas);
      }
      
      // console.log(notas.response.subjects[1].courses[0].year_summary.terms[0].parts[0].activity_types[0].activities[2].score)
      res.status(200).json({ success: true, notas });
      console.log(notas.response);
      
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