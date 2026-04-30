import { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Loader2, Code2, ChevronUp, Terminal } from 'lucide-react';
import { LANGUAGES, LANGUAGE_STARTERS } from '@/lib/constants';
import CodeResultsPanel from './CodeResultsPanel';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAuth } from '@/context/AuthContext';
import { buildBoilerplateForQuestion } from '@/lib/boilerplate';

export default function CodeEditor({ code, onChange, language, hasRunCode, setHasRunCode, question, onSubmissionResult }) {
  const { token } = useAuth();
  const [results, setResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [lineCount, setLineCount] = useState(1);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const editorRef = useRef(null);
  const resultsPanelRef = useRef(null);

  const langConfig = LANGUAGES.find(l => l.id === language) || { id: 'javascript', monaco: 'javascript', ext: '.js' };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    // Disable syntax/semantic validation (red lines)
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    }

    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column
      });
    });

    editor.onDidChangeModelContent(() => {
      setLineCount(editor.getModel().getLineCount());
    });
  };

  const resetCode = () => {
    const boilerplate = buildBoilerplateForQuestion(question, language);
    onChange(boilerplate);
  };

  const runCode = async () => {
    setIsExecuting(true);
    setResults(null);
    setIsConsoleOpen(true);

    try {
      const testCases = useCustomInput 
        ? [{ input: customInput, output: '' }] 
        : (question?.examples || []);

      const resp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/code/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code,
          language,
          questionId: question?.id,
          testCases: testCases.slice(0, 2)
        }),
      });

      if (!resp.ok) throw new Error('Failed to execute code');

      const data = await resp.json();
      setResults(data);
      setHasRunCode(true); // Enable AI Review button
    } catch (e) {
      console.error(e);
      setResults({
        status: { id: 13, description: 'Internal Error' },
        stderr: e.message
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const submitSolution = async () => {
    setIsExecuting(true);
    setResults(null);
    setIsConsoleOpen(true);

    try {
      const testCases = question?.examples || [];
      const resp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/code/submit-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code,
          language,
          questionId: question?.id,
          testCases
        }),
      });

      if (!resp.ok) throw new Error('Failed to submit code');

      const data = await resp.json();
      setResults({
        isBatch: true,
        statusText: data.status,
        passed: data.passed,
        total: data.total,
        testResults: data.results,
        status: { id: data.status === "Accepted" ? 3 : 4 } // For badges fallback
      });
      setHasRunCode(true); 
      if (onSubmissionResult) {
        onSubmissionResult({
          passed: data.passed,
          total: data.total,
          isAccepted: data.status === "Accepted"
        });
      }
    } catch (e) {
      console.error(e);
      setResults({
        status: { id: 13, description: 'Internal Error' },
        stderr: e.message
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0d0d10] relative">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f12] border-b border-white/5 z-20">
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
          <Code2 className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
            {language}
          </span>
        </div>

        <button
          onClick={resetCode}
          className="p-1.5 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
          title="Reset code"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 ml-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={useCustomInput} 
              onChange={(e) => setUseCustomInput(e.target.checked)}
              className="w-3 h-3 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
            />
            <span className="text-[10px] font-bold text-neutral-500 group-hover:text-neutral-300 uppercase tracking-widest transition-colors">Custom Input</span>
          </label>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={isExecuting || !code.trim()}
            className="flex items-center gap-2 px-4 py-1.5 bg-neutral-800 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-neutral-700 transition-all disabled:opacity-30 group"
          >
            {isExecuting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            Run
          </button>

          <button
            onClick={submitSolution}
            disabled={isExecuting || !code.trim() || !question?.examples?.length}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 transition-all disabled:opacity-30"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-0 bg-[#0d0d0f]">
        <PanelGroup direction="vertical">
          <Panel defaultSize={70} minSize={20}>
            <div className="h-full relative overflow-hidden flex flex-col">
               {useCustomInput && (
                 <div className="px-4 py-3 bg-[#0f0f12] border-b border-white/5 animate-in slide-in-from-top-2 duration-200">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Testcase Input</span>
                    <textarea 
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. nums = [1,2,3], target = 5"
                      className="w-full h-20 bg-black/40 border border-white/5 rounded-lg p-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-emerald-500/30 transition-colors resize-none"
                    />
                 </div>
               )}
               <div className="flex-1">
                <Editor
                  height="100%"
                  language={langConfig.monaco || 'javascript'}
                  value={code}
                  onChange={val => onChange(val || '')}
                  onMount={handleEditorMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                    minimap: { enabled: false },
                    padding: { top: 20, bottom: 20 },
                    lineNumbers: 'on',
                    scrollbar: {
                      vertical: 'auto',
                      horizontal: 'auto'
                    },
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    renderLineHighlight: 'all',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    backgroundColor: '#0d0d10'
                  }}
                />
               </div>
            </div>
          </Panel>

          {isConsoleOpen && (
            <>
              <PanelResizeHandle className="h-1 bg-white/5 hover:bg-emerald-500/30 transition-colors cursor-row-resize" />
              <Panel defaultSize={30} minSize={10}>
                <CodeResultsPanel 
                  results={results} 
                  isLoading={isExecuting} 
                  onClose={() => setIsConsoleOpen(false)}
                />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Console Bottom Bar */}
      {!isConsoleOpen && (
        <div className="flex items-center px-4 py-1 bg-[#0d0d0f] border-t border-white/5">
           <button 
            onClick={() => setIsConsoleOpen(true)}
            className="flex items-center gap-2 py-1 px-3 text-neutral-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            Console
            <ChevronUp className="w-3 h-3 ml-1" />
          </button>
        </div>
      )}

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0d0d0f] border-t border-white/5 font-mono text-[10px] text-neutral-500 z-20">
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</span>
          <span>{lineCount} Lines</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{langConfig.monaco}</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
        </div>
      </div>
    </div>
  );
}

