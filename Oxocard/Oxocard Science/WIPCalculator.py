button_index = 0

def drawGrid():
    drawLine(0, 120, 240, 120)
    drawLine(0, 160, 240, 160)
    drawLine(0, 200, 240, 200)

    drawLine(40, 120, 40, 240)
    drawLine(80, 120, 80, 240)
    drawLine(120, 120, 120, 240)
    drawLine(160, 120, 160, 240)
    drawLine(200, 120, 200, 240)

    textFont(FONT_ROBOTO_24)
    textAlignment(TEXT_ALIGN_CENTER)

    # Buttons Top Row
    drawText(20, 125, "+")
    drawText(60, 125, "-")
    drawText(100, 125, "*")
    drawText(140, 125, "/")
    drawText(180, 125, "%")
    drawText(220, 125, "=")

    # Buttons Middle Row
    drawText(20, 165, "1")
    drawText(60, 165, "2")
    drawText(100, 165, "3")
    drawText(140, 165, "4")
    drawText(180, 165, "5")
    drawText(220, 165, "Pi")

    # Buttons Bottom Row
    drawText(20, 205, "6")
    drawText(60, 205, "7")
    drawText(100, 205, "8")
    drawText(140, 205, "9")
    drawText(180, 205, "0")
    drawText(220, 205, ".")

#     drawText(x, y, text)
#     drawText(x, y, text)
#     drawText(x, y, text)
#     drawText(x, y, text)
#     drawText(x, y, text)
#     drawLine(180, 120, 180, 240)
#     drawLine(210, 120, 210, 240)





def onDraw():
    clear()
    drawGrid()
    drawText(120, 60, button_index)
    update()

def onClick():
    b:buttons = getButtons()

    if b.down: 
        if 10% button_index == 0
            button_index += 10
    if b.up:
        button_index -= 10
    if b.right:
        button_index += 1
    if b.left:
        button_index -= 1