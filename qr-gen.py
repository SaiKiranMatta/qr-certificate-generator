import qrcode
import os
import pandas as pd
from PIL import Image
import json


def generate_qr_code(data, qr_filename):
    qr = qrcode.QRCode(
        version=8,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=1,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_filename)

def overlay_qr_code(certificate_filename, qr_filename, output_filename):
    certificate = Image.open(certificate_filename)
    qr_code = Image.open(qr_filename)

    # Resize the QR code to fit on the certificate
    qr_code = qr_code.resize((230, 230))

    # Calculate the position to center the QR code on the certificate
    position = (1425, 978)

    # Create an alpha channel for the QR code
    alpha = qr_code.convert("RGBA").split()[3]

    # Create a transparent overlay
    overlay = Image.new("RGBA", certificate.size, (0, 0, 0, 0))

    # Paste the QR code onto the overlay using alpha_composite
    overlay.paste(qr_code, position, alpha)

    # Composite the overlay onto the certificate
    result = Image.alpha_composite(certificate.convert("RGBA"), overlay)

    # Save the final image with the QR code overlay
    result.save(output_filename)

if __name__ == "__main__":
    base_url = "https://saikiranmatta.github.io/verify24/?odyssey="

    # Directory containing the certificate templates (1.png, 2.png, 3.png, etc.)
    template_directory = "template"

    # Output directory for the generated certificates
    output_directory = "output"

    # Excel file with columns 'Name' and 'Department'
    excel_file = "data.xlsx"

    # Read data from Excel sheet into a DataFrame
    df = pd.read_excel(excel_file)

    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # List to store JSON data for all certificates
    all_certificates_data = []

    # Iterate over rows in the DataFrame
    for index, row in df.iterrows():
        # Extract data from the row
        name = row['Name']
        department = row['Department']

        # Generate QR code data and filename
        file_number = index + 1  # Assuming the index starts from 0
        code = name.lower().replace(" ", "").replace(".", "") +"O"+str(file_number).zfill(4)
        qr_data = base_url + code
        qr_filename = "qr_code_.png"

        # Generate QR code
        generate_qr_code(qr_data, qr_filename)

        # Overlay QR code on the certificate
        certificate_filename = os.path.join(template_directory, f"{file_number}.png")
        output_filename = os.path.join(output_directory, f"{name}.png")
        overlay_qr_code(certificate_filename, qr_filename, output_filename)

        # Create JSON data for the current certificate
        certificate_data = {
            "code": code, 
            "name": name,
            "dept": department,
        }

        # Append the data to the list
        all_certificates_data.append(certificate_data)

        # Print information
        print(f"Certificate with QR code for {name} saved as {output_filename}")

    # Save all certificates data to a single JSON file
    all_certificates_json_filename = os.path.join("data.json")
    with open(all_certificates_json_filename, 'w') as json_file:
        json.dump(all_certificates_data, json_file, indent=2)

    print(f"All certificates data saved to {all_certificates_json_filename}")
