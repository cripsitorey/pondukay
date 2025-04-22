import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

def get_nails(num_nails, center, radius):
    """
    Calcula las posiciones de los clavos (nails) distribuidos uniformemente en un círculo.
    """
    nails = []
    for i in range(num_nails):
        angle = 2 * np.pi * i / num_nails
        x = int(center[0] + radius * np.cos(angle))
        y = int(center[1] + radius * np.sin(angle))
        nails.append((x, y))
    return nails

def get_line(x0, y0, x1, y1):
    """
    Implementa el algoritmo de Bresenham para obtener los puntos de una línea entre dos coordenadas.
    """
    points = []
    dx = abs(x1 - x0)
    dy = abs(y1 - y0)
    sx = 1 if x0 < x1 else -1
    sy = 1 if y0 < y1 else -1
    err = dx - dy
    x, y = x0, y0

    while True:
        points.append((x, y))
        if x == x1 and y == y1:
            break
        e2 = 2 * err
        if e2 > -dy:
            err -= dy
            x += sx
        if e2 < dx:
            err += dx
            y += sy
    return points

def generate_string_art(image_path, num_lines=1000, num_nails=200, subtraction=30):
    """
    Genera el patrón de hilorama a partir de la imagen especificada.
    
    Parámetros:
    - image_path: ruta a la imagen de entrada.
    - num_lines: cantidad de líneas (hilos) a dibujar.
    - num_nails: cantidad de clavos distribuidos en el contorno.
    - subtraction: cantidad que se resta a la intensidad de la imagen en los píxeles recorridos por cada línea.
    """
    # Cargar y preprocesar la imagen
    img = Image.open(image_path).convert("L")  # escala de grises
    size = (500, 500)
    img = img.resize(size)
    img_arr = np.array(img, dtype=np.float32)
    # Invertir la imagen: las zonas oscuras serán de alto valor
    img_arr = 255 - img_arr

    # Crear una imagen (canvas) en blanco para dibujar el patrón de hilos
    canvas_arr = np.full(size, 255, dtype=np.float32)

    # Calcular la posición de los clavos sobre un círculo
    center = (size[0] // 2, size[1] // 2)
    radius = size[0] // 2 - 10  # margen
    nails = get_nails(num_nails, center, radius)

    current_nail = 0
    lines = []

    for i in range(num_lines):
        best_score = -np.inf
        best_nail = None
        best_line_points = None

        # Evaluar todos los posibles clavos destino
        for candidate in range(num_nails):
            if candidate == current_nail:
                continue
            x0, y0 = nails[current_nail]
            x1, y1 = nails[candidate]
            line_points = get_line(x0, y0, x1, y1)

            # Sumar la intensidad de los píxeles a lo largo de la línea
            score = sum(img_arr[y, x] for x, y in line_points if 0 <= x < size[0] and 0 <= y < size[1])
            
            if score > best_score:
                best_score = score
                best_nail = candidate
                best_line_points = line_points

        if best_nail is None:
            break

        # Guardar la línea elegida (índices de los clavos)
        lines.append((current_nail, best_nail))
        
        # Actualizar la imagen: simula la colocación del hilo "reduciendo" la intensidad en los píxeles recorridos
        for x, y in best_line_points:
            if 0 <= x < size[0] and 0 <= y < size[1]:
                img_arr[y, x] = max(0, img_arr[y, x] - subtraction)
                canvas_arr[y, x] = 0  # marcar en el canvas el hilo

        current_nail = best_nail

    # Visualizar el resultado: imagen residual y el patrón de hilos
    fig, ax = plt.subplots(1, 2, figsize=(12, 6))
    ax[0].imshow(255 - img_arr, cmap='gray')
    ax[0].set_title("Imagen Residual")
    ax[0].axis('off')
    ax[1].imshow(canvas_arr, cmap='gray')
    ax[1].set_title("Patrón de Hilorama")
    ax[1].axis('off')
    plt.show()

    return nails, lines

if __name__ == "__main__":
    # Reemplaza "input.jpg" por la ruta a tu imagen
    image_path = "input.jpg"  
    nails, lines = generate_string_art(image_path, num_lines=1000, num_nails=200, subtraction=40)
