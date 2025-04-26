import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import data from "./약물데이터.json";

const categories = ["소화기계", "호흡기계", "항생제", "순환기계", "당뇨병용제", "정신신경계"];

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [sameDoseOnly, setSameDoseOnly] = useState(false);
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
      item["제품명"]?.toLowerCase().includes(lower)
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item["제품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setQuery("");
    setSelectedDrug(null);
    setSuggestions([]);
  };

  const getFilteredDrugs = () => {
    if (selectedDrug) {
      const baseIngredient = selectedDrug["성분"]?.replace(/,$/, "").trim();
      const baseDose = selectedDrug["용량"]?.trim();

      const filtered = data.filter((item) => {
        const sameIngredient = item["성분"]?.replace(/,$/, "").trim() === baseIngredient;
        const sameDose = item["용량"]?.trim() === baseDose;
        return sameIngredient && (!sameDoseOnly || sameDose);
      });

      return [selectedDrug, ...filtered.filter((d) => d["제품명"] !== selectedDrug["제품명"])];
    }

    if (selectedCategory) {
      return data.filter((item) => item["분류"] === selectedCategory);
    }

    return [];
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ flexShrink: 0 }}>
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
            <ul style={{ listStyle: "none", paddingLeft: 0, maxHeight: "160px", overflowY: "auto", border: suggestions.length > 0 ? "1px solid #ccc" : "none", margin: 0, background: "white", position: "absolute", top: "56px", zIndex: 2, borderRadius: "4px", width: "100%" }}>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSuggestionClick(item)} style={{ cursor: "pointer", padding: "10px 12px" }}>{item["제품명"]}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ flexGrow: 1, overflowY: "auto", marginTop: "20px" }}>
        {!selectedDrug && !selectedCategory && (
          <>
            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>약물 카테고리</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => handleCategoryClick(cat)} style={{ padding: "10px 16px", border: "1px solid #ccc", borderRadius: "12px", background: "white", fontSize: "14px", cursor: "pointer" }}>{cat}</button>
              ))}
            </div>

            <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>안내사항</h3>
            <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc", borderRadius: "12px", padding: "20px", fontSize: "13px", lineHeight: "1.7" }}>
              <p>다산팜에서 거래하는 약물 리스트입니다.</p>
              <p>제품명 검색 시 동일 성분의 약물이 보여집니다.</p>
              <p>약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
            </div>
          </>
        )}

        {(selectedDrug || selectedCategory) && (
          <div>
            {selectedDrug && (
              <div style={{ marginBottom: "10px", fontSize: "16px" }}>
                성분: {selectedDrug["성분"]}<br />
                용량: {selectedDrug["용량"]}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h2>{selectedDrug ? "동일 성분 제품" : `📂 ${selectedCategory} 카테고리`}</h2>
              <span onClick={() => { setSelectedCategory(null); setSelectedDrug(null); }} style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}>메인으로 돌아가기</span>
            </div>

            {selectedDrug && (
              <div style={{ marginBottom: "20px" }}>
                <label>
                  <input type="checkbox" checked={sameDoseOnly} onChange={() => setSameDoseOnly(!sameDoseOnly)} /> &nbsp;동일 용량만 보기
                </label>
              </div>
            )}

            <div style={{ maxHeight: "350px", overflowY: "auto", position: "relative" }}>
              <table style={{ minWidth: "900px", borderCollapse: "separate", borderSpacing: "0", fontSize: "14px", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid #ccc", backgroundColor: "#f7f7f7", textAlign: "left", position: "sticky", top: 0, left: 0, zIndex: 4, minWidth: "140px", whiteSpace: "normal", wordBreak: "break-word" }}>제품명</th>
                    {!selectedDrug && (
                      <th style={{ padding: "10px", border: "1px solid #ccc", backgroundColor: "#f7f7f7", textAlign: "left", position: "sticky", top: 0, zIndex: 2, minWidth: "140px", whiteSpace: "normal", wordBreak: "break-word" }}>성분</th>
                    )}
                    {[
                      "용량", "제약사", "약가", "요율", "환산액", "품절", "비고"
                    ].map((label, i) => (
                      <th key={i} style={{ padding: "10px", border: "1px solid #ccc", backgroundColor: "#f7f7f7", textAlign: "left", position: "sticky", top: 0, zIndex: 2, minWidth: "80px", whiteSpace: "nowrap" }}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredDrugs().map((drug, index) => (
                    <tr key={index}>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "normal", wordBreak: "break-word", overflowWrap: "break-word", position: "sticky", left: 0, background: "#fff", zIndex: 1 }}>{drug["제품명"]}</td>
                      {!selectedDrug && (
                        <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "normal", wordBreak: "break-word", overflowWrap: "break-word" }}>{drug["성분"]}</td>
                      )}
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["용량"]}</td>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "normal", wordBreak: "break-word", overflowWrap: "break-word" }}>{drug["제약사"]}</td>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["약가"]}</td>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["요율"]}</td>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["환산액"]}</td>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["품절"]}</td>
                      <td style={{ padding: "10px", border: "1px solid #eee", whiteSpace: "nowrap" }}>{drug["비고"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer style={{ flexShrink: 0, fontSize: "13px", color: "#888", textAlign: "center" }}>
        HSY © 2025 | netizenlily@naver.com
      </footer>
    </div>
  );
}

export default App;
