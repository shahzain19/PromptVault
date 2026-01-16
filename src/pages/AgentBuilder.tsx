import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    type Edge,
    type Node,
    Panel,
    Handle,
    Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
    Save, Play, Sparkles, Zap, Send, Globe,
    Share2, Copy, Check, Github, Code, GitMerge,
    Link as LinkIcon, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrompts } from '../features/prompts/PromptContext';

// Custom Node Components for a "Smooth" and Premium Look
const BaseNode = ({ data, selected, children, icon: Icon, color }: any) => (
    <div className={`p-5 rounded-[24px] border-2 transition-all duration-300 min-w-[220px] shadow-2xl ${selected ? 'border-black scale-105' : 'border-gray-100 bg-white'}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color || 'bg-black text-white'}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 leading-none mb-1">{data.type}</p>
                <p className="text-sm font-bold tracking-tight leading-none">{data.label}</p>
            </div>
        </div>
        {children}
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-black border-2 border-white" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-black border-2 border-white" />
    </div>
);

const nodeTypes = {
    trigger: (props: any) => <BaseNode {...props} icon={Zap} color="bg-yellow-400 text-black" />,
    prompt: (props: any) => <BaseNode {...props} icon={Sparkles} color="bg-purple-500 text-white" />,
    github: (props: any) => <BaseNode {...props} icon={Github} color="bg-gray-900 text-white" />,
    logic: (props: any) => <BaseNode {...props} icon={GitMerge} color="bg-orange-500 text-white" />,
    webhook: (props: any) => <BaseNode {...props} icon={LinkIcon} color="bg-blue-500 text-white" />,
    action: (props: any) => <BaseNode {...props} icon={Send} color="bg-green-500 text-white" />,
    tool: (props: any) => <BaseNode {...props} icon={Terminal} color="bg-red-500 text-white" />,
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'GitHub Webhook', type: 'trigger' },
    },
    {
        id: '2',
        type: 'prompt',
        position: { x: 400, y: 150 },
        data: { label: 'Code Analyzer', type: 'prompt' },
    }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#000', strokeWidth: 2 } }
];

export default function AgentBuilder() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { addAgent } = usePrompts();
    const [agentName, setAgentName] = useState("AI Coding Agent");
    const [isSaving, setIsSaving] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [showDeployPanel, setShowDeployPanel] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const pendingImport = localStorage.getItem('pending_agent_import');
        if (pendingImport) {
            try {
                const data = JSON.parse(pendingImport);
                if (data.nodes && data.edges) {
                    setNodes(data.nodes);
                    setEdges(data.edges);
                    setAgentName("AI Generated Agent");
                    localStorage.removeItem('pending_agent_import');
                }
            } catch (err) {
                console.error("Failed to import agent:", err);
            }
        }
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#000', strokeWidth: 2 } }, eds)),
        [setEdges]
    );

    const addNewNode = (type: keyof typeof nodeTypes, label: string) => {
        const id = Date.now().toString();
        const newNode: Node = {
            id,
            type,
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            data: { label, type },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await addAgent(agentName, "", { nodes, edges }, isPublic);
            alert("Agent saved successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const copyDeployLink = () => {
        const link = `${window.location.origin}/a/deployed-agent-id`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <div className="flex-1 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        snapToGrid
                        snapGrid={[20, 20]}
                        fitView
                        className="bg-gray-50/50"
                    >
                        <Background color="#ccc" gap={20} size={1} />
                        <Controls className="!bg-white !border-gray-100 !rounded-2xl !shadow-xl" />
                        <MiniMap
                            nodeStrokeColor={() => '#000'}
                            nodeColor={(n: any) => n.selected ? '#000' : '#fff'}
                            className="!bg-white/80 !backdrop-blur-xl !border-gray-100 !rounded-3xl !shadow-2xl"
                        />

                        <Panel position="top-left" className="m-6 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/80 backdrop-blur-xl border border-gray-100 p-8 rounded-[40px] shadow-2xl shadow-black/5 min-w-[340px]"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl">
                                        <Code size={24} />
                                    </div>
                                    <div>
                                        <input
                                            value={agentName}
                                            onChange={(e) => setAgentName(e.target.value)}
                                            className="text-xl font-bold tracking-tighter bg-transparent border-none outline-none focus:ring-0 w-full"
                                        />
                                        <div className="flex items-center gap-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Agent Architect</p>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">v3.0 Elite</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-4">Node Library</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => addNewNode('trigger', 'New Trigger')} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-2xl text-xs font-bold group">
                                                <Zap size={14} className="text-yellow-500 group-hover:scale-125 transition-transform" /> Trigger
                                            </button>
                                            <button onClick={() => addNewNode('logic', 'New Logic')} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-2xl text-xs font-bold group">
                                                <GitMerge size={14} className="text-orange-500 group-hover:scale-125 transition-transform" /> Logic
                                            </button>
                                            <button onClick={() => addNewNode('prompt', 'AI Thought')} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-2xl text-xs font-bold group">
                                                <Sparkles size={14} className="text-purple-500 group-hover:scale-125 transition-transform" /> AI Node
                                            </button>
                                            <button onClick={() => addNewNode('github', 'Repo Action')} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-2xl text-xs font-bold group">
                                                <Github size={14} className="group-hover:scale-125 transition-transform" /> GitHub
                                            </button>
                                            <button onClick={() => addNewNode('webhook', 'API Hook')} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-2xl text-xs font-bold group">
                                                <LinkIcon size={14} className="text-blue-500 group-hover:scale-125 transition-transform" /> Webhook
                                            </button>
                                            <button onClick={() => addNewNode('tool', 'Custom Tool')} className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-2xl text-xs font-bold group">
                                                <Terminal size={14} className="text-red-500 group-hover:scale-125 transition-transform" /> Plugin
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Quick Templates</p>
                                            <Sparkles size={12} className="text-purple-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    setNodes([
                                                        { id: 'c1', type: 'github', position: { x: 50, y: 100 }, data: { label: 'repo:main', type: 'github' } },
                                                        { id: 'c2', type: 'prompt', position: { x: 300, y: 100 }, data: { label: 'Review Code', type: 'prompt' } },
                                                        { id: 'c3', type: 'logic', position: { x: 550, y: 100 }, data: { label: 'Check Lint', type: 'logic' } },
                                                        { id: 'c4', type: 'github', position: { x: 800, y: 100 }, data: { label: 'Create PR', type: 'github' } }
                                                    ]);
                                                    setEdges([
                                                        { id: 'ec1-2', source: 'c1', target: 'c2', animated: true },
                                                        { id: 'ec2-3', source: 'c2', target: 'c3', animated: true },
                                                        { id: 'ec3-4', source: 'c3', target: 'c4', animated: true }
                                                    ]);
                                                    setAgentName("GitHub Reviewer");
                                                }}
                                                className="w-full text-left p-4 bg-black/5 hover:bg-black hover:text-white transition-all rounded-2xl text-[11px] font-bold uppercase tracking-tight flex items-center justify-between"
                                            >
                                                Coding Reviewer
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Panel>

                        <Panel position="top-right" className="m-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDeployPanel(!showDeployPanel)}
                                    className={`flex items-center gap-2 px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-xl ${showDeployPanel ? 'bg-black text-white' : 'bg-white border border-gray-100 hover:border-black'}`}
                                >
                                    <Globe size={14} /> Deployment
                                </button>
                                <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-full text-xs font-bold uppercase tracking-widest hover:border-black transition-all shadow-xl">
                                    <Play size={14} /> Test Node
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
                                >
                                    <Save size={14} /> {isSaving ? "Syncing..." : "Publish"}
                                </button>
                            </div>

                            <AnimatePresence>
                                {showDeployPanel && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="bg-white border border-gray-100 p-10 rounded-[48px] shadow-2xl shadow-black/10 min-w-[360px] space-y-8"
                                    >
                                        <div className="space-y-3">
                                            <h3 className="text-2xl font-black tracking-tighter">Go Live</h3>
                                            <p className="text-xs text-gray-400 font-medium tracking-tight leading-relaxed">Turn your logic into a public workspace for team collaboration.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px]">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isPublic ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                        <Globe size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold tracking-tight">Public Workspace</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isPublic ? 'Online' : 'Draft'}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setIsPublic(!isPublic)}
                                                    className={`w-14 h-8 rounded-full transition-all relative ${isPublic ? 'bg-green-500' : 'bg-gray-200'}`}
                                                >
                                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isPublic ? 'left-7' : 'left-1'}`} />
                                                </button>
                                            </div>

                                            {isPublic && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="space-y-4"
                                                >
                                                    <div className="p-6 bg-gray-50 rounded-[32px] space-y-3">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Live URL</p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs font-mono text-gray-400">vault.io/a/{Math.random().toString(36).substring(7)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            onClick={copyDeployLink}
                                                            className="flex items-center justify-center gap-3 p-4 bg-black text-white rounded-[24px] text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                                        >
                                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                                            Copy
                                                        </button>
                                                        <button className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-[24px] text-xs font-bold uppercase tracking-widest transition-all">
                                                            <Share2 size={14} /> Share
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Panel>
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}

const ChevronRight = ({ size, className }: any) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);
