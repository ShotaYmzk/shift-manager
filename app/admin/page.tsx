"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Chart as ChartJS, ChartOptions, CategoryScale, LinearScale, BarElement, Tooltip, TimeScale, Title } from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-date-fns"; // 時間軸をサポート
import { ja } from "date-fns/locale";

// 必要なChart.jsプラグインを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, TimeScale, Title);

interface Shift {
  id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
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

  // チャート用の設定 (型を明示的に指定)
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: {
        type: "time", // 時間軸に設定
        time: {
          unit: "minute",
          displayFormats: {
            minute: "HH:mm",  // 時間単位のフォーマット
          },
          // locale: ja,  // 日本語ロケール設定
        },
        title: {
          display: true,
          text: "時間",
        },
      },
      y: {
        title: {
          display: true,
          text: "名前",
        },
      },
    },
  };

  // チャートデータの生成
  const chartData = {
    labels: shifts.map((shift) => shift.name),  // 名前でラベルを設定
    datasets: [
      {
        label: "シフト時間",
        data: shifts.map((shift) => ({
          x: new Date(`${shift.date}T${shift.start_time}:00`),  // 開始時間
          x2: new Date(`${shift.date}T${shift.end_time}:00`),  // 終了時間
          y: shift.name,
        })),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
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
                  <td className="border border-gray-300 px-4 py-2">{shift.start_time}-{shift.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">シフトチャート</h1>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
