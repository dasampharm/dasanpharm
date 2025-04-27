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
    setAvailableOnly(false);

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
      ];
    }
    else if (selectedCategory) {
      filtered = data.filter((item) => item["분류"] === selectedCategory);
    }

    if (availableOnly) {
      filtered = filtered.filter((item) => item["품절"] === "정상유통");
    }

    return filtered;
  };

  const breakText = (text, limit = 8) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    const first = text.slice(0, limit);
    const second = text.slice(limit);
    return (
      <>
        {first}
        <br />
        {second}
      </>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
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
          <h3 style={{ fontSize: "16px", marginTop: "20px", marginBottom: "8px" }}>약물 카테고리</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} style={{ padding: "10px 16px", border: "1px solid #ccc", borderRadius: "12px", background: "white", fontSize: "14px", cursor: "pointer" }}>{cat}</button>
            ))}
          </div>

          <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>안내사항</h3>
          <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc", borderRadius: "12px", padding: "20px", fontSize: "13px", lineHeight: "1.7" }}>
            <p>다산팜에서 거래하는 약물 리스트입니다.</p>
            <p>제품명 검색 시 동일 성분의 약물이 보여집니다.</p>
            <p>약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
          </div>
        </>
      )}

      {(selectedDrug || selectedCategory) && (
        <div style={{ marginTop: "20px", width: "100%", overflow: "auto", maxHeight: "600px" }}>
          {selectedDrug && (
            <div style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "16px" }}>성분: {selectedDrug["성분"]} {selectedDrug["용량"]}</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h2>{selectedDrug ? "동일성분조회" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span onClick={() => { setSelectedCategory(null); setSelectedDrug(null); }} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>메인으로 돌아가기</span>
          </div>

          {selectedDrug && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
              <label>
                <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> &nbsp;동일 용량
              </label>
              <label>
                <input type="checkbox" checked={availableOnly} onChange={() => setAvailableOnly(!availableOnly)} /> &nbsp;거래 가능
              </label>
            </div>
          )}

          <table style={{ borderCollapse: "separate", borderSpacing: "0", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ position: "sticky", top: 0, left: 0, background: "#f7f7f7", zIndex: 4, minWidth: "140px", border: "1px solid #ccc", padding: "8px" }}>제품명</th>
                {selectedDrug ? null : (
                  <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "120px", border: "1px solid #ccc", padding: "8px" }}>성분</th>
                )}
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "80px", border: "1px solid #ccc", padding: "8px" }}>용량</th>
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "120px", border: "1px solid #ccc", padding: "8px" }}>제약사</th>
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "80px", border: "1px solid #ccc", padding: "8px" }}>약가</th>
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "80px", border: "1px solid #ccc", padding: "8px" }}>요율</th>
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "80px", border: "1px solid #ccc", padding: "8px" }}>환산액</th>
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "100px", whiteSpace: "nowrap", border: "1px solid #ccc", padding: "8px" }}>품절</th>
                <th style={{ position: "sticky", top: 0, background: "#f7f7f7", zIndex: 3, minWidth: "100px", border: "1px solid #ccc", padding: "8px" }}>비고</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredDrugs().map((drug, idx) => (
                <tr key={idx}>
                  <td style={{ position: "sticky", left: 0, background: "#fff", zIndex: 2, minWidth: "140px", border: "1px solid #eee", padding: "8px" }}>
                    {breakText(drug["제품명"])}
                  </td>
                  {selectedDrug ? null : (
                    <td style={{ minWidth: "120px", border: "1px solid #eee", padding: "8px" }}>{breakText(drug["성분"])}</td>
                  )}
                  <td style={{ minWidth: "80px", border: "1px solid #eee", padding: "8px" }}>{drug["용량"]}</td>
                  <td style={{ minWidth: "120px", border: "1px solid #eee", padding: "8px" }}>{drug["제약사"]}</td>
                  <td style={{ minWidth: "80px", border: "1px solid #eee", padding: "8px" }}>{drug["약가"]}</td>
                  <td style={{ minWidth: "80px", border: "1px solid #eee", padding: "8px" }}>{drug["요율"]}</td>
                  <td style={{ minWidth: "80px", border: "1px solid #eee", padding: "8px" }}>{drug["환산액"]}</td>
                  <td style={{ minWidth: "100px", whiteSpace: "nowrap", border: "1px solid #eee", padding: "8px" }}>{drug["품절"]}</td>
                  <td style={{ minWidth: "100px", border: "1px solid #eee", padding: "8px" }}>{drug["비고"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "30px", fontSize: "13px", color: "#888", textAlign: "center" }}>
        HSY © 2025 | netizenlily@naver.com
      </div>
    </div>
  );
}

export default App;
