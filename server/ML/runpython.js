const { PythonShell } = require('python-shell');
const path = require('path');

async function pythonCall(userId, csvData) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',
      pythonOptions: ['-u'], 
    };

    const pyshell = new PythonShell(path.join(__dirname, 'matchmaker.py'), options);
    pyshell.send(JSON.stringify({ userId, csvData }));

    let output = '';

    pyshell.on('message', (message) => {
      output += message;
    });

    pyshell.on('stderr', (stderr) => {
      console.error('Python STDERR:', stderr);
    });

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
