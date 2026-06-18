export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " FCFA";
}

export function generateOrderNumber(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `MH-${y}${m}${day}-${rand}`;
}
