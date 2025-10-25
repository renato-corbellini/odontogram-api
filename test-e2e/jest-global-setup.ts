import { exec } from 'child_process';

module.exports = async () => {
  console.log('\nStarting PostgreSQL container...');
  await new Promise((resolve, reject) => {
    const dockerProcess = exec(
      'docker-compose up -d',
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve(stdout);
      },
    );

    dockerProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Docker Compose exited with code ${code}`));
      }
      resolve(code);
    });
  });

  // Wait for the database to be ready
  await new Promise((resolve) => setTimeout(resolve, 10000)); // Adjust the delay as needed
};
