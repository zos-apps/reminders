import { useState } from 'react';
import type { AppProps } from '@zos-apps/config';
import { useLocalStorage } from '@zos-apps/config';

interface Reminder { id: string; text: string; done: boolean; list: string; }

const defaultReminders: Reminder[] = [
  { id: '1', text: 'Buy groceries', done: false, list: 'Today' },
  { id: '2', text: 'Call mom', done: false, list: 'Today' },
  { id: '3', text: 'Finish project', done: true, list: 'Work' },
];

const Reminders: React.FC<AppProps> = ({ onClose: _onClose }) => {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', defaultReminders);
  const [input, setInput] = useState('');
  const [selectedList, setSelectedList] = useState('Today');

  const addReminder = () => {
    if (!input.trim()) return;
    setReminders([...reminders, { id: Date.now().toString(), text: input, done: false, list: selectedList }]);
    setInput('');
  };

  const toggle = (id: string) => setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  const lists = ['Today', 'Scheduled', 'All', 'Work', 'Personal'];
  const filtered = selectedList === 'All' ? reminders : reminders.filter(r => r.list === selectedList);

  return (
    <div className="h-full flex bg-gray-100">
      <div className="w-48 bg-white border-r p-4">
        <h1 className="text-lg font-bold mb-4">✅ Reminders</h1>
        {lists.map(l => (
          <button key={l} onClick={() => setSelectedList(l)} className={`w-full text-left px-3 py-2 rounded mb-1 ${selectedList === l ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
            {l} <span className="float-right text-xs opacity-60">{reminders.filter(r => l === 'All' || r.list === l).length}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">{selectedList}</h2>
        <div className="flex-1 overflow-auto">
          {filtered.map(r => (
            <div key={r.id} onClick={() => toggle(r.id)} className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2 cursor-pointer hover:bg-gray-50">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${r.done ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{r.done && '✓'}</div>
              <span className={r.done ? 'line-through text-gray-400' : ''}>{r.text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addReminder()} placeholder="New reminder" className="flex-1 px-4 py-2 border rounded-lg" />
          <button onClick={addReminder} className="px-4 py-2 bg-blue-500 text-white rounded-lg">+</button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
