/**
 * @file packages/cli/src/tools/bytes.ts
 * @description Byte unit converter and human-readable data size formatter.
 */

export interface ByteBreakdown {
  bytes: number;
  binary: {
    kib: number;
    mib: number;
    gib: number;
    tib: number;
    human: string;
  };
  decimal: {
    kb: number;
    mb: number;
    gb: number;
    tb: number;
    human: string;
  };
}

export function formatBytes(bytes: number): ByteBreakdown {
  const absBytes = Math.abs(bytes);

  // Binary (1024)
  const kib = absBytes / 1024;
  const mib = kib / 1024;
  const gib = mib / 1024;
  const tib = gib / 1024;

  let binaryHuman = `${absBytes} B`;
  if (tib >= 1) binaryHuman = `${tib.toFixed(2)} TiB`;
  else if (gib >= 1) binaryHuman = `${gib.toFixed(2)} GiB`;
  else if (mib >= 1) binaryHuman = `${mib.toFixed(2)} MiB`;
  else if (kib >= 1) binaryHuman = `${kib.toFixed(2)} KiB`;

  // Decimal (1000)
  const kb = absBytes / 1000;
  const mb = kb / 1000;
  const gb = mb / 1000;
  const tb = gb / 1000;

  let decimalHuman = `${absBytes} B`;
  if (tb >= 1) decimalHuman = `${tb.toFixed(2)} TB`;
  else if (gb >= 1) decimalHuman = `${gb.toFixed(2)} GB`;
  else if (mb >= 1) decimalHuman = `${mb.toFixed(2)} MB`;
  else if (kb >= 1) decimalHuman = `${kb.toFixed(2)} KB`;

  return {
    bytes,
    binary: {
      kib: Number(kib.toFixed(2)),
      mib: Number(mib.toFixed(2)),
      gib: Number(gib.toFixed(2)),
      tib: Number(tib.toFixed(2)),
      human: binaryHuman,
    },
    decimal: {
      kb: Number(kb.toFixed(2)),
      mb: Number(mb.toFixed(2)),
      gb: Number(gb.toFixed(2)),
      tb: Number(tb.toFixed(2)),
      human: decimalHuman,
    },
  };
}

export function parseByteString(input: string): number {
  const match = input.trim().match(/^([0-9.]+)\s*([a-zA-Z]+)?$/);
  if (!match) {
    const raw = Number(input.trim());
    if (isNaN(raw)) throw new Error(`Cannot parse bytes from: "${input}"`);
    return raw;
  }

  const val = parseFloat(match[1]);
  const unit = (match[2] || "B").toUpperCase();

  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1000,
    KIB: 1024,
    MB: 1000 ** 2,
    MIB: 1024 ** 2,
    GB: 1000 ** 3,
    GIB: 1024 ** 3,
    TB: 1000 ** 4,
    TIB: 1024 ** 4,
  };

  const mult = multipliers[unit] || 1;
  return Math.round(val * mult);
}
