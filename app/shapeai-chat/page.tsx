import { ShapeAIChat } from '@/Components/ShapeAIChat';
import { ShapeAIWidget } from '@/Components/ShapeAIWidget';

export default function ShapeAIChatPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">SHAPEAI Assistant</h1>
        <p className="text-slate-600">This assistant can chat, solve math, and help build websites.</p>
      </div>
      <ShapeAIChat />
      <div className="pt-8">
        <p className="text-sm text-slate-500">Floating widget demo:</p>
        <ShapeAIWidget />
      </div>
    </main>
  );
}
