import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Main: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#d8c8ff] to-[#e4b8ff] text-gray-800 font-sans relative overflow-hidden">

            <Header/>
            {/* 메인 컨텐츠 */}
            <main className="flex flex-col items-center justify-center text-center mt-24 px-8">
                <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-12 max-w-4xl border border-white/40">
                    <h2 className="text-4xl font-extrabold mb-3 leading-tight text-purple-800">
                        AI로 빠르게 <br /> 더 완성도 높게.
                    </h2>
                    <p className="text-base text-gray-700 mb-10">
                        문장 다듬기 · 강조점 추천 · 템플릿 · PDF/Markdown 출력까지 한 번에.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        <div className="p-6 bg-white/60 rounded-2xl border border-purple-100 hover:bg-white/80 transition-all">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">
                                🧠 AI 피드백
                            </h3>
                            <p className="text-sm text-gray-700">
                                문장 개선·톤 변경·전문성 강조 3가지 제안
                            </p>
                        </div>
                        <div className="p-6 bg-white/60 rounded-2xl border border-purple-100 hover:bg-white/80 transition-all">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">
                                📄 예시 템플릿
                            </h3>
                            <p className="text-sm text-gray-700">
                                포트폴리오, 자기소개서 등 고품질 템플릿 제공
                            </p>
                        </div>
                        <div className="p-6 bg-white/60 rounded-2xl border border-purple-100 hover:bg-white/80 transition-all">
                            <h3 className="text-lg font-semibold mb-2 text-purple-700">
                                ⚡ 원클릭 출력
                            </h3>
                            <p className="text-sm text-gray-700">
                                PDF/Markdown/HTML로 즉시 내보내기
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <Link
                            to="/write"
                            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-500 transition"
                        >
                            ✍ 지금 작성하기
                        </Link>
                        <Link
                            to="/templates"
                            className="px-8 py-3 bg-transparent border border-purple-400 text-purple-700 font-semibold rounded-full hover:bg-purple-100 transition"
                        >
                            📘 예시 보러가기
                        </Link>
                    </div>
                </div>
            </main>

            {/* 장식용 배경 원형 */}
            <div className="absolute top-10 right-20 w-60 h-60 bg-white/40 blur-3xl rounded-full"></div>
            <div className="absolute bottom-10 left-16 w-72 h-72 bg-purple-300/30 blur-3xl rounded-full"></div>
        </div>
    );
};

export default Main;
