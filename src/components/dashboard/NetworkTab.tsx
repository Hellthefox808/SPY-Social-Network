"use client";

import { useEffect, useRef, useState } from "react";
import { Network, ZoomIn, ZoomOut, RotateCcw, HelpCircle } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "person" | "company" | "place" | "account" | "event";
  platform?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

interface Edge {
  source: string;
  target: string;
  type: string;
  weight: number;
  confidence: number;
}

import { JobProfile, JobEdge, JobEntity } from "@/types/osint";

export interface NetworkTabProps {
  profile: JobProfile;
  edges: JobEdge[];
  entities: JobEntity[];
  onNodeClick: (node: JobEntity | Node) => void;
}

export default function NetworkTab({ profile, edges, entities, onNodeClick }: NetworkTabProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Edge[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const width = 600;
  const height = 450;

  // Initialize nodes and links
  useEffect(() => {
    // 1. Create central node
    const centralNodeId = "primary";
    const centralNode: Node = {
      id: centralNodeId,
      name: profile.displayName || profile.handle || "Main Profile",
      type: "account",
      platform: profile.platform,
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    };

    const tempNodes: Node[] = [centralNode];
    const tempLinks: Edge[] = [];

    // 2. Add other entities as nodes
    entities.forEach((ent, idx) => {
      // Find angle for circular layout
      const angle = (idx / entities.length) * 2 * Math.PI;
      const radius = 120 + Math.random() * 40;

      // Map DB type to SVG node type
      let type: Node["type"] = "account";
      if (ent.entityType === "company") type = "company";
      if (ent.entityType === "place") type = "place";
      if (ent.entityType === "event") type = "event";

      tempNodes.push({
        id: ent.id,
        name: ent.name,
        type,
        platform: ent.platform || undefined,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null,
      });
    });

    // 3. Map edges
    edges.forEach((edge) => {
      tempLinks.push({
        source: edge.sourceEntityId,
        target: edge.targetEntityId,
        type: edge.relationType,
        weight: edge.weight,
        confidence: edge.confidence,
      });
    });

    setNodes(tempNodes);
    setLinks(tempLinks);
  }, [profile, edges, entities]);

  // Force simulation loop
  useEffect(() => {
    if (nodes.length === 0) return;

    let animId: number;

    const tick = () => {
      setNodes((currentNodes) => {
        const nextNodes = currentNodes.map((n) => ({ ...n }));

        // Parameters
        const kSpring = 0.05; // spring force coefficient
        const lengthDefault = 130; // resting link distance
        const kRepulsion = 1200; // electrostatic repulsion
        const gravity = 0.02; // center gravity

        // 1. Repulsion between all nodes
        for (let i = 0; i < nextNodes.length; i++) {
          const n1 = nextNodes[i];
          for (let j = i + 1; j < nextNodes.length; j++) {
            const n2 = nextNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const distSq = dx * dx + dy * dy + 0.1;
            const dist = Math.sqrt(distSq);

            if (dist < 300) {
              const force = kRepulsion / distSq;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              // Opposing forces
              n1.vx -= fx;
              n1.vy -= fy;
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // 2. Attraction along links
        links.forEach((link) => {
          const sourceIdx = nextNodes.findIndex((n) => n.id === link.source);
          const targetIdx = nextNodes.findIndex((n) => n.id === link.target);

          if (sourceIdx !== -1 && targetIdx !== -1) {
            const n1 = nextNodes[sourceIdx];
            const n2 = nextNodes[targetIdx];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;

            const force = kSpring * (dist - lengthDefault) * link.weight;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            n1.vx += fx;
            n1.vy += fy;
            n2.vx -= fx;
            n2.vy -= fy;
          }
        });

        // 3. Gravity to center (width/2, height/2) and position updates
        nextNodes.forEach((n) => {
          if (n.fx !== null && n.fy !== null) {
            // Node is being dragged, lock its position
            n.x = n.fx;
            n.y = n.fy;
            n.vx = 0;
            n.vy = 0;
            return;
          }

          // Apply center gravity
          n.vx += (width / 2 - n.x) * gravity;
          n.vy += (height / 2 - n.y) * gravity;

          // Apply velocity friction
          n.vx *= 0.85;
          n.vy *= 0.85;

          // Update position
          n.x += n.vx;
          n.y += n.vy;

          // Clamping to screen boundaries
          n.x = Math.max(20, Math.min(width - 20, n.x));
          n.y = Math.max(20, Math.min(height - 20, n.y));
        });

        return nextNodes;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [links, nodes.length]);

  // Drag handlers
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
    setNodes((current) =>
      current.map((n) => (n.id === nodeId ? { ...n, fx: n.x, fy: n.y } : n))
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    // Convert screen coordinates to SVG viewport coordinates (handling zoom/pan)
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const svgX = (clientX - pan.x) / zoom;
    const svgY = (clientY - pan.y) / zoom;

    if (draggedNode) {
      setNodes((current) =>
        current.map((n) =>
          n.id === draggedNode ? { ...n, fx: svgX, fy: svgY, x: svgX, y: svgY } : n
        )
      );
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (draggedNode) {
      setNodes((current) =>
        current.map((n) => (n.id === draggedNode ? { ...n, fx: null, fy: null } : n))
      );
      setDraggedNode(null);
    }
    setIsPanning(false);
  };

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((z) => (direction === "in" ? Math.min(z + 0.15, 2) : Math.max(z - 0.15, 0.5)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: Node["type"], isCentral: boolean) => {
    if (isCentral) return "fill-blue-500 stroke-blue-300";
    switch (type) {
      case "company":
        return "fill-amber-500 stroke-amber-400";
      case "place":
        return "fill-teal-500 stroke-teal-400";
      case "event":
        return "fill-rose-500 stroke-rose-400";
      default:
        return "fill-slate-700 stroke-slate-500";
    }
  };

  const getEdgeDash = (type: string) => {
    return type === "inferred" ? "5, 5" : "";
  };

  return (
    <div className="relative h-[550px] w-full rounded-xl border border-slate-900 bg-slate-950 overflow-hidden shadow-inner flex flex-col">
      {/* Simulation Screen */}
      <svg
        ref={svgRef}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleSvgMouseDown}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Draw Links */}
          {links.map((link, idx) => {
            const sourceNode = nodes.find((n) => n.id === link.source);
            const targetNode = nodes.find((n) => n.id === link.target);

            if (!sourceNode || !targetNode) return null;

            return (
              <line
                key={idx}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                className="stroke-slate-800"
                strokeWidth={1.5 + link.weight * 1.5}
                strokeDasharray={getEdgeDash(link.type)}
                opacity={0.6 + link.confidence * 0.4}
              />
            );
          })}

          {/* 2. Draw Nodes */}
          {nodes.map((node) => {
            const isCentral = node.id === "primary";
            const colorClass = getNodeColor(node.type, isCentral);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeClick(node);
                }}
                className="cursor-pointer group"
              >
                <circle
                  r={isCentral ? 14 : 9}
                  className={`${colorClass} stroke-2 transition duration-200 group-hover:scale-125`}
                />
                {isCentral && (
                  <circle
                    r={20}
                    className="fill-none stroke-blue-500/30 stroke-1 animate-pulse"
                  />
                )}
                {/* Labels */}
                <text
                  y={isCentral ? 28 : 20}
                  className="fill-slate-300 font-semibold text-[10px] text-anchor-middle"
                  textAnchor="middle"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating map tools */}
      <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1 backdrop-blur shadow-xl text-xs text-slate-400">
        <button
          onClick={() => handleZoom("in")}
          className="p-2 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-2 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Recenter Map"
        >
          <RotateCcw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Graph Legend */}
      <div className="absolute top-5 right-5 z-10 bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 backdrop-blur shadow-xl space-y-2.5 max-w-[200px] text-[10px]">
        <span className="font-semibold text-slate-300 uppercase tracking-wider block border-b border-slate-850 pb-1 flex items-center gap-1">
          <HelpCircle className="h-3.5 w-3.5 text-blue-400" /> Graph Legend
        </span>
        <div className="space-y-1.5 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>Central Profile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span>Discovered Account</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Associated Company</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            <span>Discovered Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Event / Code Repository</span>
          </div>
        </div>
      </div>
    </div>
  );
}
