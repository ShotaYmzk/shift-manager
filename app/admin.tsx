"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

interface Shift {
  id: number;
  name: string;
  date: string;
  shift: string;
}

export default function Admin() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShifts = async () => {
      const { data, error } = await supabase.from("shifts").select("*");
      if (error) {
        console.error("エラー:", error);
      } else {
        setShifts(data || []);
      }
      setIsLoading(false);
    };

    fetchShifts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          管理者画面
        </h1>
        {isLoading ? (
          <p>データを読み込み中...</p>
        ) : shifts.length === 0 ? (
          <p>シフトデータがありません。</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">名前</th>
                <th className="border border-gray-300 px-4 py-2">日付</th>
                <th className="border border-gray-300 px-4 py-2">シフト</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id}>
                  <td className="border border-gray-300 px-4 py-2">{shift.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{shift.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{shift.shift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}