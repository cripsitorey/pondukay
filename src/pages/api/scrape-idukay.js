import puppeteer from 'puppeteer';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      page.goto('https://idukay.net/');
      await page.waitForSelector('input[type="password"]');
      await page.type('input[type="text"]', username);
      await page.type('input[type="password"]', password);
      await Promise.all([
        page.waitForSelector('div[class="navbar-header pull-left hidden-xs"]'),
        await page.click('button[type="submit"]'),
      ]);

      await page.goto('https://idukay.net/#/my_reportcard');
      await page.waitForSelector(`[src="'scripts/student_reports/views/activity_type_info_modal.html'"]`);
      await page.waitForSelector(`li[class="clickable-li"]`);
      await page.click(`li[class="clickable-li"]`);

      try {
        await page.waitForSelector('div[class="alert alert-info text-center no-margin"]');
        const elemento = await page.$('div[class="alert alert-info text-center no-margin"]');
        if (!elemento) throw new Error('Elemento no encontrado');
        const texto = await elemento.evaluate(el => el.innerText);
        console.log(await (await page.$('div[class="alert alert-info text-center no-margin"]')).evaluate(lol => lol.innerText)+"JIJIJIJA")
        console.log('Texto del elemento:', texto);
      } catch (error) {
        console.error('Error:', error.message);
      }


      const notas = await page.evaluate(() => {
        const subjects = document.querySelectorAll(`[authorize-country="['PE']"]`);
        const genera = document.querySelectorAll('[data-tooltip="course.qualitative"]');
        const insumo = document.querySelectorAll('[data-target="#student_activities_by_activity_type_modal"]')

        const result = [];
        for (let i = 0; i < subjects.length; i++) {
          result.push({
            subject: subjects[i].innerText.trim(),
            grade: genera[i+subjects.length*0].innerText.trim(),
            trime: genera[i+subjects.length*1].innerText.trim(),
            parci: genera[i+subjects.length*2].innerText.trim(),
            exame: genera[i+subjects.length*3].innerText.trim(),
            pract: insumo[i+subjects.length*0].innerText.trim(),
            domin: insumo[i+subjects.length*1].innerText.trim(),
            desem: insumo[i+subjects.length*2].innerText.trim(),
            sumat: insumo[i+subjects.length*3].innerText.trim(),
            itesu: subjects.length
          });
        }
        return result;
      });


      // let flash = [];

      // for (let i = 0; i < notas[0].itesu; i++) {
      //   // Haz clic en el elemento correspondiente
      //   await page.evaluate((index) => {
      //     const elementosDom = [...document.querySelectorAll('li[data-target="#student_activities_by_activity_type_modal"]')];
      //     if (elementosDom[index]) {
      //       elementosDom[index].click(); // Ejecuta el clic en el navegador
      //     }
      //   }, i + notas[0].itesu*2);

      //   // Espera el contenido del modal o la acción
      //   flash = await page.evaluate(() => {
      //     const ponderado = document.querySelector('th[class="header-color-blue white bigger-110 ng-binding"]');
      //     const resulta = [];
      //     if (ponderado) {
      //       resulta.push({
      //         pespr: ponderado.innerText.trim(),
      //       });
      //     }
      //     return resulta;
      //   });

      //   await delay(500);
      //   await page.keyboard.press('Escape');
      // }

      // Inicializa el array flash como vacío
      let flash = [];

      // Función auxiliar para calcular el índice
      const calcularIndice = (base, multiplicador) => base + notas[0].itesu * multiplicador;

      for (let i = 0; i < notas[0].itesu; i++) {
        const objetoActual = {}; // Crear un objeto por iteración

        // Almacena el pespr
        await page.evaluate((index) => {
          const elementosDom = [...document.querySelectorAll('li[data-target="#student_activities_by_activity_type_modal"]')];
          if (elementosDom[index]) {
            elementosDom[index].click();
          }
        }, calcularIndice(i, 0));

        // Espera el contenido del modal o la acción
        // const pespr = await page.evaluate(() => {
        //   const ponderado = document.querySelector('th[class="header-color-blue white bigger-110 ng-binding"]');
        //   return ponderado ? ponderado.innerText.trim() : null;
        // });
        const pespr = await page.evaluate(() => {
          const ponderado = document.querySelector('th[class="header-color-blue white bigger-110 ng-binding"]');
          const notero = document.querySelectorAll(`td[class="vertical-align-middle text-center"]`);
          const titula = document.querySelectorAll('td[class="vertical-align-middle"]');
  
          const result = [];
          for (let i = 0; i < notero.length; i++) {
            result.push({
              pondera: ponderado,
              pintore: notero[i].innerText.trim(),
              titulas: titula[i].innerText.trim()
            });
            console.log(result);
          }
          return result;
        });
  
        console.log(pespr);

        objetoActual.pespr = {}

        if (pespr) {
          objetoActual.pespr.peso = pespr.pondera;
          objetoActual.pespr.nmtui = pespr.pintore;
          objetoActual.pespr.nmtuit = pespr.titulas;
        }

        
        // Agrega un retraso
        await delay(500);

        // Cierra el modal presionando "Escape"
        await page.keyboard.press('Escape');

        // Almacena el pesde
        await page.evaluate((index) => {
          const elementosDom = [...document.querySelectorAll('li[data-target="#student_activities_by_activity_type_modal"]')];
          if (elementosDom[index]) {
            elementosDom[index].click();
          }
        }, calcularIndice(i, 2));

        const pesde = await page.evaluate(() => {
          const ponderado = document.querySelector('th[class="header-color-blue white bigger-110 ng-binding"]');
          return ponderado ? ponderado.innerText.trim() : null;
        });

        if (pesde) {
          objetoActual.pesde = pesde;
        }

        // Agrega un retraso
        await delay(500);

        // Cierra el modal presionando "Escape"
        await page.keyboard.press('Escape');

        await page.evaluate((index) => {
          const elementosDom = [...document.querySelectorAll('li[data-target="#student_activities_by_activity_type_modal"]')];
          if (elementosDom[index]) {
            elementosDom[index].click();
          }
        }, calcularIndice(i, 1));

        const pesdo = await page.evaluate(() => {
          const ponderado = document.querySelector('th[class="header-color-blue white bigger-110 ng-binding"]');
          return ponderado ? ponderado.innerText.trim() : null;
        });

        if (pesdo) {
          objetoActual.pesdo = pesdo;
        }

        // Agrega un retraso
        await delay(500);

        // Cierra el modal presionando "Escape"
        await page.keyboard.press('Escape');

        await page.evaluate((index) => {
          const elementosDom = [...document.querySelectorAll('li[data-target="#student_activities_by_activity_type_modal"]')];
          if (elementosDom[index]) {
            elementosDom[index].click();
          }
        }, calcularIndice(i, 3));

        const pessu = await page.evaluate(() => {
          const ponderado = document.querySelector('th[class="header-color-blue white bigger-110 ng-binding"]');
          return ponderado ? ponderado.innerText.trim() : null;
        });

        if (pessu) {
          objetoActual.pessu = pessu;
        }

        // Agrega un retraso
        await delay(500);

        // Cierra el modal presionando "Escape"
        await page.keyboard.press('Escape');

        // Agrega el objeto al array flash
        flash.push(objetoActual);
      }

      // Imprime los resultados
      console.log(flash);


      for (let i = 0; i < notas.length; i++) {
        notas[i].pespr = flash[i].pespr;
        notas[i].pesdo = flash[i].pesdo;
        notas[i].pesde = flash[i].pesde;
        notas[i].pessu = flash[i].pessu;
      }
      console.log(notas);
      
      
      function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      
      await browser.close();
      res.status(200).json({ success: true, notas, flash });
    } catch (error) {
      console.error('Error scraping Idukay:', error);
      res.status(500).json({ success: false, error: 'Error scraping Idukay' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
