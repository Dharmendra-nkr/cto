DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS presentations;
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS transcripts;
DROP TABLE IF EXISTS ai_responses;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'staff')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE presentations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'in_progress', 'completed')) DEFAULT 'scheduled',
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    presentation_id INTEGER NOT NULL,
    content_score REAL CHECK(content_score >= 0 AND content_score <= 10),
    delivery_score REAL CHECK(delivery_score >= 0 AND delivery_score <= 10),
    engagement_score REAL CHECK(engagement_score >= 0 AND engagement_score <= 10),
    total_score REAL,
    staff_comments TEXT,
    is_finalized BOOLEAN DEFAULT 0,
    FOREIGN KEY (presentation_id) REFERENCES presentations(id)
);

CREATE TABLE transcripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    presentation_id INTEGER NOT NULL,
    transcript_text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (presentation_id) REFERENCES presentations(id)
);

CREATE TABLE ai_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    presentation_id INTEGER NOT NULL,
    question_text TEXT,
    response_type TEXT CHECK(response_type IN ('question', 'score_update')),
    json_data TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (presentation_id) REFERENCES presentations(id)
);
