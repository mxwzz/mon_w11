"use client"; // บอก Next.js ว่าหน้านี้เป็น Client-side เพื่อให้ใช้ปุ่มกดและ State ได้

import { useState, useEffect } from "react";

// สร้างประเภทข้อมูลให้ Tag
type Tag = {
  id: number;
  tagName: string;
};

export default function Home() {
  const [tags, setTags] = useState<Tag[]>([]); // เก็บข้อมูล Tag ทั้งหมด
  const [newTag, setNewTag] = useState(""); // เก็บข้อมูลที่พิมพ์ในช่องกรอก

  // 1. ฟังก์ชันดึงข้อมูลทั้งหมด (GET)
  const fetchTags = async () => {
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTags(data);
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลตอนเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    fetchTags();
  }, []);

  // 2. ฟังก์ชันเพิ่มข้อมูล (POST)
  const handleAddTag = async () => {
    if (!newTag) return alert("กรุณาใส่ชื่อ Tag ก่อนครับ!");

    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagName: newTag }),
    });

    setNewTag(""); // ล้างช่องกรอกข้อมูล
    fetchTags(); // โหลดข้อมูลใหม่มาแสดง
  };

  // 3. ฟังก์ชันลบข้อมูล (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm("แน่ใจนะว่าจะลบ?")) return;

    await fetch(`/api/tags/${id}`, {
      method: "DELETE",
    });

    fetchTags(); // โหลดข้อมูลใหม่มาแสดง
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        ระบบจัดการแท็ก (My Tags) 🏷️
      </h1>

      {/* ส่วนกรอกข้อมูล */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="พิมพ์ชื่อแท็กที่นี่..."
          style={{ padding: "8px", flex: 1, border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button 
          onClick={handleAddTag}
          style={{ padding: "8px 16px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          เพิ่มแท็ก
        </button>
      </div>

      {/* ส่วนแสดงผลข้อมูล */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tags.map((tag) => (
          <li key={tag.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" }}>
            <span>{tag.tagName}</span>
            <button 
              onClick={() => handleDelete(tag.id)}
              style={{ color: "red", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
            >
              ลบ ❌
            </button>
          </li>
        ))}
      </ul>

      {tags.length === 0 && <p style={{ color: "gray", textAlign: "center" }}>ยังไม่มีข้อมูล ลองเพิ่มดูสิ!</p>}
    </div>
  );
}