import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const sectionColors = {
  1: "#3b3b3b",
  2: "#2d3b2d",
  3: "#3b2d3b",
  4: "#2d2d3b",
  5: "#3b3b2d",
  6: "#2d3b3b",
};

const CustomNode = ({ data }) => (
  <div
    style={{
      background: data.bg || "#121212",
      border: `1px solid ${data.borderColor || "#333"}`,
      borderRadius: data.isCenter ? "50%" : "12px",
      padding: data.isCenter ? "30px" : data.isSection ? "14px 24px" : "10px 16px",
      color: "#fff",
      fontSize: data.isCenter ? "14px" : data.isSection ? "13px" : "11px",
      fontFamily: data.isCenter || data.isSection ? "'Playfair Display', serif" : "'Manrope', sans-serif",
      width: data.isCenter ? "140px" : data.isSection ? "auto" : "auto",
      height: data.isCenter ? "140px" : "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      cursor: data.clickable ? "pointer" : "default",
      maxWidth: data.isSection ? "180px" : "160px",
      lineHeight: 1.3,
      opacity: data.isCenter ? 1 : data.isSection ? 0.9 : 0.7,
    }}
  >
    {data.label}
  </div>
);

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
      position: { x: 0, y: 0 },
      data: {
        label: "AI-Powered Mind",
        isCenter: true,
        bg: "#1a1a1a",
        borderColor: "#555",
      },
    });

    const sectionAngle = (2 * Math.PI) / sections.length;
    const sectionRadius = 350;
    const modelRadius = 200;

    sections.forEach((section, si) => {
      const angle = sectionAngle * si - Math.PI / 2;
      const sx = Math.cos(angle) * sectionRadius;
      const sy = Math.sin(angle) * sectionRadius;
      const sectionId = `section-${section.slug}`;

      newNodes.push({
        id: sectionId,
        type: "custom",
        position: { x: sx - 80, y: sy - 20 },
        data: {
          label: section.short_name,
          isSection: true,
          clickable: true,
          slug: section.slug,
          bg: sectionColors[section.index] || "#222",
          borderColor: "#555",
        },
      });

      newEdges.push({
        id: `e-center-${sectionId}`,
        source: "center",
        target: sectionId,
        type: "default",
        style: { stroke: "#333", strokeWidth: 1 },
        animated: false,
      });

      // Show first 8 models per section
      const sectionModels = models
        .filter((m) => m.section_slug === section.slug)
        .slice(0, 8);

      const modelAngleSpread = Math.PI * 0.6;
      const startAngle = angle - modelAngleSpread / 2;

      sectionModels.forEach((model, mi) => {
        const mAngle = startAngle + (modelAngleSpread / (sectionModels.length - 1 || 1)) * mi;
        const mx = sx + Math.cos(mAngle) * modelRadius - 60;
        const my = sy + Math.sin(mAngle) * modelRadius - 12;
        const modelId = `model-${model.section_slug}-${model.model_index}`;

        newNodes.push({
          id: modelId,
          type: "custom",
          position: { x: mx, y: my },
          data: {
            label: model.title,
            clickable: true,
            sectionSlug: model.section_slug,
            modelIndex: model.model_index,
            bg: "#161616",
            borderColor: "#2a2a2a",
          },
        });

        newEdges.push({
          id: `e-${sectionId}-${modelId}`,
          source: sectionId,
          target: modelId,
          style: { stroke: "#222", strokeWidth: 0.5 },
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
    <div className="h-screen w-full pt-16" data-testid="mindmap-page">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        attributionPosition="bottom-left"
        style={{ background: "#050505" }}
      >
        <Controls position="bottom-right" />
        <Background color="#1a1a1a" gap={40} size={1} />
      </ReactFlow>
    </div>
  );
}
