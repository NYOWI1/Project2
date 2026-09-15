export function calculateOrder({ quantity, unitPrice, stock }) {
  if (![quantity, unitPrice, stock].every(Number.isInteger)) {
    throw new Error('quantity, unitPrice, and stock must be integers');
  }
  if (quantity < 1 || unitPrice < 0 || stock < 0) {
    throw new Error('invalid quantity, price, or stock');
  }
  if (quantity > stock) {
    throw new Error('insufficient stock');
  }
  return { quantity, total: unitPrice, remainingStock: stock - quantity };
}
