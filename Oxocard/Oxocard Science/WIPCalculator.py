button_index = 0

class Grid:
    size_x:int
    size_y:int
    pos_x:int
    pos_y:int
    value:byte

    def init(x:int, y:int):
        size_x = x
        size_y = y

    def left():
        if pos_x <= 0
                pos_x = size_x
            else pos_x--

    def right():
        if pos_x >= size_x
                pos_x = 0
            else pos_x++

    def up():
        if pos_y <= 0
            pos_y = size_y
        else pos_y--

    def down():
        if pos_y >= size_y
                pos_y = 0
            else pos_y++

    def draw():
        fillHSV(0, 0, 100)
        drawRectangle(pos_x*40,pos_y*40+120,40,40)

    def center():
        if pos_y == 0
            if pos_x == 0
                value = "+"
            elif pos_x == 1
                value = "+"
            elif pos_x == 2
            elif pos_x == 3
            elif pos_x == 4
            elif pos_x == 5
    
        elif pos_y == 1
            if pos_x == 0
            elif pos_x == 1
            elif pos_x == 2
            elif pos_x == 3
            elif pos_x == 4
            elif pos_x == 5

        elif pos_y == 2
            if pos_x == 0
            elif pos_x == 1
            elif pos_x == 2
            elif pos_x == 3
            elif pos_x == 4
            elif pos_x == 5
update()

grid:Grid
grid.init(5, 2)
grid.draw()


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



def onDraw():
    clear()
    drawGrid()
    grid.draw()
    drawText(120, 60, button_index)
    drawText(120, 40, grid.value)
    update()

def onClick():
    b:buttons = getButtons()

    if b.down: 
        button_index += 10
        grid.down()
        grid.draw()
    if b.up:
        button_index -= 10
        grid.up()
    if b.right:
        button_index += 1
        grid.right()
    if b.left:
        button_index -= 1
        grid.left()