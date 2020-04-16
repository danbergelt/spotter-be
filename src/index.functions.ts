import { Server } from 'http';

const { PORT, NODE_ENV } = process.env;

export default {
  logRejection: <T>(loggee: T): void => console.log(loggee),
  closeServer: (s: Server, p: NodeJS.Process): Server => s.close(() => p.exit(1)),
  success: (): void => console.log(`Port: ${PORT}\nMode: ${NODE_ENV}`)
};
