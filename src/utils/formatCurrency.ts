export default function formatCurrency(
  price: number,
  currency: string = "IDR"
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}
