import { app } from './app';
import { config } from './config';
import { initDatabase } from './database';

async function main(): Promise<void> {
  await initDatabase();

  const server = app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  });
}

main().catch(console.error);
