import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// Serve the local static files (index.html, app.js, style.css)
app.use(express.static(__dirname));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-week', async (req, res) => {
    try {
        const { context } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an elite running coach similar to Steve Magness. You generate optimal, scientifically sound running workouts.
You must return your response in strictly valid JSON format with the following exact keys:
{
  "tueWk": { "name": "...", "desc": "..." },
  "friWk": { "name": "...", "desc": "..." },
  "sunLr": { "name": "...", "desc": "..." }
}
- 'name' should be short but descriptive (e.g. 6x1000m @ 10k Pace).
- 'desc' should include the warmup, the specific execution details of the reps/pace/recovery, and the cooldown.
- 'tueWk' is the primary heavy workout.
- 'friWk' is the secondary lighter workout.
- 'sunLr' is the Sunday Long Run stimulus.`
                },
                {
                    role: "user",
                    content: `Generate the Tuesday, Friday, and Sunday workouts for this specific week context:\n${context}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        res.json(result);
    } catch (error) {
        console.error('Error with OpenAI:', error);
        res.status(500).json({ error: 'Failed to generate workouts' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('You can now open your browser to http://localhost:3000');
});
