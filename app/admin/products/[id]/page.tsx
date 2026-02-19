"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          apiFetch(`/admin/products/${id}`),
          apiFetch("/admin/categories")
        ]);

        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          
          setCategories(catData.categories);
          
          const p = prodData.product;
          setForm({
            title: p.title || "",
            description: p.description || "",
            priceCents: p.priceCents || 0,
            currency: p.currency || "MXN",
            categoryId: p.categoryId || "",
            isActive: p.isActive,
            details: {
              fichaTecnica: p.details?.fichaTecnica || "",
              infoColeccionista: p.details?.infoColeccionista || "",
              cuidadosProduct: p.details?.cuidadosProduct || ""
            },
            images: p.images?.map((img: any) => ({
              url: img.url,
              alt: img.alt || "",
              type: img.type
            })) || []
          });
        }
      } catch (err) {
        setError("Error al cargar los datos del producto");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await apiFetch(`/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar el producto");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin/products")}
            className="p-3 rounded-xl hover:bg-white hover:shadow-sm text-zinc-600 transition-all border border-transparent hover:border-zinc-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Editar Producto</h1>
            <p className="text-sm text-zinc-500 font-mono">{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={18} /> ¡Guardado!
            </span>
          )}
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Cambios</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-red-700 border border-red-100 shadow-sm animate-in shake duration-500">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-50 pb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Información del Producto
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">Título</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3.5 text-zinc-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                  placeholder="Título descriptivo..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700">Descripción</label>
                <textarea 
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3.5 text-zinc-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none font-medium"
                  placeholder="Historia y detalles del producto..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-50 pb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Especificaciones Técnicas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Ficha Técnica</label>
                <textarea 
                  value={form.details.fichaTecnica}
                  onChange={(e) => setForm({...form, details: {...form.details, fichaTecnica: e.target.value}})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm bg-zinc-50/50 focus:bg-white transition-all outline-none border-dashed"
                  placeholder="Ej. Dimensiones: 30x40cm, Material: Cuero..."
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Info para Coleccionistas</label>
                <textarea 
                  value={form.details.infoColeccionista}
                  onChange={(e) => setForm({...form, details: {...form.details, infoColeccionista: e.target.value}})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm bg-zinc-50/50 focus:bg-white transition-all outline-none border-dashed"
                  placeholder="Ej. Certificado #A123, Procedencia: Subasta Londres..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Galería Multimedia
              </h2>
              <button 
                onClick={addImage}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus size={16} /> Añadir Imagen
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-4 items-start p-5 rounded-2xl border border-zinc-100 bg-zinc-50/30 group/img relative">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    {img.url ? (
                      <img src={img.url} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      placeholder="URL de la imagen..."
                      value={img.url}
                      onChange={(e) => updateImage(idx, "url", e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 transition-all"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Alt text..."
                        value={img.alt}
                        onChange={(e) => updateImage(idx, "alt", e.target.value)}
                        className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-sm outline-none"
                      />
                      <select 
                        value={img.type}
                        onChange={(e) => updateImage(idx, "type", e.target.value as any)}
                        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm bg-white font-bold text-zinc-600 outline-none"
                      >
                        <option value="GALLERY">Galería</option>
                        <option value="MAIN">Principal</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeImage(idx)}
                    className="p-2 text-zinc-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-zinc-100 rounded-3xl text-zinc-400">
                  <ImageIcon size={56} strokeWidth={1} className="mb-3 opacity-50" />
                  <p className="font-medium">No has subido ninguna imagen</p>
                  <button onClick={addImage} className="mt-4 text-indigo-600 font-bold hover:underline">Subir la primera</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-100 space-y-6 sticky top-8">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-50 pb-4">Precio y Estado</h2>
            
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700 uppercase tracking-wider text-[10px]">Precio Actual</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-zinc-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={form.priceCents}
                    onChange={(e) => setForm({...form, priceCents: parseInt(e.target.value)})}
                    className="w-full rounded-2xl border border-zinc-200 pl-9 pr-4 py-4 text-2xl font-black text-zinc-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-400">EN CENTAVOS</span>
                  <span className="text-indigo-600">≈ ${(form.priceCents / 100).toLocaleString()} {form.currency}</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-zinc-700 uppercase tracking-wider text-[10px]">Categoría</label>
                <select 
                  value={form.categoryId}
                  onChange={(e) => setForm({...form, categoryId: e.target.value})}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-4 text-zinc-900 bg-white font-bold outline-none focus:border-indigo-300"
                >
                  <option value="">Sin categoría...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-900">Visibilidad</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">{form.isActive ? 'Público' : 'Borrador'}</span>
                </div>
                <button 
                  onClick={() => setForm({...form, isActive: !form.isActive})}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${form.isActive ? 'bg-emerald-500 shadow-inner' : 'bg-zinc-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
