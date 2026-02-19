"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, Trash2, Edit2, Loader2, Tags, ChevronRight, Layers } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    parentId: ""
  });
  
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setError("");

    try {
      const url = editingId ? `/admin/categories/${editingId}` : "/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", parentId: "" });
        setIsAdding(false);
        setEditingId(null);
        fetchCategories();
      } else {
        const data = await res.json();
        setError(data.message || "Error al guardar la categoría");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({ 
      name: cat.name, 
      parentId: cat.parentId || "" 
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", parentId: "" });
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      const res = await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || "Error al eliminar");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  // Filtrar posibles padres (evitar que una categoría sea su propio padre o que sea una subcategoría ya existente para no complicar el árbol de momento)
  const parentCandidates = categories.filter(c => !c.parentId && c.id !== editingId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Estructura de Categorías</h1>
          <p className="text-zinc-500 mt-1">Organiza tu memorabilia por deportes, ligas o épocas</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white transition-all active:scale-95 shadow-lg ${
            isAdding ? "bg-zinc-800 hover:bg-zinc-900 shadow-zinc-100" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
          }`}
        >
          {isAdding ? "Cancelar" : <><Plus size={20} /> Nueva Categoría</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="rounded-2xl bg-white p-8 shadow-sm border-2 border-indigo-50 animate-in zoom-in-95 duration-200">
          <h2 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Layers className="text-indigo-500" size={20} />
            {editingId ? "Editar Categoría" : "Añadir Nueva Categoría"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider text-[10px]">Nombre</label>
              <input 
                autoFocus
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                placeholder="Ej. Liga MX, NBA, Balones..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 uppercase tracking-wider text-[10px]">Pertenece a (Opcional)</label>
              <select 
                value={formData.parentId}
                onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 bg-white font-medium outline-none focus:border-indigo-300"
              >
                <option value="">-- Es Categoría Principal --</option>
                {parentCandidates.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              type="button"
              onClick={cancelAdd}
              className="px-6 py-3 font-bold text-zinc-500 hover:bg-zinc-50 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="rounded-xl bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              {editingId ? "Actualizar" : "Crear Categoría"}
            </button>
          </div>
          {error && <p className="mt-4 text-sm font-bold text-red-600 animate-bounce">{error}</p>}
        </form>
      )}

      <div className="rounded-2xl bg-white shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nombre de Categoría</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tipo</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Estadísticas</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-400">
                  <Tags size={48} strokeWidth={1} className="mx-auto mb-3 opacity-30" />
                  <p className="italic text-lg font-medium">No hay categorías configuradas aún</p>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {cat.parentId ? (
                        <div className="flex items-center text-zinc-400">
                          <span className="text-xs font-bold mr-2 text-zinc-300">└</span>
                          <ChevronRight size={14} className="mr-1" />
                        </div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2" />
                      )}
                      <span className={`font-bold text-zinc-900 ${cat.parentId ? 'text-zinc-600 font-semibold' : 'text-lg'}`}>
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {cat.parentId ? (
                      <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Subcategoría de {cat.parent?.name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                        Categoría Principal
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Layers size={14} /> {cat._count?.subcategories || 0} Subs
                      </span>
                      <span className="flex items-center gap-1">
                        <Plus size={14} className="rotate-45" /> {cat._count?.products || 0} Prods
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => startEdit(cat)}
                        className="rounded-lg p-2.5 text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="rounded-lg p-2.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
