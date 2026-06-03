const bcrypt = require('bcrypt');

async function run() {
  const admin = await bcrypt.hash('admin123', 10);
  const profe = await bcrypt.hash('profesor123', 10);
  const alumno = await bcrypt.hash('alumno123', 10);

  console.log("\n=== HASHES GENERADOS ===\n");

  console.log("ADMIN:");
  console.log(admin);

  console.log("\nPROFESOR:");
  console.log(profe);

  console.log("\nALUMNO:");
  console.log(alumno);
}

run();