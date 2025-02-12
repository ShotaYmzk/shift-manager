"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Shift {
  id: number;
  name: string;
  date: string;
  shift: string;
}

export default function AdminPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false); // 認証状態
  const [password, setPassword] = useState<string>(""); // パスワード入力用

  const correctPassword = "admin123"; // 管理者用の正しいパスワード (本番環境では絶対にハードコードしない)

  useEffect(() => {
    if (authenticated) {
      fetchShifts();
    }
  }, [authenticated]);

  const fetchShifts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("shifts").select("*");

    if (error) {
      console.error("エラー:", error);
      alert("シフトデータの取得中にエラーが発生しました。");
    } else {
      setShifts(data || []);
    }
    setLoading(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("パスワードが間違っています。");
    }
  };

  if (!authenticated) {
    // 認証されていない場合はパスワード入力画面を表示
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            管理者認証
          </h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                パスワード:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
            >
              認証する
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 認証成功後に管理者ページを表示
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        管理者画面
      </h1>
      {loading ? (
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