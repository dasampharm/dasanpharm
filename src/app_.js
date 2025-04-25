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
      item["약품명"]?.toLowerCase().startsWith(lower)
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (item) => {
    setQuery(item["약품명"]);
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
    <div style={{
      padding: "20px",
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      maxWidth: "380px",
      margin: "0 auto",
      position: "relative"
    }}>
      <h1 style={{ textAlign: "left", alignSelf: "flex-start", fontSize: "26px" }}>약물 검색</h1>

      {/* 검색창 + 버튼 정렬 */}
      <div style={{
        display: "flex",
        alignItems: "left",
        width: "90%",
        gap: "8px",
        marginBottom: "10px"
      }}>
        <div style={{
          position: "relative",
          flexGrow: 1,
          maxWidth: "400px"
        }}>
          <FaSearch style={{
            position: "absolute",
            top: "50%",
            left: "12px",
            transform: "translateY(-50%)",
            fontSize: "16px",
            color: "#888"
          }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="제품명을 검색하세요"
            style={{
              width: "100%",
              padding: "12px 12px 12px 38px",
              fontSize: "15px",
              border: "none",
              borderRadius: "12px",
              backgroundColor: "#f5f5f5"
            }}
          />
          <ul
            style={{
              listStyle: "none",
              paddingLeft: 0,
              maxHeight: "160px",
              overflowY: "auto",
              border: suggestions.length > 0 ? "1px solid #ccc" : "none",
              margin: 0,
              width: "100%",
              background: "white",
              position: "absolute",
              top: "46px",
              zIndex: 2,
              borderRadius: "4px"
            }}
          >
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                style={{ cursor: "pointer", padding: "8px" }}
              >
                {item["약품명"]}
              </li>
            ))}
          </ul>
        </div>
     
      </div>

      {/* 설명창 + 카테고리 버튼 */}
      {!selectedDrug && !selectedCategory && (
        <>
          <h3 style={{ alignSelf: "flex-start", fontSize: "16px", marginTop: "30px", marginBottom: "10px" }}>
            약물 카테고리
          </h3>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "30px",
            justifyContent: "flex-start"
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  background: "white",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3 style={{ alignSelf: "flex-start", fontSize: "16px", marginBottom: "10px" }}>안내사항</h3>
          <div style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "20px",
            fontSize: "13px",
            lineHeight: "1.7",
            width: "90%",
            color: "#333"
          }}>
            <p>다산팜에서 거래하는 약물 리스트입니다.</p>
            <p>제품명 검색 시 동일 성분의 약물이 보여집니다.</p>
            <p>약가는 매일 영업일 10시 경에 업데이트됩니다.</p>
          </div>
        </>
      )}

      {/* 결과 테이블 */}
      {(selectedDrug || selectedCategory) && (
        <div style={{ marginTop: "40px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>{selectedDrug ? "동일 성분 제품" : `📂 ${selectedCategory} 카테고리`}</h2>
            <span
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDrug(null);
              }}
              style={{ fontSize: "13px", color: "#2F75B5", cursor: "pointer" }}
            >
              메인으로 돌아가기
            </span>
          </div>

          {selectedDrug && (
            <label>
              <input
                type="checkbox"
                checked={sameDoseOnly}
                onChange={() => setSameDoseOnly(!sameDoseOnly)}
              />
              &nbsp;동일 용량만 보기
            </label>
          )}
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                minWidth: "700px",
                width: "100%",
                marginTop: "15px",
                borderCollapse: "collapse",
                fontSize: "13px",
                tableLayout: "auto"
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>약품명</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>성분</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>용량</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>제약사</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>약가</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredDrugs().map((drug, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["약품명"]}</td>
                    <td style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: "1.5"
                    }}>
                      {drug["성분"]}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["용량"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["제약사"]}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{drug["약가"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer style={{
        marginTop: "60px",
        fontSize: "13px",
        color: "#888",
        textAlign: "center"
      }}>
        HSY © 2025 | netizenlily@naver.com
      </footer>
    </div>
  );
}

export default App;