from flask import Flask, request, jsonify

app = Flask(__name__)

# Datos de ejemplo (reemplazar con tu lógica de base de datos)
items = [
    {"id": 1, "name": "Item 1", "description": "Descripción del item 1"},
    {"id": 2, "name": "Item 2", "description": "Descripción del item 2"}
]
next_id = 3

@app.route('/items', methods=['GET'])
def get_items():
    """
    Obtiene todos los items.
    """
    return jsonify(items)

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """
    Obtiene un item específico por ID.
    """
    item = next((item for item in items if item["id"] == item_id), None)
    if item:
        return jsonify(item)
    else:
        return jsonify({"message": "Item no encontrado"}), 404

@app.route('/items', methods=['POST'])
def create_item():
    """
    Crea un nuevo item.
    """
    global next_id
    data = request.get_json()
    if not data or 'name' not in data or 'description' not in data:
        return jsonify({"message": "Datos inválidos"}), 400

    new_item = {
        "id": next_id,
        "name": data['name'],
        "description": data['description']
    }
    items.append(new_item)
    next_id += 1
    return jsonify(new_item), 201

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    """
    Actualiza un item existente por ID.
    """
    data = request.get_json()
    if not data or 'name' not in data or 'description' not in data:
        return jsonify({"message": "Datos inválidos"}), 400

    item = next((item for item in items if item["id"] == item_id), None)
    if not item:
        return jsonify({"message": "Item no encontrado"}), 404

    item['name'] = data['name']
    item['description'] = data['description']
    return jsonify(item)

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """
    Elimina un item por ID.
    """
    global items
    items = [item for item in items if item["id"] != item_id]
    return jsonify({"message": "Item eliminado"})

if __name__ == '__main__':
    app.run(debug=True)