"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { 
  Plus, 
  Search, 
  Loader2, 
  Image as ImageIcon, 
  Edit2, 
  Trash2,
  ExternalLink,
  Package
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await apiFetch(`/admin/products${search ? `?q=${search}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const res = await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Inventario de Productos</h1>
          <p className="text-zinc-500 mt-1">Gestiona tus piezas únicas y memorabilia</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Nuevo Producto
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-2 shadow-sm border border-zinc-200 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
        <Search className="text-zinc-400" size={22} />
        <input 
          type="text" 
          placeholder="Buscar por título o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent py-3 text-base outline-none placeholder:text-zinc-400 font-medium"
        />
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Producto</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Categoría</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Precio</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Estado</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Package size={48} strokeWidth={1} />
                      <p className="italic text-lg">No se encontraron productos en la base de datos</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200">
                          {p.images?.find((i: any) => i.type === 'MAIN')?.url ? (
                            <img src={p.images.find((i: any) => i.type === 'MAIN').url} alt={p.title} className="h-full w-full object-cover" />
                          ) : p.images?.[0] ? (
                            <img src={p.images[0].url} alt={p.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-300">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-lg leading-tight">{p.title}</p>
                          <p className="text-xs text-zinc-400 font-mono mt-1">{p.id.substring(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.category ? (
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                          {p.category.name}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic text-sm">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 text-lg">${(p.priceCents / 100).toLocaleString()}</span>
                        <span className="text-xs text-zinc-400 font-medium uppercase">{p.currency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                        p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-zinc-400"}`} />
                        {p.isActive ? "Visible" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${p.id}`}
                          className="rounded-lg p-2.5 text-zinc-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                          title="Editar producto"
                        >
                          <Edit2 size={20} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg p-2.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-all"
                          title="Eliminar producto"
                        >
                          <Trash2 size={20} />
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
    </div>
  );
}
