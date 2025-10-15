-- Create the database
CREATE DATABASE IF NOT EXISTS business_db;
USE business_db;

-- 1. Departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    manager_id INT,
    budget DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    hire_date DATE,
    job_title VARCHAR(50),
    salary DECIMAL(10,2),
    department_id INT,
    manager_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- 3. Customers table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(100),
    contact_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products table
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_price DECIMAL(10,2),
    stock_quantity INT,
    supplier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    employee_id INT,
    order_date DATE,
    required_date DATE,
    shipped_date DATE,
    status VARCHAR(20) DEFAULT 'Pending',
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- 6. Order details table
CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    discount DECIMAL(4,2) DEFAULT 0.00,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Add foreign key constraint for departments manager
ALTER TABLE departments ADD FOREIGN KEY (manager_id) REFERENCES employees(employee_id);
ALTER TABLE employees ADD FOREIGN KEY (manager_id) REFERENCES employees(employee_id);



-- Insert departments
INSERT INTO departments (department_name, budget) VALUES
('Sales', 500000.00),
('Marketing', 300000.00),
('IT', 400000.00),
('HR', 200000.00),
('Finance', 350000.00);

-- Insert employees
INSERT INTO employees (first_name, last_name, email, hire_date, job_title, salary, department_id) VALUES
('John', 'Smith', 'john.smith@company.com', '2020-01-15', 'Sales Manager', 75000.00, 1),
('Sarah', 'Johnson', 'sarah.johnson@company.com', '2020-03-20', 'Marketing Manager', 70000.00, 2),
('Mike', 'Chen', 'mike.chen@company.com', '2019-06-10', 'IT Manager', 85000.00, 3),
('Emily', 'Davis', 'emily.davis@company.com', '2021-02-01', 'Sales Representative', 55000.00, 1),
('David', 'Wilson', 'david.wilson@company.com', '2021-04-15', 'Software Developer', 65000.00, 3),
('Lisa', 'Brown', 'lisa.brown@company.com', '2020-11-30', 'HR Specialist', 50000.00, 4);

-- Update departments with managers
UPDATE departments SET manager_id = 1 WHERE department_id = 1;
UPDATE departments SET manager_id = 2 WHERE department_id = 2;
UPDATE departments SET manager_id = 3 WHERE department_id = 3;
UPDATE departments SET manager_id = 6 WHERE department_id = 4;

-- Insert customers
INSERT INTO customers (company_name, contact_name, email, phone, city, country) VALUES
('Tech Solutions Inc', 'Robert Taylor', 'robert@techsolutions.com', '+1-555-0101', 'New York', 'USA'),
('Global Retail Co', 'Maria Garcia', 'maria@globalretail.com', '+1-555-0102', 'Chicago', 'USA'),
('Innovate Labs', 'James Wilson', 'james@innovatelabs.com', '+1-555-0103', 'San Francisco', 'USA'),
('City Services Ltd', 'Jennifer Lee', 'jennifer@cityservices.com', '+1-555-0104', 'Boston', 'USA');

-- Insert products
INSERT INTO products (product_name, description, category, unit_price, stock_quantity, supplier) VALUES
('Laptop Pro', 'High-performance business laptop', 'Electronics', 1200.00, 50, 'TechSuppliers Inc'),
('Office Desk', 'Ergonomic office desk', 'Furniture', 450.00, 30, 'OfficeFurniture Co'),
('Wireless Mouse', 'Bluetooth wireless mouse', 'Electronics', 25.99, 100, 'TechSuppliers Inc'),
('Desk Chair', 'Comfortable office chair', 'Furniture', 299.99, 40, 'OfficeFurniture Co'),
('Monitor 24"', '24-inch HD monitor', 'Electronics', 199.99, 75, 'TechSuppliers Inc');

-- Insert orders
INSERT INTO orders (customer_id, employee_id, order_date, required_date, status, total_amount) VALUES
(1, 1, '2024-01-10', '2024-01-20', 'Delivered', 2400.00),
(2, 4, '2024-01-12', '2024-01-25', 'Processing', 749.98),
(3, 1, '2024-01-15', '2024-01-30', 'Pending', 1225.97),
(1, 4, '2024-01-18', '2024-02-01', 'Processing', 299.99);

-- Insert order details
INSERT INTO order_details (order_id, product_id, quantity, unit_price, discount) VALUES
(1, 1, 2, 1200.00, 0.00),
(2, 2, 1, 450.00, 0.00),
(2, 3, 4, 25.99, 0.10),
(3, 1, 1, 1200.00, 0.05),
(3, 5, 1, 199.99, 0.00),
(4, 4, 1, 299.99, 0.00);