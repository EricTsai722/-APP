
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const defaultExercises = {
    "腿部": [
      "深蹲", "腿推機", "腿彎舉", "保加利亞分腿蹲"
    ],
    "胸部": [
      "槓鈴上斜胸推", "啞鈴平胸推", "夾胸飛鳥"
    ],
    "背部": [
      "硬舉", "滑輪下拉", "槓鈴划船", "臉拉（Face Pull）"
    ],
    "肩部": [
      "啞鈴肩推", "側平舉", "阿諾肩推"
    ],
    "手臂": [
      "二頭彎舉", "三頭下壓"
    ]
  };

  const [exercises, setExercises] = useState(() => {
    const flatList = [];
    Object.entries(defaultExercises).forEach(([group, names]) => {
      names.forEach(name => {
        flatList.push({ group, name, checked: false, sets: "", reps: "", weight: "" });
      });
    });
    return flatList;
  });

  const [email, setEmail] = useState("");
  const [exportText, setExportText] = useState("");

  const handleChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = () => {
    const selected = exercises.filter(e => e.checked);
    const summary = `日期：${date}\n訓練紀錄：\n` +
      selected.map(e => `✅ [${e.group}] ${e.name} - ${e.sets} 組 × ${e.reps} 次 × ${e.weight} kg`).join("\n");

    window.open(`mailto:${email}?subject=訓練紀錄_${date}&body=${encodeURIComponent(summary)}`);
  };

  const handleExport = () => {
    const selected = exercises.filter(e => e.checked);
    const summary = `日期：${date}\n訓練紀錄：\n` +
      selected.map(e => `✅ [${e.group}] ${e.name} - ${e.sets} 組 × ${e.reps} 次 × ${e.weight} kg`).join("\n");

    setExportText(summary);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 16 }}>
      <h1>訓練紀錄</h1>

      <label>📅 日期：
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <div style={{ marginTop: 16 }}>
        {Object.keys(defaultExercises).map((group) => (
          <div key={group} style={{ marginBottom: 24 }}>
            <h3>{group}</h3>
            {exercises.filter(e => e.group === group).map((e, i) => (
              <div key={i}>
                <label>
                  <input
                    type="checkbox"
                    checked={e.checked}
                    onChange={(ev) => handleChange(exercises.findIndex(x => x.name === e.name), 'checked', ev.target.checked)}
                  />
                  {e.name}
                  <input
                    placeholder="組數"
                    style={{ width: 50, marginLeft: 8 }}
                    value={e.sets}
                    onChange={(ev) => handleChange(exercises.findIndex(x => x.name === e.name), 'sets', ev.target.value)}
                  />
                  ×
                  <input
                    placeholder="次數"
                    style={{ width: 50, marginLeft: 8 }}
                    value={e.reps}
                    onChange={(ev) => handleChange(exercises.findIndex(x => x.name === e.name), 'reps', ev.target.value)}
                  />
                  ×
                  <input
                    placeholder="重量kg"
                    style={{ width: 60, marginLeft: 8 }}
                    value={e.weight}
                    onChange={(ev) => handleChange(exercises.findIndex(x => x.name === e.name), 'weight', ev.target.value)}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <label>📧 傳送至 Email：
          <input type="email" style={{ marginLeft: 8 }} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 16, padding: 8 }}>📤 傳送訓練紀錄 Email</button>
      <button onClick={handleExport} style={{ marginTop: 8, padding: 8 }}>📋 匯出訓練文字（給教練）</button>

      {exportText && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f3f3', padding: 12, marginTop: 16 }}>{exportText}</pre>
      )}
    </div>
  );
}
