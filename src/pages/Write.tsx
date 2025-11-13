import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { getAIResponse } from "../utils/openai";

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

const STORAGE_DRAFTS_KEY = "drafts";
const STORAGE_SELECTED_ID_KEY = "selected_draftId";

const Write: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [feedbackType, setFeedbackType] = useState<"개선" | "톤" | "강조" | "">("");
    const [loading, setLoading] = useState(false);
    const [showTitleInput, setShowTitleInput] = useState(false);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const makeNewDraft = (): Draft => ({
        id: "draft_" + Date.now(),
        title: "새 문서",
        content: "",
        feedbacks: [],
        createdAt: new Date().toISOString(),
    });

    /* 초기 로드 */
    useEffect(() => {
        const savedDraftsRaw = localStorage.getItem(STORAGE_DRAFTS_KEY);
        const savedSelectedId = localStorage.getItem(STORAGE_SELECTED_ID_KEY);

        if (savedDraftsRaw) {
            const savedDrafts: Draft[] = JSON.parse(savedDraftsRaw);
            setDrafts(savedDrafts);

            if (savedSelectedId) {
                const found = savedDrafts.find((d) => d.id === savedSelectedId);
                if (found) {
                    setSelectedDraftId(found.id);
                    setTitle(found.title);
                    setContent(found.content);
                    setFeedbacks(found.feedbacks);
                    setShowTitleInput(true);
                    return;
                }
            }

            if (savedDrafts.length > 0) {
                const first = savedDrafts[0];
                setSelectedDraftId(first.id);
                setTitle(first.title);
                setContent(first.content);
                setFeedbacks(first.feedbacks);
                setShowTitleInput(true);
                localStorage.setItem(STORAGE_SELECTED_ID_KEY, first.id);
                return;
            }
        }

        const first = makeNewDraft();
        setDrafts([first]);
        setSelectedDraftId(first.id);
        setTitle(first.title);
        setShowTitleInput(true);
        localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify([first]));
        localStorage.setItem(STORAGE_SELECTED_ID_KEY, first.id);
    }, []);

    useEffect(() => {
        const selectedTemplate = localStorage.getItem("selectedTemplate");
        if (selectedTemplate) {
            const { title, content } = JSON.parse(selectedTemplate);
            setTitle(title);
            setContent(content);
            setShowTitleInput(true);
            localStorage.removeItem("selectedTemplate"); // 중복 적용 방지
        }
    }, []);


    /* draft 업데이트 */
    const updateCurrentDraft = (updates: Partial<Draft>) => {
        if (!selectedDraftId) return;
        setDrafts((prev) =>
            prev.map((d) => (d.id === selectedDraftId ? { ...d, ...updates } : d))
        );
    };

    /* 수동 저장 */
    const handleManualSave = () => {
        if (!selectedDraftId) return;
        const updatedDrafts = drafts.map((d) =>
            d.id === selectedDraftId
                ? { ...d, title, content, feedbacks, updatedAt: new Date().toISOString() }
                : d
        );
        setDrafts(updatedDrafts);
        localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(updatedDrafts));
        alert("✅ 문서가 저장되었습니다!");
    };

    /* 새 글쓰기 */
    const createNewDraft = () => {
        const newDraft = makeNewDraft();
        setDrafts((prev) => [newDraft, ...prev]);
        setSelectedDraftId(newDraft.id);
        setTitle(newDraft.title);
        setContent("");
        setFeedbacks([]);
        setShowTitleInput(true);
        localStorage.setItem(STORAGE_SELECTED_ID_KEY, newDraft.id);
    };

    /* draft 선택 */
    const loadDraft = (id: string) => {
        const draft = drafts.find((d) => d.id === id);
        if (!draft) return;
        setSelectedDraftId(id);
        setTitle(draft.title);
        setContent(draft.content);
        setFeedbacks(draft.feedbacks);
        setShowTitleInput(true);
        localStorage.setItem(STORAGE_SELECTED_ID_KEY, id);
    };

    /* draft 삭제 */
    const deleteDraft = (id: string) => {
        const draft = drafts.find((d) => d.id === id);
        if (!draft) return;

        if (!confirm(`'${draft.title}' 문서를 삭제하시겠습니까?`)) return;

        const updatedDrafts = drafts.filter((d) => d.id !== id);
        setDrafts(updatedDrafts);
        localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(updatedDrafts));

        // 현재 선택된 문서를 삭제했다면 상태 초기화
        if (selectedDraftId === id) {
            setSelectedDraftId(null);
            setTitle("");
            setContent("");
            setFeedbacks([]);
            setShowTitleInput(false);
            localStorage.removeItem(STORAGE_SELECTED_ID_KEY);
        }

        alert("🗑️ 문서가 삭제되었습니다.");
    };

    /* 피드백 삭제 */
    const deleteFeedback = (id: number) => {
        const updated = feedbacks.filter((f) => f.id !== id);
        setFeedbacks(updated);
        updateCurrentDraft({ feedbacks: updated });
    };

    /* 피드백 생성 */
    const handleFeedback = async () => {
        if (!content.trim()) return alert("내용을 입력해주세요!");
        if (!feedbackType) return alert("피드백 유형을 선택해주세요!");

        setLoading(true);
        const newFeedbacks: FeedbackItem[] = [];

        for (let i = 1; i <= 3; i++) {
            const placeholder = {
                id: Date.now() + i,
                text: `🕐 ${i}번째 피드백 생성 중...`,
                target: "",
            };
            setFeedbacks((prev) => [placeholder, ...prev]);

            const prompt = `
당신은 매우 엄격하고 냉정한 글쓰기 평가자입니다.
문법, 논리, 구조, 표현력 측면에서 냉정하게 평가하세요.

사용자 글:
"""${content}"""

피드백 유형: ${feedbackType}

- 고칠 부분: (문장 일부 그대로 인용)
- 피드백: (무엇이 잘못됐는지 냉정히 지적)
- 수정 제안: (전문가 수준으로 수정, 이유 포함)
`;

            const result = await getAIResponse(prompt);
            const parsed = result?.trim() || "";

            const match = parsed.match(
                /고칠 부분\s*:\s*(.+)\n.*피드백\s*:\s*(.+)\n.*수정 제안\s*:\s*(.+)/
            );
            let newFeedback: FeedbackItem;
            if (match) {
                newFeedback = {
                    id: Date.now() + i,
                    target: match[1].trim(),
                    text: `⚠️ [${feedbackType}] ${match[2].trim()}\n✏️ 제안: ${match[3].trim()}`,
                };
            } else {
                newFeedback = {
                    id: Date.now() + i,
                    target: "",
                    text: `⚠️ [${feedbackType}] ${parsed}`,
                };
            }

            setFeedbacks((prev) =>
                [newFeedback, ...prev.filter((f) => !f.text.includes("피드백 생성 중"))]
            );
            newFeedbacks.unshift(newFeedback);
        }

        updateCurrentDraft({ feedbacks: [...newFeedbacks, ...feedbacks] });
        setLoading(false);
    };

    /* 구절 위치 이동 */
    const scrollToPhrase = (phrase: string) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const idx = textarea.value.indexOf(phrase);
        if (idx !== -1) {
            textarea.focus();
            textarea.setSelectionRange(idx, idx + phrase.length);
            textarea.scrollTop =
                textarea.scrollHeight * (idx / textarea.value.length - 0.1);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#d8c8ff] to-[#e4b8ff] min-h-screen">
            <Header />

            <div className="font-sans text-gray-800 p-10 flex justify-center">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* 왼쪽 - Draft 리스트 */}
                    <aside className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/40 flex flex-col">
                        <h2 className="text-lg font-bold text-purple-700 mb-4 flex justify-between items-center">
                            Draft History
                            <button
                                onClick={createNewDraft}
                                className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-500"
                            >
                                ➕ 새 글
                            </button>
                        </h2>

                        <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px]">
                            {drafts.length === 0 ? (
                                <p className="text-sm text-gray-500">저장된 문서가 없습니다.</p>
                            ) : (
                                drafts.map((d) => (
                                    <div
                                        key={d.id}
                                        className={`relative p-3 rounded-lg text-left transition ${selectedDraftId === d.id
                                                ? "bg-purple-500 text-white"
                                                : "bg-white hover:bg-purple-100 text-purple-700"
                                            }`}
                                    >
                                        <div onClick={() => loadDraft(d.id)} className="cursor-pointer">
                                            <p className="font-semibold truncate">{d.title || "제목 없음"}</p>
                                            <p className="text-xs opacity-70">
                                                {new Date(d.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* 🗑️ 삭제 버튼 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteDraft(d.id);
                                            }}
                                            className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>

                    {/* 가운데 - 글쓰기 */}
                    <section className="col-span-2 bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/40 flex flex-col">
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-purple-700">
                            <input
                                type="checkbox"
                                checked={showTitleInput}
                                onChange={(e) => setShowTitleInput(e.target.checked)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            제목 입력 (최대 10자)
                        </label>

                        {showTitleInput && (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value.slice(0, 10))}
                                placeholder="제목 입력"
                                className="w-full mb-4 p-2 rounded-md bg-white/60 border border-purple-200 outline-none focus:ring-2 focus:ring-purple-300 transition"
                            />
                        )}

                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="자기소개서/포트폴리오 내용을 입력하거나 붙여넣으세요"
                            className="flex-1 w-full resize-none rounded-lg p-4 bg-purple-100/30 text-gray-800 border border-purple-200 outline-none focus:ring-2 focus:ring-purple-300 transition"
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleManualSave}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-500 transition"
                            >
                                💾 저장하기
                            </button>
                        </div>
                    </section>

                    {/* 오른쪽 - 피드백 */}
                    <aside className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/40 flex flex-col">
                        <h2 className="text-lg font-bold text-purple-700 mb-4">AI 피드백 로그</h2>

                        <div className="flex justify-between mb-4 bg-purple-100/60 p-1 rounded-lg">
                            {["개선", "톤", "강조"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() =>
                                        setFeedbackType((prev) => (prev === type ? "" : (type as any)))
                                    }
                                    className={`w-1/3 py-1 rounded-md font-semibold transition ${feedbackType === type
                                            ? "bg-purple-500 text-white"
                                            : "text-purple-700 hover:bg-purple-200"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleFeedback}
                            disabled={loading}
                            className={`w-full font-semibold py-2 rounded-lg transition mb-4 ${loading
                                    ? "bg-purple-300 cursor-not-allowed text-white"
                                    : "bg-purple-600 hover:bg-purple-500 text-white"
                                }`}
                        >
                            {loading ? "AI 분석 중..." : "피드백 받기"}
                        </button>

                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px]">
                            {feedbacks.length === 0 ? (
                                <p className="text-sm text-gray-500">아직 피드백이 없습니다.</p>
                            ) : (
                                feedbacks.map((f) => (
                                    <div
                                        key={f.id}
                                        className="relative p-3 bg-white/80 rounded-lg border border-purple-100 hover:bg-purple-200 cursor-pointer whitespace-pre-wrap"
                                        onClick={() => f.target && scrollToPhrase(f.target)}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteFeedback(f.id);
                                            }}
                                            className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                        <p className="text-sm text-gray-700">{f.text}</p>
                                        {f.target && (
                                            <p className="text-xs mt-1 text-purple-600 italic">
                                                ⤷ “{f.target}” 위치로 이동
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Write;
