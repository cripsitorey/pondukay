const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/scrape-idukay', async (req, res) => {
    const { username, password } = req.body;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto('https://idukay.net/');

        // Completar el formulario de inicio de sesión
        await page.type('input[type="text"]', username);
        await page.type('input[type="password"]', password);   
        await Promise.all([
            page.waitForNavigation(), // Esperar a la navegación después del clic
            page.click('button[type="submit"]')
        ]);

        // Navegar a la página de notas
        await page.goto('https://idukay.net/#/my_reportcard');
        await page.waitForSelector(`[src="'scripts/student_reports/views/activity_type_info_modal.html'"]`);


        const notas = await page.evaluate(() => {
            // En este contexto, asumimos que las notas están estructuradas en pares de divs, uno para materia y otro para nota.
        
            // Seleccionar todos los elementos con la clase CSS '.subject' que representan las materias
            const subjects = document.querySelectorAll(`[authorize-country="['PE']"]`);
        
            // Seleccionar todos los elementos con la clase CSS '.grade' que representan las notas
            const grades = document.querySelectorAll('[data-tooltip="course.qualitative"]');
        
            // Verificar que la cantidad de materias y notas sean iguales
            // subjects.length !== grades.length
            if (1==0) {
                throw new Error('La cantidad de materias y notas no coincide.');
            }
        
            // Mapear los pares de materias y notas en un arreglo de objetos
            const result = [];
            for (let i = 0; i < subjects.length; i++) {
                result.push({
                    subject: subjects[i].innerText.trim(),
                    grade: parseFloat(grades[i].innerText.trim())
                });
            }
        
            return result;
        });
        
        // const notas = await page.evaluate(() => {
        //     const rows = document.querySelectorAll('[data-tooltip="course.qualitative"]');
        //     return Array.from(rows).map(row => ({
        //         subject: row.querySelector('[class="courses-table"]').innerText,
        //         grade: parseFloat(row.querySelector('[value="7.64"]').innerText)
        //     }));
        // });

        await browser.close();
        res.json({ success: true, notas });
    } catch (error) {
        console.error('Error scraping Idukay:', error);
        res.status(500).json({ success: false, error: 'Error scraping Idukay' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
