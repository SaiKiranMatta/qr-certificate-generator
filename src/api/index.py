from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import qrcode
import pandas as pd
from PIL import Image, ImageDraw, ImageFont
import json
from typing import Optional

app = FastAPI()

base_dir = os.path.dirname(os.path.abspath(__file__))

class CertificateData(BaseModel):
    base_url: str
    output_directory: str
    code_serial: str
    codes_start_number: int
    json_file_name: str
    json_directory: str

@app.post("/api/generate-certificates")
async def generate_certificates(
    base_url: str = Form(...),
    output_directory: str = Form(...),
    code_serial: str = Form(...),
    codes_start_number: int = Form(...),
    json_file_name: str = Form(...),
    json_directory: str = Form(...),
    template: UploadFile = File(...),
    excel: UploadFile = File(...)
):
    # Define paths
    template_path = os.path.join(base_dir, 'static', 'templates', 'template.png')
    excel_path = os.path.join(base_dir, 'static', 'data', 'data.xlsx')
    qr_path = os.path.join(base_dir, 'static', 'qr_code.png')
    output_directory_path = os.path.join(base_dir, output_directory)
    json_file_path = os.path.join(base_dir, json_directory, json_file_name)
    
    # Save uploaded files
    with open(template_path, "wb") as f:
        f.write(await template.read())
    
    with open(excel_path, "wb") as f:
        f.write(await excel.read())
    
    # Process certificates
    certificate_template = Image.open(template_path)
    df = pd.read_excel(excel_path)

    os.makedirs(output_directory_path, exist_ok=True)
    all_certificates_data = []
    
    def generate_qr_code(data, qr_filename):
        qr = qrcode.QRCode(
            version=8,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=40,
            border=0,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(qr_filename)

    def overlay_qr_code(certificate, text, qr_code, text_position, qr_position, output_filename):
        draw = ImageDraw.Draw(certificate)
        font_path = os.path.join(base_dir, 'static', 'fonts', 'baskervi.ttf')  # Path to the font
        font = ImageFont.truetype(font_path, 90)
        text_width = font.getlength(text)
        text_x = text_position[0] - text_width // 2
        text_y = text_position[1]
        draw.text((text_x, text_y), text, fill="#4c0d82", font=font)
        
        qr_code = qr_code.resize((399, 399))
        qr_alpha = qr_code.convert("RGBA").split()[3]
        qr_overlay = Image.new("RGBA", certificate.size, (0, 0, 0, 0))
        qr_overlay.paste(qr_code, qr_position, qr_alpha)
        result = Image.alpha_composite(certificate.convert("RGBA"), qr_overlay)
        result.save(output_filename)
    
    for index, row in df.iterrows():
        name = row['Name']
        fname = ' '.join(''.join((word[i].upper() if (i == 0 or (i < len(word) - 1 and word[i-1] == '.')) else char.lower()) for i, char in enumerate(word)) for word in name.split())
        code = fname.lower().replace(" ", "").replace(".", "") + code_serial + str(index + codes_start_number).zfill(4)
        qr_data = base_url + code
        qr_filename = qr_path
        generate_qr_code(qr_data, qr_filename)
        qr_code = Image.open(qr_filename)
        overlay_text = row["Holder"]
        text_position = (1750, 1169)
        qr_position = (1550, 1720)
        output_filename = os.path.join(output_directory_path, f"{fname}.png")
        overlay_qr_code(certificate_template.copy(), overlay_text, qr_code, text_position, qr_position, output_filename)
        print(f"Certificate for {name} generated")
        certificate_data = {
            "code": code,
            "holder": overlay_text,
        }
        all_certificates_data.append(certificate_data)
    
    with open(json_file_path, 'w') as json_file:
        json.dump(all_certificates_data, json_file, indent=2)
    
    return JSONResponse(content={"message": "Certificates generated successfully!"})

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}
