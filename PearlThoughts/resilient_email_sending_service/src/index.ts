import express from 'express';
import { EmailService } from './services/EmailService';

const app = express();
const PORT = process.env.PORT || 3000;
const emailService = new EmailService();

app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.send('Email Service is running!');
});

// Submit email request (enqueue)
app.post('/send-email', async (req, res) => {
  const { id, to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await emailService.enqueue({ id, to, subject, body });
    res.status(202).json(response); // 202 = Accepted for processing
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Check email status
app.get('/status/:id', (req, res) => {
  const status = emailService.getStatus(req.params.id);
  if (!status) {
    return res.status(404).json({ error: 'Email ID not found' });
  }
  res.json({ id: req.params.id, status });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
