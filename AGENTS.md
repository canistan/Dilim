<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:security-rules -->
# SECURITY & SECRETS MANAGEMENT (CRITICAL)
NEVER hardcode any passwords, connection strings, API keys, or tokens in ANY script, source code file, or temporary scratchpad file (e.g. scripts/*.js, *.ts). 
ALWAYS use `process.env.VARIABLE_NAME` to access secrets. 
If a script needs to be run locally, instruct the user to source their `.env` file or use `dotenv`. 
If you must create a temporary file with a secret (which you shouldn't), you MUST create it inside the `<appDataDir>/brain/<conversation-id>/scratch/` directory, which is safely outside the project's git repository.
<!-- END:security-rules -->
