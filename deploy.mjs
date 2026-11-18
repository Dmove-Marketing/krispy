import { execSync } from "child_process";
import { createRequire } from "module";
import { getDeployDomain } from "./scripts/deploy-domain.mjs";

const require = createRequire(import.meta.url);
const config = require("./config.json");

const { user, server, remote_path } = config.deploy ?? {};

if (!server) {
  console.error('Deploy abortado: preencha "deploy.server" no config.json.');
  process.exit(1);
}

// Valida e normaliza o caminho (sem barra no fim, sempre /var/www/<dominio>)
const remote = `/var/www/${getDeployDomain(remote_path)}`;

const dest = `${user}@${server}:${remote}`;
console.log(`Enviando dist/ → ${dest}`);
execSync(`scp -r dist/* ${dest}`, { stdio: "inherit" });

// Fix permissions so nginx (www-data) can read all files
execSync(
  `ssh -o StrictHostKeyChecking=no ${user}@${server} "find ${remote} -type d -exec chmod 755 {} \\; && find ${remote} -type f -exec chmod 644 {} \\;"`,
  { stdio: "inherit" }
);
console.log("Permissões ajustadas.");
