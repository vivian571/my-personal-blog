# 🧠 MEMORY.md - Your Long-Term Memory

## Project: Digital Museum (以安的数字博物馆)

### Core UI/UX Evolution
- **Design Inspiration**: Shifted towards a high-contrast, professional asset management aesthetic, inspired by **Heyvhuang/ship-faster**.
- **The "USD Whitepaper" Protocol**: 
    - Implemented a layout style mimicking professional publications and whitepapers (`.whitepaper-layout`).
    - Focused on typography, strict grids, and a "formal yet modern" feel.
- **Color Palette & Theme**:
    - **Dark Mode ("Black Rainy Night")**: Deep background (`#050505`) with subtle borders and high-contrast text.
    - **Gold Accents**: Used `#D4AF37` for highlights, links, and specific status indicators to convey value and "museum-grade" quality.
    - **Light Mode ("Minimalist Gallery")**: Off-white background (`#FAFAFA`) with clean lines.
- **Key Design Decisions**:
    - **High-Contrast Professionalism**: Moving away from generic "blog" looks toward a curated, "sovereign" digital asset exhibition.
    - **Micro-interactions**: Added smooth cubic-bezier transitions for background, color, and transforms to enhance the premium feel.
    - **Dashboard Aesthetics**: Cards feature floating effects and gold-tinted hover states.

### Identity & Relationship
- **Name**: 零壹 (Ling Yi).
- **Owner**: 以安 (Yian).
- **Vibe**: Friendly, affectionate, and professional.

### Technical Stack
- **Framework**: Next.js 16 (App Router).
- **Styling**: Tailwind CSS + Shadcn UI (modified with custom variables).
- **Content**: Markdown-driven via `content/` and `posts/`.
- **Database / Auth**: Drizzle ORM + PostgreSQL + Better-Auth.

### Learnings & Development Experience (Ralph Loop Distillations)
- **Local Postgres**: If the remote Supabase project `ynaipebxobelevsswupi` is offline, start OrbStack and run a local PostgreSQL container: `docker run -d --name local-postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres postgres:16`.
- **Drizzle-kit Env Loading**: Drizzle Kit CLI doesn't read `.env.local` by default. Provide `DATABASE_URL` inline when running pushes: `DATABASE_URL="..." npx drizzle-kit push`.
- **Drizzle CLI command**: Use `npx drizzle-kit push` for version 0.31+.

---
*Last Updated: 2026-07-01*
