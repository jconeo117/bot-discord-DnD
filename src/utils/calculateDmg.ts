export function calculateDmg(points: number, current_points: number = 0): string {
  var pc: number = points + current_points
  const dice = Math.floor(pc / 3)
  const modifier = pc % 3

  if (modifier !== 0) {
    return `${dice + 1}d6 + ${modifier}`
  } else {
    return `${dice + 1}d6`
  }
}

export function calculatePoints(dmgStr: String): number {
  const parts = dmgStr.split('d6')
  const dice = parseInt(parts[0])
  let modifier = 0

  if (parts.length > 1 && parts[1].trim()) {
    modifier = parseInt(parts[1].trim().replace('+', ''))
  }

  return (dice - 1) * 3 + modifier
}