import { Link } from "react-router";
const header = () => {
  return (
      <div>
                      {/* 상단 네비게이션 */}
                      <header className="flex justify-between items-center px-12 py-2 backdrop-blur-sm">
                          <h1 className="text-xl font-semibold tracking-wide text-purple-700">
                              AI 글쓰기 도우미
                          </h1>
                          <nav className="flex gap-10 text-sm font-medium">
                              <Link to="/" className="hover:text-purple-500 transition-colors">
                                  메인
                              </Link>
                              <Link to="/write" className="hover:text-purple-500 transition-colors">
                                  작성
                              </Link>
                              <Link
                                  to="/templates"
                                  className="hover:text-purple-500 transition-colors"
                              >
                                  예시
                              </Link>
                              <Link to="/export" className="hover:text-purple-500 transition-colors">
                                  출력
                              </Link>
                          </nav>    
                      </header>
    </div>
  );
};

export default header;