
from datetime import datetime
from io import BytesIO
import requests
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from app.models.room import Room

class PDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_styles()

    def _setup_styles(self):
        """Initialize custom styles for the PDF"""
        self.title_style = ParagraphStyle(
            name='TitleStyle', 
            parent=self.styles['Heading1'],
            fontSize=28,
            spaceAfter=12,
            spaceBefore=20,
        )
        
        self.description_style = ParagraphStyle(
            name='DescriptionStyle', 
            parent=self.styles['Normal'],
            fontSize=14,
            leading=18,
            spaceBefore=0,
            spaceAfter=20
        )
        
        self.heading_style = ParagraphStyle(
            name='HeadingStyle', 
            parent=self.styles['Heading2'],
            fontSize=18,
            spaceBefore=20,
            spaceAfter=12
        )
        
        self.facility_style = ParagraphStyle(
            name='FacilityStyle', 
            parent=self.styles['Normal'],
            fontSize=12,
            leading=16,
            leftIndent=10
        )
        
        self.footer_style = ParagraphStyle(
            name='FooterStyle', 
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.gray
        )

    def _create_header(self):
        """Create the PDF header with logo"""
        header_data = [[
            Paragraph(
                '''
                <para align="center" spaceBefore="0">
                <font size="14" color="white">
                <b>THE<br/>HUGO</b>
                <br/><font size="8">GARY LANE</font>
                </font>
                </para>
                ''', 
                self.styles["Normal"]
            )
        ]]
        
        header_table = Table(header_data, colWidths=[500], rowHeights=50)
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.gray),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        return header_table

    def _create_facilities_table(self, facilities):
        """Create a two-column table for facilities"""
        facilities_data = []
        row = []
        
        # Default facilities if none provided
        default_facilities = [
            "Nespresso System", "E-Concierge", "All-night checkin",
            "Luxury Amenities", "Temple Spa toiletries", "Towels and linen"
        ]
        
        # Use provided facilities or defaults if empty
        all_facilities = facilities if facilities else default_facilities
        
        for i, facility in enumerate(all_facilities):
            bullet_item = Paragraph(f"• {facility}", self.facility_style)
            row.append(bullet_item)
            
            if len(row) == 2 or i == len(all_facilities) - 1:
                if len(row) == 1:
                    row.append(Paragraph("", self.facility_style))
                facilities_data.append(row)
                row = []
        
        if facilities_data:
            table = Table(facilities_data, colWidths=[250, 250])
            table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ]))
            return table
        return None

    def generate_room_pdf(self, room: Room) -> bytes:
        """Generate a PDF for a room"""
        buffer = BytesIO()
        
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=30,
            rightMargin=30,
            topMargin=30,
            bottomMargin=30
        )
        
        elements = []
        
        # Add export header
        elements.append(Paragraph(
            '<para align="right" spaceBefore="0"><font size="12" color="#A0A0A0">PDF Export</font></para>',
            self.styles["Normal"]
        ))
        
        # Add hotel header
        elements.append(self._create_header())
        elements.append(Spacer(1, 30))
        
        # Room details
        elements.append(Paragraph(room.name, self.title_style))
        elements.append(Paragraph(room.description, self.description_style))
        
        # Room image
        if room.image:
            try:
                # Handle base64 encoded images
                if room.image.startswith('data:image'):
                    import base64
                    # Extract the base64 encoded data
                    encoded_data = room.image.split(',')[1]
                    img_data = base64.b64decode(encoded_data)
                    img = Image(BytesIO(img_data), width=500, height=300)
                    img.hAlign = 'CENTER'
                    elements.append(img)
                else:
                    # Handle URL images
                    response = requests.get(room.image)
                    if response.status_code == 200:
                        img = Image(BytesIO(response.content), width=500, height=300)
                        img.hAlign = 'CENTER'
                        elements.append(img)
            except Exception as e:
                print(f"Failed to add image to PDF: {e}")
        
        elements.append(Spacer(1, 20))
        
        # Facilities section
        if hasattr(room, 'facilityList') and room.facilityList:
            elements.append(Paragraph("Facilities", self.heading_style))
            facilities_table = self._create_facilities_table(room.facilityList)
            if facilities_table:
                elements.append(facilities_table)
        
        elements.append(Spacer(1, 40))
        
        # Footer
        footer_data = [[
            Paragraph(f"© The Hugo {datetime.now().year}", self.footer_style),
            Paragraph(f"{datetime.now().strftime('%d/%m/%y')}", self.footer_style),
        ]]
        
        footer_table = Table(footer_data, colWidths=[250, 250])
        footer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(footer_table)
        
        # Build PDF
        doc.build(elements)
        
        pdf_value = buffer.getvalue()
        buffer.close()
        
        return pdf_value
