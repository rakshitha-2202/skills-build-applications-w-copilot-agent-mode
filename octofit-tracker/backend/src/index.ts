import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8000;

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/octofit_db';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  const codespaceName = process.env.CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';

  res.json({
    status: 'ok',
    service: 'octofit-backend',
    baseUrl,
    mongo: mongoose.connection.readyState,
  });
});

async function startServer() {
  try {
    await mongoose.connect(mongoUri, { dbName: 'octofit_db' });
    console.log('Connected to MongoDB at port 27017');

    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend service:', error);
    process.exit(1);
  }
}

startServer();
