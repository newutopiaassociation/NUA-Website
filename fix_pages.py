import os
import re

html_dir = "useful-links"

header_html = """    <header id="main-header">
        <div class="container header-container">
            <div class="logo">
                <a href="../index.html">
                    <img src="../assets/logo.png" alt="NUA Logo" id="header-logo">
                </a>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="../index.html#about" class="glow-on-hover">About NUA</a></li>
                    <li><a href="../index.html#principles" class="glow-on-hover">Guiding Principles</a></li>
                    <li><a href="../index.html#registration" class="glow-on-hover">Member Registration</a></li>
                    <li><a href="../mc-members.html" id="nav-member-resources" class="glow-on-hover">Member Resources</a></li>
                    <li><a href="../index.html#contact" class="glow-on-hover">Contact NUA MC</a></li>
                    <li><a href="../index.html#newsletters" class="glow-on-hover">NUA Newsletters</a></li>

                    <li class="mobile-only-controls">
                        <div class="header-controls">
                            <button id="theme-toggle-mobile" class="control-btn" title="Toggle Day/Night Mode">🌙</button>
                            <button id="sound-toggle-mobile" class="control-btn" title="Toggle Ambient Sound">🔇</button>
                            <button class="control-btn refresh-app-btn" title="Refresh App" onclick="refreshApp()">🔄</button>
                        </div>
                    </li>
                </ul>
                <div class="header-controls desktop-only-controls">
                    <button id="theme-toggle" class="control-btn" title="Toggle Day/Night Mode">🌙</button>
                    <button id="sound-toggle" class="control-btn" title="Toggle Ambient Sound">🔇</button>
                    <button class="control-btn refresh-app-btn" title="Refresh App" onclick="refreshApp()">🔄</button>
                </div>
                <div class="menu-toggle" id="mobile-menu">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </nav>
        </div>
    </header>"""

quicklinks_html = """        <section id="quicklinks" class="section bg-light">
            <div class="container">
                <div class="quicklinks-grid">
                    <div class="quicklinks-col">
                        <h3>Useful Links</h3>
                        <ul class="quick-links-list">
                            <li><a href="kya.html">KYA (Know Your Association)</a></li>
                            <li><a href="gallery.html">📸 NUA Photo Gallery</a></li>
                            <li><a href="blogs.html">✍️ MC Member Blogs</a></li>
                            <li><a href="nua-journey.html">⏳ NUA Journey Timeline</a></li>
                        </ul>
                    </div>
                    <div class="quicklinks-col">
                        <h3>Contact Us</h3>
                        <p><strong>NUA MC Email ID:</strong><br>
                            <a href="mailto:nua-managing-committee@googlegroups.com">nua-managing-committee@googlegroups.com</a>
                        </p>
                    </div>
                    <div class="quicklinks-col">
                        <h3>Site Navigation</h3>
                        <ul class="quick-links-list">
                            <li><a href="../index.html#about">About NUA</a></li>
                            <li><a href="../index.html#principles">Guiding Principles</a></li>
                            <li><a href="../index.html#registration">Member Registration</a></li>
                            <li><a href="../mc-members.html">MC Resources</a></li>
                            <li><a href="gallery.html">📸 Photo Gallery</a></li>
                            <li><a href="../index.html#contact">Contact NUA MC</a></li>
                            <li><a href="../index.html#newsletters">NUA Newsletters</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>"""

def add_quicklinks(filename):
    filepath = os.path.join(html_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    if '<section id="quicklinks"' not in content:
        # insert before <footer> or </main>
        if '<footer>' in content:
            content = content.replace('<footer>', quicklinks_html + '\n\n    <footer>')
        elif '</main>' in content:
            content = content.replace('</main>', quicklinks_html + '\n    </main>')
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Added quicklinks to {filename}")

# Fix nua-journey.html
journey_path = os.path.join(html_dir, "nua-journey.html")
with open(journey_path, "r", encoding="utf-8") as f:
    journey_content = f.read()

# Replace header in nua-journey
header_regex = re.compile(r'<header id="main-header".*?</header>', re.DOTALL)
journey_content = header_regex.sub(header_html, journey_content)
with open(journey_path, "w", encoding="utf-8") as f:
    f.write(journey_content)
print("Updated header in nua-journey.html")

add_quicklinks("nua-journey.html")
add_quicklinks("gallery.html")
add_quicklinks("blogs.html")
add_quicklinks("kya.html")
add_quicklinks("welfare_calculator.html")
add_quicklinks("welfare_calculator_standalone.html")
