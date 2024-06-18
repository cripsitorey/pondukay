const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeIdukay(username, password) {
    const browser = await puppeteer.launch({ headless: false }); // Cambiar a 'true' para modo headless
    const page = await browser.newPage();

    try {
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
        await page.waitForSelector(`[src="'scripts/student_reports/views/activity_type_info_modal.html'"]`); // Esperar a que aparezca un selector en la página de notas

        // Extraer el contenido de la página de notas
        const content = await page.content();

        // Guardar el contenido en un archivo
        fs.writeFileSync('grades.html', content);

        console.log('Página de notas guardada como grades.html');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

// Reemplaza 'tu_usuario' y 'tu_contraseña' con las credenciales reales
scrapeIdukay('emiliocuenca@saintdominicschool.edu.ec', '20070612');
