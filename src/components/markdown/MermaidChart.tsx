'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidChartProps {
  chart: string;
}

export function MermaidChart({ chart }: MermaidChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        // Dynamically import mermaid only when needed
        const mermaid = (await import('mermaid')).default;
        
        // Always use light theme for mermaid diagrams
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1e293b',
            primaryBorderColor: '#cbd5e1',
            lineColor: '#64748b',
            secondaryColor: '#f1f5f9',
            tertiaryColor: '#e2e8f0',
            background: '#ffffff',
            mainBkgColor: '#f8fafc',
            secondBkgColor: '#f1f5f9',
            textColor: '#1e293b',
          },
        });

        const id = `mermaid-${Math.random().toString(36).substring(7)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setError(false);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-3 rounded-lg bg-red-50 p-6 text-center">
        <div className="text-red-600">
          Failed to render diagram
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-3 rounded-lg bg-slate-50 p-6 text-center">
        <div className="text-slate-600">
          Rendering diagram...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-3 flex justify-center overflow-x-auto rounded-lg bg-white p-6"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

