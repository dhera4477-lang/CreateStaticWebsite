import Anthropic from '@anthropic-ai/sdk'

export interface AnalysisResult {
  score: number
  verdict: string
  verdictColor: 'green' | 'yellow' | 'red'
  tags: { label: string; status: 'ok' | 'warn' | 'fail' }[]
  lines: { text: string; status: 'correct' | 'warn' | 'error'; note?: string }[]
  summary: string
}

export async function analyzePoem(poem: string, apiKey: string): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 1024,
    system: `You are an expert in Tamil classical poetry (Yaappu / Chandas).
Analyze the given Tamil poem for its metrical structure (Yaappu).
Check for: Asai (syllable patterns), Seer (metrical feet), Thalai (foot-linking rules), and Adi (verse lines).
Return ONLY a valid JSON object with this exact shape:
{
  "score": <0-100 integer>,
  "verdict": "<one short phrase like 'Good Match!' or 'Needs Work' or 'Excellent!' or 'Poor Structure'>",
  "verdictColor": "<'green' if score>=75, 'yellow' if 50-74, 'red' if <50>",
  "tags": [
    { "label": "Asai ✓", "status": "ok" },
    { "label": "Seer ✓", "status": "ok" },
    { "label": "Thalai ⚠", "status": "warn" },
    { "label": "Adi ✓", "status": "ok" }
  ],
  "lines": [
    { "text": "<line text>", "status": "correct" },
    { "text": "<line text>", "status": "warn", "note": "<brief issue description>" }
  ],
  "summary": "<2-3 sentence explanation of the poem's metrical quality in English>"
}
Only return the JSON. No markdown, no explanation outside the JSON.`,
    messages: [{ role: 'user', content: poem }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? '{}'
  try {
    return JSON.parse(text) as AnalysisResult
  } catch {
    return {
      score: 0,
      verdict: 'Parse Error',
      verdictColor: 'red',
      tags: [],
      lines: [],
      summary: 'Could not parse the analysis result.',
    }
  }
}
