import { useEffect, useRef } from 'react';
import { User, BrainCircuit, Settings, Activity, Cpu } from 'lucide-react';

declare global {
  interface Window {
    mermaid: {
      initialize: (config: unknown) => void;
      render: (id: string, definition: string) => Promise<{ svg: string }>;
    };
  }
}

const chartDefinition = `
flowchart TD
    %% Styling Definitions
    classDef ui fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef ai fill:#fefce8,stroke:#eab308,stroke-width:2px,color:#713f12;
    classDef engine fill:#fdf4ff,stroke:#d946ef,stroke-width:2px,color:#701a75;
    classDef data fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d;
    classDef action fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;

    %% --- 1. USER LAYER ---
    subgraph UserLayer ["👤 User Experience Layer"]
        A((User)) --> B[Signup / Login]
        B --> C{Landing Page}
        C --> D1[Chatbot UI]
        C --> D2[Scheduler UI]
        C --> D3[Project Manager UI]
        C --> D4[Dashboard UI]
    end

    %% --- 2. AI CORE LAYER ---
    subgraph ChatbotCore ["💬 AI Controller & Routing"]
        D1 --> E[Chatbot Controller]
        E --> F[AI Input Processing]
        F --> G1[Intent Classification]
        F --> G2[Entity Extraction]
        G1 --> H{Decision Router}
        G2 --> H
    end

    %% --- 3. APPLICATION ENGINES ---
    subgraph AppEngines ["⚙️ Specialized Engines"]
        H -->|Scheduling| I1[Scheduler Engine]
        H -->|Projects| I2[Project Manager Engine]
        H -->|Insights| I3[Dashboard Engine]
    end

    %% --- 4. SPECIFIC FLOWS ---
    subgraph SchedulerLogic ["📅 Scheduler Logic"]
        I1 --> J1[Optimization Logic]
        J1 --> J2[Conflict Detection]
        J2 --> J3[Auto Scheduling]
        D2 -.->|Manual Edits| I1
    end

    subgraph ProjectLogic ["📊 Project Logic"]
        I2 --> M1[Task Breakdown]
        M1 --> M2[Dependency Mapping]
        M2 --> M3[Progress Tracking]
        D3 -.->|Manual Updates| I2
    end

    subgraph DashboardLogic ["📈 Analytics Flow"]
        I3 --> N1[Analytics Engine]
        N1 --> N2[Performance Insights]
        N2 --> N3[Recommendations]
        N3 --> D4
    end

    %% --- 5. EXECUTION LOOP ---
    subgraph Execution ["✅ Execution & Feedback Loop"]
        D2 --> O[Task List / Checklist]
        D3 --> O
        O --> P{Task Completed?}
        P -->|Yes| Q[Update Progress]
        P -->|No| R[Reschedule Engine]
        R --> I1
        Q --> S[Feedback Collector]
        S --> T[Learning Engine]
        T -.->|Improves Model| I1
        T -.->|Improves Model| I2
        T -.->|Improves Model| I3
    end

    %% --- 6. DATA LAYER ---
    subgraph Databases ["💾 Data Persistence"]
        J3 --> K1[(Scheduler DB)]
        M3 --> K2[(Project DB)]
        Q --> K1 & K2
        K1 & K2 --> DB[(Central Database)]
        DB -.-> E & I1 & I2 & I3
        K1 --> D2
        K2 --> D3
    end

    %% --- RETURNS ---
    I1 & I2 & I3 --> L1[Chatbot Response Formatting]
    L1 --> E

    %% Assign Styles to Nodes
    class A,B,C,D1,D2,D3,D4 ui;
    class E,F,G1,G2,H,T,L1 ai;
    class I1,I2,I3,J1,J2,J3,M1,M2,M3,N1,N2,N3,R engine;
    class K1,K2,DB data;
    class O,P,Q,S action;
`;

const MermaidDiagram = ({ chart }: { chart: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAndRender = async () => {
      if (!window.mermaid) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.8.0/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => renderChart();
        document.head.appendChild(script);
      } else {
        renderChart();
      }
    };

    const renderChart = async () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#ffffff',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#cbd5e1',
          lineColor: '#94a3b8',
          clusterBkg: '#f8fafc',
          clusterBorder: '#e2e8f0',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        },
        flowchart: {
          padding: 20,
        },
      });
      
      if (containerRef.current) {
        try {
          const { svg } = await window.mermaid.render('generated-mermaid-svg', chart);
          containerRef.current.innerHTML = svg;
        } catch (err) {
          console.error('Mermaid render error:', err);
        }
      }
    };

    loadAndRender();
  }, [chart]);

  return (
    <div ref={containerRef} className="m-0 overflow-x-auto w-full flex justify-center text-sm"></div>
  );
};

export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-blue-100">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Cpu size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Architecture Platform</h1>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          Interactive Documentation
        </div>
      </nav>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Platform Architecture</h2>
            <p className="mt-3 text-lg text-slate-500 leading-relaxed">
              A high-level view of how user requests flow through our AI routing system to specialized engines. Use the diagram below to understand component interactions.
            </p>
          </div>
          
          {/* Legend */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-sm text-sm shrink-0">
            <h3 className="font-bold text-slate-700 mb-3 uppercase tracking-wider text-xs">Color Legend</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-100 border-2 border-blue-500 shadow-sm"></span> 
                <span className="font-medium text-slate-600">User Interfaces</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-100 border-2 border-yellow-500 shadow-sm"></span> 
                <span className="font-medium text-slate-600">AI Processing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-fuchsia-100 border-2 border-fuchsia-500 shadow-sm"></span> 
                <span className="font-medium text-slate-600">Core Engines</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-green-100 border-2 border-green-500 shadow-sm"></span> 
                <span className="font-medium text-slate-600">Databases</span>
              </div>
            </div>
          </div>
        </header>

        {/* Diagram Section */}
        <main className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-8 mb-12 flex justify-center w-full overflow-hidden">
          <MermaidDiagram chart={chartDefinition} />
        </main>

        {/* Presentation Guide / Explanation Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            Component Breakdown
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 border border-blue-100 text-blue-600">
                <User size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">User Experience</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Users interact via dedicated UI modules (Chatbot, Scheduler, Project Manager). The chatbot serves as the primary conversational interface for natural language requests.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-5 border border-yellow-100 text-yellow-600">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Routing Core</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Inputs are parsed using Natural Language Processing. The AI extracts intents and entities to determine exactly which backend engine should handle the request.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mb-5 border border-fuchsia-100 text-fuchsia-600">
                <Settings size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Specialized Engines</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Once routed, the specific engine runs logic. For example, the Scheduler detects conflicts, while the Project manager maps dependencies and creates sub-tasks.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-5 border border-rose-100 text-rose-600">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Feedback Loop</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                As users complete (or fail to complete) tasks, data feeds into a Learning Engine. This loop constantly improves the AI's future scheduling and estimations.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}