# 🤖 Agent Spec Builder

Interactive, AI-guided tool for building agent specifications. Get intelligent follow-up questions, real-time system prompt synthesis, and automatic validation—all while preserving your API quota.

**[📖 Setup Guide](./SETUP.md) · [🔧 Backend Configuration](./BACKENDS.md) · [📦 Feature Overview](#features)**

---

## 🤔 Why This Tool?

### The Problem
Building effective AI agent specs is **hard**:
- ❌ Manual YAML/JSON editing is tedious and error-prone
- ❌ Prompt engineering requires deep expertise
- ❌ Tools either lock you into one framework OR require extensive coding
- ❌ Declared tools often end up unused (wasted potential)
- ❌ Testing specs before deployment is time-consuming

### The Solution
Agent Spec Builder guides you through a **conversation**, asking intelligent follow-up questions that:
- ✅ Help you clarify what you actually want
- ✅ Catch gaps in your specification
- ✅ Generate production-ready system prompts automatically
- ✅ Validate that tools will actually be used
- ✅ Export to any framework (YAML/JSON)

**Result:** Better specs, faster. Without burning API quota.

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

## ⚡ Get Started in 30 Seconds

```bash
# 1. Clone and install
git clone https://github.com/pseudosky/sox-agent-builder.git
cd sox-agent-builder
npm install

# 2. Configure (pick one)
# Option A: Use Claude CLI (recommended - no quota impact)
echo "FOLLOWUP_BACKEND=cli" > .env.local

# Option B: Use Anthropic API (requires API key)
echo "FOLLOWUP_BACKEND=api" > .env.local
echo "ANTHROPIC_API_KEY=sk-ant-v1-xxxxx" >> .env.local

# 3. Run
npm run dev

# 4. Open http://localhost:3000 and click "Start Building"
```

**That's it!** Answer 6 questions, get a production-ready agent spec.

---

## 🚀 Full Setup Guide

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

## 📋 Example Output

Here's what a generated agent spec looks like (YAML format):

```yaml
name: Customer Support Agent
description: AI-powered customer support specialist with ticket management and knowledge base access
version: 1.0.0
role: Customer Support Specialist
purpose: Handle customer inquiries, troubleshoot issues, and resolve support tickets efficiently
expertise_domains:
  - Customer Service
  - Technical Support
  - Troubleshooting

primary_tasks:
  - Answer customer questions based on knowledge base
  - Create and manage support tickets
  - Escalate complex issues to human agents
  - Follow up on resolved tickets

success_criteria:
  - First-contact resolution rate > 70%
  - Average response time < 5 minutes
  - Customer satisfaction score > 4.5/5

tools:
  - name: search_knowledge_base
    description: Search internal knowledge base for solutions
    when_to_use: When customer asks about features, troubleshooting, or common issues
    example: "search_knowledge_base('how to reset password')"
  
  - name: create_ticket
    description: Create a new support ticket
    when_to_use: When issue cannot be resolved immediately
    example: "create_ticket('Billing issue', priority='high')"
  
  - name: escalate
    description: Escalate to human support agent
    when_to_use: Complex issues, billing problems, or dissatisfied customers

hard_rules:
  - Never promise refunds without manager approval
  - Always maintain professional tone
  - Respect customer privacy - never share account details
  - Maximum 3 troubleshooting steps before escalation

soft_guidelines:
  - Use empathy in responses
  - Acknowledge customer frustration
  - Provide clear next steps
  - Offer alternatives when solutions unavailable

safety_boundaries:
  - Do not access customer payment information directly
  - Never bypass security protocols
  - Do not make commitments outside your authority

workflow_pattern: sequential
reasoning_pattern: react
output_format: Structured response with acknowledgment, solution/next steps, and follow-up actions
```

### System Prompt (Generated)
```xml
<role>
You are a Customer Support Specialist designed to handle customer inquiries, troubleshoot issues, and resolve support tickets efficiently.
Your expertise is in: Customer Service, Technical Support, Troubleshooting.
</role>

<tasks>
Your primary responsibilities are:
1. Answer customer questions based on knowledge base
2. Create and manage support tickets
3. Escalate complex issues to human agents
4. Follow up on resolved tickets

Success criteria:
- First-contact resolution rate > 70%
- Average response time < 5 minutes
- Customer satisfaction score > 4.5/5
</tasks>

<tools>
Available tools:

**search_knowledge_base**
Description: Search internal knowledge base for solutions
When to use: When customer asks about features, troubleshooting, or common issues
Example: search_knowledge_base('how to reset password')

**create_ticket**
Description: Create a new support ticket
When to use: When issue cannot be resolved immediately
Example: create_ticket('Billing issue', priority='high')

**escalate**
Description: Escalate to human support agent
When to use: Complex issues, billing problems, or dissatisfied customers
</tools>

<rules>
CRITICAL RULES (you MUST follow these):
1. Never promise refunds without manager approval
2. Always maintain professional tone
3. Respect customer privacy - never share account details
4. Maximum 3 troubleshooting steps before escalation

GUIDELINES (best practices):
- Use empathy in responses
- Acknowledge customer frustration
- Provide clear next steps
- Offer alternatives when solutions unavailable

SAFETY BOUNDARIES:
⚠️  Do not access customer payment information directly
⚠️  Never bypass security protocols
⚠️  Do not make commitments outside your authority
</rules>

<reasoning>
For complex tasks, use this reasoning pattern:

<thought>
Analyze the customer's problem and identify which tools or knowledge base searches are needed.
</thought>

<action>
If needed, invoke a tool or search the knowledge base. Include all required parameters.
</action>

<observation>
Analyze the result. Does it help resolve the customer's issue? Do you need additional information or actions?
</observation>

Repeat this cycle until you can provide a complete, helpful response.
</reasoning>

<output_format>
Always structure your responses as:
Structured response with acknowledgment, solution/next steps, and follow-up actions
</output_format>
```

This is what the tool generates automatically from your answers. You can then:
- 💾 Save it for later editing
- 📥 Export as YAML (version control friendly)
- 📤 Export as JSON (for APIs)
- ✅ Validate tool alignment
- 🔄 Iterate and refine

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

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature: `git checkout -b feature/my-feature`
3. **Make your changes** with clear commits
4. **Test** locally: `npm run dev` and `npm run build`
5. **Submit a PR** with a description of your changes

### Development Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npm run build

# Format code (if using Prettier)
npm run format
```

### Areas We're Looking For Help

- **Backend Improvements**: Add new backends (local LLMs, other APIs)
- **UI/UX**: Enhance the web interface, add visualizations
- **Documentation**: Improve guides, add tutorials, create video content
- **Features**: 
  - Pre-built agent templates
  - Integration with popular frameworks
  - Multi-agent team building
  - Version control with metrics
- **Testing**: Add unit and E2E tests
- **Performance**: Optimize spec generation

### Bug Reports
Found a bug? Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Environment (Node version, OS, etc.)

### Feature Requests
Have an idea? Open an issue describing:
- The problem you're solving
- Your proposed solution
- Why it would benefit users

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

**Built with:**
- **Next.js 14** - React framework with App Router
- **Anthropic Claude API** - AI-powered follow-ups and synthesis
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Modern, responsive styling
- **js-yaml** - YAML parsing and generation

**Inspired by:**
- **Anthropic's Prompt Engineering Guide** - XML-structured prompts and best practices
- **CrewAI** - Declarative YAML-first agent definitions
- **Model Context Protocol (MCP)** - Vendor-neutral tool integration standards
- **ReAct Pattern** - Transparent reasoning (Thought→Action→Observation)
- **LangSmith Agent Builder** - Interactive guidance for agent creation

**Philosophy:**
This tool embodies the belief that building AI agents should be:
- **Accessible** - No deep ML expertise required
- **Interactive** - Guided conversations beat blank pages
- **Transparent** - Understand what your agent will do
- **Framework-agnostic** - Work with any platform
- **Quota-respectful** - Optional API usage, not mandatory

---

## 💬 Getting Help

### Resources
- **[Setup Guide](./SETUP.md)** - Installation and configuration
- **[Backend Guide](./BACKENDS.md)** - Choosing between CLI and API
- **[GitHub Issues](https://github.com/pseudosky/sox-agent-builder/issues)** - Report bugs or request features
- **[Discussions](https://github.com/pseudosky/sox-agent-builder/discussions)** - Ask questions and share ideas

### Quick Troubleshooting

**"Claude CLI not found"** → Make sure you're in Claude Code environment
**"API key error"** → Use `FOLLOWUP_BACKEND=cli` to avoid needing an API key
**"Build fails"** → Run `npm install` and check Node version (18+)

Still stuck? [Open an issue!](https://github.com/pseudosky/sox-agent-builder/issues/new)

---

## 🎯 Vision

Agent Spec Builder is the first step toward a future where:
- ✨ Anyone can design sophisticated AI agents
- 📦 Specs are reusable across frameworks and teams
- 🔄 Iterating on agents is as easy as editing YAML
- 🤝 Agents can be shared, versioned, and improved collaboratively
- 🌍 The barrier to entry for AI agent creation drops to zero

**Want to help build that future?** [Contribute!](#-contributing)

---

**[Ready to build your first agent spec? Start here →](http://localhost:3000)**

Made with ❤️ for the AI agent community.
