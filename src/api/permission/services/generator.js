
import { promises as fs } from "fs";
import { resolve, join, extname } from 'path';

/**
 * 
 * @returns {Array<{api:string,endpoint:string,method: string,handler: string}>}
 * 
 */
export default async () => {
    try {
        const readPermissions = async (filePath) => {
            try {
                const fullPath = resolve(filePath);
                const module = await import(`file:///${fullPath}`);
                // console.log(module.permissions)
                return module.permissions ? module.permissions : undefined;
            } catch (error) {
                console.error(`Error reading permissions from file ${filePath}: ${error.message}`);
                return null;
            }
        };

        const readApiPermissions = async (apiDirectory) => {
            let permissions;
            const files = await fs.readdir(apiDirectory);
            for (const file of files) {
                const filePath = join(apiDirectory, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile() && extname(file) === '.js') {
                    const filePermissions = await readPermissions(filePath);
                    if (filePermissions) {
                        permissions = filePermissions;
                    }
                }
            }
            return permissions;
        };

        const apiDirectory = resolve('./src/api');
        // console.log(2, apiDirectory);
        const apiFolders = await fs.readdir(apiDirectory);
        const allApiPermissions = await Promise.all(
            apiFolders.flatMap(apiFolder => readApiPermissions(join(apiDirectory, apiFolder, 'routes')))
        );

        let filteredArray = allApiPermissions.filter(item => item !== undefined).flatMap(apiArray => apiArray.map(apiObject => apiObject))
        return filteredArray

    } catch (error) {
        console.log(error);
        return { error };
    }
};