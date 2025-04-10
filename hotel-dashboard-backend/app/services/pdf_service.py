from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO

def generate_room_pdf(room_data: dict) -> BytesIO:
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Add room details to PDF
    p.drawString(100, 750, f"Room: {room_data['name']}")
    p.drawString(100, 730, f"Description: {room_data['description']}")
    p.drawString(100, 710, f"Facilities: {room_data['facilities']}")
    
    if room_data.get('facility_list'):
        y = 690
        p.drawString(100, y, "Facility List:")
        for facility in room_data['facility_list']:
            y -= 20
            p.drawString(120, y, f"- {facility}")
    
    p.save()
    buffer.seek(0)
    return buffer
