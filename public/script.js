// Declarar las variables en un ámbito global
let t1 = 0, t2 = 0, t3 = 0;
let notasIdukay = [];

async function fetchNotasIdukay(username, password) {
    try {
        const response = await fetch('/scrape-idukay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            notasIdukay = data.notas;
            populateFields(notasIdukay);
        } else {
            console.error('Error fetching notas:', data.error);
        }
    } catch (error) {
        console.error('Error fetching notas:', error);
    }
}

function populateFields(notas) {
    for (let i = 0; i < 15; i++) {
        if (notas[i]) {
            document.getElementById(`trim${i + 1}`).value = notas[i].grade;
        }
    }
}

function addInput(trimester) {
    const div = document.createElement('div');
    div.className = 'input-group';
    div.innerHTML = `
        <input type="number" placeholder="Nota" class="note">
        <input type="number" placeholder="Porcentaje" class="percentage">
    `;
    document.getElementById(`inputs${trimester}`).appendChild(div);
}

function calculateTrimesters() {
    t1 = calculateTrimester(1);
    t2 = calculateTrimester(2);
    t3 = calculateTrimester(3);

    document.getElementById('trim1').value = t1.toFixed(2);
    document.getElementById('trim2').value = t2.toFixed(2);
    document.getElementById('trim3').value = t3.toFixed(2);
    document.getElementById('trim4').value = t4.toFixed(2);
    document.getElementById('trim5').value = t5.toFixed(2);
    document.getElementById('trim6').value = t6.toFixed(2);
    document.getElementById('trim7').value = t7.toFixed(2);
    document.getElementById('trim8').value = t8.toFixed(2);
    document.getElementById('trim9').value = t9.toFixed(2);
    document.getElementById('trim10').value = t10.toFixed(2);
    document.getElementById('trim11').value = t11.toFixed(2);
    document.getElementById('trim12').value = t12.toFixed(2);
    document.getElementById('trim13').value = t12.toFixed(2);
    document.getElementById('trim14').value = t12.toFixed(2);
    document.getElementById('trim15').value = t12.toFixed(2);
}

function calculateTrimester(trimester) {
    const notes = document.querySelectorAll(`#trimester${trimester} .note`);
    const percentages = document.querySelectorAll(`#trimester${trimester} .percentage`);
    let total = 0;

    for (let i = 0; i < notes.length; i++) {
        const note = parseFloat(notes[i].value) || 0;
        const percentage = parseFloat(percentages[i].value) || 0;
        total += note * (percentage / 100);
    }

    document.getElementById(`result${trimester}`).innerText = 'Resultado: ' + total.toFixed(2);
    return total;
}

function exCalc() {
    const trim1 = parseFloat(document.getElementById('trim1').value) || 0;
    const trim2 = parseFloat(document.getElementById('trim2').value) || 0;
    const trim3 = parseFloat(document.getElementById('trim3').value) || 0;
    const ef = parseFloat(document.getElementById('ef').value) || 0;

    const average = (trim1 + trim2 + trim3) / 3;
    const result = (21 - average - ef) / 0.1;

    // Muestra el resultado en el elemento con id="output"
    document.getElementById('output').innerText = 'Resultado: ' + result.toFixed(2);

    // Llama a la función para evaluar el resultado
    evaluateResult(result);
}

function evaluateResult(result) {
    let message = '';
    if (result > 10) {
        message = 'Ni queriendo pasas, tendrías que sacar: ' + result.toFixed(2);
    } else if (result < 0) {
        message = 'Sacando 0 pasas, chillout';
    } else {
        message = 'Resultado dentro del rango esperado.';
    }

    // Muestra el mensaje en el elemento con id="message"
    document.getElementById('message').innerText = message;
}
