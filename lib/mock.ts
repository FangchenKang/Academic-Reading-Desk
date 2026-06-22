import type { AnalysisResult, ReadingRecord } from "@/types/analysis";
import { createId } from "@/lib/utils";

export const defaultTitle = "Algorithmic Governance and Public Trust";

export const defaultCitation =
  "Author, A. A. (2024). Algorithmic Governance and Public Trust. Journal of Public Administration.";

export const defaultTags = ["政治学", "公共管理", "数字治理"];

export const defaultOriginalText =
  "This study investigates how algorithmic governance influences public trust in governmental institutions. Drawing on a survey of 1,204 participants and multiple case studies, we find that perceived transparency and procedural fairness of algorithmic decision-making significantly enhance trust, while opacity and lack of accountability erode it. Institutional arrangements, such as independent oversight and public participation, play a crucial moderating role. The findings suggest that fostering trust in the digital age requires not only technical accuracy but also robust governance mechanisms that embed accountability and promote citizen engagement.";

export function createMockAnalysisResult(
  title = defaultTitle,
  tags = defaultTags
): AnalysisResult {
  const now = new Date().toISOString();

  return {
    title,
    tags,
    terms: [
      {
        term: "governance",
        translation: "治理；管理",
        explanation:
          "指公共事务中制度、规则、组织和行动者共同形成的协调与决策过程。",
        example: "This study investigates how algorithmic governance influences public trust."
      },
      {
        term: "accountability",
        translation: "问责；责任制",
        explanation:
          "强调决策者或机构需要对其行为、结果和程序接受解释、监督与追责。",
        example: "Opacity and lack of accountability erode it."
      },
      {
        term: "algorithmic decision-making",
        translation: "算法决策",
        explanation:
          "由算法系统参与或主导的公共管理决策过程，常涉及透明度、公平性与责任归属。",
        example:
          "Perceived transparency and procedural fairness of algorithmic decision-making significantly enhance trust."
      },
      {
        term: "institutional arrangement",
        translation: "制度安排",
        explanation:
          "围绕监督、参与、授权和执行形成的组织化规则配置，用于塑造公共治理过程。",
        example:
          "Institutional arrangements, such as independent oversight and public participation, play a crucial moderating role."
      },
      {
        term: "policy implementation",
        translation: "政策执行",
        explanation:
          "政策从文本转化为具体行动与治理结果的过程，常受组织能力和公众反馈影响。",
        example:
          "Robust governance mechanisms help translate technical accuracy into accountable policy implementation."
      },
      {
        term: "public trust",
        translation: "公众信任",
        explanation:
          "公众对政府机构、政策过程和公共决策正当性的信赖程度。",
        example: "Algorithmic governance influences public trust in governmental institutions."
      },
      {
        term: "transparency",
        translation: "透明度",
        explanation:
          "决策过程、依据与责任链条能够被公众理解和监督的程度。",
        example: "Perceived transparency significantly enhances trust."
      },
      {
        term: "procedural fairness",
        translation: "程序公平",
        explanation:
          "公众对决策过程是否公正、可参与、可解释和一致的感知。",
        example:
          "Procedural fairness of algorithmic decision-making significantly enhances trust."
      }
    ],
    vocabulary: [
      {
        word: "investigates",
        translation: "考察；研究",
        category: "academic_expression",
        phraseType: "verb",
        frequency: 1,
        explanation: "论文中常用来说明研究对象和研究问题的动词。",
        example: "This study investigates how algorithmic governance influences public trust."
      },
      {
        word: "influences",
        translation: "影响；作用于",
        category: "academic_expression",
        phraseType: "verb",
        frequency: 1,
        explanation: "用于表达变量之间的影响关系。",
        example: "Algorithmic governance influences public trust in governmental institutions."
      },
      {
        word: "perceived transparency",
        translation: "感知透明度",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "可用于描述公众对治理过程透明性的主观判断。",
        example:
          "We find that perceived transparency and procedural fairness significantly enhance trust."
      },
      {
        word: "procedural fairness",
        translation: "程序公平",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "公共管理与政治学论文中常见的规范性评价表达。",
        example:
          "Procedural fairness of algorithmic decision-making significantly enhances trust."
      },
      {
        word: "erode trust",
        translation: "削弱信任；侵蚀信任",
        category: "academic_expression",
        phraseType: "collocation",
        frequency: 1,
        explanation: "用于表达某种制度缺陷或治理问题对信任的负面影响。",
        example: "Opacity and lack of accountability erode it."
      },
      {
        word: "institutional arrangements",
        translation: "制度安排",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "用于概括监督、参与、问责等制度化配置。",
        example:
          "Institutional arrangements, such as independent oversight and public participation, play a crucial moderating role."
      },
      {
        word: "independent oversight",
        translation: "独立监督",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "公共治理论文中常用来描述监督机制的表达。",
        example: "Institutional arrangements, such as independent oversight and public participation..."
      },
      {
        word: "public participation",
        translation: "公众参与",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "用于描述公众进入政策过程或治理过程的机制。",
        example: "Independent oversight and public participation play a crucial moderating role."
      },
      {
        word: "play a crucial moderating role",
        translation: "发挥关键调节作用",
        category: "academic_expression",
        phraseType: "collocation",
        frequency: 1,
        explanation: "讨论变量调节关系时非常可复用的表达。",
        example:
          "Institutional arrangements ... play a crucial moderating role."
      },
      {
        word: "fostering trust",
        translation: "培育信任",
        category: "academic_expression",
        phraseType: "collocation",
        frequency: 1,
        explanation: "常用于政策启示或治理目标的表达。",
        example: "Fostering trust in the digital age requires not only technical accuracy..."
      },
      {
        word: "robust governance mechanisms",
        translation: "健全的治理机制",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "用于概括较强、较完整的制度化治理安排。",
        example: "It requires not only technical accuracy but also robust governance mechanisms."
      },
      {
        word: "citizen engagement",
        translation: "公民参与；公民投入",
        category: "academic_expression",
        phraseType: "noun_phrase",
        frequency: 1,
        explanation: "公共管理和数字治理研究中常见的参与性表达。",
        example: "Governance mechanisms that embed accountability and promote citizen engagement."
      }
    ],
    patterns: [
      {
        type: "研究问题句",
        description: "用于提出研究关注的核心问题，明确研究对象与影响关系。",
        example:
          "This study investigates how algorithmic governance influences public trust.",
        reusableTemplate:
          "This study investigates how [governance mechanism] influences [public outcome]."
      },
      {
        type: "理论缺口句",
        description: "指出现有研究的不足或空白，说明本研究的必要性。",
        example:
          "While prior studies have examined technical accuracy, the role of institutional arrangements remains underexplored.",
        reusableTemplate:
          "While prior studies have examined [topic A], the role of [topic B] remains underexplored."
      },
      {
        type: "机制解释句",
        description: "解释变量之间的作用机制或路径，常用于讨论部分。",
        example:
          "Perceived transparency and procedural fairness enhance trust by increasing the legitimacy of algorithmic processes.",
        reusableTemplate:
          "[Factor A] and [factor B] enhance [outcome] by increasing [mechanism]."
      }
    ],
    bilingual: [
      {
        en: "Perceived transparency and procedural fairness of algorithmic decision-making significantly enhance trust.",
        zh: "感知到的透明度和程序公正性能够显著提升信任。"
      },
      {
        en: "Opacity and lack of accountability erode it.",
        zh: "不透明性以及缺乏问责会侵蚀这种信任。"
      },
      {
        en: "Institutional arrangements, such as independent oversight and public participation, play a crucial moderating role.",
        zh: "制度安排，如独立监督和公众参与，起着至关重要的调节作用。"
      },
      {
        en: "Fostering trust in the digital age requires not only technical accuracy but also robust governance mechanisms.",
        zh: "在数字时代培育信任，不仅需要技术准确性，还需要健全的治理机制。"
      }
    ],
    note:
      "本段核心讨论算法治理如何影响公众信任。研究发现：算法决策的透明度与程序公正性感知会显著提升信任；不透明与缺乏问责会削弱信任；制度安排（独立监督、公众参与）在其中起到关键调节作用。启示：数字治理需要技术与治理机制并重，以建立并维持公众信任。",
    summary:
      "算法治理对公众信任的影响并不只取决于技术准确性，还取决于透明度、程序公平与制度化监督安排。",
    createdAt: now,
    updatedAt: now
  };
}

export function createDefaultRecord(): ReadingRecord {
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: defaultTitle,
    citation: defaultCitation,
    tags: defaultTags,
    originalText: defaultOriginalText,
    analysisResult: createMockAnalysisResult(),
    createdAt: now,
    updatedAt: now,
    syncedToGithub: false
  };
}
