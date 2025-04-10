from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import Color, black, white
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.lib.fonts import addMapping
from io import BytesIO
import datetime
import requests
import os
import base64
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the absolute path to the static directory
current_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.dirname(os.path.dirname(current_dir))
static_dir = os.path.join(app_dir, 'static')
logo_path = os.path.join(static_dir, 'logo.png')
fonts_dir = os.path.join(static_dir, 'fonts')

logger.info(f"Logo path: {logo_path}")
logger.info(f"Fonts directory: {fonts_dir}")

# Register fonts
try:
    karla_regular = os.path.join(fonts_dir, 'Karla-Regular.ttf')
    karla_bold = os.path.join(fonts_dir, 'Karla-Bold.ttf')
    merriweather_regular = os.path.join(fonts_dir, 'Merriweather-Regular.ttf')
    merriweather_bold = os.path.join(fonts_dir, 'Merriweather-Bold.ttf')
    
    pdfmetrics.registerFont(TTFont('Karla', karla_regular))
    pdfmetrics.registerFont(TTFont('Karla-Bold', karla_bold))
    pdfmetrics.registerFont(TTFont('Merriweather', merriweather_regular))
    pdfmetrics.registerFont(TTFont('Merriweather-Bold', merriweather_bold))
    
    logger.info("Custom fonts registered successfully")
except Exception as e:
    logger.error(f"Error registering fonts: {e}")

def download_image(url):
    """Download image from URL or process Base64 data URI"""
    if not url:
        return None
        
    # Handle base64 encoded images (data URIs)
    if url.startswith('data:image'):
        try:
            # Extract the base64 part
            base64_data = url.split(',')[1]
            return BytesIO(base64.b64decode(base64_data))
        except Exception as e:
            logger.error(f"Error processing base64 image: {e}")
            return None
    
    # Handle URL images
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return BytesIO(response.content)
        logger.error(f"Failed to download image: HTTP {response.status_code}")
        return None
    except Exception as e:
        logger.error(f"Error downloading image: {e}")
        return None

def generate_room_pdf(room_data: dict) -> BytesIO:
    buffer = BytesIO()
    width, height = letter  # 8.5 x 11 inches
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Color definitions
    dark_gray = Color(0.2, 0.2, 0.2)
    light_gray = Color(0.9, 0.9, 0.9)
    
    # Header - dark background
    p.setFillColor(dark_gray)
    p.rect(0, height - 1.5*inch, width, 1.5*inch, fill=1)
    
    # Add hotel logo in the header
    p.setFillColor(white)
    
    # Try to load and draw the PNG logo
    try:
        if os.path.exists(logo_path):
            # Calculate logo dimensions (about 2 inches wide)
            logo_width = 2*inch
            logo_height = 0.9*inch  # Adjust as needed based on your logo's aspect ratio
            
            # Position the logo in the header
            logo_x = 0.5*inch
            logo_y = height - 1.2*inch  # Centered vertically in the header
            
            # Draw the logo
            p.drawImage(logo_path, logo_x, logo_y, width=logo_width, height=logo_height, preserveAspectRatio=True)
            logger.info("PNG logo drawn successfully")
        else:
            # Fallback to text if logo file doesn't exist
            logger.warning(f"Logo file not found at {logo_path}. Using text fallback.")
            fallback_to_text = True
    except Exception as e:
        logger.error(f"Error drawing PNG logo: {e}")
        fallback_to_text = True
    
    # Fallback to text-based header if needed
    if 'fallback_to_text' in locals() and fallback_to_text:
        # Using the custom Karla-Bold font for the header
        p.setFont("Karla-Bold", 36)
        
        # Draw hotel name
        p.drawString(0.5*inch, height - 0.85*inch, "HUGO")
        
        # Draw "HOTEL GROUP" below in smaller text
        p.setFont("Karla", 14)
        p.drawString(0.5*inch, height - 1.1*inch, "HOTEL GROUP")
    
    # Room title - use bold font
    p.setFillColor(black)
    p.setFont("Karla", 28)
    
    title = room_data.get('name', 'Deluxe Suite')
    p.drawString(0.5*inch, height - 2.5*inch, title)
    
    # Room description
    p.setFillColor(black)
    p.setFont("Merriweather", 14)  # Using Merriweather for description
    
    description = room_data.get('description', 'A spacious suite with ocean view')
    # Wrap description if it's too long
    description_width = width - inch  # Available width
    if p.stringWidth(description, "Merriweather", 14) > description_width:
        # Simple truncation with ellipsis
        while p.stringWidth(description + "...", "Merriweather", 14) > description_width and len(description) > 0:
            description = description[:-1]
        description += "..."
    p.drawString(0.5*inch, height - 3.1*inch, description)
    
    # Add room image
    image_url = room_data.get('image')
    if image_url:
        img_data = download_image(image_url)
        if img_data:
            try:
                img = ImageReader(img_data)
                # Draw image maintaining aspect ratio
                img_width = width - inch
                img_height = 3.5*inch
                p.drawImage(img, 0.5*inch, height - 7*inch, width=img_width, height=img_height, preserveAspectRatio=True)
            except Exception as e:
                logger.error(f"Error drawing image: {e}")
    
    # Facilities section
    p.setFillColor(black)
    p.setFont("Karla-Bold", 18)
    
    p.drawString(0.5*inch, height - 7.5*inch, "Facilities")
    
    # Draw facility list in two columns
    if room_data.get('facilityList'):
        facilities = room_data['facilityList']
        # Split facilities into two columns
        mid_point = (len(facilities) + 1) // 2
        left_facilities = facilities[:mid_point]
        right_facilities = facilities[mid_point:]
        
        # Left column
        y_pos = height - 8*inch
        p.setFont("Merriweather", 12)
        
        for facility in left_facilities:
            p.drawString(0.7*inch, y_pos, "•")
            p.drawString(0.9*inch, y_pos, facility)
            y_pos -= 0.4*inch
        
        # Right column (starts at middle of page)
        y_pos = height - 8*inch
        for facility in right_facilities:
            p.drawString(4*inch, y_pos, "•")
            p.drawString(4.2*inch, y_pos, facility)
            y_pos -= 0.4*inch
    
    # Footer - make it taller to better fit text
    p.setFillColor(light_gray)
    # Increase height for better text coverage
    p.rect(0, 0.4*inch, width, 0.4*inch, fill=1)
    p.setFillColor(dark_gray)
    
    p.setFont("Karla", 9)
    
    # Copyright - Adjust y position to center vertically in the footer bar
    footer_center_y = 0.6*inch  # Middle of the footer bar (0.4*inch + 0.2*inch)
    
    # Copyright
    current_year = datetime.datetime.now().year
    p.drawString(0.5*inch, footer_center_y, f"© The Hugo {current_year}")
    
    # Date on right side
    today = datetime.datetime.now().strftime("%d/%m/%y")
    p.drawRightString(width - 0.5*inch, footer_center_y, today)
    
    p.save()
    buffer.seek(0)
    return buffer
