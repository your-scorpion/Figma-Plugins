let frame = figma.createFrame()

export function createFrame(x, y) {
	// Move to (50, 50)
	frame.x = 0
	frame.y = 0
	frame.resize(x, y)

	return
}
