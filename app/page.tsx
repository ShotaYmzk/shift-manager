import { useState } from 'react';
import { supabase } from '../lib/supabase'; // Supabaseクライアントをインポート

interface Shift {
  id?: number;
  name: string;
  date: string;
  shift: string;
}

export default function Home() {
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [shift, setShift] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // シフトデータをSupabaseに追加
    const { data, error } = await supabase
  .from('shifts')
  .insert([{ name, date, shift }]);

    if (error) {
      console.error('エラー:', error);
    } else {
      alert('シフトが登録されました！');
      setName('');
      setDate('');
      setShift('');
    }
  };

  return (
    <div>
      <h1>シフト管理</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">名前:</label>
          <input
            type="text"
            id="name"
            placeholder="名前を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">日付:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="shift">シフト:</label>
          <select
            id="shift"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            required
          >
            <option value="">シフトを選択</option>
            <option value="morning">朝</option>
            <option value="afternoon">昼</option>
            <option value="night">夜</option>
          </select>
        </div>
        <button type="submit">送信</button>
      </form>
    </div>
  );
}

