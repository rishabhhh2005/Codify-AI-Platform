import React from 'react';
import TabButton from './TabButton';
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
      <div className="flex items-center gap-0.5 px-3 h-[42px] bg-black/25 border-b border-white/[0.04] shrink-0 relative">
        <TabButton
          active={activeTab === 'problem'}
          onClick={() => setActiveTab('problem')}
          label="Problem"
          icon={(
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 1a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1v1a1 1 0 0 1-2 0V8H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 0 1 1-1zM4 7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1h1a1 1 0 0 0 0-2h-1V9a2 2 0 0 0-2-2H4z" />
            </svg>
          )}
        />

        <TabButton
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
          label="AI Interviewer"
          badge={messages.length > 0}
          icon={(
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414L1 15.414V4a2 2 0 0 1 1-1.732V2z" />
            </svg>
          )}
        />

        <div className="ml-auto flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-widest text-[#10b981]/80 uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981] animate-pulse" />
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
