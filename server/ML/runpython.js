const { PythonShell } = require('python-shell');
const path = require('path');

async function pythonCall(userId, csvData) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',
      pythonOptions: ['-u'], // unbuffered stdout
    };

    const pyshell = new PythonShell(path.join(__dirname, 'matchmaker.py'), options);
    // Send data via stdin
    pyshell.send(JSON.stringify({ userId, csvData }));

    let output = '';

    // Collect messages from Python stdout
    pyshell.on('message', (message) => {
      output += message;
    });

    // Handle Python errors
    pyshell.on('stderr', (stderr) => {
      console.error('Python STDERR:', stderr);
    });

    // When Python finishes
    pyshell.end((err) => {
      if (err) return reject(err);
      try {
        resolve(JSON.parse(output));
      } catch (parseErr) {
        reject(parseErr);
      }
    });

    
  });
}

module.exports = { pythonCall };
