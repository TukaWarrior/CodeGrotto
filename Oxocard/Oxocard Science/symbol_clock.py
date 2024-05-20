#Symbol TIme
def SymbolTime():
    drawArc(0, 0, 110, rad(0), rad(360))
    drawLine(0, 0, -60, -40)
    drawLine(0, 0, 40, -10)
    for i in 12:
        drawLine(0, -110, 0, -90)
        rotate(rad(30))