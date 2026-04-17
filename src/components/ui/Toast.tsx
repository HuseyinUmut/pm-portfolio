export interface ToastItem {
  id: number;
  message: string;
}

export function ToastViewport({ items }: { items: ToastItem[] }) {
  return (
    <div className="toast-stack">
      {items.map((item) => (
        <div className="toast" key={item.id}>
          {item.message}
        </div>
      ))}
    </div>
  );
}
