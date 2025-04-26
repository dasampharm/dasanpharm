// 약물 검색 React App
import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

// 카테고리 목록
const categories = ["소화기계", "호흡기계", "항생제", "순환기계", "당뇨병용제", "정신신경계"];

function App() {
  const [query, setQuery] = useState(""); // 검색창 입력값
  const [suggestions, setSuggestions] = useState([]); // 검색 자동완성 리스트
  const [selectedDrug, setSelectedDrug] = useState(null); // 선택한 약물
  const [sameDoseOnly, setSameDoseOnly] = useState(false); // 동일 용량 필터 여부
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택한 카테고리
  const inputRef = useRef(null); // 검색창 포커스용

  // 검색창 입력 핸들링
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedDrug(null);
    setSelectedCategory(null);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = data.filter((item) =>
      item["제품명"]?.toLowerCase().startsWith(lower)
    );
    setSuggestions(filtered);
  };

  // 검색 제안 클릭 시
  const handleSuggestionClick = (item) => {
    setQuery(item["제품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
    setSelectedCategory(null);
  };

  // 카테고리 버튼 클릭 시
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setQuery("");
    setSelectedDrug(null);
    setSuggestions([]);
  };

  // 검색 결과 필터링
  const getFilteredDrugs = () => {
    if (selectedDrug) {
      const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
      const baseDose = selectedDrug["용량"]?.trim();

      return data.filter((item) => {
        const sameIngredient = item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
        const sameDose = item["용량"]?.trim() === baseDose;
        return sameIngredient && (!sameDoseOnly || sameDose);
      });
    }

    if (selectedCategory) {
      return data.filter((item) => item["분류"] === selectedCategory);
    }

    return [];
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "380px", margin: "0 auto" }}>
      {/* 상단 검색창 */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", paddingBottom: "10px" }}>
        <h1 style={{ fontSize: "26px" }}>약물 검색</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flexGrow: 1 }}>
            <FaSearch style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", color: "#888" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="제품명을 검색하세요"
              style={{
                width: "100%",
                padding: "16px 16px 16px 42px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "14px",
                backgroundColor: "#f5f5f5",
                boxSizing: "border-box"
              }}
            />
            {/* 검색 자동완성 리스트 */}
            <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: "160px", overflowY: "auto", border: suggestions.length > 0 ? "1px solid #ccc" : "none", margin: 0, background: "white", position: "absolute", top: "56px", zIndex: 2, borderRadius: "4px", width: "100%" }}>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSuggestionClick(item)} style={{ cursor: "pointer", padding: "10px 12px" }}>{item["제품명"]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 카테고리 및 안내사항 */}
      {!selectedDrug && !selectedCategory && (
        <>
          <h3 style={{ fontSize: "16px", marginTop: "30px", marginBottom: "10px" }}>약물 카테고리</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} style={{ padding: "10px 16px", border: "1px solid #ccc", borderRadius: "12px", background: "white", fontSize: "14px", cursor: "pointer" }}>{cat}</button>
            ))}
          </div>

          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>안내사항</h3>
          <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc", borderRadius: "12px", padding: "20px", fontSize: "13px", lineHeight: "1.7" }}>
            <p>다산팝에서 거래하는 약물 리스트입니다.</p>
            <p>제품명 검색 시 동일 성분의 약물이 보여집니다.</p>
            <p>약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
          </div>
        </>
      )}

      {/* 검색 결과 테이블 */}
      {(selectedDrug || selectedCategory) && (
        <div style={{ marginTop: "40px", width: "100%", overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>{selectedDrug ? "동일 성분 제품" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span onClick={() => { setSelectedCategory(null); setSelectedDrug(null); }} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>메인으로 돌아가기</span>
          </div>

          {selectedDrug && (
            <label>
              <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> &nbsp;동일 용량만 보기
            </label>
          )}

          {/* 테이블 상단(항목명) */}
          <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{
                  position: "sticky", top: 0, left: 0, zIndex: 4,
                  background: "#f7f7f7", padding: "12px", border: "1px solid #ccc",
                  maxWidth: "10em", whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "keep-all"
                }}>제품명</th>
                {["성분", "용량", "제약사", "약가", "요율", "환산액", "품절", "비고"].map((label, i) => (
                  <th key={i} style={{
                    position: "sticky", top: 0, background: "#f7f7f7", zIndex: 2,
                    padding: "12px", border: "1px solid #ccc", textAlign: "left", whiteSpace: "nowrap"
                  }}>{label}</th>
                ))}
              </tr>
            </thead>
          </table>

          {/* 테이블 본문(데이터) 스크롤 적용 */}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
              <tbody>
                {getFilteredDrugs().map((drug, index) => (
                  <tr key={index}>
                    <td style={{
                      position: "sticky", left: 0, zIndex: 1,
                      background: "#fff", padding: "12px", border: "1px solid #eee",
                      maxWidth: "10em", whiteSpace: "normal", overflowWrap: "break-word", wordBreak: "keep-all"
                    }}>{drug["제품명"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["성분"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["용량"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["제약사"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["약가"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["요율"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["환산액"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["품절"]}</td>
                    <td style={{ padding: "12px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["비고"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer style={{ marginTop: "60px", fontSize: "13px", color: "#888", textAlign: "center" }}>
        HSY © 2025 | netizenlily@naver.com
      </footer>
    </div>
  );
}

export default App;
