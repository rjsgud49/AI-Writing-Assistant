import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Write from "./pages/Write";
import Templates from "./pages/Templates";
import Export from "./pages/Export";

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Main />} />
        {/* 작성 페이지 */}
        <Route path="/write" element={<Write />} />
        {/* 예시 템플릿 페이지 */}
        <Route path="/templates" element={<Templates />} />
        {/* 출력 페이지 */}
        <Route path="/export" element={<Export />} />
      </Routes>
    </Router>
  );
}

export default App;
