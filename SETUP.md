# Agent Spec Builder - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- An Anthropic API key (get one at https://console.anthropic.com/)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` to configure your backend:

**Option A: Use Claude CLI (Recommended - No API Quota Usage)**
```
FOLLOWUP_BACKEND=cli
# ANTHROPIC_API_KEY not needed
```

**Option B: Use Anthropic API (Uses Your API Quota)**
```
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=your-api-key-here
```

The default is `cli` to preserve your API quota.

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
sox-agent-builder/
├── app/
│   ├── api/
│   │   ├── claude/
│   │   │   └── generate-followups/    # Claude API wrapper for follow-ups
│   │   ├── specs/                     # Spec CRUD endpoints
│   │   ├── validate/                  # Validation endpoint
│   │   └── export/                    # YAML/JSON export
│   ├── builder/                       # Main builder page
│   ├── components/                    # React components
│   │   └── hooks/                     # Custom hooks
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Home page
├── lib/
│   ├── types/                         # TypeScript types
│   ├── configurator.ts                # State machine
│   ├── prompt-builder.ts              # System prompt synthesis
│   ├── spec-builder.ts                # YAML/JSON spec generation
│   ├── validation.ts                  # Prompt-tool alignment checker
│   └── persistence.ts                 # Save/load specs
└── public/                            # Static assets
```

## Backend Configuration

The Agent Spec Builder supports two backends for generating intelligent follow-up questions:

### Claude CLI Backend (Default - Recommended)
- **What it is**: Uses the local Claude Code CLI (`claude` command)
- **API Quota**: ✅ **No impact** on your Anthropic API quota
- **Setup**: Just ensure the `claude` CLI is available in your PATH
- **Fallback**: If Claude CLI unavailable, automatically uses template-based questions
- **Best for**: Local development, preserving API quota

```bash
FOLLOWUP_BACKEND=cli
```

### Anthropic API Backend
- **What it is**: Direct calls to the Anthropic API
- **API Quota**: ⚠️ **Uses** your Anthropic API quota
- **Setup**: Requires `ANTHROPIC_API_KEY` environment variable
- **Best for**: Production deployments, when CLI not available

```bash
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=your-api-key-here
```

### Switching Backends
Simply change `FOLLOWUP_BACKEND` in `.env.local` and restart the dev server. The app automatically uses the configured backend.

---

## How It Works

### 1. **Interactive Questions**
Users answer 6 initial questions about their agent:
- Purpose & Role
- Tasks & Responsibilities
- Tools & Integrations
- Rules & Constraints
- Workflow & Patterns
- Output Format

### 2. **AI-Guided Follow-ups**
After each answer, Claude generates 2-3 intelligent follow-up questions to refine the specification.

### 3. **Real-Time Preview**
As users answer, the system generates an XML-structured system prompt in real-time.

### 4. **Smart Validation**
The system validates that declared tools are actually mentioned in the prompt (prompt-tool alignment).

### 5. **Export Options**
Specs can be exported as:
- **YAML** (declarative, version-control friendly)
- **JSON** (for programmatic use)

## Key Features

### 🎯 XML-Structured Prompts
Prompts follow Anthropic best practices with semantic XML sections:
```xml
<role>...</role>
<tasks>...</tasks>
<tools>...</tools>
<rules>...</rules>
<reasoning>...</reasoning>
<output_format>...</output_format>
```

### 🤖 ReAct Pattern Support
Optional Thought→Action→Observation pattern for transparent reasoning.

### ✅ Prompt-Tool Alignment Validation
Ensures declared tools are actually explained and used in the prompt.

### 💾 Save & Load Specifications
Specs are saved to browser localStorage and can be loaded to continue editing.

### 📦 MCP-Compatible Tools
Tool definitions follow Model Context Protocol standard for vendor neutrality.

## Architecture Overview

### Frontend (React)
- **Configurator.tsx**: Question flow UI with answer input
- **Preview.tsx**: Real-time system prompt preview
- **SpecInspector.tsx**: YAML spec viewer
- **ValidationResults.tsx**: Quality score and improvement suggestions

### Backend (Next.js API Routes)
- **generate-followups**: Claude API integration for follow-up question generation
- **specs/**: CRUD operations for specifications
- **validate/**: Full validation report generation
- **export/**: YAML/JSON export endpoint

### Core Logic (lib/)
- **AgentConfigurator**: State machine managing conversation flow
- **PromptBuilder**: System prompt synthesis from answers
- **SpecBuilder**: YAML/JSON spec generation
- **PromptValidator**: Alignment checking and quality scoring
- **ClientPersistence**: Browser localStorage management

## API Endpoints

### Generate Follow-up Questions
```bash
POST /api/claude/generate-followups
Content-Type: application/json

{
  "topic": "purpose",
  "user_answer": "Customer support agent",
  "current_round": 0,
  "previous_answers": {}
}
```

### List Specifications
```bash
GET /api/specs
```

### Save Specification
```bash
POST /api/specs
Content-Type: application/json

{
  "name": "Customer Support Agent",
  "role": "...",
  ...
}
```

### Load Specification
```bash
GET /api/specs/[id]
```

### Update Specification
```bash
PUT /api/specs/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  ...
}
```

### Delete Specification
```bash
DELETE /api/specs/[id]
```

### Validate Specification
```bash
POST /api/validate
Content-Type: application/json

{
  "spec": {...},
  "system_prompt": "..."
}
```

### Export Specification
```bash
POST /api/export
Content-Type: application/json

{
  "spec": {...},
  "format": "yaml"  // or "json"
}
```

## Future Enhancements (v2+)

- **Team Building**: Define multi-agent teams with role specialization
- **Skill Libraries**: Reusable capabilities across agents
- **Workflow Orchestration**: Define how agents coordinate and hand off work
- **Version Control**: Track specification versions with performance metrics
- **Collaborative Editing**: Real-time multi-user editing
- **Pre-built Templates**: Domain-specific agent templates
- **CLI Interface**: Command-line agent builder
- **A/B Testing**: Staged rollout and comparison

## Troubleshooting

### "Claude API key not configured"
Make sure you've set `ANTHROPIC_API_KEY` in `.env.local`

### Prompts not generating
Check that Claude API key is valid and has sufficient quota.

### Build errors
Run `npm install` to ensure all dependencies are installed, then try `npm run build` again.

### Styles not loading
Make sure Tailwind CSS is properly configured. Check `app/globals.css` is imported in the layout.

## Development Tips

### Local Testing
1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Start Building"
4. Answer questions and see the prompt build in real-time

### Extending the Questions
Edit `lib/initial-questions.ts` to customize the initial questions or add more topics.

### Customizing Prompt Structure
Modify `lib/prompt-builder.ts` to change how system prompts are synthesized.

### Adding More Export Formats
Extend `lib/spec-builder.ts` with additional `to*` methods for new formats.

## Resources

- [Anthropic Documentation](https://docs.anthropic.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)

## License

MIT
