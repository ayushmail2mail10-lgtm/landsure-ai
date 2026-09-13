import urllib.request
import json
import os
import uuid

def post_multipart(url, token, filename, file_bytes, content_type):
    boundary = '----WebKitFormBoundary' + uuid.uuid4().hex
    body = bytearray()
    body.extend(f'--{boundary}\r\n'.encode('utf-8'))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode('utf-8'))
    body.extend(f'Content-Type: {content_type}\r\n\r\n'.encode('utf-8'))
    body.extend(file_bytes)
    body.extend(f'\r\n--{boundary}--\r\n'.encode('utf-8'))
    
    req = urllib.request.Request(url, data=bytes(body), headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': f'multipart/form-data; boundary={boundary}'
    })
    res = urllib.request.urlopen(req)
    return json.loads(res.read())

def main():
    # 1. Login as citizen
    login_data = json.dumps({'email': 'citizen@landsure.gov.in', 'password': 'Admin@123'}).encode()
    req_login = urllib.request.Request('http://127.0.0.1:8000/api/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    res_login = urllib.request.urlopen(req_login)
    token = json.loads(res_login.read())['access_token']
    print('[OK] Citizen Logged In successfully.')

    # 2. Upload PNG
    sample_png = os.path.join(os.path.dirname(__file__), 'data', 'samples', 'sample_genuine_pune.png')
    with open(sample_png, 'rb') as f:
        png_bytes = f.read()
    doc_png = post_multipart('http://127.0.0.1:8000/api/documents/upload', token, 'verified_7_12_extract.png', png_bytes, 'image/png')
    print(f'[OK] PNG Upload Success: ID={doc_png.get("id")} DocNum={doc_png.get("document_number")} Status={doc_png.get("status")}')

    # 3. Upload PDF
    pdf_bytes = (
        b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
        b"4 0 obj\n<< /Length 75 >>\nstream\nBT\n/F1 14 Tf\n50 700 Td\n(Government of Maharashtra Land Record 7-12) Tj\nET\nendstream\nendobj\n"
        b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
        b"xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000236 00000 n \n0000000363 00000 n \n"
        b"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n432\n%%EOF\n"
    )
    doc_pdf = post_multipart('http://127.0.0.1:8000/api/documents/upload', token, 'khatauni_pune_record.pdf', pdf_bytes, 'application/pdf')
    print(f'[OK] PDF Upload Success: ID={doc_pdf.get("id")} DocNum={doc_pdf.get("document_number")} Status={doc_pdf.get("status")}')

    # 4. Upload JPG
    jpg_bytes = bytes([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
        0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C,
        0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
        0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01,
        0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0xFF, 0xDA, 0x00, 0x08, 0x01,
        0x01, 0x00, 0x00, 0x3F, 0x00, 0xBF, 0x00, 0xFF, 0xD9
    ])
    doc_jpg = post_multipart('http://127.0.0.1:8000/api/documents/upload', token, 'survey_pune_record.jpg', jpg_bytes, 'image/jpeg')
    print(f'[OK] JPG Upload Success: ID={doc_jpg.get("id")} DocNum={doc_jpg.get("document_number")} Status={doc_jpg.get("status")}')

    # 5. Verify GET /api/documents list
    req_docs = urllib.request.Request('http://127.0.0.1:8000/api/documents', headers={'Authorization': f'Bearer {token}'})
    res_docs = urllib.request.urlopen(req_docs)
    all_docs = json.loads(res_docs.read())
    print(f'\nTotal Documents in Citizen List: {len(all_docs)}')
    for d in all_docs[:5]:
        s = d.get('structured_data') or {}
        v = d.get('validation_result') or {}
        print(f"  * {d.get('document_number')} | {d.get('file_name')} ({d.get('mime_type')}) | Survey #{s.get('survey_number')} | Owner: {s.get('owner_name')} | OCR: {d.get('ocr_confidence')}% | Risk: {v.get('risk_level')} ({v.get('fraud_risk_score')}/100)")

    # 6. Verify Officer review queue
    login_officer = json.dumps({'email': 'officer@landsure.gov.in', 'password': 'Admin@123'}).encode()
    req_off = urllib.request.Request('http://127.0.0.1:8000/api/auth/login', data=login_officer, headers={'Content-Type': 'application/json'})
    res_off = urllib.request.urlopen(req_off)
    off_token = json.loads(res_off.read())['access_token']
    
    req_queue = urllib.request.Request('http://127.0.0.1:8000/api/review/queue', headers={'Authorization': f'Bearer {off_token}'})
    res_queue = urllib.request.urlopen(req_queue)
    queue = json.loads(res_queue.read())
    print(f'\nTotal Documents in Officer Review Queue: {len(queue)}')

if __name__ == '__main__':
    main()
