import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

// 약물 카테고리 리스트
const categories = ["소화기계", "호흡기계", "항생제", "순환기계", "당뇨병용제", "정신신경계"];

function App() {
  const [query, setQuery] = useState(""); // 검색창 입력값
  const [suggestions, setSuggestions] = useState([]); // 검색 자동완성 리스트
  const [selectedDrug, setSelectedDrug] = useState(null); // 검색으로 선택한 약
  const [sameDoseOnly, setSameDoseOnly] = useState(false); // 동일 용량만 보기 체크박스
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택한 카테고리
  const inputRef = useRef(null); // 검색 input에 접근하기 위한 ref

  // 검색창 입력 변화시 작동
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedDrug(null);
    setSelectedCategory(null);

    if (!value) {
      setSuggestions([]);
      return;
    }

    // 검색창 입력값으로 제품명 앞부분 startsWith로 필터링
    const lower = value.toLowerCase();
    const filtered = data.filter((item) =>
      item["제품명"]?.toLowerCase().startsWith(lower)
    );
    setSuggestions(filtered);
  };

  // 검색 결과 클릭 시 작동
  const handleSuggestionClick = (item) => {
    setQuery(item["제품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
    setSelectedCategory(null);
  };

  // 카테고리 버튼 클릭 시 작동
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setQuery("");
    setSelectedDrug(null);
    setSuggestions([]);
  };

  // 선택한 약물/카테고리에 맞춰서 필터링하는 함수
  const getFilteredDrugs = () => {
    if (selectedDrug) {
      const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
      const baseDose = selectedDrug["용량"]?.trim();

      const filtered = data.filter((item) => {
        const sameIngredient = item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
        const sameDose = item["용량"]?.trim() === baseDose;
        return sameIngredient && (!sameDoseOnly || sameDose);
      });

      // 선택한 약물이 제일 위에 오도록 정렬
      const sorted = [
        selectedDrug,
        ...filtered.filter((item) => item["제품명"] !== selectedDrug["제품명"])
      ];

      return sorted;
    }

    if (selectedCategory) {
      return data.filter((item) => item["분류"] === selectedCategory);
    }

    return [];
  };

  return (
    // 최상단 div - 화면 전체를 감쌈
    // overflowX: hidden → 모바일 가로 스크롤 막기!
    <div style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden", padding: "20px", fontFamily: "sans-serif", margin: "0 auto" }}>
      
      {/* 검색창 영역 */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", paddingBottom: "10px" }}>
        <h1 style={{ fontSize: "26px" }}>약물 검색</h1>

        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative", flexGrow: 1 }}>
            {/* 검색 아이콘 */}
            <FaSearch style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", color: "#888" }} />
            {/* 검색 input */}
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
            {/* 검색 자동완성 드롭다운 */}
            <ul style={{
              listStyle: "none",
              paddingLeft: 0,
              maxHeight: "400px",
              overflowY: "auto",
              border: suggestions.length > 0 ? "1px solid #ccc" : "none",
              margin: 0,
              background: "white",
              position: "absolute",
              top: "56px",
              zIndex: 2,
              borderRadius: "4px",
              width: "100%"
            }}>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSuggestionClick(item)} style={{ cursor: "pointer", padding: "10px 12px" }}>
                  {item["제품명"]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 아무것도 선택 안 했을 때 보여주는 화면 (카테고리+안내) */}
      {!selectedDrug && !selectedCategory && (
        <>
          <h3 style={{ fontSize: "16px", marginTop: "20px", marginBottom: "8px" }}>약물 카테고리</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} style={{
                padding: "10px 16px",
                border: "1px solid #ccc",
                borderRadius: "12px",
                background: "white",
                fontSize: "14px",
                cursor: "pointer"
              }}>
                {cat}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>안내사항</h3>
          <div style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "20px",
            fontSize: "13px",
            lineHeight: "1.7"
          }}>
            <p>다산팜에서 거래하는 약물 리스트입니다.</p>
            <p>제품명 검색 시 동일 성분의 약물이 보여집니다.</p>
            <p>약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
          </div>
        </>
      )}

      {/* 약물 선택 or 카테고리 선택한 경우 */}
      {(selectedDrug || selectedCategory) && (
        <div style={{ width: "100%" }}>
          
          {/* 상단 타이틀 + 메인으로 돌아가기 버튼 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "20px" }}>{selectedDrug ? "동일성분조회" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span onClick={() => { setSelectedCategory(null); setSelectedDrug(null); setQuery(""); }} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>
              메인으로 돌아가기
            </span>
          </div>

          {/* 동일성분이면 성분명+용량 보여주기 */}
          {selectedDrug && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "16px" }}>
                성분: {selectedDrug["성분"]} {selectedDrug["용량"]}
              </div>
            </div>
          )}

          {/* 동일 용량만 보기 체크박스 */}
          {selectedDrug && (
            <label style={{ marginBottom: "8px", display: "block" }}>
              <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> &nbsp;동일 용량만 보기
            </label>
          )}

          {/* 테이블 스크롤 영역 시작 */}
          <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "400px", overscrollBehavior: "contain" }}>
            <div style={{ width: "fit-content", minWidth: "100%" }}>
              <table style={{
                borderCollapse: "separate",
                borderSpacing: "0",
                fontSize: "14px",
                width: "100%",
                marginBottom: "0"
              }}>
                <thead>
                  <tr>
                    <th style={headerStyle}>제품명</th>
                    {selectedDrug ? null : <th style={headerStyle}>성분</th>}
                    {["용량", "제약사", "약가", "요율", "환산액", "품절", "비고"].map((label, i) => (
                      <th key={i} style={headerStyle}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredDrugs().map((drug, index) => (
                    <tr key={index}>
                      {/* 제품명 (왼쪽 고정) */}
                      <td style={stickyCellStyle}>{drug["제품명"]}</td>

                      {/* 성분명 */}
                      {selectedDrug ? null : (
                        <td style={cellStyle}>{drug["성분"]}</td>
                      )}

                      {/* 나머지 셀들 */}
                      {["용량", "제약사", "약가", "요율", "환산액"].map((field) => (
                        <td key={field} style={cellStyle}>{drug[field]}</td>
                      ))}

                      {/* 품절만 한줄 유지 */}
                      <td style={nowrapCellStyle}>{drug["품절"]}</td>

                      {/* 비고 (없으면 '-') */}
                      <td style={cellStyle}>{drug["비고"] || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 하단 고정 - 저작권 표시 */}
      <div style={{ marginTop: "30px", fontSize: "13px", color: "#888", textAlign: "center" }}>
        HSY © 2025 | netizenlily@naver.com
      </div>
    </div>
  );
}

// 테이블 헤더 스타일
const headerStyle = {
  padding: "14px",
  border: "1px solid #ccc",
  backgroundColor: "#f7f7f7",
  textAlign: "left",
  position: "sticky",
  top: 0,
  zIndex: 2
};

// 일반 셀 스타일 (줄넘김 허용)
const cellStyle = {
  padding: "14px",
  border: "1px solid #eee",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  wordBreak: "keep-all"
};

// 품절 셀 스타일 (한줄 유지)
const nowrapCellStyle = {
  padding: "14px",
  border: "1px solid #eee",
  whiteSpace: "nowrap"
};

// 왼쪽 고정 셀 (제품명)
const stickyCellStyle = {
  ...cellStyle,
  background: "#fff",
  position: "sticky",
  left: 0,
  zIndex: 1
};

export default App;