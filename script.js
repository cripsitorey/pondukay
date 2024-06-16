// Declarar las variables en un ámbito global
let t1 = 0, t2 = 0, p1 = 0;

function saveData() {
    // Obtiene los valores de los campos de texto
    t1 = parseFloat(document.getElementById('t1').value);
    t2 = parseFloat(document.getElementById('t2').value);
    p1 = parseFloat(document.getElementById('p1').value);

    // Muestra los valores en la consola
    console.log('t1:', t1, 't2:', t2, 'p1:', p1);

    // Realiza la operación matemática
    const result = (21 - t1 - t2 - (p1 * 0.9)) / 0.1;

    // Muestra el resultado en el elemento con id="output"
    document.getElementById('output').innerText = 'Necesitas: ' + result.toFixed(2);

    // Llama a la función para evaluar el resultado
    evaluateResult(result);
}

function evaluateResult(result) {
    let message = '';
    if (result > 10) {
        message = 'Mejor estudia para el supletorio';
    } else if (result < 0) {
        message = 'Sacando 0 pasas, chillout';
    } else {
        message = 'Gracias por usar Pondukay';
    }

    // Muestra el mensaje en el elemento con id="message"
    document.getElementById('message').innerText = message;
}

