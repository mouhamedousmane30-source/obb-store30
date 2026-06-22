export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export function generateOrderNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  // Get the current order counter from localStorage (only on client side)
  let counter = 0;
  if (typeof window !== 'undefined') {
    counter = parseInt(localStorage.getItem('orderCounter') || '0', 10);
    counter += 1;
    localStorage.setItem('orderCounter', counter.toString());
  }

  const seq = String(counter).padStart(5, "0");
  return `OBB-${y}${m}${day}-${seq}`;
}
