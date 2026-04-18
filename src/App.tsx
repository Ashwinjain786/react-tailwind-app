import { useEffect, useId, useRef } from 'react';
import {
  Activity,
  BrainCircuit,
  Cpu,
  Database,
  Settings,
  User,
  type LucideIcon,
} from 'lucide-react';

type MermaidApi = {
  initialize: (config: unknown) => void;
  render: (id: string, definition: string) => Promise<{ svg: string }>;
};

declare global {
  interface Window {
    mermaid?: MermaidApi;
  }
}

const chartDefinition = String.raw`
%%{init: {"layout": "elk"}}%%
flowchart TD
  %% ---------------- USER LAYER ----------------
  A[User] --> B[Signup / Login]
  B --> C[Landing Page]

  C --> D1[Chatbot UI]
  C --> D2[Scheduler UI]
  C --> D3[Project Manager UI]
  C --> D4[Dashboard UI]

  %% ---------------- CHATBOT INTERACTION ----------------
  D1 --> E[Chatbot Controller]
  E --> F[AI Input Processing]

  %% ---------------- AI LAYER ----------------
  F --> G1[Intent Classification]
  F --> G2[Entity Extraction]
  G1 --> H[Decision Router]
  G2 --> H

  %% ---------------- ROUTING ----------------
  H -->|Scheduling Intent| I1[Scheduler Engine]
  H -->|Project Intent| I2[Project Manager Engine]
  H -->|General Insights| I3[Dashboard Engine]

  %% ---------------- SCHEDULER FLOW ----------------
  I1 --> J1[Schedule Optimization Logic]
  J1 --> J2[Conflict Detection]
  J2 --> J3[Auto Scheduling]

  J3 --> DB[(Central Database)]
  D2 -->|Manual Changes| I1
  I1 --> L1[Chatbot Response]

  %% ---------------- PROJECT MANAGER FLOW ----------------
  I2 --> M1[Task Breakdown]
  M1 --> M2[Dependency Mapping]
  M2 --> M3[Progress Tracking]

  M3 --> DB
  D3 -->|Manual Updates| I2
  I2 --> L1

  %% ---------------- DASHBOARD FLOW ----------------
  I3 --> N1[Analytics Engine]
  N1 --> N2[Performance Insights]
  N2 --> N3[Recommendations]

  N3 --> D4
  I3 --> L1

  %% ---------------- TASK EXECUTION LOOP ----------------
  D2 --> O[Task List / Checklist]
  D3 --> O
  O --> P{Task Completed?}
  P -->|Yes| Q[Update Progress]
  P -->|No| R[Reschedule Engine]

  Q --> DB
  R --> I1

  %% ---------------- FEEDBACK LOOP ----------------
  Q --> S[Feedback Collector]
  S --> T[Learning Engine]

  T --> I1
  T --> I2
  T --> I3

  %% ---------------- DATABASE ----------------
  DB --> E
  DB --> I1
  DB --> I2
  DB --> I3

  %% ---------------- CHATBOT OUTPUT ----------------
  L1 --> E
  E --> D1

  %% ---------------- STYLES ----------------
  classDef indigo stroke:#818cf8,fill:#eef2ff;
  classDef green stroke:#4ade80,fill:#f0fdf4;
  classDef orange stroke:#fb923c,fill:#fff7ed;
  classDef cyan stroke:#22d3ee,fill:#ecfeff;
  classDef teal stroke:#2dd4bf,fill:#f0fdfa;
  classDef violet stroke:#a78bfa,fill:#f5f3ff;
  class A,B,C,D1,D2,D3,D4 indigo;
  class E,F,G1,G2,H orange;
  class I1,I2,I3,J1,J2,J3,M1,M2,M3,N1,N2,N3 teal;
  class O,P,Q,R,S,T green;
  class DB violet;
  class L1 cyan;
`;

const legendItems = [
  { label: 'User layer', className: 'border-indigo-300 bg-indigo-50' },
  { label: 'AI processing', className: 'border-orange-300 bg-orange-50' },
  { label: 'Execution engines', className: 'border-teal-300 bg-teal-50' },
  { label: 'Task loop', className: 'border-emerald-300 bg-emerald-50' },
  { label: 'Central database', className: 'border-violet-300 bg-violet-50' },
  { label: 'Response channel', className: 'border-cyan-300 bg-cyan-50' },
] as const;

const overviewCards: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}> = [
  {
    title: 'User touchpoints',
    description:
      'Signup, landing, chatbot, scheduler, project manager, and dashboard experiences all sit in the same operating surface.',
    icon: User,
    accent: 'from-indigo-500/15 to-sky-500/10 border-indigo-200/80 text-indigo-700',
  },
  {
    title: 'AI control layer',
    description:
      'The chatbot controller handles incoming requests, then combines intent classification and entity extraction before routing work.',
    icon: BrainCircuit,
    accent: 'from-orange-500/15 to-amber-500/10 border-orange-200/80 text-orange-700',
  },
  {
    title: 'Specialized execution',
    description:
      'Scheduler, project manager, and dashboard engines each run domain-specific logic while still feeding a shared response channel.',
    icon: Settings,
    accent: 'from-teal-500/15 to-cyan-500/10 border-teal-200/80 text-teal-700',
  },
  {
    title: 'Learning feedback loop',
    description:
      'Task completion, feedback collection, and rescheduling continuously update the database and strengthen future recommendations.',
    icon: Activity,
    accent: 'from-emerald-500/15 to-lime-500/10 border-emerald-200/80 text-emerald-700',
  },
];

const flowSteps = [
  {
    step: '01',
    title: 'Enter the platform',
    description:
      'Users authenticate, arrive on the landing page, and branch into chatbot, scheduler, project manager, or dashboard views.',
  },
  {
    step: '02',
    title: 'Interpret the request',
    description:
      'The chatbot controller hands requests to AI input processing, which identifies intent and extracts the entities needed to act.',
  },
  {
    step: '03',
    title: 'Route to the right engine',
    description:
      'The decision router sends scheduling work to the scheduler engine, project work to the project manager, and insights to the dashboard engine.',
  },
  {
    step: '04',
    title: 'Execute and update',
    description:
      'Optimization, dependency mapping, analytics, manual updates, and checklist progress all push shared state into the central database.',
  },
  {
    step: '05',
    title: 'Learn and respond',
    description:
      'Feedback and completion data train the learning engine, while formatted chatbot responses loop back into the conversational interface.',
  },
];

const loadMermaid = async () => {
  if (window.mermaid) {
    return window.mermaid;
  }

  const existingScript = document.getElementById('mermaid-cdn');

  if (!existingScript) {
    const script = document.createElement('script');
    script.id = 'mermaid-cdn';
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    document.head.appendChild(script);
  }

  return await new Promise<MermaidApi>((resolve, reject) => {
    const handleLoad = () => {
      if (window.mermaid) {
        resolve(window.mermaid);
        return;
      }

      reject(new Error('Mermaid did not initialize correctly.'));
    };

    const handleError = () => reject(new Error('Failed to load Mermaid.'));
    const script = document.getElementById('mermaid-cdn');

    script?.addEventListener('load', handleLoad, { once: true });
    script?.addEventListener('error', handleError, { once: true });

    if (window.mermaid) {
      resolve(window.mermaid);
    }
  });
};

const MermaidDiagram = ({ chart }: { chart: string }) => {
  const chartId = useId().replace(/:/g, '-');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      try {
        const mermaid = await loadMermaid();

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            fontFamily: 'Aptos, Segoe UI Variable Text, Segoe UI, sans-serif',
            primaryTextColor: '#0f172a',
            lineColor: '#94a3b8',
            clusterBkg: '#ffffff',
            clusterBorder: '#dbe7f0',
          },
          flowchart: {
            curve: 'basis',
            padding: 24,
            useMaxWidth: false,
          },
        });

        const { svg } = await mermaid.render(`architecture-${chartId}`, chart);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid render error:', error);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML =
            '<p class="px-4 py-6 text-sm text-rose-700">Unable to render the architecture diagram.</p>';
        }
      }
    };

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, chartId]);

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram flex w-full justify-center overflow-x-auto text-sm"
    />
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_34%),linear-gradient(180deg,_#f8fbff_0%,_#f2f8f4_45%,_#eef6f2_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(99,102,241,0.07),_transparent_36%,_rgba(20,184,166,0.08)_100%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_320px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                <Cpu size={14} />
                AI Workflow Architecture
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Unified scheduler, project manager, and insights system flow
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                The architecture now follows your updated Mermaid model: users enter through a
                shared landing experience, the chatbot interprets intent, domain engines execute
                the work, and a central database plus feedback loop keeps every surface in sync.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  ELK layout for clearer routing
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  One shared central database
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  Continuous reschedule and learning loop
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-indigo-200/80 bg-gradient-to-br from-indigo-500/15 to-sky-500/10 p-5">
                <p className="text-sm font-medium text-slate-600">Primary interfaces</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">4</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Chatbot, scheduler, project manager, and dashboard views branch from the landing
                  page.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-teal-200/80 bg-gradient-to-br from-teal-500/15 to-cyan-500/10 p-5">
                <p className="text-sm font-medium text-slate-600">Execution engines</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">3</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Scheduler, project manager, and dashboard services handle routed work.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-500/15 to-lime-500/10 p-5">
                <p className="text-sm font-medium text-slate-600">Adaptive loop</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">24/7</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Progress, feedback, and rescheduling data continuously refine future decisions.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_320px]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  System map
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  End-to-end operational flow
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                The diagram below uses your updated routing, database, and feedback-loop structure
                so the application architecture matches the latest planning model.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(247,250,252,0.98))] p-3 sm:p-4">
              <MermaidDiagram chart={chartDefinition} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-950">Legend</h3>
              <div className="mt-4 space-y-3">
                {legendItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className={`h-4 w-4 rounded-full border ${item.className}`} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 text-violet-700">
                  <Database size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Design notes</h3>
                  <p className="text-sm text-slate-500">What changed in this version</p>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>The flow now centers on one shared database instead of multiple isolated stores.</li>
                <li>Manual changes from scheduler and project manager views feed directly back into their engines.</li>
                <li>The chatbot response loop is explicit, so conversational output stays connected to every engine.</li>
                <li>The learning engine improves scheduling, project planning, and dashboard insight generation together.</li>
              </ul>
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map(({ title, description, icon: Icon, accent }) => (
            <article
              key={title}
              className={`rounded-[1.75rem] border bg-gradient-to-br p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.35)] ${accent}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-current/10 bg-white/70">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Reading guide
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              How the platform behaves from request to recommendation
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              This sequence is useful when you want to narrate the architecture in a presentation
              or validate whether a new feature belongs in the chatbot, scheduler, project manager,
              dashboard, or learning loop.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {flowSteps.map(({ step, title, description }) => (
              <article
                key={step}
                className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Step {step}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
