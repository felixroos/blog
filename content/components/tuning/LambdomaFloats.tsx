import React from "react"
import { maxFractionSize } from "./tuning"
import { gcd } from "../common/gcd"
import { Lambdoma } from "./Lambdoma"

export function LambdomaFloats({ floats, base, size }) {
  const freqs = floats.map((fraction) => fraction * base)
  const isEqual = (a, b, precision = 100000) => {
    return Math.round(a * precision) === Math.round(b * precision)
  }
  const maxSize = maxFractionSize(floats)
  return (
    <Lambdoma
      hideZeroes={true}
      angle={0}
      filter={([value, top, bottom]) =>
        freqs.find(
          (freq) => isEqual(freq, base * value) && gcd(top, bottom) === 1
        )
      }
      margin={0}
      cols={maxSize[0]}
      rows={maxSize[1]}
      radius={size || 20}
      base={base}
    />
  )
}
