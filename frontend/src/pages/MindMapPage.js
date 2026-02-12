import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { Brain, Zap, Lightbulb, Target, BookOpen, Cpu } from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const CustomNode = ({ data }) => {
  const isCenter = data.isCenter;
  const isSection = data.isSection;

  return (
    <div
      className={`
        px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer
        ${
          isCenter
            ? "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] border-transparent text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            : isSection
            ? "bg-[#0F0F0F] border-white/10 text-[#EDEDED] hover:border-[#2563EB]/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            : "bg-[#0A0A0A] border-white/5 text-[#A1A1AA] hover:border-[#2563EB]/30 hover:text-white"
        }
      `}
    >
      <div className="flex items-center gap-2">
        {isCenter && <Brain className="w-5 h-5 text-white" />}
        {isSection && data.icon}
        <span className={`font-semibold ${isCenter ? "text-lg" : isSection ? "text-sm" : "text-xs"}`}>
          {data.label}
        </span>
      </div>
      {isSection && (
        <span className="text-xs text-[#A1A1AA] mt-1 block">{data.modelCount} Models</span>
      )}
    </div>
  );
};

const sectionIconMap = {
  1: <Brain className="w-5 h-5 text-[#2563EB]" />,
  2: <Zap className="w-5 h-5 text-[#2563EB]" />,
  3: <Lightbulb className="w-5 h-5 text-[#2563EB]" />,
  4: <Target className="w-5 h-5 text-[#2563EB]" />,
  5: <BookOpen className="w-5 h-5 text-[#2563EB]" />,
  6: <Cpu className="w-5 h-5 text-[#2563EB]" />,
};

export default function MindMapPage() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [models, setModels] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/sections`),
      axios.get(`${API}/models?limit=300`),
    ]).then(([sectionsRes, modelsRes]) => {
      setSections(sectionsRes.data);
      setModels(modelsRes.data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!sections.length || !models.length) return;

    const newNodes = [];
    const newEdges = [];

    // Center node
    newNodes.push({
      id: "center",
      type: "custom",
      position: { x: 400, y: 300 },
      data: { label: "AI-Powered Mind", isCenter: true },
    });

    const positions = [
      { x: 80, y: 80 },
      { x: 720, y: 80 },
      { x: 80, y: 520 },
      { x: 720, y: 520 },
      { x: 400, y: 0 },
      { x: 400, y: 600 },
    ];

    sections.forEach((section, si) => {
      const sectionId = `section-${section.slug}`;
      const pos = positions[si] || { x: 400 + si * 200, y: 300 };

      newNodes.push({
        id: sectionId,
        type: "custom",
        position: pos,
        data: {
          label: section.short_name,
          isSection: true,
          slug: section.slug,
          modelCount: section.model_count,
          icon: sectionIconMap[section.index],
        },
      });

      newEdges.push({
        id: `e-center-${sectionId}`,
        source: "center",
        target: sectionId,
        type: "default",
        style: { stroke: "#2563EB", strokeWidth: 1.5 },
        animated: true,
        markerEnd: { type: "arrowclosed", color: "#2563EB" },
      });

      // Show first 6 models per section
      const sectionModels = models
        .filter((m) => m.section_slug === section.slug)
        .slice(0, 6);

      const angle = Math.atan2(pos.y - 300, pos.x - 400);
      sectionModels.forEach((model, mi) => {
        const spread = Math.PI * 0.5;
        const mAngle = angle - spread / 2 + (spread / (sectionModels.length - 1 || 1)) * mi;
        const dist = 180;
        const mx = pos.x + Math.cos(mAngle) * dist;
        const my = pos.y + Math.sin(mAngle) * dist;
        const modelId = `model-${model.section_slug}-${model.model_index}`;

        newNodes.push({
          id: modelId,
          type: "custom",
          position: { x: mx, y: my },
          data: {
            label: model.title,
            sectionSlug: model.section_slug,
            modelIndex: model.model_index,
          },
        });

        newEdges.push({
          id: `e-${sectionId}-${modelId}`,
          source: sectionId,
          target: modelId,
          type: "default",
          style: { stroke: "#27272A", strokeWidth: 1 },
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [sections, models, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_, node) => {
      if (node.data.slug) {
        navigate(`/domain/${node.data.slug}`);
      } else if (node.data.sectionSlug && node.data.modelIndex) {
        navigate(`/model/${node.data.sectionSlug}/${node.data.modelIndex}`);
      }
    },
    [navigate]
  );

  return (
    <div className="min-h-screen" data-testid="mindmap-page">
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4 text-center">Interactive Preview</p>
          <h2 className="text-4xl md:text-6xl tracking-tighter font-bold gradient-text mb-4 text-center">Explore the Mind Map</h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto text-center mb-8">
            Navigate through 200+ mental models organized into six powerful categories. Click on nodes to explore.
          </p>
        </div>
        <div className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden mx-4 md:mx-12 lg:mx-24">
          <div className="h-[500px] md:h-[650px] w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              minZoom={0.3}
              maxZoom={2}
              attributionPosition="bottom-left"
              style={{ background: "#050505" }}
            >
              <Controls position="bottom-right" />
              <Background color="#27272A" gap={20} size={1} variant="dots" />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}
