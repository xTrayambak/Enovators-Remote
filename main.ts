enum RadioMessage {
    message1 = 49434,
    ok = 31318,
    back = 39633,
    forward = 16348,
    left = 14947,
    right = 32391,
    clutch = 48290
}
input.onButtonPressed(Button.A, function () {
    radio.sendMessage(RadioMessage.ok)
    basic.showLeds(`
        # . . . .
        . # . . .
        . . # . .
        . . . # .
        . . . . #
        `)
    basic.pause(500)
    basic.showLeds(`
        . . . . .
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        `)
})
function ForwardBack () {
    if (pins.analogReadPin(AnalogPin.P1) > 0 && pins.analogReadPin(AnalogPin.P1) < 500) {
        if (work == 0) {
            radio.sendMessage(RadioMessage.back)
            work = 1
            _break = 0
            basic.showLeds(`
                . . # . .
                . . # . .
                # . # . #
                . # # # .
                . . # . .
                `)
        }
    } else if (pins.analogReadPin(AnalogPin.P1) > 560) {
        if (work == 0) {
            radio.sendMessage(RadioMessage.forward)
            work = 1
            _break = 0
            basic.showLeds(`
                . . # . .
                . # # # .
                # . # . #
                . . # . .
                . . # . .
                `)
        }
    }
}
function braking () {
    if (pins.analogReadPin(AnalogPin.P1) > 500 && pins.analogReadPin(AnalogPin.P1) < 550 && (pins.analogReadPin(AnalogPin.P2) > 500 && pins.analogReadPin(AnalogPin.P2) < 550)) {
        if (_break == 0) {
            _break = 1
            work = 0
            radio.sendMessage(RadioMessage.clutch)
        }
    }
    if (powerspeed == 1) {
        _break = 1
        work = 1
        led.plotBarGraph(
        pins.analogReadPin(AnalogPin.P1),
        1023
        )
    }
}
input.onButtonPressed(Button.B, function () {
    powerspeed += 1
    if (powerspeed == 2) {
        speed = pins.analogReadPin(AnalogPin.P1) / 4
        radio.sendNumber(speed)
        basic.showIcon(IconNames.Asleep)
        basic.pause(1000)
        basic.showIcon(IconNames.Yes)
        work = 0
    }
    if (powerspeed == 3) {
        powerspeed = 0
    }
})
function LeftRight () {
    if (pins.analogReadPin(AnalogPin.P2) > 0 && pins.analogReadPin(AnalogPin.P2) < 500) {
        if (work == 0) {
            radio.sendMessage(RadioMessage.left)
            work = 1
            _break = 0
            basic.showLeds(`
                . . # . .
                . # . . .
                # # # # #
                . # . . .
                . . # . .
                `)
        }
    } else if (pins.analogReadPin(AnalogPin.P2) > 560) {
        if (work == 0) {
            radio.sendMessage(RadioMessage.right)
            work = 1
            _break = 0
            basic.showLeds(`
                . . # . .
                . . . # .
                # # # # #
                . . . # .
                . . # . .
                `)
        }
    }
}
let speed = 0
let powerspeed = 0
let _break = 0
let work = 0
radio.setGroup(1)
radio.setTransmitPower(7)
basic.forever(function () {
    ForwardBack()
    LeftRight()
    braking()
})
