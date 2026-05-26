import React from 'react';
import ProblemPanel from './ProblemPanel';
import ChatPanel from './ChatPanel';

const ContentPanel = ({ 
  activeTab, 
  setActiveTab, 
  messages, 
  isLoading, 
  sendMessage, 
  requestHint, 
  currentQuestion 
}) => {
  return (
    <div className="h-full flex flex-col bg-[#0f0f14] overflow-hidden animate-fade-in">
      {/* Tab Bar */}
      <div className="flex items-center px-4 h-10 bg-black border-b border-white/10 shrink-0">
        {[
          { id: 'problem', label: 'Problem' },
          { id: 'chat', label: 'AI Interviewer' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`h-full px-4 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-violet-400 text-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-400'
            }`}
          >
            {tab.label}
            {tab.id === 'chat' && messages.length > 0 && (
              <span className="ml-2 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block align-middle" />
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-emerald-500/70 uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Problem Content */}
      <div 
        className={`flex-1 overflow-hidden flex flex-col ${activeTab !== 'problem' ? 'hidden' : ''}`}
      >
        <ProblemPanel question={currentQuestion} />
      </div>

      {/* Chat Content */}
      <div 
        className={`flex-1 overflow-hidden flex flex-col ${activeTab !== 'chat' ? 'hidden' : ''}`}
      >
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onHint={requestHint}
        />
      </div>
    </div>
  );
};

export default ContentPanel;
