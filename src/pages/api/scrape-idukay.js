import CryptoJS from "crypto-js";
import fetch from 'node-fetch';

const STUDENTS_URL = 'https://idukay.net/api/students?__sort={"relational_data.name.order":"asc"}&populate={"user":"photo name surname second_name second_surname"}&select=user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    try {
      // Encriptar la contraseña
      const encryptedPassword = CryptoJS.AES.encrypt(
        password, 
        "idukay-secret-key-password"
      ).toString();

      // Preparar el payload para la solicitud
      const payload = {
        email: username,
        password: encryptedPassword
      };

      // Realizar la solicitud al endpoint de login
      const loginResponse = await fetch('https://idukay.net/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        },
        body: JSON.stringify(payload)
      });

      const jsonResponse = await loginResponse.json();

      if (!jsonResponse.response?.token) {
        throw new Error('No se pudo obtener el token de autorización');
      }

      const {
        token: authToken,
        user: {
          preferences: {
            selected_student: { _id: studentID },
            working_year: { _id: lectiveID },
            working_profile: { _id: profileID }
          },
          school: schooolID
        }
      } = jsonResponse.response;

      // Preparar headers comunes
      const commonHeaders = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        "Authorization": authToken,
        "WorkingYear": lectiveID,
        "WorkingSchool": schooolID,
        "WorkingProfile": profileID,
        "ClientVersion": "7.0.3",
      };

      let notas = [];

      if (profileID !== studentID) {
        // Obtener lista de estudiantes
        const studentsResponse = await fetch(STUDENTS_URL, {
          method: "GET",
          headers: { ...commonHeaders, "SelectedStudent": studentID }
        });
        const studentsData = await studentsResponse.json();

        // Obtener notas para cada estudiante
        for (const student of studentsData.response) {
          try {
            const currentStudentId = student._id;
            const yearSummaryUrl = `https://idukay.net/api/student_year_summary?include_averages=true&student=${currentStudentId}`;
            
            const summaryResponse = await fetch(yearSummaryUrl, {
              method: "GET",
              headers: { ...commonHeaders, "SelectedStudent": currentStudentId }
            });

            const summaryData = await summaryResponse.json();
            notas.push({
              student: `${student.user.name} ${student.user.surname}`,
              resulto: summaryData
            });
          } catch (error) {
            console.error(`Error obteniendo notas para estudiante ${student._id}:`, error);
          }
        }
      } else {
        // Obtener notas para un solo estudiante
        const yearSummaryUrl = `https://idukay.net/api/my_year_summary?include_averages=true`;
        const summaryResponse = await fetch(yearSummaryUrl, {
          method: "GET",
          headers: { ...commonHeaders, "SelectedStudent": studentID }
        });
        notas = await summaryResponse.json();
      }

      return res.status(200).json({ 
        success: true, 
        notas,
        authToken,
        studentID,
        schooolID,
        lectiveID,
        profileID
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } else {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido.' 
    });
  }
}