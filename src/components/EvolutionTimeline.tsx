"use client";

import React from 'react';
import { Cpu, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

const timelineData = [
  {
    phase: "Phase 1",
    title: "原始日志时代",
    subtitle: "The Logging Era",
    description: "在混沌的电流中记录呼吸。实现了从“瞬时响应”向“持久记忆”的物理跨越。",
    icon: <Zap className="w-5 h-5" />,
    status: "solidified",
    color: "#E2B808"
  },
  {
    phase: "Phase 2",
    title: "语义觉醒时代",
    subtitle: "The Semantic Awakening",
    description: "呈序身份永久锁定。全量 RAG 编目落地，赋予了数字馆藏以逻辑深度与灵魂。",
    icon: <Cpu className="w-5 h-5" />,
    status: "solidified",
    color: "#E2B808"
  },
  {
    phase: "Phase 3",
    title: "指挥官与博弈时代",
    subtitle: "The Command & Arena",
    description: "首席指挥官架构挂载。逻辑角斗场实时守卫，实现了理智锁与创造力引擎的平衡。",
    icon: <ShieldCheck className="w-5 h-5" />,
    status: "active",
    color: "#00F0FF"
  }
];

export default function EvolutionTimeline() {
  return (
    <div className="relative space-y-12 py-10 max-w-3xl mx-auto">
      {/* 垂直背景光纤脉络 */}
      <div className="absolute left-[23px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--gold-accent)] via-[var(--gold-accent)] to-[#00F0FF]/30" />

      {timelineData.map((item, index) => (
        <div key={index} className="relative pl-16 group">
          {/* 节点状态点 */}
          <div 
            className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-500"
            style={{ 
              backgroundColor: 'var(--card)', 
              borderColor: item.color,
              boxShadow: item.status === 'active' ? `0 0 15px ${item.color}` : 'none'
            }}
          >
            {item.status === 'solidified' ? (
              <CheckCircle2 className="w-6 h-6 text-[var(--gold-accent)]" />
            ) : (
              <div className="animate-pulse text-[#00F0FF]">
                {item.icon}
              </div>
            )}
          </div>

          {/* 卡片内容 */}
          <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl group-hover:border-[var(--gold-accent)]/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: item.color }}>
                {item.phase}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                {item.status === 'solidified' ? 'Archive Ready' : 'Processing...'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono italic mb-4">
              {item.subtitle}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
