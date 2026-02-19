export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900">Bienvenido al Panel de Control</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Productos Totales</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Categorías Activas</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">0</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Últimas Ventas</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">$0.00</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-sm border border-zinc-100 mt-12">
        <h2 className="text-xl font-bold text-zinc-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/products/new" className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95">
            + Nuevo Producto
          </a>
          <a href="/admin/categories" className="inline-flex items-center rounded-lg bg-white border border-zinc-200 px-6 py-3 font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-50">
            Gestionar Categorías
          </a>
        </div>
      </div>
    </div>
  );
}
