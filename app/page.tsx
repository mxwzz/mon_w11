"use client";

import { useState, useEffect } from "react";

// กำหนดประเภทข้อมูล
type Tag = {
  id: number;
  tagName: string;
};

export default function Home() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [newTag, setNewTag] = useState("");
  
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fetchTags = async () => {
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTags(data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = async () => {
    if (!newTag) return alert("กรุณาพิมพ์ชื่อแท็กก่อนครับ");
    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagName: newTag }),
    });
    setNewTag("");
    fetchTags();
  };

  const handleEdit = async (id: number) => {
    if (!editName) return alert("กรุณาพิมพ์ชื่อแท็กที่ต้องการแก้ไข");
    await fetch(`/api/tags/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagName: editName }),
    });
    setEditId(null);
    setEditName("");
    fetchTags();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("แน่ใจหรือไม่ว่าจะลบแท็กนี้?")) return;
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    fetchTags();
  };

  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // กำหนดพื้นหลังหลักให้สว่างเสมอ และบังคับสีตัวอักษรให้เข้ม
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 px-4 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        
        {/* หัวเว็บ */}
        <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm">
          ระบบจัดการแท็ก (w11) 🏷️
        </h1>

        {/* กล่องส่วนค้นหา และ เพิ่มข้อมูล */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-blue-100">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="🔍 ค้นหาแท็ก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder-gray-400 bg-gray-50"
            />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="✨ พิมพ์ชื่อแท็กใหม่ที่นี่..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all text-gray-800 placeholder-gray-400 bg-gray-50"
            />
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              + เพิ่มข้อมูล
            </button>
          </div>
        </div>

        {/* ตารางข้อมูล */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <th className="p-4 font-semibold text-center w-20">ID</th>
                <th className="p-4 font-semibold text-lg">ชื่อแท็ก (Tag Name)</th>
                <th className="p-4 font-semibold text-center w-48">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-blue-50 transition-colors duration-150 group">
                    <td className="p-4 text-center font-medium text-gray-500">{tag.id}</td>
                    <td className="p-4 text-gray-800 text-lg font-medium">
                      {editId === tag.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full p-2 border-2 border-blue-400 rounded-lg focus:outline-none bg-white text-gray-800"
                          autoFocus
                        />
                      ) : (
                        tag.tagName
                      )}
                    </td>
                    <td className="p-4 text-center space-x-2">
                      {editId === tag.id ? (
                        <>
                          <button onClick={() => handleEdit(tag.id)} className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">บันทึก</button>
                          <button onClick={() => setEditId(null)} className="text-sm bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">ยกเลิก</button>
                        </>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => { setEditId(tag.id); setEditName(tag.tagName); }} 
                            className="text-sm bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm mr-2"
                          >
                            แก้ไข
                          </button>
                          <button 
                            onClick={() => handleDelete(tag.id)} 
                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                          >
                            ลบ
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-gray-400 text-lg">
                    อ๊ะ! ยังไม่มีข้อมูลแท็กในระบบเลย ลองเพิ่มดูสิ ✨
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}