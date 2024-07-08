import { spawn } from 'child_process';

// Set the PGPASSWORD environment variable
process.env.PGPASSWORD = 'admin';

// Command to execute
const command = 'psql';

export default (dbName) => {
    try {
        const args = [
            '-U',
            'postgres',
            '-d',
            `${dbName}`,
            '-f',
            'backup.sql'
        ];

        // Spawn the child process
        const child = spawn(command, args, { stdio: 'inherit' });

        // Handle process events
        child.on('error', (error) => {
            console.error(`Error executing command: ${error}`);
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log('Command executed successfully');
            } else {
                console.error(`Command failed with code ${code}`);
            }
        });

    } catch (error) {
        console.log(error)
        throw error
    }
}