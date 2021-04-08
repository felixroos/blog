export function conjunction<T>(a: T[], b: T[]) {
  return a.filter(el => b.includes(el))
}