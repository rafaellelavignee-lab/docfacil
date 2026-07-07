export function isValidCNPJ(rawValue: string): boolean {
  const cnpj = rawValue.replace(/\D/g, "")
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false

  const digits = cnpj.split("").map(Number)

  const calcCheckDigit = (length: number) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < length; i++) {
      sum += digits[i] * weights[i]
    }
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  return calcCheckDigit(12) === digits[12] && calcCheckDigit(13) === digits[13]
}
