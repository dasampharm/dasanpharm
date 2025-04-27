import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./야물데이터.json";

const categories = ["소화기계", "호음기계", "항생제", "순화기계", "당료병용제", "정신신공계"];

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
    const filtered = data.filter((item) =>
      item["제품명"]?.toLowerCase().startsWith(lower)
    );
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
          .sort((a, b) => (Number(b["요율"]) || 0) - (Number(a["요율"]) || 0))
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
      background: "#f0f0f0",
      fontWeight: "bold",
      borderRight: "1px solid #ccc",
      zIndex: 2,
      minWidth: "100px"
    } : {};
    if (["제품명", "성분", "용량", "제약사"].includes(key)) {
      return {
        whiteSpace: value && value.length > 8 ? "normal" : "nowrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...commonStickyStyle
      };
    }
    if (["품절", "환산액", "약가", "요율"].includes(key)) {
      return {
        whiteSpace: "nowrap",
        ...commonStickyStyle
      };
    }
    if (key === "비고") {
      return {
        whiteSpace: value && value.length > 15 ? "normal" : "nowrap",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...commonStickyStyle
      };
    }
    return {
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      ...commonStickyStyle
    };
  };

  const tableHeaders = ["제품명", selectedDrug ? null : "성분", "용량", "제약사", "약가", "요율", "환산액", "품절", "비고"].filter(Boolean);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      {/* 검색창 & 카테고리 생략 (기존과 동일) */}

      {(selectedDrug || selectedCategory) && (
        <div style={{ marginTop: "10px", width: "100%", overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h2>{selectedDrug ? "동일성분조회" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span onClick={handleReset} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>메인으로 돌아가기</span>
          </div>

          {selectedDrug && (
            <div style={{ fontSize: "14px", marginBottom: "10px" }}>
              성분 : {selectedDrug["성분"]} {selectedDrug["용량"]}
            </div>
          )}

          {selectedDrug && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> 동일 용량
              </label>
              <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                <input type="checkbox" checked={availableOnly} onChange={() => setAvailableOnly(!availableOnly)} /> 거래 가능
              </label>
            </div>
          )}

          <div style={{ maxHeight: "400px", overflowY: "auto", position: "relative" }}>
            <table style={{ borderCollapse: "collapse", tableLayout: "auto", width: "100%", fontSize: "14px" }}>
              <thead>
                <tr>
                  {tableHeaders.map((key, i) => (
                    <th key={i} style={{ padding: "14px", border: "1px solid #ccc", backgroundColor: "#f0f0f0", textAlign: "left", fontWeight: "bold", position: key === "제품명" ? "sticky" : "sticky", top: 0, left: key === "제품명" ? 0 : undefined, zIndex: 3 }}>{key}</th>
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

      {/* Footer 생략 (기존과 동일) */}
    </div>
  );
}

export default App;
