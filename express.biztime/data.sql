-- Create companies table
CREATE TABLE companies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Create invoices table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  comp_code TEXT REFERENCES companies(code),
  amt NUMERIC(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  add_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE
);

-- Insert sample data
INSERT INTO companies (code, name, description)
VALUES
  ('c1', 'Company One', 'Description of Company One'),
  ('c2', 'Company Two', 'Description of Company Two');

INSERT INTO invoices (comp_code, amt)
VALUES
  ('c1', 100.00),
  ('c1', 200.00),
  ('c2', 300.00);

