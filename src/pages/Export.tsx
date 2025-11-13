import React, { useEffect, useState } from "react";
import Header from "../components/Header";

interface Draft {
    id: string;
    title: string;
    content: string;
}

const Export: React.FC = () => {
    const [search, setSearch] = useState("");
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [selected, setSelected] = useState<Draft | null>(null);

    // ✅ localStorage에서 drafts 불러오기
    useEffect(() => {
        const saved = localStorage.getItem("drafts");
        if (saved) {
            const parsed = JSON.parse(saved);
            setDrafts(parsed);
        }
        
    }, []);

    // ✅ 제목 검색 필터
    const filtered = drafts.filter((d) =>
        d.title.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ 복사
    const handleCopy = () => {
        if (selected) {
            navigator.clipboard.writeText(selected.content);
            alert("📋 복사 완료!");
        }
    };

    // ✅ PDF(인쇄)
    const handlePrint = () => {
        if (!selected) return;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>${selected.title}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #7b4af5; border-bottom: 2px solid #ccc; padding-bottom: 8px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${selected.title}</h1>
            <pre>${selected.content}</pre>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    // ✅ 다운로드 함수
    const downloadFile = (type: "md" | "txt" | "html") => {
        if (!selected) return;
        let content = "";
        const filename = `${selected.title}.${type}`;


        switch (type) {
            case "md":
                content = `# ${selected.title}\n\n${selected.content}`;
                break;
            case "txt":
                content = `${selected.title}\n\n${selected.content}`;
                break;
            case "html":
                content = `<html><head><meta charset="UTF-8"><title>${selected.title}</title></head><body><h1>${selected.title}</h1><pre>${selected.content}</pre></body></html>`;
                break;
        }

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-[#d8c8ff] to-[#e4b8ff] text-gray-800 font-sans flex">
                {/* 좌측 - Draft 목록 */}
                <aside className="w-72 bg-white/60 backdrop-blur-md border-r border-white/40 p-5 flex flex-col">
                    <h2 className="text-lg font-bold text-purple-700 mb-4">임시 저장 목록</h2>
                    <input
                        type="text"
                        placeholder="제목으로 검색하세요"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-white/70 border border-purple-200 mb-4 outline-none focus:ring-2 focus:ring-purple-300 transition"
                    />
                    <div className="flex-1 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-gray-500">저장된 초안이 없습니다.</p>
                        ) : (
                            filtered.map((d) => (
                                <div
                                    key={d.id}
                                    onClick={() => setSelected(d)}
                                    className={`p-3 mb-2 rounded-lg cursor-pointer transition ${selected?.id === d.id
                                            ? "bg-purple-500 text-white"
                                            : "bg-white/70 hover:bg-purple-100 text-gray-700"
                                        }`}
                                >
                                    <p className="font-semibold truncate">{d.title}</p>
                                    <p className="text-xs opacity-70">
                                        ID: {d.id.replace("draft_", "")}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                    <p className="mt-6 text-xs text-gray-500 text-center">
                        © 2025 AI Portfolio — Export
                    </p>
                </aside>

                {/* 우측 - 출력 미리보기 */}
                <main className="flex-1 flex flex-col justify-center items-center relative">
                    {!selected ? (
                        <div className="text-center">
                            <div className="text-5xl mb-4">📄</div>
                            <h3 className="text-lg font-semibold text-purple-700">
                                출력할 목록을 클릭해주세요
                            </h3>
                            <p className="text-sm text-gray-600">
                                왼쪽에서 문서를 선택하면 미리보기가 나타납니다.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-full p-8 flex flex-col">
                            {/* 상단 */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-purple-700">
                                    제목: {selected.title}
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="px-4 py-2 bg-white border border-purple-300 rounded-md hover:bg-purple-100 transition"
                                    >
                                        📋 복사
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition"
                                    >
                                        🖨️ PDF(인쇄)
                                    </button>
                                </div>
                            </div>

                            {/* 본문 */}
                            <div className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl border border-purple-200 p-6 shadow-inner overflow-y-auto">
                                <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
                                    {selected.content}
                                </p>
                            </div>

                            {/* 하단 */}
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={() => downloadFile("md")}
                                    className="px-5 py-2 bg-white border border-purple-300 text-purple-700 rounded-full font-semibold hover:bg-purple-100 transition"
                                >
                                    ⬇ Markdown(.md)
                                </button>
                                <button
                                    onClick={() => downloadFile("html")}
                                    className="px-5 py-2 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-400 transition"
                                >
                                    ⬇ HTML(.html)
                                </button>
                                <button
                                    onClick={() => downloadFile("txt")}
                                    className="px-5 py-2 bg-white border border-purple-300 text-purple-700 rounded-full font-semibold hover:bg-purple-100 transition"
                                >
                                    ⬇ 텍스트(.txt)
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Export;
