import { BookOpenCheck, ClipboardList, Lightbulb, Network, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    title: "研究问题句",
    icon: Search,
    description: "用于提出研究关注的核心问题，明确研究对象与影响关系。",
    example: "This study investigates how [X] influences [Y]."
  },
  {
    title: "文献缺口句",
    icon: BookOpenCheck,
    description: "指出现有研究的不足或空白，说明本研究的必要性。",
    example: "While prior studies have examined [A], [B] remains underexplored."
  },
  {
    title: "机制解释句",
    icon: Network,
    description: "解释变量之间的作用机制或路径，常用于理论与讨论部分。",
    example: "[X] enhances [Y] by increasing [mechanism]."
  },
  {
    title: "理论贡献句",
    icon: Lightbulb,
    description: "概括研究对理论框架、概念关系或解释机制的推进。",
    example: "This article contributes to [literature] by demonstrating [finding]."
  },
  {
    title: "方法说明句",
    icon: ClipboardList,
    description: "介绍数据来源、样本、案例或识别策略，增强研究可信度。",
    example: "Drawing on [data/source], we examine [research question]."
  }
];

export default function TemplatesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">Writing Templates</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">模板</h2>
          <p className="mt-2 text-sm text-slate-500">
            预留论文句式模板库，后续可扩展为个人写作训练与 Anki 卡片。
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <article
                key={template.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Badge tone={index % 2 === 0 ? "teal" : "blue"}>模板</Badge>
                </div>
                <h3 className="font-semibold text-slate-950">{template.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {template.description}
                </p>
                <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {template.example}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
