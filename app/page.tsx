"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase"; // Supabaseクライアントをインポート

// interface Shift {
//   id?: number;
//   name: string;
//   date: string;
//   shift: string;
// }

export default function Home() {
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [shift, setShift] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("shifts")
      .insert([{ name, date, shift }]);

    if (error) {
      console.error("エラー:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } else {
      alert("シフトが登録されました！");
      setName("");
      setDate("");
      setShift("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          シフト管理
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              名前:
            </label>
            <input
              type="text"
              id="name"
              placeholder="名前を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-700 font-medium">
              日付:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="shift" className="block text-gray-700 font-medium">
              シフト:
            </label>
            <select
              id="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">シフトを選択</option>
              <option value="morning">朝</option>
              <option value="afternoon">昼</option>
              <option value="night">夜</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white font-bold rounded-md ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "送信中..." : "送信"}
          </button>
        </form>
      </div>
    </div>
  );
}