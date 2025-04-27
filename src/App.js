import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

// 카테고리 리스트
const categories = ["소화기계", "호흡기계", "항생제", "순환기계", "당뇨병용제", "정신신경계"];

function App() {
  const [query, setQuery] = useState(""); // 검색창 입력값
  const [suggestions, setSuggestions] = useState([]); // 검색 자동완성 리스트
  const [selectedDrug, setSelectedDrug] = useState(null); // 선택한 약
  const [sameDoseOnly, setSameDoseOnly] = useState(false); // 동일 용량 보기 여부
  const [onlyAvailable, setOnlyAvailable] = useState(false); // 거래 가능만 보기 여부
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택한 카테고리
  const inputRef = useRef(null); // 검색 input ref

  // 검색창 입력할 때 자동완성 리스트 업데이트
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

  // 검색 추천어 클릭했을 때
  const handleSuggestionClick = (item) => {
    setQuery(item["제품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
    setOnlyAvailable(false);
    setSelectedCategory(null);
  };

  // 카테고리 버튼 클릭했을 때
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setQuery("");
    setSelectedDrug(null);
    setSuggestions([]);
    setSameDoseOnly(false);
    setOnlyAvailable(false);
  };

  // 약물 리스트 필터링하는 함수
  const getFilteredDrugs = () => {
    if (selectedDrug) {
      const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
      const baseDose = selectedDrug["용량"]?.trim();

      const filtered = data.filter((item) => {
        const sameIngredient = item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
        const sameDose = item["용량"]?.trim() === baseDose;
        const available = item["품절"] === "정상유통";

        return sameIngredient &&
          (!sameDoseOnly || sameDose) &&
          (!onlyAvailable || available);
      });

      // 선택한 약물이 가장 위로
      const sorted = [
        selectedDrug,
        ...filtered.filter((item) => item["제품명"] !== selectedDrug["제품명"])
      ];

      return sorted;
    }

    if (selectedCategory) {
      const filtered = data.filter((item) => item["분류"] === selectedCategory);

      // 카테고리 결과에도 거래가능 체크 반영
      if (onlyAvailable) {
        return filtered.filter((item) => item["품절"] === "정상유통");
      }
      return filtered;
    }

    return [];
  };

  return (
    // 페이지 전체 감싸는 div - 모바일 스크롤바 방지
    <div style={{ width: "100%", maxWidth: "100vw", overflowX: "hidden", padding: "20px", fontFamily: "sans-serif", margin: "0 auto" }}>

      {/* 검색창 영역 */}
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
            {/* 자동완성 추천 리스트 */}
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

      {/* 아무것도 검색/선택 안했을 때 보여주는 카테고리+안내 */}
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

      {/* 검색 결과 or 카테고리 결과 */}
      {(selectedDrug || selectedCategory) && (
        <div style={{ width: "100%" }}>

          {/* 상단 타이틀 + 돌아가기 버튼 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "20px" }}>{selectedDrug ? "동일성분조회" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span onClick={() => { setSelectedCategory(null); setSelectedDrug(null); setQuery(""); }} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>
              메인으로 돌아가기
            </span>
          </div>

          {/* 동일성분조회 - 성분+용량 보여주기 */}
          {selectedDrug && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "16px" }}>
                성분: {selectedDrug["성분"]} {selectedDrug["용량"]}
              </div>
            </div>
          )}

          {/* 체크박스: 동일 용량 / 거래 가능 */}
          {selectedDrug && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
              <label>
                <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} />
                &nbsp;동일 용량
              </label>
              <label>
                <input type="checkbox" checked={onlyAvailable} onChange={() => setOnlyAvailable(!onlyAvailable)} />
                &nbsp;거래 가능
              </label>
            </div>
          )}

          {/* 테이블 영역 */}
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
                      <td style={stickyCellStyle}>{drug["제품명"]}</td>
                      {selectedDrug ? null : (
                        <td style={cellStyle}>{drug["성분"]}</td>
                      )}
                      <td style={cellStyle}>{drug["용량"]}</td>
                      <td style={cellStyle}>{drug["제약사"]}</td>
                      <td style={cellStyle}>{drug["약가"]}</td>
                      <td style={cellStyle}>{drug["요율"]}</td>
                      <td style={nowrapCellStyle}>{drug["품절"]}</td>
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

// 테이블 스타일 모음
const headerStyle = {
  padding: "14px",
  border: "1px solid #ccc",
  backgroundColor: "#f7f7f7",
  textAlign: "left",
  position: "sticky",
  top: 0,
  zIndex: 2
};

const cellStyle = {
  padding: "14px",
  border: "1px solid #eee",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  wordBreak: "keep-all"
};

const nowrapCellStyle = {
  padding: "14px",
  border: "1px solid #eee",
  whiteSpace: "nowrap"
};

const stickyCellStyle = {
  ...cellStyle,
  background: "#fff",
  position: "sticky",
  left: 0,
  zIndex: 1
};

export default App;