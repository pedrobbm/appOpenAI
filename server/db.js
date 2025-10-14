// server/db.js
export async function dbQuery(sql) {
  // Mock response — in production, run your real SQL here
  console.log("Executing:", sql);
  return [
    { region: "North", total_sales: 120000 },
    { region: "South", total_sales: 95000 },
    { region: "East", total_sales: 78000 },
  ];
}
