import React, { useState } from "react";
import data from "./약물데이터.json";

function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [sameDoseOnly, setSameDoseOnly] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();
    const filtered = data
      .filter((item) => item["제품명"]?.toLowerCase().includes(lower))
      .slice(0, 10);
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item["제품명"]);
    setSelectedDrug(item);
    setSuggestions([]);
    setSameDoseOnly(false);
  };

  const filteredDrugs = selectedDrug
    ? data.filter((item) => {
        const sameIngredient = item["성분"] === selectedDrug["성분"];
        const sameDose = item["용량"] === selectedDrug["용량"];
        return sameDoseOnly ? sameIngredient && sameDose : sameIngredient;
      })
    : [];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="제품명을 입력하세요"
          style={{ padding: "8px", width: "300px", fontSize: "16px" }}
        />
      </div>

      <ul style={{ listStyleType: "none", padding: 0, maxHeight: "400px", overflowY: "auto", marginBottom: "10px" }}>
        {suggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(item)}
            style={{ padding: "8px", borderBottom: "1px solid #ccc", cursor: "pointer" }}
          >
            {item["제품명"]}
          </li>
        ))}
      </ul>

      {selectedDrug && (
        <div style={{ marginBottom: "10px", fontSize: "16px" }}>
          <div style={{ marginBottom: "4px" }}>
            <strong>성분:</strong> {selectedDrug["성분"]} {selectedDrug["용량"]}
          </div>
        </div>
      )}

      {selectedDrug && (
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={sameDoseOnly}
              onChange={(e) => setSameDoseOnly(e.target.checked)}
            />
            동일용량만 보기
          </label>
        </div>
      )}

      {selectedDrug && (
        <div>
          <h3 style={{ marginBottom: "8px", marginTop: "10px" }}>동일성분조회</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "6px" }}>제품명</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "6px" }}>제조사</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrugs.map((item, index) => (
                <tr key={index}>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>{item["제품명"]}</td>
                  <td style={{ borderBottom: "1px solid #eee", padding: "6px" }}>{item["제조사"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
