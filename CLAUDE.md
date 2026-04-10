# Claude Code Configuration

This file helps Claude Code (and future AI assistants) understand the project context and how to continue development.

## 📋 Project Overview

**Agent Spec Builder** - Interactive, AI-guided tool for building agent specifications with dual-backend support (Claude CLI and Anthropic API).

**Repository:** `pseudosky/sox-agent-builder`  
**Branch:** `claude/agent-spec-builder-sNPr4`  
**Status:** MVP Complete - Ready for enhancement and deployment

## 🚀 Quick Start for Continuation

### Environment Setup
```bash
# Install dependencies (already done)
npm install

# Set up environment - choose ONE:
# Option A: Claude CLI (no API quota)
FOLLOWUP_BACKEND=cli

# Option B: Anthropic API (uses quota)
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=your-key
```

### Running the Project
```bash
# Development
npm run dev          # Runs on http://localhost:3000

# Build
npm run build        # Full production build

# Type checking
npm run type-check   # Via Next.js
```

## 📁 Project Structure

```
lib/
├── types/                 # TypeScript types (agent, team, skill)
├── configurator.ts        # State machine for conversation flow
├── prompt-builder.ts      # System prompt synthesis (XML)
├── spec-builder.ts        # YAML/JSON generation
├── validation.ts          # Prompt-tool alignment checking
├── persistence.ts         # Save/load specs (localStorage)
├── initial-questions.ts   # 6 core questions + topic mapping
└── followup-generator.ts  # Dual-backend abstraction (NEW)

app/
├── api/
│   ├── claude/generate-followups/  # Claude integration (dual backend)
│   ├── specs/                       # Spec CRUD
│   ├── validate/                    # Validation
│   └── export/                      # YAML/JSON export
├── builder/page.tsx         # Main builder interface
├── components/              # React components
├── page.tsx                 # Home page
└── layout.tsx              # Root layout
```

## 🔧 Key Architectural Decisions

### Dual Backend System
- **FollowUpGeneratorFactory** - Abstraction layer choosing between backends
- **ClaudeCliFollowUpGenerator** - Uses `claude` CLI (no quota)
- **AnthropicFollowUpGenerator** - Uses API (uses quota)
- **Fallback** - Template questions if both unavailable

### Spec Format
- **Internal:** TypeScript types in `lib/types/agent.ts`
- **Storage:** YAML (primary), JSON (secondary)
- **Prompts:** XML-structured (Anthropic best practice)

### State Management
- **Frontend:** Custom `useConfigurator` hook
- **Backend:** `AgentConfigurator` class (state machine)
- **Persistence:** Browser localStorage for MVP

## 📚 Development Guidelines

### Adding Features
1. **New Questions:** Edit `lib/initial-questions.ts`
2. **Prompt Customization:** Edit `lib/prompt-builder.ts`
3. **Validation Rules:** Edit `lib/validation.ts`
4. **Export Formats:** Extend `lib/spec-builder.ts`
5. **UI Components:** Add to `app/components/`

### Tech Stack Notes
- **Next.js 16** - Latest with Turbopack, App Router
- **TypeScript** - Strict mode enabled
- **Tailwind CSS** - All styling
- **js-yaml** - YAML handling
- **@anthropic-ai/sdk** - Claude API

### Important Files
- `.env.local.example` - Configuration template
- `SETUP.md` - Detailed setup and usage
- `BACKENDS.md` - Backend comparison and config
- `README.md` - Public documentation
- Plan reference: `/root/.claude/plans/adaptive-sniffing-blossom.md`

## 🎯 Current Implementation Status

### Completed ✅
- [x] Interactive configurator with 6 questions
- [x] Dual-backend follow-up generation (CLI + API)
- [x] Real-time system prompt preview
- [x] XML-structured prompt synthesis
- [x] Prompt-tool alignment validation
- [x] YAML/JSON export
- [x] Save/load specifications
- [x] Home page and builder UI
- [x] Complete documentation

### TODO - Future Enhancements
- [ ] Screenshots/GIFs in README (would help adoption)
- [ ] Pre-built agent templates (customer support, research, etc.)
- [ ] Team building features (v2)
- [ ] Skill library/reusable capabilities (v2)
- [ ] Version control with metrics
- [ ] Collaborative editing
- [ ] CLI interface
- [ ] Database persistence (replace localStorage)
- [ ] Unit and E2E tests
- [ ] Performance optimizations

## 🐛 Known Limitations & Gotchas

1. **Persistence:** Currently localStorage-only (MVP)
   - Works great for single user
   - Data cleared on browser cache clear
   - Future: Add database (Supabase, MongoDB, etc.)

2. **Claude CLI Backend:**
   - Only works in Claude Code environment
   - Requires `claude` command in PATH
   - Fallback to template questions if unavailable

3. **API Backend:**
   - Requires valid `ANTHROPIC_API_KEY`
   - Uses quota (~$0.0006 per follow-up)
   - Test with CLI first, switch to API for production

4. **Build Environment:**
   - Requires Node 18+
   - Google Fonts removed from layout (network issues)
   - Turbopack used for fast builds

## 🔄 Git Workflow

**Current Branch:** `claude/agent-spec-builder-sNPr4`

### Making Changes
```bash
# Make changes to files
# Commit with descriptive message
git add -A
git commit -m "What you changed and why"

# Push to branch
git push origin claude/agent-spec-builder-sNPr4

# Include session link in commits:
# https://claude.ai/code/session_01EcnftbMnHvFqfjbfqyK9Xv
```

### Recommended Workflow
1. Work on feature branches
2. Test locally with `npm run dev`
3. Build with `npm run build` before committing
4. Commit with clear messages
5. Push to working branch (don't merge to main)

## 📖 Documentation Structure

- **README.md** - Public-facing overview with examples
- **SETUP.md** - Installation and configuration guide
- **BACKENDS.md** - Detailed backend comparison and config
- **CLAUDE.md** - This file (for AI assistants)

## 💡 Common Tasks

### Running the Dev Server
```bash
npm run dev
# Browser: http://localhost:3000
```

### Testing Follow-ups
1. Set `FOLLOWUP_BACKEND=cli` in `.env.local`
2. Run `npm run dev`
3. Go to `/builder`
4. Answer a question and watch follow-ups generate

### Switching Backends
```bash
# In .env.local, change:
FOLLOWUP_BACKEND=cli    # ← to this
# or
FOLLOWUP_BACKEND=api
ANTHROPIC_API_KEY=sk-ant-v1-xxxxx
```

### Building for Production
```bash
npm run build
npm run start
```

### Adding a New Feature
1. Create feature branch (if long-running)
2. Add code to appropriate files
3. Update types if needed
4. Test with `npm run dev`
5. Type check with `npm run build`
6. Commit and push

## 🤝 For Contributors

- Start with [SETUP.md](./SETUP.md) for local setup
- Check [README.md](./README.md) for feature overview
- Read [BACKENDS.md](./BACKENDS.md) to understand backends
- Look at existing code patterns (TypeScript, Tailwind classes, API routes)
- Open issues for bugs or feature requests
- See README.md Contributing section for guidelines

## 🚨 Important Reminders

1. **Always run `npm run build`** before committing - catches TypeScript errors
2. **Test with Claude CLI first** before switching to API (saves quota)
3. **Update docs** if changing user-facing behavior
4. **Keep commits focused** - one feature per commit
5. **Use descriptive commit messages** - helps track history

## 🎓 Learning Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)

---

**Last Updated:** Session starting from `/root/.claude/plans/adaptive-sniffing-blossom.md`  
**Status:** MVP Complete - Ready for enhancements  
**Next Focus:** Tests, templates, or team building features

Happy coding! 🚀
