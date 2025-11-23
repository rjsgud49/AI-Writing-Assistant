import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Main: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#f7f5ff] text-gray-900 font-sans">

            <Header />

            {/* 메인 컨텐츠 */}
            <main className="flex flex-col items-center justify-center text-center mt-20 px-6">
                <div className="bg-white rounded-xl shadow-md p-12 max-w-4xl border border-purple-200">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight text-purple-700">
                        더 빠르게, 더 완성도 높게.
                    </h2>

                    <p className="text-base text-gray-600 mb-10">
                        문장 개선 · 템플릿 제공 · PDF 및 Markdown 출력까지 한 번에 해결하세요.
                    </p>

                    {/* 기능 카드 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 bg-white rounded-lg border border-purple-100 hover:bg-purple-50 transition">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">
                                AI 피드백
                            </h3>
                            <p className="text-sm text-gray-600">
                                문장 개선 · 톤 조절 · 명확한 표현 제안
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-lg border border-purple-100 hover:bg-purple-50 transition">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">
                                문서 템플릿
                            </h3>
                            <p className="text-sm text-gray-600">
                                자기소개서 · 포트폴리오 등 고품질 템플릿 제공
                            </p>
                        </div>

                        <div className="p-6 bg-white rounded-lg border border-purple-100 hover:bg-purple-50 transition">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">
                                원클릭 출력
                            </h3>
                            <p className="text-sm text-gray-600">
                                PDF · Markdown · HTML 즉시 내보내기
                            </p>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            to="/write"
                            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-500 transition"
                        >
                            작성 시작하기
                        </Link>

                        <Link
                            to="/templates"
                            className="px-8 py-3 border border-purple-300 text-purple-700 font-semibold rounded-full hover:bg-purple-50 transition"
                        >
                            템플릿 보기
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Main;
