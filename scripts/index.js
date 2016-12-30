const execSync = require('child_process').exec;

var log = console,
    commands = [{
		script: 'npm run lint',
		msg: `
	     _    _     _   _           
	    | |  (_)_ _| |_(_)_ _  __ _ 
	    | |__| | ' \\  _| | ' \\\/ _\` |
	    |____|_|_||_\\__|_|_||_\\__, |
	                           |___/ 
       `
	}, {
		script: 'npm run build',
		msg: `
	      ___                _ _ _           
	     / __|___ _ __  _ __(_) (_)_ _  __ _ 
	    | (__/ _ \\ '  \\| '_ \\ | | | ' \\\/ _\` |
	     \\___\\___/_|_|_| .__/_|_|_|_||_\\__, |
	                   |_|             |___/ 
       `
	}, {
		script: 'npm run jsunit',
		msg: `

         _   _       _ _     _____         _   _             
        | | | |_ __ (_) |_  |_   _|__  ___| |_(_)_ __   __ _ 
        | | | | '_ \\| | __|   | |/ _ \\/ __| __| | '_ \\ / _\` |
        | |_| | | | | | |_    | |  __/\\__ \\ |_| | | | | (_| |
         \\___/|_| |_|_|\\__|   |_|\\___||___/\\__|_|_| |_|\\__, |
                                                |___/ 
		`
	}];

log = log.log;

function runTests (index) {
	var command = commands[index];
    log(command.msg);
    execSync(command.script, (error, stdout) => {
        if (error) {
            log(`exec error: ${error} ${stdout}`);
            return;
        } else {
	        log(`SUCCESS: ${command.script} \n ${stdout}\n`);
	        if (++index < commands.length) {
		        runTests(index);
	        }
        }
    });
}

runTests(0);
