import os

filepath = r"c:\Users\HP\projects\AntiGravity\NUA Website\useful-links\nua-journey.html"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix body style
content = content.replace("""        body {
            background-color: #ffffff; /* Clean white background */
            color: #333;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }""", """        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding-top: 100px; /* Offset for fixed header */
        }
        
        body.moonlit-theme {
            --timeline-blue: #90caf9;
            --timeline-bg: #0A1F08;
            --card-bg: #0F250E;
            --text-color: #E0EADD;
            --border-light: rgba(255,255,255,0.1);
        }
        
        body:not(.moonlit-theme) {
            --timeline-blue: #1a4f8b;
            --timeline-bg: #ffffff;
            --card-bg: #ffffff;
            --text-color: #333;
            --border-light: #eee;
        }""")

# Add moonlit-theme class to body
content = content.replace("<body>", '<body class="moonlit-theme">')

# Replace colors
content = content.replace("color: #1a4f8b;", "color: var(--timeline-blue);")
content = content.replace("background-color: #1a4f8b;", "background-color: var(--timeline-blue);")
content = content.replace("border: 4px solid #1a4f8b;", "border: 4px solid var(--timeline-blue);")
content = content.replace("border-color: #1a4f8b;", "border-color: var(--timeline-blue);")
content = content.replace("border: 2px solid #1a4f8b;", "border: 2px solid var(--timeline-blue);")
content = content.replace("background: #1a4f8b;", "background: var(--timeline-blue);")
content = content.replace("color: #555;", "color: var(--text-color); opacity: 0.8;")

content = content.replace("background-color: white;", "background-color: var(--card-bg);")
content = content.replace("background: white;", "background: var(--card-bg);")
content = content.replace("border-top: 3px solid #eee;", "border-top: 3px solid var(--border-light);")

# Inject quicklinks
quicklinks_html = """    <!-- Quicklinks Section -->
    <section id="quicklinks" class="section bg-light" style="margin-top: auto; padding: 60px 0; background-color: var(--bg-secondary); border-top: 1px solid rgba(45, 90, 39, 0.1);">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div class="quicklinks-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px;">
                <div class="quicklinks-col">
                    <h3 style="font-size: 1.25rem; margin-bottom: 20px; color: var(--brand-primary); font-family: 'Outfit';">Useful Links</h3>
                    <ul class="quick-links-list" style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px;"><a href="kya.html" style="color: var(--text-primary); text-decoration: none;">KYA (Know Your Association)</a></li>
                        <li style="margin-bottom: 10px;"><a href="gallery.html" style="color: var(--text-primary); text-decoration: none;">📸 NUA Photo Gallery</a></li>
                        <li style="margin-bottom: 10px;"><a href="blogs.html" style="color: var(--text-primary); text-decoration: none;">✍️ MC Member Blogs</a></li>
                        <li style="margin-bottom: 10px;"><a href="nua-journey.html" style="color: var(--text-primary); text-decoration: none;">⏳ NUA Journey Timeline</a></li>
                    </ul>
                </div>
                <div class="quicklinks-col">
                    <h3 style="font-size: 1.25rem; margin-bottom: 20px; color: var(--brand-primary); font-family: 'Outfit';">Contact Us</h3>
                    <p style="color: var(--text-primary);"><strong>NUA MC Email ID:</strong><br>
                        <a href="mailto:nua-managing-committee@googlegroups.com" style="color: var(--brand-primary); text-decoration: none;">nua-managing-committee@googlegroups.com</a>
                    </p>
                </div>
                <div class="quicklinks-col">
                    <h3 style="font-size: 1.25rem; margin-bottom: 20px; color: var(--brand-primary); font-family: 'Outfit';">Site Navigation</h3>
                    <ul class="quick-links-list" style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px;"><a href="../index.html#about" style="color: var(--text-primary); text-decoration: none;">About NUA</a></li>
                        <li style="margin-bottom: 10px;"><a href="../index.html#principles" style="color: var(--text-primary); text-decoration: none;">Guiding Principles</a></li>
                        <li style="margin-bottom: 10px;"><a href="../index.html#registration" style="color: var(--text-primary); text-decoration: none;">Member Registration</a></li>
                        <li style="margin-bottom: 10px;"><a href="../mc-members.html" style="color: var(--text-primary); text-decoration: none;">MC Resources</a></li>
                        <li style="margin-bottom: 10px;"><a href="../index.html#contact" style="color: var(--text-primary); text-decoration: none;">Contact NUA MC</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <footer style="background-color: var(--bg-dark, #1B3F16); color: var(--text-inverse, #fff); padding: 30px 0; text-align: center;">
        <div class="container text-center">
            <p>&copy; 2026 New Utopia Association (NUA). All rights reserved.</p>
            <p class="designer-credit" style="font-size: 0.85rem; opacity: 0.7; margin-top: 5px;">Designed By: R&R Consulting</p>
        </div>
    </footer>
"""

bottom_bar_replacement = """    <div class="bottom-bar">
        NUA Web Development & Automation
    </div>"""

# Ensure we don't duplicate
if 'id="quicklinks"' not in content:
    content = content.replace(bottom_bar_replacement, quicklinks_html + "\n\n" + bottom_bar_replacement)

# Include script.js for the theme toggle to work
if 'src="../script.js"' not in content:
    content = content.replace("</body>", '    <script src="../script.js"></script>\n</body>')

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("nua-journey.html updated successfully!")
