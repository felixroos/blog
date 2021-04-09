import React from 'react';
import NestedGrid from '../graphs/NestedGrid';
import { renderChordSymbols } from './ChordSymbol';

export default function SheetGrid({ measures }) {
  return (
    <NestedGrid rows={[1, 1, 1, 1]} innerBorders={true} outerBorders={false} cells={renderChordSymbols(measures)} />
  );
}
