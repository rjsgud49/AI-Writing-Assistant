import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Template {
    id: number;
    title: string;
    description: string;
    tags: string[];
    content: string;
}

interface FeedbackItem {
    id: number;
    text: string;
    target: string;
}


interface Draft {
    id: string;
    title: string;
    content: string;
    feedbacks: FeedbackItem[];
    createdAt: string;
}

const Templates: React.FC = () => {
    const navigate = useNavigate();

    const templates: Template[] = [
        {
            id: 1,
            title: "자기소개서 기본형",
            description: "지원 동기와 성장 과정을 중심으로 구성된 기본형 자기소개서 템플릿",
            tags: ["취업", "학생", "기본"],
            content: `안녕하세요. 저는 [이름]입니다.

저는 어릴 적부터 [관심 분야]에 흥미를 느껴 이를 발전시키기 위해 꾸준히 노력해왔습니다.
학창시절에는 [관련 활동]을 통해 협업과 문제 해결 능력을 기를 수 있었습니다.

저는 [지원 직무]에 지원하게 된 이유는 [지원 동기] 때문입니다.
앞으로 [회사명]의 발전에 기여하며 함께 성장하는 인재가 되고 싶습니다.`,
        },
        {
            id: 2,
            title: "프로젝트 포트폴리오",
            description: "프로젝트 개요, 역할, 기술 스택, 성과 중심의 포트폴리오 문서 구성",
            tags: ["개발자", "디자이너", "경험 중심"],
            content: `### 프로젝트명: [프로젝트 제목]
- 기간: [YYYY.MM ~ YYYY.MM]
- 역할: [개발 / 디자인 / 기획 등]
- 기술 스택: [React, Spring Boot, MySQL 등]

#### 📘 프로젝트 개요
이 프로젝트는 [문제 정의 및 목표]를 해결하기 위해 제작되었습니다.

#### 🔧 담당 업무
- [업무 1]
- [업무 2]

#### 🏆 주요 성과
- [성과 1]
- [성과 2]`,
        },
        {
            id: 3,
            title: "연구/논문 요약형",
            description: "연구 목적, 방법, 결과를 간결히 정리할 수 있는 아카데믹용 템플릿",
            tags: ["논문", "보고서", "연구"],
            content: `### 연구 제목: [논문 제목]

#### 📍 연구 목적
이 연구는 [연구 동기 및 필요성]을 규명하기 위해 수행되었습니다.

#### 🧪 연구 방법
- [실험 설계 / 분석 방법]

#### 📊 연구 결과
- [결과 요약]

#### 🧭 결론 및 시사점
본 연구는 [핵심 결론]을 도출하였으며, 이는 [시사점]을 제시합니다.`,
        },
        {
            id: 4,
            title: "지원동기 강조형",
            description: "직무와 조직에 대한 관심도를 중심으로 동기를 강조하는 템플릿",
            tags: ["취업", "기업", "동기 강조"],
            content: `안녕하세요. [회사명]에 지원한 [이름]입니다.

저는 [직무명] 분야에서 [관심을 가지게 된 계기]를 통해 이 직무에 대한 열정을 키워왔습니다.
[회사명]의 [비전 또는 가치]가 제 목표와 잘 맞아 지원하게 되었습니다.

앞으로 [회사명]에서 저의 역량을 발휘하여 함께 성장하고 싶습니다.`,
        },
    ];

    // ✅ 템플릿 선택 시 Draft 자동 생성
    const handleUseTemplate = (tpl: Template) => {
        const draftsRaw = localStorage.getItem("drafts");
        const drafts: Draft[] = draftsRaw ? JSON.parse(draftsRaw) : [];

        const newDraft: Draft = {
            id: "draft_" + Date.now(),
            title: tpl.title,
            content: tpl.content,
            feedbacks: [],
            createdAt: new Date().toISOString(),
        };

        const updatedDrafts = [newDraft, ...drafts];
        localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
        localStorage.setItem("selected_draftId", newDraft.id);

        alert(`✅ '${tpl.title}' 템플릿이 새 문서로 추가되었습니다.`);
        navigate("/write");
    };

    return (
        <div className="bg-gradient-to-br from-[#d8c8ff] to-[#e4b8ff] min-h-screen">
            <Header />

            <div className="text-gray-800 font-sans p-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-purple-700">예시 템플릿</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className="bg-white/70 backdrop-blur-md border border-purple-100 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:bg-white/80 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-purple-700 mb-2">
                                    {tpl.title}
                                </h2>
                                <p className="text-sm text-gray-700 mb-4">{tpl.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tpl.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-500 transition"
                                    onClick={() => alert(`📄 미리보기\n\n${tpl.content}`)}
                                >
                                    미리보기
                                </button>
                                <button
                                    onClick={() => handleUseTemplate(tpl)}
                                    className="flex-1 text-center bg-white border border-purple-400 text-purple-700 py-2 rounded-lg font-semibold hover:bg-purple-100 transition"
                                >
                                    사용하기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Templates;
