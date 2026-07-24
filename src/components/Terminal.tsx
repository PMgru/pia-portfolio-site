'use client';
import { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Play } from 'lucide-react';

export default function Terminal() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [startSkills, setStartSkills] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const skillsData = [
    { name: 'SEO & SEM', val: 97 },
    { name: 'AI & Machine Learning', val: 92 },
    { name: 'Data Analytics', val: 95 },
    { name: 'Content Strategy', val: 90 },
    { name: 'Social Media Marketing', val: 88 },
    { name: 'Web Development', val: 85 }
  ];

  useEffect(() => {
    const lines = [
      ">> Searching for the smartest SEO strategies...",
      ">> Loading AI Growth Framework...",
      ">> Pial Mahmud initialized. Ready for deployment.",
      ">> Specializations: [SEO] [AI Marketing] [Growth Hacking] [Data Analytics] [Content Strategy]"
    ];

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Trigger terminal lines sequence
        let lineIdx = 0;
        const printLine = () => {
          if (lineIdx < lines.length) {
            setTerminalLines(prev => [...prev, lines[lineIdx]]);
            lineIdx++;
            setTimeout(printLine, 800);
          } else {
            // Trigger skills loading after terminal logs finish
            setTimeout(() => setStartSkills(true), 400);
          }
        };
        printLine();
        observer.disconnect(); // Print only once
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#121218] border-y border-[#B76E79]/10 relative">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-headings mb-4">
            Live AI Growth Terminal
          </h2>
          <p className="text-textSecondary dark:text-[#9A8F95] max-w-lg mx-auto">
            Dynamic processing and algorithmic capabilities mapping real-world business results.
          </p>
        </div>

        {/* Outer Console Shell */}
        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          
          {/* Terminal Console Block (7 Cols) */}
          <div className="md:col-span-7 rounded-2xl bg-[#0A0A0F] border border-[#B76E79]/20 shadow-2xl overflow-hidden flex flex-col min-h-[350px]">
            {/* Header bar */}
            <div className="bg-[#121218] px-4 py-3 flex items-center justify-between border-b border-[#B76E79]/10">
              <div className="flex items-center gap-2">
                <TermIcon className="w-4 h-4 text-[#B76E79]" />
                <span className="text-[#9A8F95] text-xs font-mono font-semibold">pial_mahmud_cli.sh</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F4C27F]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            {/* Console output body */}
            <div ref={terminalRef} className="p-6 flex-grow font-mono text-sm leading-relaxed text-[#F4F4F9] flex flex-col gap-4 overflow-y-auto">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Play className="w-3.5 h-3.5 fill-emerald-400" /> sh pial_mahmud.sh
              </div>

              {terminalLines.map((line, idx) => (
                <div key={idx} className={`${
                  line.startsWith('>> Specializations') 
                    ? 'text-[#F4C27F] font-semibold' 
                    : line.startsWith('>> Pial') 
                      ? 'text-[#B76E79]' 
                      : 'text-[#9A8F95]'
                }`}>
                  {line}
                </div>
              ))}

              {!startSkills && (
                <div className="flex items-center gap-1.5 text-[#B76E79]">
                  <span className="animate-pulse">_</span>
                </div>
              )}

              {startSkills && (
                <div className="text-emerald-500 font-bold mt-2 animate-bounce">
                  ✔ Growth Framework fully loaded. Displaying competencies ...
                </div>
              )}
            </div>
          </div>

          {/* Skill Performance Bars (5 Cols) */}
          <div className="md:col-span-5 flex flex-col justify-center gap-6 p-6 rounded-2xl bg-white/[0.01] border border-[#B76E79]/10">
            <h3 className="text-lg font-bold font-headings text-[#F4F4F9] tracking-wide mb-2 uppercase border-l-2 border-[#B76E79] pl-3">
              Skill Allocations
            </h3>

            <div className="flex flex-col gap-4">
              {skillsData.map((sk, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-[#F4F4F9]">{sk.name}</span>
                    <span className="text-[#F4C27F]">{startSkills ? `${sk.val}%` : '0%'}</span>
                  </div>
                  
                  {/* Track line */}
                  <div className="h-2 w-full bg-white/[0.03] border border-[#B76E79]/15 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#B76E79] to-[#E63946] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: startSkills ? `${sk.val}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
