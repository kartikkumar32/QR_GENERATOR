from flask import Flask, render_template, request, send_file
import qrcode
from PIL import Image
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate_qr():
    data = request.form["data"]
    fill_color = request.form["fill_color"]
    back_color = request.form["back_color"]
    size = int(request.form["size"])

    logo = request.files.get("logo")

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=size,
        border=4,
    )

    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color=fill_color, back_color=back_color).convert('RGB')

    if logo and logo.filename != "":
        logo_path = os.path.join(UPLOAD_FOLDER, logo.filename)
        logo.save(logo_path)

        logo_img = Image.open(logo_path)
        logo_size = img.size[0] // 4
        logo_img = logo_img.resize((logo_size, logo_size))

        pos = (
            (img.size[0] - logo_size) // 2,
            (img.size[1] - logo_size) // 2
        )

        img.paste(logo_img, pos)

    qr_path = os.path.join(UPLOAD_FOLDER, "qr.png")
    img.save(qr_path)

    return send_file(qr_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)