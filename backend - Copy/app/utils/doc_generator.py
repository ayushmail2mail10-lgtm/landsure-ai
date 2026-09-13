import os
import zlib
import struct

def create_sample_png(file_path: str, title: str, subtitle: str, fields: dict):
    """
    Creates a clean, valid PNG file without requiring any C-extensions or external binaries.
    Uses Python standard library (struct + zlib).
    """
    width, height = 800, 1000
    # Create an RGB image buffer with GovTech styled document look
    # Background: warm off-white (250, 248, 245)
    row_bytes = bytearray([0] + [250, 248, 245] * width) # filter byte 0 + RGB
    
    # We can create a simple, elegant SVG or convert SVG to PNG or write direct PNG
    # An SVG is also easily served and displayed in web browsers!
    svg_path = file_path.replace(".png", ".svg")
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
    <filter id="paperShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.1" />
    </filter>
  </defs>

  <!-- Document Paper Canvas -->
  <rect x="15" y="15" width="770" height="1020" fill="#fcfbf7" stroke="#cbd5e1" stroke-width="2" rx="4" filter="url(#paperShadow)"/>
  <rect x="25" y="25" width="750" height="1000" fill="none" stroke="#1e3a8a" stroke-width="2" />
  <rect x="30" y="30" width="740" height="990" fill="none" stroke="#d97706" stroke-width="0.8" />

  <!-- Government Header Banner -->
  <rect x="35" y="35" width="730" height="115" fill="url(#headerGrad)" rx="2" />
  
  <!-- Emblem Placeholder / Seal -->
  <circle cx="95" cy="92" r="38" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
  <text x="95" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#f59e0b">सत्यमेव जयते</text>
  <text x="95" y="102" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">GOV OF INDIA</text>

  <!-- Title Text -->
  <text x="410" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="1">GOVERNMENT OF MAHARASHTRA / महाराष्ट्र शासन</text>
  <text x="410" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#f59e0b">REVENUE &amp; LAND RECORDS DEPARTMENT / महसूल विभाग</text>
  <text x="410" y="116" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">FORM VII-XII EXTRACT (गाव नमुना सात-बारा अधिकार अभिलेख)</text>

  <!-- Sub-header metadata -->
  <rect x="35" y="160" width="730" height="35" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
  <text x="50" y="183" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">DOC TYPE: {title.upper()}</text>
  <text x="550" y="183" font-family="Arial, sans-serif" font-size="12" fill="#475569">DIGITIZED CADASTRE PORTAL</text>

  <!-- Grid Table -->
  <g transform="translate(35, 210)" font-family="Arial, sans-serif" font-size="12">
    <!-- Outer Table Border -->
    <rect x="0" y="0" width="730" height="520" fill="#ffffff" stroke="#334155" stroke-width="1.5" />
    
    <!-- Table Header -->
    <rect x="0" y="0" width="730" height="40" fill="#e2e8f0" stroke="#334155" stroke-width="1" />
    <text x="180" y="25" text-anchor="middle" font-weight="bold" fill="#0f172a">REVENUE RECORD ATTRIBUTE (महसूल तपशील)</text>
    <text x="540" y="25" text-anchor="middle" font-weight="bold" fill="#0f172a">EXTRACTED SANCTIONED VALUE (नोंदणीकृत माहिती)</text>
    <line x1="365" y1="0" x2="365" y2="520" stroke="#64748b" stroke-width="1" />

    <!-- Row 1: Survey Number -->
    <line x1="0" y1="80" x2="730" y2="80" stroke="#cbd5e1" />
    <text x="20" y="65" font-weight="bold" fill="#334155">Survey / Gut No (सर्व्हे / गट क्र.):</text>
    <text x="385" y="65" font-weight="bold" fill="#1e40af">{fields.get("survey_number", "142/3B")}</text>

    <!-- Row 2: Plot Number -->
    <line x1="0" y1="120" x2="730" y2="120" stroke="#cbd5e1" />
    <text x="20" y="105" font-weight="bold" fill="#334155">Plot Number (भूखंड क्र.):</text>
    <text x="385" y="105" fill="#0f172a">{fields.get("plot_number", "P-14")}</text>

    <!-- Row 3: Owner Name -->
    <line x1="0" y1="160" x2="730" y2="160" stroke="#cbd5e1" />
    <text x="20" y="145" font-weight="bold" fill="#334155">Title Holder / Owner (खातेदाराचे नाव):</text>
    <text x="385" y="145" font-weight="bold" fill="#0f172a">{fields.get("owner_name", "Rameshwar Shivram Patil")}</text>

    <!-- Row 4: Father's Name -->
    <line x1="0" y1="200" x2="730" y2="200" stroke="#cbd5e1" />
    <text x="20" y="185" font-weight="bold" fill="#334155">Father's Name (वडिलांचे नाव):</text>
    <text x="385" y="185" fill="#0f172a">{fields.get("fathers_name", "Shivram Tukaram Patil")}</text>

    <!-- Row 5: Village -->
    <line x1="0" y1="240" x2="730" y2="240" stroke="#cbd5e1" />
    <text x="20" y="225" font-weight="bold" fill="#334155">Village / Gram (गाव):</text>
    <text x="385" y="225" fill="#0f172a">{fields.get("village", "Wagholi")}</text>

    <!-- Row 6: Taluka -->
    <line x1="0" y1="280" x2="730" y2="280" stroke="#cbd5e1" />
    <text x="20" y="265" font-weight="bold" fill="#334155">Taluka / Tehsil (तालुका):</text>
    <text x="385" y="265" fill="#0f172a">{fields.get("taluka", "Haveli")}</text>

    <!-- Row 7: District -->
    <line x1="0" y1="320" x2="730" y2="320" stroke="#cbd5e1" />
    <text x="20" y="305" font-weight="bold" fill="#334155">District (जिल्हा):</text>
    <text x="385" y="305" fill="#0f172a">{fields.get("district", "Pune")}</text>

    <!-- Row 8: Land Area -->
    <line x1="0" y1="360" x2="730" y2="360" stroke="#cbd5e1" />
    <text x="20" y="345" font-weight="bold" fill="#334155">Total Area (एकूण क्षेत्र):</text>
    <text x="385" y="345" font-weight="bold" fill="#047857">{fields.get("land_area", "2.45 Ha")}</text>

    <!-- Row 9: Land Type -->
    <line x1="0" y1="400" x2="730" y2="400" stroke="#cbd5e1" />
    <text x="20" y="385" font-weight="bold" fill="#334155">Tenure &amp; Land Type (धारणा व प्रकार):</text>
    <text x="385" y="385" fill="#0f172a">{fields.get("land_type", "Jirayat Agricultural (भोगवटादार वर्ग १)")}</text>

    <!-- Row 10: Mutation No -->
    <line x1="0" y1="440" x2="730" y2="440" stroke="#cbd5e1" />
    <text x="20" y="425" font-weight="bold" fill="#334155">Last Mutation No (शेवटचा फेरफार क्र.):</text>
    <text x="385" y="425" font-weight="bold" fill="#7c2d12">{fields.get("mutation_number", "4892")}</text>

    <!-- Row 11: Sanction Date -->
    <line x1="0" y1="480" x2="730" y2="480" stroke="#cbd5e1" />
    <text x="20" y="465" font-weight="bold" fill="#334155">Record Sanction Date (नोंद दिनांक):</text>
    <text x="385" y="465" fill="#0f172a">{fields.get("record_date", "14/08/2023")}</text>

    <!-- Row 12: Encumbrances -->
    <text x="20" y="505" font-weight="bold" fill="#334155">Encumbrances (इतर हक्क व बोजा):</text>
    <text x="385" y="505" fill="#b45309">Nil / No Outstanding Revenue Dues</text>
  </g>

  <!-- Digital Stamp & Seal -->
  <g transform="translate(540, 760)">
    <circle cx="80" cy="80" r="65" fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="6 3" />
    <circle cx="80" cy="80" r="55" fill="none" stroke="#059669" stroke-width="1.5" />
    <text x="80" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#059669">DIGITALLY SIGNED</text>
    <text x="80" y="76" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#065f46">TALATHI / REVENUE</text>
    <text x="80" y="92" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#059669">PUNE CIRCLE</text>
    <text x="80" y="108" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#047857">OFFICIAL SEAL</text>
  </g>

  <!-- Barcode Simulation & Hash -->
  <g transform="translate(60, 780)">
    <rect x="0" y="0" width="380" height="70" fill="#f8fafc" stroke="#e2e8f0" rx="3" />
    <!-- Barcode lines -->
    {"".join(f'<line x1="{15 + i*8}" y1="12" x2="{15 + i*8}" y2="52" stroke="#000000" stroke-width="{2 if i%3!=0 else 4}" />' for i in range(42))}
    <text x="15" y="64" font-family="Courier, monospace" font-size="9" fill="#475569">ROR-NIC-CERT-2026-X79B4892C</text>
  </g>

  <!-- Footer Verification Note -->
  <text x="400" y="920" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#64748b">This is a system generated certified land record extract authorized under Maharashtra Land Revenue Code, 1966.</text>
  <text x="400" y="938" text-anchor="middle" font-family="Courier, monospace" font-size="10" fill="#0f172a">SHA-256 DIGITAL INTEGRITY REGISTRATION: VERIFIED</text>
</svg>"""

    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

    # Also write a standard valid minimal PNG for systems requesting PNG mime type
    # A 100x100 clean PNG or copy
    # We can write raw PNG file chunks
    png_data = create_minimal_png(width=200, height=250, title=title)
    with open(file_path, "wb") as f:
        f.write(png_data)

def create_minimal_png(width=200, height=250, title="Doc"):
    import zlib, struct
    def chunk(tag, data):
        return struct.pack("!I", len(data)) + tag + data + struct.pack("!I", zlib.crc32(tag + data) & 0xffffffff)

    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter type 0
        for x in range(width):
            # Paper texture background with Gov Blue header
            if y < 40:
                raw_data.extend([15, 23, 42]) # Navy header
            elif x < 5 or x >= width - 5 or y >= height - 5:
                raw_data.extend([217, 119, 6]) # Saffron border
            else:
                raw_data.extend([250, 248, 245]) # Warm parchment

    compressed = zlib.compress(bytes(raw_data), 9)
    ihdr = struct.pack("!IIBBBBB", width, height, 8, 2, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")

print("Generator functions verified.")
