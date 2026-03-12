import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Dumbbell, Tag, ChevronDown } from 'lucide-react';
import API from '../api/axios';

export default function WorkoutModal({ isOpen, onClose, refreshWorkouts, initialData }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Strength');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [exercises, setExercises] = useState([{ exerciseName: '', sets: '', reps: '', weight: '' }]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'Strength');
      setNotes(initialData.notes || '');
      setTags(initialData.tags || []);
      setExercises(initialData.exercises?.length ? initialData.exercises : [{ exerciseName: '', sets: '', reps: '', weight: '' }]);
    } else {
      setName('');
      setCategory('Strength');
      setNotes('');
      setTags([]);
      setExercises([{ exerciseName: '', sets: '', reps: '', weight: '' }]);
    }
  }, [initialData, isOpen]);

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const addExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, category, notes, exercises, tags };
    try {
      const token = localStorage.getItem('token');
      if (initialData) {
        await API.put(`/workouts/${initialData._id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await API.post('/workouts', payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      refreshWorkouts();
      onClose();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Container fix: overflow-hidden to stop double scrollbars */}
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black">
          <h2 className="text-2xl font-serif italic text-white">
            {initialData ? 'Edit Routine' : 'Create New Routine'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2 block">Routine Name</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Upper Body Power"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BFFF00] transition-colors text-white"
              />
            </div>
            
            {/* CLEAN CATEGORY DROPDOWN FIX */}
            <div>
              <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2 block text-white">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BFFF00] transition-colors text-white appearance-none cursor-pointer"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="HIIT">HIIT</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] uppercase font-black text-[#BFFF00] tracking-widest flex items-center gap-2">
                <Dumbbell size={14} /> Exercises
              </label>
              <button 
                type="button"
                onClick={addExercise}
                className="text-[10px] font-black uppercase tracking-tighter bg-[#BFFF00]/10 text-[#BFFF00] px-3 py-1 rounded-lg border border-[#BFFF00]/20 hover:bg-[#BFFF00] hover:text-black transition-all"
              >
                + Add Movement
              </button>
            </div>

            <div className="space-y-4">
              {exercises.map((ex, index) => (
                <div key={index} className="group bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input 
                      placeholder="Exercise Name"
                      value={ex.exerciseName}
                      onChange={(e) => updateExercise(index, 'exerciseName', e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-1 focus:border-[#BFFF00] outline-none text-sm font-bold text-white md:col-span-1"
                    />
                    <input 
                      type="number" placeholder="Sets"
                      value={ex.sets}
                      onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-1 focus:border-[#BFFF00] outline-none text-sm text-center text-white"
                    />
                    <input 
                      type="number" placeholder="Reps"
                      value={ex.reps}
                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                      className="bg-transparent border-b border-white/10 py-1 focus:border-[#BFFF00] outline-none text-sm text-center text-white"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" placeholder="Kg"
                        value={ex.weight}
                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        className="flex-1 bg-transparent border-b border-white/10 py-1 focus:border-[#BFFF00] outline-none text-sm text-center text-white"
                      />
                      {exercises.length > 1 && (
                        <button type="button" onClick={() => removeExercise(index)} className="text-zinc-600 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2 block flex items-center gap-2">
              <Tag size={14} /> Organization Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-[#BFFF00]/10 text-[#BFFF00] text-[10px] font-black uppercase px-2 py-1 rounded-md border border-[#BFFF00]/20">
                  #{tag}
                  <X size={10} className="cursor-pointer" onClick={() => removeTag(tag)} />
                </span>
              ))}
            </div>
            <input 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type tag and press Enter"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BFFF00] transition-colors text-white text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2 block">Coaching Notes</label>
            <textarea 
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Focus on form..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#BFFF00] transition-colors text-white text-sm resize-none"
            />
          </div>

          <button 
            type="submit"
            className="sticky bottom-0 w-full bg-[#BFFF00] text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl"
          >
            {initialData ? 'Update Routine' : 'Save Routine'}
          </button>
        </form>
      </div>
    </div>
  );
}