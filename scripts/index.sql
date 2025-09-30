-- =============================================
-- CREACIÓN DE BASES DE DATOS
-- =============================================
CREATE DATABASE identity_db;
GO

CREATE DATABASE contest_db;
GO

CREATE DATABASE submission_db;
GO

CREATE DATABASE evaluation_db;
GO

CREATE DATABASE ai_analysis_db;
GO

-- =============================================
-- BASE DE DATOS: identity_db
-- =============================================
USE identity_db;
GO

CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Judge', 'Participant')),
    first_name NVARCHAR(100),
    last_name NVARCHAR(100),
    phone NVARCHAR(20),
    institution NVARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_users_role ON users(role);

-- =============================================
-- BASE DE DATOS: contest_db
-- =============================================
USE contest_db;
GO

CREATE TABLE contests (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    rules NVARCHAR(MAX),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Published', 'Closed', 'Archived')),
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2 NOT NULL,
    judging_date DATETIME2,
    max_submissions_per_participant INT DEFAULT 1,
    created_by_user_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a identity_db.users
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE categories (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contest_id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    max_submissions INT,
    allowed_file_types NVARCHAR(500), -- 'pdf,jpg,png,mp4'
    max_file_size_mb INT DEFAULT 100,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_categories_contests FOREIGN KEY (contest_id) 
        REFERENCES contests(id) ON DELETE CASCADE
);

CREATE INDEX IX_contests_status ON contests(status);
CREATE INDEX IX_contests_dates ON contests(start_date, end_date);
CREATE INDEX IX_categories_contest_id ON categories(contest_id);

-- =============================================
-- BASE DE DATOS: submission_db
-- =============================================
USE submission_db;
GO

CREATE TABLE submissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contest_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a contest_db.contests
    category_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a contest_db.categories
    participant_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a identity_db.users
    title NVARCHAR(500),
    description NVARCHAR(MAX),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Submitted', 'UnderReview', 'Accepted', 'Rejected')),
    submitted_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT UQ_submission_unique UNIQUE (contest_id, category_id, participant_id)
);

CREATE TABLE submission_files (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    submission_id UNIQUEIDENTIFIER NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    original_name NVARCHAR(255) NOT NULL,
    stored_path NVARCHAR(500) NOT NULL, -- URL en cloud storage
    file_size BIGINT NOT NULL,
    mime_type NVARCHAR(100) NOT NULL,
    upload_completed BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_submission_files_submissions FOREIGN KEY (submission_id) 
        REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE INDEX IX_submissions_contest_id ON submissions(contest_id);
CREATE INDEX IX_submissions_participant_id ON submissions(participant_id);
CREATE INDEX IX_submissions_status ON submissions(status);
CREATE INDEX IX_submission_files_submission_id ON submission_files(submission_id);

-- =============================================
-- BASE DE DATOS: evaluation_db
-- =============================================
USE evaluation_db;
GO

CREATE TABLE rubrics (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contest_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a contest_db.contests
    criterion_name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    max_score DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 1.00,
    criteria_order INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE judge_assignments (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contest_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a contest_db.contests
    submission_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a submission_db.submissions
    judge_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a identity_db.users
    assigned_at DATETIME2 DEFAULT GETDATE(),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('Assigned', 'InProgress', 'Completed', 'Cancelled')),
    completed_at DATETIME2,
    
    CONSTRAINT UQ_judge_assignment_unique UNIQUE (submission_id, judge_id)
);

CREATE TABLE scores (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    judge_assignment_id UNIQUEIDENTIFIER NOT NULL,
    rubric_criterion_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a evaluation_db.rubrics
    score DECIMAL(5,2) NOT NULL,
    comments NVARCHAR(MAX),
    scored_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_scores_judge_assignments FOREIGN KEY (judge_assignment_id) 
        REFERENCES judge_assignments(id) ON DELETE CASCADE,
    
    CONSTRAINT CHK_score_range CHECK (score >= 0 AND score <= 10)
);

CREATE INDEX IX_rubrics_contest_id ON rubrics(contest_id);
CREATE INDEX IX_judge_assignments_judge_id ON judge_assignments(judge_id);
CREATE INDEX IX_judge_assignments_submission_id ON judge_assignments(submission_id);
CREATE INDEX IX_scores_judge_assignment_id ON scores(judge_assignment_id);

-- =============================================
-- BASE DE DATOS: ai_analysis_db
-- =============================================
USE ai_analysis_db;
GO

CREATE TABLE analysis_requests (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    submission_file_id UNIQUEIDENTIFIER NOT NULL, -- Referencia lógica a submission_db.submission_files
    file_path NVARCHAR(500) NOT NULL,
    analysis_type NVARCHAR(100) NOT NULL CHECK (analysis_type IN ('TextAnalysis', 'ImageAnalysis', 'VideoAnalysis', 'PlagiarismCheck')),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Processing', 'Completed', 'Failed')),
    requested_at DATETIME2 DEFAULT GETDATE(),
    started_at DATETIME2,
    completed_at DATETIME2,
    error_message NVARCHAR(MAX)
);

CREATE TABLE analysis_results (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    analysis_request_id UNIQUEIDENTIFIER NOT NULL,
    result_type NVARCHAR(100) NOT NULL,
    result_data NVARCHAR(MAX) NOT NULL, -- JSON con los resultados del análisis
    confidence_score DECIMAL(5,4), -- 0.0000 a 1.0000
    metadata NVARCHAR(MAX), -- JSON con metadatos adicionales
    created_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_analysis_results_analysis_requests FOREIGN KEY (analysis_request_id) 
        REFERENCES analysis_requests(id) ON DELETE CASCADE
);

CREATE INDEX IX_analysis_requests_status ON analysis_requests(status);
CREATE INDEX IX_analysis_requests_submission_file_id ON analysis_requests(submission_file_id);
CREATE INDEX IX_analysis_results_request_id ON analysis_results(analysis_request_id);

-- =============================================
-- VISTAS ÚTILES (OPCIONALES)
-- =============================================

-- Vista para reportes de submissions (requeriría enlazar datos de múltiples BD)
USE submission_db;
GO

CREATE VIEW submission_overview AS
SELECT 
    s.id,
    s.contest_id,
    s.category_id,
    s.participant_id,
    s.title,
    s.status,
    s.submitted_at,
    sf.file_name,
    sf.file_size
FROM submissions s
LEFT JOIN submission_files sf ON s.id = sf.submission_id;
GO

-- =============================================
-- INSERCIÓN DE DATOS DE PRUEBA
-- =============================================

USE identity_db;
GO

INSERT INTO users (id, email, password_hash, role, first_name, last_name) VALUES
(NEWID(), 'admin@concursos.com', '$2a$10$hashedpassword', 'Admin', 'Admin', 'Sistema'),
(NEWID(), 'judge1@concursos.com', '$2a$10$hashedpassword', 'Judge', 'María', 'García'),
(NEWID(), 'participant1@concursos.com', '$2a$10$hashedpassword', 'Participant', 'Carlos', 'López');
GO

PRINT '✅ Bases de datos y tablas creadas exitosamente';
PRINT '📊 identity_db: Tablas para gestión de usuarios y autenticación';
PRINT '🏆 contest_db: Tablas para gestión de concursos y categorías';
PRINT '📤 submission_db: Tablas para envío de propuestas y archivos';
PRINT '⚖️ evaluation_db: Tablas para evaluación y calificaciones';
PRINT '🤖 ai_analysis_db: Tablas para análisis de IA';