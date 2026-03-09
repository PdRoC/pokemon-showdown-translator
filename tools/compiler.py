# tools/compiler.py
import csv
import json
import os

def csv_to_json():
    # Definimos la ruta de la carpeta data relativa a este script
    # Esto permite que el script funcione incluso si lo lanzas desde fuera de /tools
    base_dir = os.path.dirname(__file__)
    data_folder = os.path.join(base_dir, '..', 'data')
    
    # Lista de archivos que quieres procesar
    archivos = ['pokemon.csv', 'habilidades.csv', 'ataques.csv']
    master = {"ES": []}

    print("Iniciando compilación...")

    for nombre in archivos:
        path = os.path.join(data_folder, nombre)
        
        # Verificamos si el archivo existe antes de intentar abrirlo
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    count = 0
                    for fila in reader:
                        # Validamos que la fila tenga las columnas necesarias
                        if 'Key' in fila and 'ES' in fila:
                            master["ES"].append([fila['Key'], fila['ES']])
                            count += 1
                print(f" Procesado: {nombre} ({count} entradas)")
            except Exception as e:
                print(f" Error al leer {nombre}: {e}")
        else:
            print(f" Omitido: {nombre} (No se encuentra en {data_folder})")

    # Si no se encontró ningún dato, avisamos
    if not master["ES"]:
        print(" Error: No se ha podido cargar ninguna traducción. Revisa tus archivos .csv")
        return

    # Ordenar por longitud de la llave inglesa (descendente)
    # Esto evita que "Close Combat" se traduzca mal si existe "Combat"
    master["ES"].sort(key=lambda x: len(x[0]), reverse=True)

    # Guardar el resultado
    output_path = os.path.join(data_folder, 'diccionario.json')
    try:
        # Aseguramos que la carpeta data existe
        if not os.path.exists(data_folder):
            os.makedirs(data_folder)
            
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(master, f, ensure_ascii=False, indent=2)
        print(f"\n Éxito: 'diccionario.json' generado en {output_path}")
    except Exception as e:
        print(f" Error al escribir el archivo JSON: {e}")

if __name__ == "__main__":
    csv_to_json()