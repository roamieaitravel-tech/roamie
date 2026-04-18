"use client";

interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

interface BudgetChartProps {
  total: number;
  categories: BudgetCategory[];
}

export default function BudgetChart({ total, categories }: BudgetChartProps) {
  const gradient = categories
    .map((category, index) => {
      const share = Math.round((category.amount / total) * 100);
      return `${category.color} ${categories.slice(0, index).reduce((sum, current) => sum + Math.round((current.amount / total) * 100), 0)}% ${categories
        .slice(0, index + 1)
        .reduce((sum, current) => sum + Math.round((current.amount / total) * 100), 0)}%`;
    })
    .join(", ");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Budget distribution</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Budget breakdown</h3>
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          ${total} total
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-52 w-52 rounded-full bg-slate-100 p-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `conic-gradient(${gradient})` }}
          />
          <div className="absolute inset-12 flex items-center justify-center rounded-full bg-white text-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">${total}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:w-full">
          {categories.map((category) => {
            const percentage = Math.round((category.amount / total) * 100);
            return (
              <div key={category.name} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3.5 w-3.5 rounded-full" style={{ backgroundColor: category.color }} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">{percentage}% of total</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900">${category.amount}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
