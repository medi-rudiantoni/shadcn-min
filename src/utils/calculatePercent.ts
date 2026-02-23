export default function calculatePercent(amount: number, taxPercent: number = 11): number {
  return (amount * taxPercent) / 100;
}