import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProblemPanel({ question }) {
  if (!question) return <div className="p-8 font-mono text-sm text-neutral-500">Loading problem...</div>;

  return (
    <div className="flex-1 overflow-y-auto h-full px-8 py-8 bg-[#0a0a0c] text-neutral-300 scrollbar-hide">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">{question.title}</h1>
        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md uppercase tracking-wider ${
          question.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          question.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {question.difficulty}
        </span>
      </div>
      
      <div className="prose prose-invert prose-sm max-w-none 
          [&_p]:leading-relaxed [&_p]:mb-4
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:bg-white/10 [&_code]:text-neutral-200 [&_code]:font-mono [&_code]:text-[13px] [&_code]:before:content-none [&_code]:after:content-none
          [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-[#161618] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/5 [&_pre]:my-6 [&_pre]:shadow-inner
          [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words
          [&_strong]:text-white [&_strong]:font-semibold
          [&_h3]:text-sm [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-10 [&_h3]:mb-4
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-neutral-300 [&_li]:marker:text-neutral-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {question.problemStatement}
        </ReactMarkdown>
      </div>
    </div>
  );
}
