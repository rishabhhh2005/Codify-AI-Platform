import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const InterviewLayout = ({ leftPanel, rightPanel }) => {
  return (
    <div className="flex-1 flex min-h-0 overflow-hidden relative z-10">
      <PanelGroup direction="horizontal">
        {/* Left Pane */}
        <Panel defaultSize={44} minSize={30}>
          {leftPanel}
        </Panel>

        <PanelResizeHandle className="resize-handle-v">
          <div className="resize-pip" />
        </PanelResizeHandle>

        {/* Right Pane */}
        <Panel defaultSize={56} minSize={30}>
          {rightPanel}
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default InterviewLayout;
