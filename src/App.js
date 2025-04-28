import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

const categories = ["소화기계", "호흡기계", "항생제", "순환기계", "당뇨병용제", "정신신경계"];

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [sameDoseOnly, setSameDoseOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const inputRef = useRef(null);

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
    const filtered = data.filter((item) => item["제품명"]?.toLowerCase().startsWith(lower));
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item["제품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
    setAvailableOnly(false);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setQuery("");
    setSelectedDrug(null);
    setSuggestions([]);
    setAvailableOnly(false);
  };

  const getFilteredDrugs = () => {
    let filtered = [];
    if (selectedDrug) {
      const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
      const baseDose = selectedDrug["용량"]?.trim();
      filtered = data.filter((item) => {
        const sameIngredient = item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
        const sameDose = item["용량"]?.trim() === baseDose;
        return sameIngredient && (!sameDoseOnly || sameDose);
      });
      filtered = [
        selectedDrug,
        ...filtered.filter((item) => item["제품명"] !== selectedDrug["제품명"])
        .sort((a, b) => (parseFloat(b["요율"]) || 0) - (parseFloat(a["요율"]) || 0))
      ];
    } else if (selectedCategory) {
      filtered = data.filter((item) => item["분류"] === selectedCategory);
    }
    if (availableOnly) {
      filtered = filtered.filter((item) => item["품절"] === "정상유통");
    }
    return filtered;
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedDrug(null);
    setQuery("");
    setSameDoseOnly(false);
    setAvailableOnly(false);
    setSuggestions([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const getCellStyle = (key, value) => {
    const commonStickyStyle = key === "제품명" ? {
      position: "sticky",
      left: 0,
      background: "#f7f7f7",
      zIndex: 2,
      minWidth: "100px"
    } : {};

    if (["제품명", "용량", "제약사"].includes(key)) {
      return {
        color: "#000",
        whiteSpace: value && value.length > 8 ? "normal" : "nowrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        fontWeight: key === "제품명" ? "bold" : "normal",
        ...commonStickyStyle
      };
    }
    if (key === "성분") {
      return {
        color: "#000",
        minWidth: "160px", // 성분명 칸 최소 넓이 확보
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...commonStickyStyle
      };
}
    if (["품절", "환산액", "약가", "요율"].includes(key)) {
      return {
        color: "#000",
        whiteSpace: "nowrap",
        ...commonStickyStyle
      };
    }
    if (key === "비고") {
      return {
        color: "#000",
        whiteSpace: value && value.length > 25 ? "normal" : "nowrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...commonStickyStyle
      };
    }
    return {
      color: "#000",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      ...commonStickyStyle
    };
  };

  const tableHeaders = ["제품명", selectedDrug ? null : "성분", "용량", "제약사", "약가", "요율", "환산액", "품절", "비고"].filter(Boolean);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", paddingBottom: "10px" }}>
        <h1 style={{ fontSize: "26px" }}>약물 검색</h1>
        <div style={{ display: "flex", gap: "8px", marginBottom: "7px" }}>
          <div style={{ position: "relative", flexGrow: 1 }}>
            <FaSearch style={{ position: "absolute", top: "50%", left: "12px", transform: "translateY(-50%)", color: "#888" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="제품명을 검색하세요"
              style={{ width: "100%", padding: "16px 16px 16px 42px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "14px", backgroundColor: "#f5f5f5", boxSizing: "border-box" }}
            />
            <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: "400px", overflowY: "auto", border: suggestions.length > 0 ? "1px solid #ccc" : "none", margin: 0, background: "white", position: "absolute", top: "56px", zIndex: 2, borderRadius: "4px", width: "100%" }}>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSuggestionClick(item)} style={{ cursor: "pointer", padding: "10px 12px" }}>{item["제품명"]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {!selectedDrug && !selectedCategory && (
        <>
          <h3 style={{ fontSize: "16px", marginTop: "20px", marginBottom: "20px" }}>약물 카테고리</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} style={{ padding: "10px 16px", border: "1px solid #ccc", borderRadius: "12px", background: "white", fontSize: "14px", cursor: "pointer" }}>{cat}</button>
            ))}
          </div>
          <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>안내사항</h3>
          <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc", borderRadius: "12px", padding: "20px", fontSize: "13px", lineHeight: "1.7", marginTop: "15px" }}>
            <p>다산팝에서 거래하는 약물 리스트입니다.</p>
            <p>제품명 검색 시 동일 성분의 약물이 보여지며,</p>
            <p>약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
          </div>
        </>
      )}

      {(selectedDrug || selectedCategory) && (
        <div style={{ marginTop: "7px", width: "100%", overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <h2 style={{ fontSize: "20px" }}>{selectedDrug ? "동일성분조회" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span onClick={handleReset} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>메인으로 돌아가기</span>
          </div>

          {selectedDrug && (
            <div style={{ fontSize: "17px", marginBottom: "8px" }}>
              성분 : {selectedDrug["성분"]} {selectedDrug["용량"]}
            </div>
          )}

          {selectedDrug && (
            <div style={{ display: "flex", gap: "14px", marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", fontSize: "17px" }}>
                <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> 동일 용량
              </label>
              <label style={{ display: "flex", alignItems: "center", fontSize: "17px" }}>
                <input type="checkbox" checked={availableOnly} onChange={() => setAvailableOnly(!availableOnly)} /> 거래 가능
              </label>
            </div>
          )}

          <div style={{ maxHeight: "400px", overflowY: "auto", position: "relative" }}>
            <table style={{ borderCollapse: "collapse", tableLayout: "auto", width: "100%", fontSize: "14px" }}>
              <thead>
                <tr>
                  {tableHeaders.map((key, i) => (
                    <th key={i} style={{ padding: "14px", border: "1px solid #ccc", backgroundColor: "#f0f0f0", textAlign: "left", position: key === "제품명" ? "sticky" : undefined, left: key === "제품명" ? 0 : undefined, zIndex: key === "제품명" ? 3 : undefined }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getFilteredDrugs().map((drug, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map((key, colIndex) => (
                      <td key={colIndex} style={{ padding: "14px", border: "1px solid #eee", ...getCellStyle(key, drug[key]) }}>{drug[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: "30px", fontSize: "13px", color: "#888", textAlign: "center" }}>
        HSY © 2025 | netizenlily@naver.com
      </div>
    </div>
  );
}

export default App;
