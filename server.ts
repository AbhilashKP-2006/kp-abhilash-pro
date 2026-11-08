import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { SYSTEM_PROMPT, sanitizeUserMessage, checkRateLimit, AI_FALLBACK_RESPONSE } from './src/utils/chatHelpers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // In dev, let Vite handle client files, in prod serve static dist
  let vite: any = null;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
  }

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // AI Chat Route
  app.post('/api/chat', async (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'visitor';
    
    // Rate limit check: 20 per hour
    const rate = checkRateLimit(clientIp, 20);
    if (!rate.allowed) {
      res.status(429).json({
        error: 'Rate limit reached (20 messages per hour). Please try again later or email Abhilash directly at akp911187@gmail.com.',
      });
      return;
    }

    const { message, history } = req.body;
    const sanitized = sanitizeUserMessage(message);

    if (!sanitized.valid) {
      res.status(400).json({ error: sanitized.error || 'Invalid message.' });
      return;
    }

    // Build chat history (last 6 messages)
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      const recent = history.slice(-6);
      for (const item of recent) {
        if (item && item.text && (item.sender === 'user' || item.sender === 'assistant')) {
          formattedContents.push({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: String(item.text).slice(0, 500) }],
          });
        }
      }
    }

    // Add current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: sanitized.text }],
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Falling back to local offline responder.');
      // Offline fallback responder with intelligent rule matching
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const lower = sanitized.text.toLowerCase();
      let reply = AI_FALLBACK_RESPONSE;
      if (lower.includes('who') || lower.includes('about')) {
        reply = "Abhilash K P is a B.E. Computer Science and Engineering student at University College of Engineering, Nagercoil (UCEN), currently in Semester 3 with a CGPA of 8.1. He is passionate about software development, Generative AI, machine learning, and building student-focused solutions.";
      } else if (lower.includes('skill')) {
        reply = "Abhilash has solid fundamentals in C, C++, Java, and Python, with learning in Flutter/Dart and DSA. He has explored HTML/CSS/JS, works extensively with VS Code and Git/GitHub, and holds multiple AI and Generative AI certifications.";
      } else if (lower.includes('project')) {
        reply = "Abhilash's featured concepts include Studora (a student assistant concept for college announcements & deadlines), PathFinder (an integrated transport concept for multimodal travel in India), and FinGuard (a 48-hour hackathon concept exploring blockchain cross-border transactions). Note that these are concepts and research projects, not deployed apps.";
      } else if (lower.includes('hackathon') || lower.includes('achievement')) {
        reply = "Abhilash and team UCEN Innovators were Top 30 Finalists at the national 24-hour BYTEATHON 2026 at NICHE. He also participated in the 48-hour Smart Horizon 2026 International Hackathon in Bengaluru (FinGuard), Build With Bharat 2.0 at NIT Delhi (PPT round), and won 3rd prize in Bluff Royale at Ponjesly College.";
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
        reply = "You can contact Abhilash directly via email at akp911187@gmail.com, phone at +91 80150 43129, or connect on LinkedIn (linkedin.com/in/abhilashkp2006-).";
      }
      
      // Simulate streaming for offline mode
      for (const word of reply.split(' ')) {
        res.write(word + ' ');
        await new Promise((r) => setTimeout(r, 20));
      }
      res.end();
      return;
    }

    try {
      const ai = new GoogleGenAI();
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: 500,
          temperature: 0.3,
        },
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (err: any) {
      console.error('Error invoking Gemini API:', err?.message || err);
      if (!res.headersSent) {
        res.status(500).send(AI_FALLBACK_RESPONSE);
      } else {
        res.write(' ' + AI_FALLBACK_RESPONSE);
        res.end();
      }
    }
  });

  if (!isProd && vite) {
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
