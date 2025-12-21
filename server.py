from wsgiref.simple_server import make_server
import mysql.connector
import json

# MYSQL CONFIG
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "pagweb"
}


def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


# JSON RESPONSE
def json_response(start_response, status, data):
    start_response(status, [
        ("Content-Type", "application/json"),
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Headers", "Content-Type"),
        ("Access-Control-Allow-Methods", "POST, OPTIONS")
    ])
    return [json.dumps(data).encode("utf-8")]


# WSGI APP
def application(environ, start_response):
    method = environ["REQUEST_METHOD"]
    path = environ["PATH_INFO"]

    # CORS
    if method == "OPTIONS":
        start_response("200 OK", [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Headers", "Content-Type"),
            ("Access-Control-Allow-Methods", "POST, OPTIONS")
        ])
        return [b""]

    # REGISTRO
    if path == "/register" and method == "POST":
        try:
            length = int(environ.get("CONTENT_LENGTH", 0))
            data = json.loads(environ["wsgi.input"].read(length))

            nombre = data["nombre"]
            email = data["email"]
            password = data["password"]

            conn = get_connection()
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO usuarios (nombre, email, contraseña) VALUES (%s, %s, %s)",
                (nombre, email, password)
            )
            conn.commit()

            cursor.close()
            conn.close()

            return json_response(start_response, "201 Created", {
                "message": "Usuario registrado"
            })

        except mysql.connector.errors.IntegrityError:
            return json_response(start_response, "400 Bad Request", {
                "error": "El usuario ya existe"
            })

    # LOGIN 
    if path == "/login" and method == "POST":
        length = int(environ.get("CONTENT_LENGTH", 0))
        data = json.loads(environ["wsgi.input"].read(length))

        nombre = data["nombre"]
        password = data["password"]

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM usuarios WHERE nombre=%s AND contraseña=%s",
            (nombre, password)
        )
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return json_response(start_response, "200 OK", {
                "message": "Login correcto",
                "user": {
                    "id": user["id"],
                    "nombre": user["nombre"],
                    "email": user["email"],
                    "contraseña": user["contraseña"]  # visible
                }
            })

        return json_response(start_response, "401 Unauthorized", {
            "error": "Usuario o contraseña incorrectos"
        })

    return json_response(start_response, "404 Not Found", {
        "error": "Ruta no encontrada"
    })


# SERVER
if __name__ == "__main__":
    print("Servidor WSGI en http://localhost:8000")
    make_server("", 8000, application).serve_forever()