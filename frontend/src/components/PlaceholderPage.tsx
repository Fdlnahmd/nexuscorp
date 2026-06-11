export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center py-20">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
      <p className="text-slate-500">This page is part of the UI concept and is currently a placeholder.</p>
    </div>
  );
}
