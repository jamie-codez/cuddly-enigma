import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

function getFiles(): string[] {
    const ROOT_DIR = process.cwd();
    const FILE_PATTERN = "**/*.{ts,tsx,js,jsx}"; // Broaden file patterns
    const IGNORE_PATTERN = ["**/node_modules/**", "**/dist/**", "env.collect.ts"];

    return glob.sync(FILE_PATTERN, {
        cwd: ROOT_DIR,
        ignore: IGNORE_PATTERN,
        nodir: true,
    });
}

function extractEnvVariables(content: string): Set<string> {
    const variables = new Set<string>();

    // Match process.env.VAR_NAME
    const processEnvRegex = /process\.env\.([A-Z0-9_]+)/g;
    let match: RegExpExecArray | null;
    while ((match = processEnvRegex.exec(content)) !== null) {
        variables.add(match[1]);
    }

    // Match ConfigService get and getOrThrow with optional type parameter
    const configServiceRegex = /\.(?:get|getOrThrow)(?:<[^>]+>)?\(["']([A-Z0-9_]+)["']\)/g;
    while ((match = configServiceRegex.exec(content)) !== null) {
        variables.add(match[1]);
    }

    return variables;
}

function getVariables() {
    const envExamplePath = path.join(__dirname, ".env.example");

    try {
        // Get all TypeScript files in src directory
        const files = getFiles();

        // Extract all environment variables
        const allVariables = new Set<string>();
        for (const file of files) {
            const content = fs.readFileSync(file, "utf-8");
            const vars = extractEnvVariables(content);
            vars.forEach(v => allVariables.add(v));
        }

        // Read existing .env.example variables
        const existingVariables = new Set<string>();
        if (fs.existsSync(envExamplePath)) {
            const content = fs.readFileSync(envExamplePath, "utf-8");
            content.split("\n").forEach(line => {
                const varName = line.split("=")[0].trim();
                if (varName) {
                    existingVariables.add(varName);
                }
            });
        }

        // Filter out existing variables
        const newVariables = Array.from(allVariables).filter(v => !existingVariables.has(v));

        // Append new variables to .env.example
        if (newVariables.length > 0) {
            const linesToAdd = newVariables.map(v => `${v}=`).join("\n") + "\n";
            fs.appendFileSync(envExamplePath, linesToAdd);
            console.log(`Added ${newVariables.length} new variables to .env.example`);
        } else {
            console.log("No new variables to add");
        }
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

getVariables();