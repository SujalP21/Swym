interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
    <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
  </div>
);
