const bcrypt = require('bcrypt');

async function run() {
  const passwords = [
    { email: 'ana.garcia@alumnos.uneatlantico.es', pass: 'ana123' },
    { email: 'carlos.martin@alumnos.uneatlantico.es', pass: 'carlos123' },
    { email: 'laura.sanchez@alumnos.uneatlantico.es', pass: 'laura123' },
    { email: 'alumno@davidario.edu', pass: 'alumno123' }
  ];

  console.log("\n=== HASHES ALUMNOS ===\n");

  for (const u of passwords) {
    const hash = await bcrypt.hash(u.pass, 10);

    console.log(u.email);
    console.log(u.pass);
    console.log(hash);
    console.log('');
  }
}

run();