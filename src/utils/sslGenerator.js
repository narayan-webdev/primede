import { readFile, writeFile } from 'fs';
import { exec } from 'child_process';
import { join } from 'path';

// Configuration file path
const configFilePath = join(process.cwd(), "nginx.ssl.conf");

// Function to add a new subdomain
const addSubdomain = (subdomain) => {
    // Read the configuration file
    console.log(configFilePath)
    readFile(configFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the configuration file: ${err.message}`);
            return;
        }

        // Check if the subdomain already exists in the config
        if (data.includes(subdomain)) {
            console.log(`Subdomain ${subdomain} already exists in the configuration.`);
        } else {
            // Add the new subdomain to the server_name list
            const updatedData = data.replace(/server_name admin.*;/, match => `${match} ${subdomain}`);
            writeFile(configFilePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing to the configuration file: ${err.message}`);
                    return;
                }
                console.log(`Subdomain ${subdomain} added to configuration. Reloading Nginx.`);

                // Reload Nginx
                exec('sudo systemctl reload nginx', (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Error reloading Nginx: ${stderr}`);
                        return;
                    }
                    console.log(`Nginx reloaded successfully: ${stdout}`);
                });
            });
        }
    });
};

// Example usage: add a new subdomain
const newSubdomain = 'admin.newtenant.store.api.mtl.hangs.in';
export default {
    addSubdomain
}
// addSubdomain(newSubdomain);