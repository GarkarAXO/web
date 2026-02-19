"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceCents: 0,
    currency: "MXN",
    categoryId: "",
    isActive: true,
    details: {
      fichaTecnica: "",
      infoColeccionista: "",
      cuidadosProduct: ""
    },
    images: [] as { url: string; alt: string; type: "MAIN" | "GALLERY" }[]
  });

  useEffect(() => {
    async function fetchCats() {
      const res = await apiFetch("/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    }
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validar datos básicos
      if (!form.title || form.priceCents <= 0) {
        throw new Error("El título y un precio mayor a 0 son obligatorios");
      }

      const res = await apiFetch("/admin/products", {
        method: "POST",
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el producto");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    setForm({
      ...form,
      images: [...form.images, { url: "", alt: "", type: form.images.length === 0 ? "MAIN" : "GALLERY" }]
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...form.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setForm({ ...form, images: newImages });
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-zinc-900">Nuevo Producto</h1>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Producto</>}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700 border border-red-100">
          <AlertCircle size={20} />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-50 pb-4">Información General</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">Título del Producto</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="Ej. Memorabilia Autografiada de Pelé"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">Descripción</label>
                <textarea 
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                  placeholder="Describe la historia y detalles del producto..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-50 pb-4">Detalles Técnicos</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Ficha Técnica</label>
                <textarea 
                  value={form.details.fichaTecnica}
                  onChange={(e) => setForm({...form, details: {...form.details, fichaTecnica: e.target.value}})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
                  placeholder="Medidas, peso, materiales..."
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Información para Coleccionistas</label>
                <textarea 
                  value={form.details.infoColeccionista}
                  onChange={(e) => setForm({...form, details: {...form.details, infoColeccionista: e.target.value}})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm"
                  placeholder="Certificados de autenticidad, procedencia..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <h2 className="text-lg font-bold text-zinc-900">Galería de Imágenes</h2>
              <button 
                onClick={addImage}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus size={16} /> Añadir Imagen
              </button>
            </div>
            
            <div className="space-y-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      placeholder="URL de la imagen"
                      value={img.url}
                      onChange={(e) => updateImage(idx, "url", e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Texto descriptivo (alt)"
                        value={img.alt}
                        onChange={(e) => updateImage(idx, "alt", e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                      />
                      <select 
                        value={img.type}
                        onChange={(e) => updateImage(idx, "type", e.target.value)}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white"
                      >
                        <option value="GALLERY">Galería</option>
                        <option value="MAIN">Principal</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeImage(idx)}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400">
                  <ImageIcon size={48} strokeWidth={1} className="mb-2" />
                  <p className="text-sm">No hay imágenes añadidas aún</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-50 pb-4">Precio y Estado</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">Precio (en Centavos)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-zinc-400">$</span>
                  <input 
                    type="number" 
                    value={form.priceCents}
                    onChange={(e) => setForm({...form, priceCents: parseInt(e.target.value)})}
                    className="w-full rounded-xl border border-zinc-200 pl-8 pr-4 py-3 text-zinc-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="0"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-400">Ej: 1000 = $10.00 MXN</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">Categoría</label>
                <select 
                  value={form.categoryId}
                  onChange={(e) => setForm({...form, categoryId: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 bg-white"
                >
                  <option value="">Seleccionar categoría...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <span className="text-sm font-semibold text-zinc-700">Producto Activo</span>
                <button 
                  onClick={() => setForm({...form, isActive: !form.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-indigo-600' : 'bg-zinc-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
