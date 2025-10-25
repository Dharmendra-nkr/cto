from flask import Flask, send_from_directory, jsonify
import os

# Path to the React production build
CLIENT_BUILD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "client", "dist")

app = Flask(
    __name__,
    static_folder=os.path.join(CLIENT_BUILD_DIR),
    static_url_path="/"
)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


# Serve React App
@app.route("/")
@app.route('/<path:path>')
def serve_react(path: str = "index.html"):
    target = path if path else "index.html"
    full_path = os.path.join(CLIENT_BUILD_DIR, target)

    if os.path.isfile(full_path):
        return send_from_directory(CLIENT_BUILD_DIR, target)

    # For any unmatched route, return index.html so the React router can handle it
    return send_from_directory(CLIENT_BUILD_DIR, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
