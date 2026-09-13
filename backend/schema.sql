-- ============================================================================
-- LandSure AI - PostgreSQL Production Schema
-- Enterprise GovTech Land Record Digitization & AI Validation System
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen', -- 'citizen', 'officer', 'admin'
    department VARCHAR(100),
    mobile_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS land_records (
    id SERIAL PRIMARY KEY,
    survey_number VARCHAR(100) NOT NULL,
    subdivision_number VARCHAR(50) DEFAULT '1',
    plot_number VARCHAR(50),
    owner_name VARCHAR(255) NOT NULL,
    father_or_husband_name VARCHAR(255),
    village VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    total_area_hectares NUMERIC(10, 4) NOT NULL,
    uncultivated_area NUMERIC(10, 4) DEFAULT 0.0,
    assessment_rupees NUMERIC(10, 2) DEFAULT 15.00,
    land_type VARCHAR(100) DEFAULT 'Agricultural',
    tenure_type VARCHAR(100) DEFAULT 'Occupant Class 1',
    mutation_number VARCHAR(100),
    last_mutation_date VARCHAR(50),
    encumbrances TEXT DEFAULT 'None / Nil',
    status VARCHAR(50) DEFAULT 'VERIFIED',
    health_score INTEGER DEFAULT 95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_land_records_survey ON land_records(survey_number);
CREATE INDEX idx_land_records_owner ON land_records(owner_name);
CREATE INDEX idx_land_records_village ON land_records(village);
CREATE INDEX idx_land_records_district ON land_records(district);

CREATE TABLE IF NOT EXISTS mutation_history (
    id SERIAL PRIMARY KEY,
    land_record_id INTEGER NOT NULL REFERENCES land_records(id) ON DELETE CASCADE,
    mutation_number VARCHAR(100) NOT NULL,
    mutation_date VARCHAR(50) NOT NULL,
    mutation_type VARCHAR(100) NOT NULL,
    transferor_name VARCHAR(255),
    transferee_name VARCHAR(255) NOT NULL,
    area_transferred NUMERIC(10, 4),
    remarks TEXT,
    status VARCHAR(50) DEFAULT 'SANCTIONED'
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(100) UNIQUE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    original_file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    is_tampered BOOLEAN DEFAULT FALSE,
    uploaded_by_id INTEGER NOT NULL REFERENCES users(id),
    upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'uploaded',
    processed_image_path VARCHAR(500),
    raw_ocr_text TEXT,
    ocr_confidence NUMERIC(5, 2) DEFAULT 0.0,
    structured_data TEXT, -- Stored as JSON
    officer_remarks TEXT,
    reviewed_by_id INTEGER REFERENCES users(id),
    review_timestamp TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_documents_hash ON documents(sha256_hash);
CREATE INDEX idx_documents_status ON documents(status);

CREATE TABLE IF NOT EXISTS validation_results (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    matched_record_id INTEGER REFERENCES land_records(id),
    overall_validation_score NUMERIC(5, 2) DEFAULT 0.0,
    fraud_risk_score NUMERIC(5, 2) DEFAULT 0.0,
    risk_level VARCHAR(50) DEFAULT 'LOW',
    ai_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discrepancies (
    id SERIAL PRIMARY KEY,
    validation_result_id INTEGER NOT NULL REFERENCES validation_results(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    document_value VARCHAR(255),
    database_value VARCHAR(255),
    risk_level VARCHAR(50) NOT NULL, -- 'HIGH', 'MEDIUM', 'LOW'
    severity INTEGER DEFAULT 1,
    discrepancy_type VARCHAR(100) NOT NULL,
    suggested_action TEXT,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(255) NOT NULL DEFAULT 'System',
    user_role VARCHAR(50) NOT NULL DEFAULT 'system',
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
