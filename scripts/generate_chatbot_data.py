import os
import json
import sys
import subprocess

# Auto-install dependencies if missing
def install_dependencies():
    required_packages = ["beautifulsoup4", "pypdf"]
    for package in required_packages:
        try:
            __import__(package if package != "beautifulsoup4" else "bs4")
        except ImportError:
            print(f"Installing missing dependency: {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Install required dependencies
install_dependencies()

from bs4 import BeautifulSoup
from pypdf import PdfReader

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
USEFUL_LINKS_DIR = os.path.join(BASE_DIR, "useful-links")
OUTPUT_FILE = os.path.join(ASSETS_DIR, "chatbot-corpus.json")

print(f"Base Directory: {BASE_DIR}")
print(f"Assets Directory: {ASSETS_DIR}")
print(f"Useful Links Directory: {USEFUL_LINKS_DIR}")

corpus = []

# List of HTML files to process
html_files = [
    {"path": os.path.join(BASE_DIR, "index.html"), "name": "index.html", "title": "Home Page"},
    {"path": os.path.join(USEFUL_LINKS_DIR, "blogs.html"), "name": "useful-links/blogs.html", "title": "Blogs"},
    {"path": os.path.join(USEFUL_LINKS_DIR, "gallery.html"), "name": "useful-links/gallery.html", "title": "Gallery"},
    {"path": os.path.join(USEFUL_LINKS_DIR, "kya.html"), "name": "useful-links/kya.html", "title": "KYA (Know Your Association)"},
    {"path": os.path.join(USEFUL_LINKS_DIR, "nua-journey.html"), "name": "useful-links/nua-journey.html", "title": "NUA Journey"},
    {"path": os.path.join(USEFUL_LINKS_DIR, "welfare_calculator.html"), "name": "useful-links/welfare_calculator.html", "title": "Welfare Calculator"},
]

# 1. Parse HTML files
for hfile in html_files:
    path = hfile["path"]
    name = hfile["name"]
    title = hfile["title"]
    
    if not os.path.exists(path):
        print(f"Warning: HTML file not found: {path}")
        continue
        
    print(f"Processing HTML: {name}...")
    
    with open(path, "r", encoding="utf-8") as f:
        html_content = f.read()
        
    soup = BeautifulSoup(html_content, "html.parser")
    
    # Strip script, style, header, footer, nav
    for tag in soup(["script", "style", "header", "footer", "nav"]):
        tag.decompose()
        
    # We will segment the HTML page by its main sections or headings
    sections = []
    
    # Check if there are explicit <section> tags
    section_tags = soup.find_all("section")
    if section_tags:
        for sec in section_tags:
            sec_id = sec.get("id", "")
            
            # Find the first heading in section
            heading_tag = sec.find(["h1", "h2", "h3", "h4"])
            heading_text = heading_tag.get_text(strip=True) if heading_tag else "General Info"
            
            # Get text contents (strip extra spaces)
            sec_text = sec.get_text(" ", strip=True)
            # Remove the heading text from the content to avoid double indexing
            if heading_tag:
                sec_text = sec_text.replace(heading_tag.get_text(" ", strip=True), "", 1).strip()
            
            # Clean up spacing
            sec_text = " ".join(sec_text.split())
            
            if len(sec_text) > 20: # Only index sections with meaningful text
                sections.append({
                    "section_id": sec_id,
                    "heading": heading_text,
                    "text": sec_text
                })
    else:
        # Fallback to general page text if no <section> tags
        page_text = " ".join(soup.get_text(" ", strip=True).split())
        sections.append({
            "section_id": "main",
            "heading": title,
            "text": page_text
        })
        
    corpus.append({
        "type": "html",
        "source": name,
        "title": title,
        "sections": sections
    })

# 2. Parse PDF file (Bye-laws)
pdf_path = os.path.join(ASSETS_DIR, "nua-byelaws.pdf")
if os.path.exists(pdf_path):
    print("Processing PDF: nua-byelaws.pdf...")
    try:
        reader = PdfReader(pdf_path)
        pdf_pages = []
        for idx, page in enumerate(reader.pages):
            page_num = idx + 1
            text = page.extract_text()
            if text:
                # Clean text spacing
                text_clean = " ".join(text.split())
                if len(text_clean) > 20:
                    pdf_pages.append({
                        "page": page_num,
                        "text": text_clean
                    })
        corpus.append({
            "type": "pdf",
            "source": "assets/nua-byelaws.pdf",
            "title": "NUA Bye-laws Document",
            "pages": pdf_pages
        })
    except Exception as e:
        print(f"Error parsing PDF file: {e}")
else:
    print(f"Warning: PDF file not found at {pdf_path}")

# Write to chatbot-corpus.json
try:
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(corpus, f, indent=2, ensure_ascii=False)
    print(f"Successfully generated chatbot corpus at: {OUTPUT_FILE}")
    print(f"Total entries: {len(corpus)}")
except Exception as e:
    print(f"Error writing output file: {e}")
    sys.exit(1)
