-- Create tables
CREATE TABLE companies (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    comp_code TEXT REFERENCES companies(code) ON DELETE CASCADE,
    amt NUMERIC(10, 2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    add_date DATE DEFAULT CURRENT_DATE,
    paid_date DATE
);

CREATE TABLE industries (
    code TEXT PRIMARY KEY,
    industry TEXT NOT NULL
);

CREATE TABLE company_industries (
    company_code TEXT REFERENCES companies(code) ON DELETE CASCADE,
    industry_code TEXT REFERENCES industries(code) ON DELETE CASCADE,
    PRIMARY KEY (company_code, industry_code)
);

-- Insert sample data
INSERT INTO companies (code, name, description) VALUES
('apple', 'Apple Inc.', 'A technology company that designs, manufactures, and sells consumer electronics.'),
('google', 'Google LLC', 'A multinational technology company specializing in Internet-related services and products.'),
('amazon', 'Amazon.com Inc.', 'An e-commerce and cloud computing company.');

INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES
('apple', 1000.00, FALSE, '2024-08-15', NULL),
('google', 500.00, TRUE, '2024-08-16', '2024-08-18'),
('amazon', 2000.00, FALSE, '2024-08-17', NULL);

INSERT INTO industries (code, industry) VALUES
('tech', 'Technology'),
('ecom', 'E-commerce'),
('cloud', 'Cloud Computing');

INSERT INTO company_industries (company_code, industry_code) VALUES
('apple', 'tech'),
('google', 'tech'),
('amazon', 'ecom'),
('amazon', 'cloud');

-- Verify table creation and sample data
SELECT * FROM companies;
SELECT * FROM invoices;
SELECT * FROM industries;
SELECT * FROM company_industries;


