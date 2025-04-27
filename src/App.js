// 수정된 App.js 코드 (요청한 사항 모두 반영)
import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

const categories = ["소화기계", "호흡기계", "항생제", "순환기계", "당뇨병용제", "정신신경계"];

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [sameDoseOnly, setSameDoseOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false); // 거래 가능 버튼
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

  const handleMainClick = () => {
    setSelectedCategory(null);
    setSelectedDrug(null);
    setQuery("");
    setSameDoseOnly(false);
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

      filtered = [selectedDrug, ...filtered.filter((item) => item["제품명"] !== selectedDrug["제품명"])];
    }

    if (selectedCategory) {
      filtered = data.filter((item) => item["분류"] === selectedCategory);
    }

    if (availableOnly) {
      filtered = filtered.filter((item) => item["품절"] === "정상유통");
    }

    return filtered;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff", paddingBottom: "10px" }}>
        <h1 style={{ fontSize: "26px" }}>약물 검색</h1>
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
              backgroundColor: "#f5f5f5"
            }}
          />
          <ul style={{ maxHeight: "200px", overflowY: "auto", border: suggestions.length ? "1px solid #ccc" : "none" }}>
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSuggestionClick(item)}>{item["제품명"]}</li>
            ))}
          </ul>
        </div>
      </div>

      {(selectedDrug || selectedCategory) && (
        <div>
          <button onClick={handleMainClick}>메인으로 돌아가기</button>
          {selectedDrug && (
            <>
              <label>
                <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> 동일 용량
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input type="checkbox" checked={availableOnly} onChange={() => setAvailableOnly(!availableOnly)} /> 거래 가능
              </label>
            </>
          )}
          <table style={{ width: "100%", overflowX: "auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {Object.keys(data[0]).map((key, idx) => (
                  <th key={idx} style={{ border: "1px solid #ccc", padding: "8px" }}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getFilteredDrugs().map((drug, idx) => (
                <tr key={idx}>
                  {Object.keys(drug).map((key, index) => (
                    <td
                      key={index}
                      style={{
                        border: "1px solid #eee",
                        padding: "8px",
                        whiteSpace: key === "품절" ? "nowrap" : "normal",
                        wordBreak: "break-word"
                      }}
                    >
                      {drug[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedDrug && !selectedCategory && categories.map(cat => (
        <button key={cat} onClick={() => handleCategoryClick(cat)}>{cat}</button>
      ))}
    </div>
  );
}

export default App;
