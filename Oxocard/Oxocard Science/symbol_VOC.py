#Symbol VOC
def SymbolVOC():
    for i in 2:
        drawLine(0, 0, -50, 0)
        drawLine(-85, 0, -50, 0)
        drawCircle(-100 , 0, 15)
        drawLine(-69, -29, -50, 0)
        drawCircle(-80 , -40, 15)
        drawLine(-69, 29, -50, 0)
        drawCircle(-80 , 40, 15)
        rotate(PI/1.3)
    rotate(PI/-5)
    drawCircle(-50, 0, 15)
    drawLine(0, 0, -50, 0)