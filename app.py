from flask import Flask, send_from_directory, jsonify
import os

app = Flask(
    __name__,
    static_folder="client/dist",  # Serve static files from React build
    static_url_path=""  # Serve at root
)

# ✅ Health check route
@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

# ✅ Backend API test route
@app.route("/api/test")
def api_test():
    return jsonify({"message": "Flask backend working!"})

# ✅ Serve React build files + SPA fallback
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    build_dir = app.static_folder
    file_path = os.path.join(build_dir, path)

    # Debugging print
    print("Requested path:", path)

    if path != "" and os.path.exists(file_path):
        return send_from_directory(build_dir, path)

    return send_from_directory(build_dir, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
