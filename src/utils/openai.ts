import OpenAI from "openai";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // 클라이언트에서 직접 호출 가능 (테스트용)
});

export async function getAIResponse(prompt: string) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "너는 문서 피드백 전문가야. 사용자의 자기소개서나 포트폴리오 문장을 분석해서 개선, 톤, 강조점을 제안해줘.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("OpenAI API Error:", err);
        return "⚠️ 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
}
