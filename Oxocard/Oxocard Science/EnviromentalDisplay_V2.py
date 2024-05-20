# This is a small project done for school, which displays temperature, air quality, tvoc, co2 and the current time on individual pages and on a dashboard.
# It features three color themes and indificually drawn symbols for each meassurement. 
# This code is very rough and bodged together because it was created with zero programming knowledge.

#Variables
setPrecision(2)
menu = 1
theme = 0
themecolor = 255
strokeHSV(0, 0, 0)
strokeWeight(3)

#Background
def Background():
    if theme == 0: 
        themecolor = 255
    elif theme == 1:
        themecolor = 50
    elif theme == 2:
        themecolor = 100
    backgroundHSV(0, 0, themecolor)
    drawArc(30,30,20,PI/1,PI/2) #Frame TopLeft Arc
    drawArc(210,30,20,PI/-2,PI/2) #Frame TopRight Arc
    drawArc(30,210,20,PI/2,PI/2) #Frame BottomLeft Arc
    drawArc(210,210,20,0,PI/2) #Frame BottomRight Arc
    drawLine(30, 10, 210, 10) #Frame Top Line
    drawLine(10, 30, 10, 210) #Frame Left Line
    drawLine(230, 30, 230, 210) #Frame Right Line
    drawLine(30, 230, 210, 230) #Frame Bottom Line
    drawLine(10, 60, 230, 60) #Title Divider Line
    drawLine(10, 180, 230, 180) #Bottom Divider Line

#Symbol CO2
def SymbolCO2():
    drawArc(-60, 30, 50, PI/2, PI/1)
    drawArc(60, 30, 50, PI/-2, PI/1)
    drawArc(15, -30, 45, PI/-1.35, PI/1)
    drawArc(-34, -40, 30, PI/1.4, PI/1)
    drawArc(-28, 70, 35, PI/1.1, PI/-1.25)
    drawArc(30, 70, 28, PI/1.15, PI/-1.25)

#Symbol VOC
def SymbolVOC():
    fillHSV(0, 0, 0)
    drawCircle(0, 0, 15)
    for i in 2:
        fillHSV(0, 0, 0)
        drawCircle(-50, 0, 15)
        drawLine(0, 0, -50, 0)
        noFill()
        drawLine(-85, 0, -50, 0)
        drawCircle(-100 , 0, 15)
        drawLine(-69, -29, -50, 0)
        drawCircle(-80 , -40, 15)
        drawLine(-69, 29, -50, 0)
        drawCircle(-80 , 40, 15)
        rotate(PI/1.3)
    rotate(PI/-5)
    fillHSV(0, 0, 0)
    drawCircle(-50, 0, 15)
    drawLine(0, 0, -50, 0)
    noFill()

#Symbol IAQ
def SymbolIAQ():
    drawLine(-50, -30, 18, -30) 
    drawArc(20, -60, 30, rad(90), rad(-240))
    drawLine(-50, 30, 75, 30)
    drawArc(75, 60, 30, rad(270), rad(260))
    drawLine(-10, 0, 80, 0)
    drawLine(-55, 0, -30, 0)
    drawLine(60, -30, 70, -30)
    drawLine(-10, 60, 20, 60)

#Symbol TIme
def SymbolTime():
    drawArc(0, 0, 110, rad(0), rad(360))
#     fillHSV(0, 0, 0)
    drawCircle(0, 0, 5)
#     noFill()
    drawLine(0, 0, -60, -40)
    drawLine(0, 0, 40, -10)
    for i in 12:
        drawLine(0, -110, 0, -90)
        rotate(rad(30))

def SymbolTemperature():
    drawArc(0, 80, 30, rad(225), rad(-270))
    drawArc(0, -80, 20, rad(180), rad(180))
    drawLine(-20, -80, -20, 58)
    drawLine(20, -80, 20, 58)
    fillHSV(0, 0, 0)
    #drawQuadrangle(-3, -80, 3, -80, 3, 80, -3, 80)
    noFill()
    drawLine(30, -70, 50, -70)
    #drawLine(30, -50, 50, -50)
    drawLine(30, -30, 50, -30)
    #drawLine(30, -10, 50, -10)
    drawLine(30, 10, 50, 10)
    #drawLine(30, 30, 50, 30)
    drawLine(30, 50, 50, 50)

#Symbol Humidity
def SymbolHumidity():
    drawArc(0, 80, 30, rad(225), rad(-270))
    drawArc(0, -80, 20, rad(180), rad(180))
    drawLine(-20, -80, -20, 58)
    drawLine(20, -80, 20, 58)
    fillHSV(0, 0, 0)
    drawCircle(0, 80, 15)
    drawQuadrangle(-5, -10, 5, -10, 5, 80, -5, 80)
    noFill()
    drawArc(60, 30, 26, rad(210), rad(-235))
    drawLine(38, 17, 60, -20)
    drawLine(82, 17, 60, -20)

#Symbol Ethanol
def SymbolEthanol():
    fillHSV(0, 0, 0)
    drawCircle(-30, 0, 20)
    drawCircle(30, 0, 20)
    drawCircle(100, 0, 30)
    noFill()
    drawCircle(-30, -60, 15)
    drawCircle(30, -60, 15)
    drawCircle(-30, 60, 15)
    drawCircle(30, 60, 15)
    drawCircle(-90, 0, 15)
    drawCircle(100, -60, 15)
    drawLine(-30, -50, -30, -10)
    drawLine(30, -50, 30, -10)
    drawLine(100, -50, 100, -10)
    drawLine(-30, 50, -30, 10)
    drawLine(30, 50, 30, 10)
    drawLine(-80, 0, 100, 0)

#Time Bar
def BarTime():
    textFont(FONT_ROBOTO_BOLD_32)

    #GetTime Hour
    if getHour() < 10:
        drawText(80, 185, "0" + getHour())
    else:
        drawText(80, 185, getHour())

    #GetTime Minute
    if getMinute() < 10:
        drawText(125, 185, "0" + getMinute())
    else:
        drawText(125, 185, getMinute())
    drawText(115, 185, ":")
    update()

#Page Clock
def Clock():
    textFont(FONT_ROBOTO_BOLD_32)
    textwidth = textWidth("Time")
    drawText(120-textwidth/2,17,"Time")

    #Symbol
    push()
    scale(0.175)
    translate(35, 35)
    SymbolTime()
    pop()

    #Indicator Colors
    push()
    fillHSV(150, 255, 255) #180 255 150
    drawQuadrangle(12, 61, 228, 61, 228, 178, 12, 178)
    pop()
    textFont(FONT_ROBOTO_BOLD_32)
    
    #GetTime Year
    drawText(140, 140, getYear())

    #GetTime Month
    if getMonth() == 1:
        drawText(75, 140, "Jan")
    elif getMonth() == 2:
        drawText(75, 140, "Feb")
    elif getMonth() == 3:
        drawText(75, 140, "Mar")
    elif getMonth() == 4:
        drawText(75, 140, "Apr")
    elif getMonth() == 5:
        drawText(75, 140, "May")
    elif getMonth() == 6:
        drawText(75, 140, "Jun")
    elif getMonth() == 7:
        drawText(75, 140, "Jul")
    elif getMonth() == 8:
        drawText(75, 140, "Aug")
    elif getMonth() == 9:
        drawText(75, 140, "Sep")
    elif getMonth() == 10:
        drawText(75, 140, "Oct")
    elif getMonth() == 11:
        drawText(75, 140, "Nov")
    elif getMonth() == 12:
        drawText(75, 140, "Dez")

#GetTime Day
    if getDay() < 10:
        drawText(30, 140, "0" + getDay())
    else:
        drawText(30, 140, getDay())

#GetTime Hour
    textFont(FONT_ROBOTO_BOLD_64)
    if getHour() < 10:
        drawText(20, 70, "0" + getHour())
    else:
        drawText(20, 70, getHour())

#GetTime Minute
    if getMinute() < 10:
        drawText(105, 70, "0" + getMinute())
    else:
        drawText(105, 70, getMinute())
    drawText(90, 70, ":")
    
#GetTime Second
    textFont(FONT_ROBOTO_BOLD_32)
    if getSecond() < 10:
        drawText(180, 100, "0" + getSecond())
    else:
        drawText(180, 100, getSecond())

#GetTime Weekda
    strokeHSV(0, 0, 0)
    textFont(FONT_ROBOTO_BOLD_32)
    if getWeekDay() == 0:
        textwidth = textWidth("Sunnday")
        drawText(120-textwidth/2,190,"Sunday")
    elif getWeekDay() == 1:
        textwidth = textWidth("Monday")
        drawText(120-textwidth/2,190,"Monday")
    elif getWeekDay() == 2: 
        textwidth = textWidth("Tuesday")
        drawText(120-textwidth/2,190,"Tuesday")
    elif getWeekDay() == 3:
        textwidth = textWidth("Wednesday")
        drawText(120-textwidth/2,190,"Wednesday")
    elif getWeekDay() == 4:
        textwidth = textWidth("Thursday")
        drawText(120-textwidth/2,190,"Thursday")
    elif getWeekDay() == 5:
        textwidth = textWidth("Friday")
        drawText(120-textwidth/2,190,"Friday")
    elif getWeekDay() == 6:
        textwidth = textWidth("Saturday")
        drawText(120-textwidth/2,190,"Saturday")

    push()
    pop()
    update()


#Page IAQ
def IAQ():
    setPrecision(2)
    strokeHSV(0, 0, 0)
    textFont(FONT_ROBOTO_BOLD_32)
    textwidth = textWidth("Air Quality")
    drawText(120-textwidth/2,17," Air Quality")
    push()

    #Symbol
    push()
    scale(0.2)
    translate(27, 35)
    SymbolIAQ()
    pop()

    #Indicator Colors
    if getIAQ() == -1:
        fillHSV(0, 0, 100)
    elif getIAQ() < 2:
        fillHSV(90, 255, 255)
    elif getIAQ() < 3:
        fillHSV(60, 255, 255)
    elif getIAQ() < 4:
        fillHSV(40, 255, 255)
    elif getIAQ() < 5:
        fillHSV(20, 255, 255)
    elif getIAQ() >= 5:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 61, 228, 61, 228, 178, 12, 178)

    #Value Display
    if getIAQ() == -1:
        textFont(FONT_ROBOTO_BOLD_80)
        textwidth = textWidth("...")
        drawText(120-textwidth/2,70,"...")
        textFont(FONT_ROBOTO_BOLD_24)
        textwidth = textWidth("Calibrating sensor...")
        drawText(120-textwidth/2,145,"Calibrating sensor...")
    else:
        textFont(FONT_ROBOTO_BOLD_80)
        textwidth = textWidth(getIAQ())
        drawText(120-textwidth/2,70,getIAQ())
        textFont(FONT_ROBOTO_BOLD_24)
        textwidth = textWidth("from 1 - 5")
        drawText(120-textwidth/2,145,"from 1 - 5")

    BarTime()
    pop()
    update()

#Page CO2
def CO2():
    setPrecision(1)
    strokeHSV(0, 0, 0)
    textFont(FONT_ROBOTO_BOLD_32)
    textwidth = textWidth("CO2")
    drawText(120-textwidth/2,17,"CO2")
    push()

    #Symbol
    push()
    scale(0.2)
    translate(40, 32)
    SymbolCO2()
    pop()

    #Indicator Colors
    if getCO2() == -1:
        fillHSV(0, 0, 100)
    elif getCO2() < 600:
        fillHSV(90, 255, 255)
    elif getCO2() < 1000:
        fillHSV(60, 255, 255)
    elif getCO2() < 1500:
        fillHSV(40, 255, 255)
    elif getCO2() < 2000:
        fillHSV(20, 255, 255)
    elif getCO2() >= 2000:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 61, 228, 61, 228, 178, 12, 178)

    #Value Display
    if getCO2() == -1:
        textFont(FONT_ROBOTO_BOLD_80)
        textwidth = textWidth("...")
        drawText(120-textwidth/2,70,"...")
        textFont(FONT_ROBOTO_BOLD_24)
        textwidth = textWidth("Calibrating sensor...")
        drawText(120-textwidth/2,145,"Calibrating sensor...")
    else:
        textFont(FONT_ROBOTO_BOLD_64)
        textwidth = textWidth(getCO2())
        drawText(120-textwidth/2,70,getCO2())
        textFont(FONT_ROBOTO_BOLD_24)
        textwidth = textWidth("in ppm")
        drawText(120-textwidth/2,145,"in ppm")

    BarTime()
    pop()
    update()

#Page TVOC
def TVOC():
    setPrecision(2)
    strokeHSV(0, 0, 0)
    textFont(FONT_ROBOTO_BOLD_32)
    textwidth = textWidth("TVOC")
    drawText(120-textwidth/2,17,"TVOC")
    push()

    #Symbol
    push()
    scale(0.2)
    translate(40, 35)
    SymbolVOC()
    pop()

    #Indicator Color
    if getTVOC() == -1:
        fillHSV(0, 0, 100)
    elif getTVOC() < 0.3:
        fillHSV(90, 255, 255)
    elif getTVOC() < 1:
        fillHSV(60, 255, 255)
    elif getTVOC() < 3:
        fillHSV(40, 255, 255)
    elif getTVOC() < 10:
        fillHSV(20, 255, 255)
    elif getTVOC() >= 10.0:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 61, 228, 61, 228, 178, 12, 178)

    #Value Display
    if getTVOC() == -1:
        textFont(FONT_ROBOTO_BOLD_80)
        textwidth = textWidth("...")
        drawText(120-textwidth/2,70,"...")
        textFont(FONT_ROBOTO_BOLD_24)
        textwidth = textWidth("Calibrating sensor...")
        drawText(120-textwidth/2,145,"Calibrating sensor...")
    else:
        textFont(FONT_ROBOTO_BOLD_80)
        textwidth = textWidth(getTVOC())
        drawText(120-textwidth/2,70,getTVOC())
        textFont(FONT_ROBOTO_BOLD_24)
        textwidth = textWidth("in ppm")
        drawText(120-textwidth/2,145,"in ppm")

    BarTime()
    pop()
    update()

#Page Temp
def Temp():
    setPrecision(1)
    strokeHSV(0, 0, 0)
    textFont(FONT_ROBOTO_BOLD_32)
    textwidth = textWidth("Temperature")
    drawText(120-textwidth/2,17," Temperature")
    push()

    #Symbol
    push()
    scale(0.2)
    translate(25, 35)
    SymbolTemperature()
    pop()

    #Indicator Color
    if  getTemperature() < 0:
        fillHSV(140, 255, 255)
    elif getTemperature() < 10:
        fillHSV(110, 255, 255)
    elif getTemperature() < 15:
        fillHSV(90, 255, 255)
    elif getTemperature() < 20:
        fillHSV(60, 255, 255)
    elif getTemperature() < 26:
        fillHSV(40, 255, 255)
    elif getTemperature() < 30:
        fillHSV(20, 255, 255)
    elif getTemperature() >= 30:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 61, 228, 61, 228, 178, 12, 178)

    #Value Display
    textFont(FONT_ROBOTO_BOLD_80)
    textwidth = textWidth(getTemperature())
    drawText(120-textwidth/2,70,getTemperature())
    textFont(FONT_ROBOTO_BOLD_24)
    textwidth = textWidth("° Celsius")
    drawText(120-textwidth/2,145,"° Celsius")

    BarTime()
    pop()
    update()

#Page Dashboard
def Dashboard():
    strokeHSV(0, 0, 0)
    textFont(FONT_ROBOTO_BOLD_32)
    textwidth = textWidth("Dashboard")
    drawText(120-textwidth/2,17,"Dashboard")
    push()

    #Indicator Colors IAQ
    if getIAQ() == -1:
        fillHSV(0, 0, 100)
    elif getIAQ() < 2:
        fillHSV(90, 255, 255)
    elif getIAQ() < 3:
        fillHSV(60, 255, 255)
    elif getIAQ() < 4:
        fillHSV(40, 255, 255)
    elif getIAQ() < 5:
        fillHSV(20, 255, 255)
    elif getIAQ() >= 5:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 61, 228, 61, 228, 100, 12, 100)

    #Indicator Colors CO2
    if getCO2() == -1:
        fillHSV(0, 0, 100)
    elif getCO2() < 600:
        fillHSV(90, 255, 255)
    elif getCO2() < 1000:
        fillHSV(60, 255, 255)
    elif getCO2() < 1500:
        fillHSV(40, 255, 255)
    elif getCO2() < 2000:
        fillHSV(20, 255, 255)
    elif getCO2() >= 2000:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 101, 228, 101, 228, 139, 12, 139)

    #Indicator Color TVOC
    if getTVOC() == -1:
        fillHSV(0, 0, 100)
    elif getTVOC() < 0.3:
        fillHSV(90, 255, 255)
    elif getTVOC() < 1:
        fillHSV(60, 255, 255)
    elif getTVOC() < 3:
        fillHSV(40, 255, 255)
    elif getTVOC() < 10:
        fillHSV(20, 255, 255)
    elif getTVOC() >= 10.0:
        fillHSV(0, 255, 255)
    drawQuadrangle(12, 140, 228, 140, 228, 178, 12, 178)

    #Symbol IAQ
    push()
    scale(0.18)
    translate(35, 81)
    SymbolIAQ()
    pop()

    #Symbol VOC
    push()
    scale(0.18)
    translate(40, 122)
    SymbolVOC()
    pop()

    #Symbol CO2
    push()
    scale(0.18)
    translate(40, 157)
    SymbolCO2()
    pop()

    #Value Display
    textFont(FONT_ROBOTO_BOLD_32)
    #drawText(20, 70, "IAQ")
    #drawText(20, 110, "CO2")
    #drawText(20, 150, "TVOC")
    drawText(80, 62, getIAQ())
    drawText(80, 102, getTVOC())
    drawText(80, 142, getCO2())
    textFont(FONT_ROBOTO_BOLD_16)
    drawText(158, 75, "from 1-5")
    drawText(183, 114, "ppm")
    drawText(183, 154, "ppm")
    
    BarTime()
    pop()
    update()

# Buttons
def onClick():
    b = getButtons()
    if b.right and menu < 6:
        menu +=1
    if b.left and menu > 0:
        menu -=1
    if b.up:
        if theme < 2:
            theme += 1
        elif theme == 2:
            theme = 0
    if b.down and b.left:
        returnToMenu()
    if b.down and b.right:
        restart()
    delay(200)

# Main Programm
def onDraw():
    push()
    clear()
    Background()
    pop()

    #Menu Pointers
    if menu == 1:
        Dashboard()
    if menu == 2:
        Clock()
    if menu == 3:
        IAQ()
    if menu == 4:
        TVOC()
    if menu == 5:
        CO2()
    if menu == 6:
        Temp()
update()
