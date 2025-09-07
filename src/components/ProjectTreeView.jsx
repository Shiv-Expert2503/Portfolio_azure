// import React, { useMemo } from 'react';
// import ReactFlow, { MiniMap, Controls, Background, Position } from 'reactflow';
// import 'reactflow/dist/style.css';

// const ProjectTreeView = ({ data }) => {
//   const { initialNodes, initialEdges } = useMemo(() => {
//     if (!data || !data.root_node) return { initialNodes: [], initialEdges: [] };

//     const nodes = [
//       { 
//         id: 'root', 
//         position: { x: 350, y: 25 }, 
//         data: { label: data.root_node },
//         style: { background: '#2b77e7', color: 'white', border: '1px solid #555', fontSize: '16px', padding: '10px 20px', borderRadius: '8px' },
//         sourcePosition: Position.Bottom,
//       },
//       ...(data.child_nodes || []).map((node, index) => ({
//         id: `child-${index}`,
//         position: { x: index * 220, y: 150 },
//         data: { label: <div><strong>{node.title}:</strong><br/>{node.summary}</div> },
//         style: { background: '#1e1e1e', color: '#eee', border: '1px solid #444', width: 200, textAlign: 'center', padding: '8px', borderRadius: '8px' },
//         targetPosition: Position.Top,
//       }))
//     ];

//     const edges = (data.child_nodes || []).map((node, index) => ({
//         id: `edge-root-child-${index}`,
//         source: 'root',
//         target: `child-${index}`,
//         animated: true,
//         style: { stroke: '#555', strokeWidth: 2 }
//     }));

//     return { initialNodes: nodes, initialEdges: edges };
//   }, [data]);

//   if (initialNodes.length === 0) {
//     return <div className="text-red-400 p-4">Error: Invalid data received for tree view.</div>;
//   }

//   // --- THIS DIV IS NOW SIZED WITH TAILWIND ---
//   return (
//     <div className="h-full w-full rounded-lg">
//       <ReactFlow
//         nodes={initialNodes}
//         edges={initialEdges}
//         fitView
//       >
//         {/* <Controls style={{ button: { backgroundColor: '#1e1e1e', color: '#eee', border: '1px solid #444' } }} /> */}
//         {/* <MiniMap 
//             nodeColor={(n) => (n.id === 'root' ? '#2b77e7' : '#1a1a1a')}
//             nodeStrokeColor={'#333'}
//             style={{ backgroundColor: '#111', border: '1px solid #333' }} 
//         /> */}
//         <Background variant="dots" gap={12} size={1} />
//       </ReactFlow>
//     </div>
    
//   );
// };

// export default ProjectTreeView;


import React, { useMemo } from 'react';
import ReactFlow, { Background, Position } from 'reactflow'; // Removed MiniMap and Controls
import 'reactflow/dist/style.css';

const ProjectTreeView = ({ data }) => {
  console.log("ProjectTreeView received data:", data);

  const { initialNodes, initialEdges, followUpQuestion } = useMemo(() => {
    if (!data || !data.root_node) return { initialNodes: [], initialEdges: [], followUpQuestion: '' };

    const nodes = [
      { 
        id: 'root', 
        position: { x: 350, y: 25 }, 
        data: { label: data.root_node },
        style: { background: '#2b77e7', color: 'white', border: '1px solid #555', fontSize: '16px', padding: '10px 20px', borderRadius: '8px' },
        sourcePosition: Position.Bottom,
      },
      ...(data.child_nodes || []).map((node, index) => ({
        id: `child-${index}`,
        // Adjust position to make it more spread out if needed, or keep as is
        position: { x: index * 220 + (index * 10), y: 150 }, // Added a slight offset for better spacing
        data: { label: <div><strong>{node.title}:</strong><br/>{node.summary}</div> },
        style: { background: '#1e1e1e', color: '#eee', border: '1px solid #444', width: 200, textAlign: 'center', padding: '8px', borderRadius: '8px', minHeight: '80px' }, // Added minHeight for consistency
        targetPosition: Position.Top,
      }))
    ];

    const edges = (data.child_nodes || []).map((node, index) => ({
        id: `edge-root-child-${index}`,
        source: 'root',
        target: `child-${index}`,
        animated: true,
        style: { stroke: '#555', strokeWidth: 2 }
    }));

    return { 
        initialNodes: nodes, 
        initialEdges: edges, 
        followUpQuestion: data.follow_up_question || '' // Extract follow-up question
    };
  }, [data]);

  if (initialNodes.length === 0) {
    return <div className="text-red-400 p-4">Error: Invalid data received for tree view.</div>;
  }

  return (
    <div className="h-full w-full rounded-lg flex flex-col"> {/* Added flex-col for layout */}
      <div className="flex-grow"> {/* This will take up available space for ReactFlow */}
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          proOptions={{ hideAttribution: true }} 
          // --- No MiniMap or Controls components here anymore ---
        >
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* --- Display Follow-up Question Here --- */}
      {followUpQuestion && (
        <div className="mt-2 p-2 text-sm text-white/70 bg-white/5 rounded-b-lg">
          {followUpQuestion}
        </div>
      )}
    </div>
  );
};

export default ProjectTreeView;