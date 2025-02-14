"use client";

import { useState } from "react";
import Link from "next/link"; // 管理者画面リンク用
import { supabase } from "./lib/supabase";

interface Shift {
  date: string;
  startTime: string;
  endTime: string;
}

export default function Home() {
  const [name, setName] = useState<string>("");
  const [shifts, setShifts] = useState<Shift[]>([{ date: "", startTime: "", endTime: "" }]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // シフトの値を変更
  const handleShiftChange = (index: number, field: keyof Shift, value: string) => {
    const newShifts = [...shifts];
    newShifts[index][field] = value;
    setShifts(newShifts);
  };

  // シフトを追加
  const addShift = () => {
    setShifts([...shifts, { date: "", startTime: "", endTime: "" }]);
  };

  // シフトを削除
  const removeShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // シフトデータを Supabase に送信
    const dataToSubmit = shifts.map((shift) => ({
      name,
      date: shift.date,
      start_time: shift.startTime,
      end_time: shift.endTime,
    }));

    const { error } = await supabase.from("shifts").insert(dataToSubmit);

    if (error) {
      console.error("エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    } else {
      alert("シフトが登録されました！");
      setName("");
      setShifts([{ date: "", startTime: "", endTime: "" }]); // リセット
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          シフト管理
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">名前:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {shifts.map((shift, index) => (
            <div key={index} className="space-y-2">
              <div>
                <label className="block text-gray-700 font-medium">日付:</label>
                <input
                  type="date"
                  value={shift.date}
                  onChange={(e) =>
                    handleShiftChange(index, "date", e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">開始時間:</label>
                <input
                  type="time"
                  value={shift.startTime}
                  onChange={(e) =>
                    handleShiftChange(index, "startTime", e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">終了時間:</label>
                <input
                  type="time"
                  value={shift.endTime}
                  onChange={(e) =>
                    handleShiftChange(index, "endTime", e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeShift(index)}
                  className="text-red-500 text-sm underline mt-2"
                >
                  このシフトを削除
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addShift}
            className="w-full py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
          >
            シフトを追加
          </button>
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
        <div className="mt-6">
          <Link href="/admin" className="block text-center bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800">
            管理者画面へ
          </Link>
        </div>
      </div>
    </div>
  );
}