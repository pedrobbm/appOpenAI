// server/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db;

// Initialize or connect to local database file
export async function initDB() {
  db = await open({
    filename: "./business_db.sqlite",
    driver: sqlite3.Database,
  });

  console.log("✅ SQLite database ready");

  // Create tables (simplified version of your MySQL schema)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      department_id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_name TEXT,
      manager_id INTEGER,
      budget DECIMAL(12,2)
    );

    CREATE TABLE IF NOT EXISTS employees (
      employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      job_title TEXT,
      salary DECIMAL(10,2),
      department_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS customers (
      customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT,
      contact_name TEXT,
      email TEXT,
      city TEXT,
      country TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT,
      category TEXT,
      unit_price DECIMAL(10,2),
      stock_quantity INTEGER
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      employee_id INTEGER,
      order_date TEXT,
      status TEXT,
      total_amount DECIMAL(10,2)
    );
  `);

  // Optional seed data
  await db.exec(`
    INSERT OR IGNORE INTO departments (department_id, department_name, budget)
    VALUES
      (1, 'Sales', 500000),
      (2, 'IT', 400000),
      (3, 'Marketing', 300000);

    INSERT OR IGNORE INTO employees (employee_id, first_name, last_name, email, job_title, salary, department_id)
    VALUES
      (1, 'John', 'Smith', 'john@company.com', 'Manager', 75000, 1),
      (2, 'Sarah', 'Johnson', 'sarah@company.com', 'Developer', 65000, 2),
      (3, 'Emily', 'Davis', 'emily@company.com', 'Sales Rep', 55000, 1);
  `);
}

export async function dbQuery(sql) {
  if (!db) await initDB();
  try {
    console.log("🧠 Executing SQL:", sql);
    const result = await db.all(sql);
    return result;
  } catch (err) {
    console.error("❌ SQLite Query Error:", err.message);
    return { error: err.message };
  }
}
