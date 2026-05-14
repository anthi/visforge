const TOOLTIP_W = 248;
const TOOLTIP_H = 116;
const OFFSET = 14;

export function tooltipPosition(
	mouseX: number,
	mouseY: number,
	containerW: number,
	containerH: number
): { x: number; y: number } {
	let x = mouseX + OFFSET;
	let y = mouseY - TOOLTIP_H / 2;
	if (x + TOOLTIP_W > containerW - 8) x = mouseX - TOOLTIP_W - OFFSET;
	if (y < 8) y = 8;
	if (y + TOOLTIP_H > containerH - 8) y = containerH - TOOLTIP_H - 8;
	return { x, y };
}
