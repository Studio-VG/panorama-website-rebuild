# Advisor CRM

Internal lead desk for a financial advisory firm. An advisor adds and updates leads by hand. There is no public intake form, email, or external service.

Leads are stored in `user_data/leads.json`. The first time the server starts and that file is missing, it writes a handful of example leads so the list is not empty. Later edits stay in that file. Delete the file and restart to restore the examples.

## Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the production build locally:

```bash
npm run build
npm start
```

No environment variables are required.
