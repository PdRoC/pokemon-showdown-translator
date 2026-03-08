# tools/compiler.py
import csv, json, os

def csv_to_json():
    archivos = ['pokemon.csv', 'habilidades.csv', 'ataques.csv']
    master = {"ES": []} # Puedes ampliar a más idiomas

    for nombre in archivos:
        path = f'../data/{nombre}'
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for fila in reader:
                    # Guardamos pares [Inglés, Español]
                    master["ES"].append([fila['Key'], fila['ES']])

    # Ordenar por longitud de la llave inglesa (descendente)
    master["ES"].sort(key=lambda x: len(x[0]), reverse=True)

    with open('../data/diccionario.json', 'w', encoding='utf-8') as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

csv_to_json()
