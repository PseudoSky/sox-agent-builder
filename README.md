# 🤖 Agent Spec Builder

Interactive, AI-guided tool for building agent specifications. Get intelligent follow-up questions, real-time system prompt synthesis, and automatic validation—all while preserving your API quota.

**[📖 Setup Guide](./SETUP.md) · [🔧 Backend Configuration](./BACKENDS.md) · [📦 Feature Overview](#features)**

---

## ✨ Features

### 🎯 Interactive Configurator
- **6 Core Questions** about agent purpose, tasks, tools, rules, workflow, and output
- **Claude-Powered Follow-ups** that intelligently refine your specification
- **Real-Time Preview** of your system prompt as you answer

### 📝 XML-Structured Prompts
- Follows **Anthropic best practices** for system prompts
- Semantic sections: `<role>`, `<tasks>`, `<tools>`, `<rules>`, `<reasoning>`, `<output_format>`
- **ReAct pattern** support for transparent reasoning (Thought→Action→Observation)

### ✅ Prompt-Tool Alignment Validation
Ensures declared tools are actually mentioned and explained in your prompt:
- Quality scoring (0-100)
- Automatic issue detection
- Actionable improvement suggestions

### 💾 Flexible Export & Persistence
- **YAML export** (declarative, version-control friendly)
- **JSON export** (for programmatic use)
- **Browser localStorage** for saving specs
- **MCP-compatible** tool definitions

### 🚀 Dual Backend Support
- **Claude CLI** (default) - Uses your Claude Code subscription, **zero API quota usage**
- **Anthropic API** - Direct API calls, uses your quota

Choose the backend that fits your workflow!

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install & Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local to choose your backend:
# FOLLOWUP_BACKEND=cli    # Uses Claude CLI (default, no quota)
# FOLLOWUP_BACKEND=api    # Uses API (requires ANTHROPIC_API_KEY)
```

### 2. Run Development Server

```bash
npm run dev
# Visit http://localhost:3000
```

### 3. Start Building
1. Click "Start Building" on the home page
2. Answer 6 guided questions about your agent
3. Claude generates intelligent follow-ups (2-3 per topic)
4. Watch your system prompt build in real-time
5. Validate and export as YAML or JSON

---

## 🔧 Backend Configuration

**By default, the app uses the Claude CLI backend—no API quota usage required.**

### Claude CLI Backend (Recommended)
```bash
FOLLOWUP_BACKEND=cli
```
- ✅ No API quota impact
- ✅ Works in Claude Code environment
- ✅ Fallback to template questions if CLI unavailable

### Anthropic API Backend
```bash
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=sk-ant-v1-xxxxx
```
- ✅ Always works
- ⚠️ Uses your API quota (~$0.0006 per follow-up)

**[Full Backend Guide →](./BACKENDS.md)**

---

## 📁 Project Structure

```
sox-agent-builder/
├── app/
│   ├── api/                    # API routes
│   │   ├── claude/            # Follow-up generation (dual backend)
│   │   ├── specs/             # Spec CRUD
│   │   ├── validate/          # Validation endpoint
│   │   └── export/            # YAML/JSON export
│   ├── builder/               # Main builder interface
│   ├── components/            # React components
│   │   ├── Configurator.tsx   # Question flow
│   │   ├── Preview.tsx        # Live prompt preview
│   │   ├── SpecInspector.tsx  # YAML viewer
│   │   ├── ValidationResults.tsx
│   │   └── hooks/             # State management
│   ├── page.tsx               # Home page
│   └── layout.tsx             # Root layout
├── lib/
│   ├── types/                 # TypeScript types
│   ├── configurator.ts        # State machine
│   ├── prompt-builder.ts      # Prompt synthesis
│   ├── spec-builder.ts        # YAML/JSON generation
│   ├── validation.ts          # Alignment checking
│   ├── persistence.ts         # Save/load specs
│   └── followup-generator.ts  # Dual-backend abstraction
├── SETUP.md                   # Detailed setup guide
├── BACKENDS.md                # Backend configuration
└── README.md                  # This file
```

---

## 🎯 How It Works

### Step 1: Initial Questions
Answer 6 foundational questions about your agent:
1. **Purpose & Role** - What is this agent designed to do?
2. **Tasks & Responsibilities** - What are its primary functions?
3. **Tools & Integrations** - What external tools does it need?
4. **Rules & Constraints** - What rules must it follow?
5. **Workflow & Patterns** - How should it solve problems?
6. **Output Format** - How should it structure responses?

### Step 2: AI-Guided Follow-ups
For each answer, Claude generates 2-3 intelligent follow-up questions:
- Clarifies ambiguous answers
- Explores edge cases
- Refines technical requirements
- Helps define specs precisely

### Step 3: Real-Time Synthesis
Watch your system prompt build in real-time with XML-structured sections:
```xml
<role>...</role>
<tasks>...</tasks>
<tools>...</tools>
<rules>...</rules>
<reasoning>...</reasoning>
<output_format>...</output_format>
```

### Step 4: Validation & Export
Automatic validation ensures:
- ✅ All declared tools are mentioned in the prompt
- ✅ Prompt covers all essential sections
- ✅ Quality score and improvement suggestions

Export as YAML or JSON:
```bash
# YAML (recommended for version control)
agent-spec.yaml

# JSON (for programmatic use)
agent-spec.json
```

---

## 🏗️ Architecture

### Frontend (React)
- Interactive question flow with real-time updates
- Live system prompt preview
- Spec inspector (YAML/JSON viewer)
- Validation results dashboard

### Backend (Next.js API Routes)
- Dual-backend follow-up generation (CLI or API)
- Spec CRUD operations
- Validation endpoint
- Export endpoint

### Core Logic (TypeScript)
- **AgentConfigurator**: State machine managing conversation
- **PromptBuilder**: System prompt synthesis
- **SpecBuilder**: YAML/JSON generation
- **PromptValidator**: Quality checking
- **FollowUpGeneratorFactory**: Dual-backend abstraction

---

## 📊 Unique Differentiators

| Feature | Our Tool | LangSmith | CrewAI |
|---------|----------|-----------|--------|
| **Interactive Builder** | ✅ | ❌ | ❌ |
| **Prompt-Tool Validation** | ✅ | ❌ | ❌ |
| **Dual Backends** | ✅ | ❌ | ❌ |
| **Framework Agnostic** | ✅ | ❌ | ✅ |
| **YAML-First** | ✅ | ❌ | ✅ |
| **XML Prompts** | ✅ | ❌ | ❌ |

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
```bash
# Backend selection
FOLLOWUP_BACKEND=cli    # or 'api'

# Required only for API backend
ANTHROPIC_API_KEY=sk-ant-v1-xxxxx
```

---

## 🔮 Future Roadmap

### v2: Multi-Agent Teams
- Define team members with specialized roles
- Shared resources and knowledge bases
- Coordination protocols

### v3: Workflow Orchestration
- Agent interaction guidelines
- Hand-off protocols
- Decision-making workflows

### Additional Features
- Version control with performance metrics
- Collaborative real-time editing
- Pre-built domain-specific templates
- CLI interface
- A/B testing and staging

---

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Installation, configuration, running locally
- **[Backend Guide](./BACKENDS.md)** - Detailed backend comparison and configuration
- **[API Documentation](./SETUP.md#api-endpoints)** - API endpoint reference

---

## 🔧 Development

### Build
```bash
npm run build
```

### Type Check
```bash
npm run type-check  # Via Next.js
```

### Extending
- **Add Questions**: Edit `lib/initial-questions.ts`
- **Customize Prompts**: Edit `lib/prompt-builder.ts`
- **Add Exports**: Extend `lib/spec-builder.ts`
- **Custom Validation**: Modify `lib/validation.ts`

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

Built with:
- **Next.js 14** - React framework
- **Anthropic Claude API** - AI backend
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

Inspired by:
- Anthropic's prompt engineering best practices
- CrewAI's declarative approach
- Model Context Protocol (MCP) standards
- ReAct prompting pattern

---

**Questions?** Check the [Setup Guide](./SETUP.md) or [Backend Guide](./BACKENDS.md).

**Ready to build?** [Start creating agent specs →](http://localhost:3000)
