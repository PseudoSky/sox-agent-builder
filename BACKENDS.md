# Backend Configuration Guide

The Agent Spec Builder supports **two backends** for generating intelligent follow-up questions. Choose based on your preferences:

## Quick Comparison

| Feature | Claude CLI | Anthropic API |
|---------|-----------|----------------|
| **API Quota** | ✅ No usage | ⚠️ Uses quota |
| **Setup** | Just works in Claude Code | Requires API key |
| **Cost** | Free (included) | Charged per call |
| **Availability** | Local/Claude Code env | Always available |
| **Speed** | Very fast | Fast |
| **Best for** | Local dev, quota preservation | Production, 24/7 availability |

---

## Configuration

### Set Up Environment

1. Copy the example config:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` to choose your backend:

**Using Claude CLI (Default):**
```bash
FOLLOWUP_BACKEND=cli
```

**Using Anthropic API:**
```bash
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=your-api-key-here
```

### Switching Backends

You can switch backends anytime by changing `FOLLOWUP_BACKEND` and restarting the dev server:

```bash
# Switch to API
export FOLLOWUP_BACKEND=api
npm run dev

# Switch back to CLI
export FOLLOWUP_BACKEND=cli
npm run dev
```

---

## Claude CLI Backend (Recommended for Development)

### How It Works
- Uses the local `claude` CLI command (available in Claude Code environment)
- Sends prompts to Claude via `child_process.exec()`
- **No impact** on your Anthropic API quota
- Automatic fallback to template questions if CLI unavailable

### Setup
Just ensure the `claude` CLI is in your PATH:
```bash
which claude  # Should show the CLI path
```

### Advantages
✅ **Zero API quota usage** - Preserve your monthly quota  
✅ **Always available** - Works even without API key  
✅ **Fast** - Local execution, minimal latency  
✅ **Perfect for development** - Experiment freely  
✅ **Fallback support** - Has template questions as backup  

### Limitations
❌ Not available outside Claude Code environment  
❌ Can't track usage (unlike API)  
❌ CLI must be in PATH  

### Fallback Behavior
If the Claude CLI is unavailable, the app automatically uses **template-based follow-up questions** tailored to each topic:

```
Purpose    → "What specific problems does this agent solve?"
Tasks      → "How often will users need each task?"
Tools      → "Do all tools need simultaneous availability?"
Rules      → "How should rule violations be handled?"
Workflow   → "How long should each task take?"
Output     → "Should reasoning be included in output?"
```

Users can still answer these questions and build their spec successfully.

---

## Anthropic API Backend

### How It Works
- Makes direct calls to the Anthropic API using your API key
- Generates completely custom follow-up questions
- Uses your monthly API quota
- Works anywhere with internet access

### Setup
1. Get API key from https://console.anthropic.com/
2. Add to `.env.local`:
```bash
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=sk-ant-v1-xxxxx
```

### Advantages
✅ **Custom questions** - Fully personalized to user's answer  
✅ **Always works** - No CLI dependency  
✅ **Production-ready** - Reliable for deployments  
✅ **Trackable** - Can monitor API usage/costs  

### Limitations
❌ **Uses API quota** - Consumes your monthly allowance  
❌ **Requires API key** - Can't use without credentials  
❌ **Has latency** - Network roundtrip to API  
❌ **Incurs cost** - Each call counts toward usage  

### Cost Estimation
- Average follow-up generation: ~200 tokens
- Cost per follow-up: ~$0.0006 USD (at Claude 3.5 Sonnet pricing)
- Cost per spec (3 topics × 3 questions): ~$0.005 USD

---

## Production Deployment Recommendations

### For Distributed/Cloud Deployments
Use the **API backend** since Claude CLI won't be available:
```bash
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=<your-key>
```

### For Claude Code/Local Deployments
Use the **CLI backend** to preserve quota:
```bash
FOLLOWUP_BACKEND=cli
```

### Hybrid Approach
If cost is a concern but you need reliability:
1. Default to `cli` for most users
2. Provide option to switch to `api` for better customization
3. Users can choose based on their quota situation

---

## Implementation Details

### Architecture
```
app/api/claude/generate-followups/
    ↓
FollowUpGeneratorFactory
    ↓
    ├─→ ClaudeCliFollowUpGenerator (FOLLOWUP_BACKEND=cli)
    │
    └─→ AnthropicFollowUpGenerator (FOLLOWUP_BACKEND=api)
```

### Key Classes

**FollowUpGeneratorFactory**
- Reads `FOLLOWUP_BACKEND` from environment
- Returns appropriate generator implementation
- Handles config validation

**ClaudeCliFollowUpGenerator**
- Implements `IFollowUpGenerator`
- Executes: `echo '<prompt>' | claude --no-stream`
- Parses output into numbered questions
- Falls back to templates on error

**AnthropicFollowUpGenerator**
- Implements `IFollowUpGenerator`
- Uses `@anthropic-ai/sdk` for API calls
- Model: `claude-opus-4-6`
- System + user message structure

### Error Handling
1. **CLI unavailable** → Fallback to template questions
2. **API key missing** → Error message with setup instructions
3. **API error** → Graceful failure with helpful message

---

## Troubleshooting

### "Claude CLI not found"
**Solution:** Ensure you're running in the Claude Code environment where `claude` CLI is available.

### "ANTHROPIC_API_KEY not configured"
**Solution:** Set `FOLLOWUP_BACKEND=cli` to use CLI instead, or add your API key if using API backend.

### Fallback questions appearing
**This is expected behavior!** It means:
- Claude CLI not available (if using `cli` backend)
- API key missing or API call failed (if using `api` backend)

The app gracefully falls back to template questions so users can still build their specs.

### Switching backends doesn't work
**Solution:** Restart the dev server:
```bash
npm run dev
# Ctrl+C to stop
# npm run dev  to start again
```

---

## Performance Notes

### Response Time
- **CLI**: ~1-3 seconds (local execution)
- **API**: ~2-5 seconds (network + processing)

### Token Usage
- **CLI**: No token counting (not tracked)
- **API**: ~200 tokens per follow-up (varies by question)

### Reliability
- **CLI**: High (local), but CLI must be available
- **API**: Very high (Anthropic infrastructure)

---

## Cost Analysis

### If Using API Backend

**Monthly quota:** Assume 10 specs per month

```
10 specs × 3 topics × 3 questions = 90 follow-up questions
90 questions × 200 tokens = 18,000 tokens
18,000 tokens × $0.000003/token (input) ≈ $0.054/month
```

Negligible cost for most users!

### If Using CLI Backend

**Cost:** $0 (included with Claude Code)

---

## Migration Guide

### From API to CLI
```bash
# 1. Edit .env.local
FOLLOWUP_BACKEND=cli
# Remove or leave ANTHROPIC_API_KEY (not needed)

# 2. Restart server
npm run dev
```

### From CLI to API
```bash
# 1. Get API key from https://console.anthropic.com/

# 2. Edit .env.local
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=sk-ant-v1-xxxxx

# 3. Restart server
npm run dev
```

---

## Future Enhancements

Possible backend additions:
- **Local LLM** (Ollama, LM Studio)
- **Other APIs** (OpenAI, Anthropic Managed Agents)
- **Hybrid mode** (CLI with API fallback)
- **Caching** (cache follow-ups for common topics)

---

**Summary:** Use `cli` backend to preserve API quota during development. Switch to `api` backend when CLI isn't available or for production deployments.
