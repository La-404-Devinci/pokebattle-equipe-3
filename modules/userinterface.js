import * as util from "./util.js"

export class UserInterface {
    constructor(battle) {
        this.battle = battle
        this.canvas = this.battle.canvas
        this.ctx = this.canvas.getContext('2d')
        this.terrain = this.battle.terrain
        this.menu = 'attack'
            //def des couleurs 
        this.colorExt = 'rgb(108,108,108)'
        this.colorInt = 'rgb(248,248,216)'
        this.moveBaseColor = this.colorExt
        this.x = this.canvas.width / 2
        this.y = this.canvas.height * (0.70)
        this.width = this.canvas.width - this.x
        this.height = this.canvas.height - this.y
        this.gap = 10
        this.mousedown = -1 //-1: la mouse n'est pas down, 0 si il est down sur le move 0, 1 si c'est le move 1, ect...
        this.moves = [
                [null, null, this.moveBaseColor],
                [null, null, this.moveBaseColor],
                [null, null, this.moveBaseColor],
                [null, null, this.moveBaseColor]
            ] //format : [Move, Path2D, color]
    }

    update() {
        this.drawBackground()
        this.drawFrontground()
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorExt
        this.ctx.roundRect(this.x, this.y, this.width, this.height, [20, 0, 0, 0])
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorInt
        this.ctx.roundRect(this.x + this.gap / 2, this.y + this.gap / 2, this.width - this.gap, this.height - this.gap, [20, 0, 0, 0])
        this.ctx.fill()
    }

    drawFrontground() {
        if (this.menu == 'attack') {
            this.drawAttack()
        }
    }

    drawAttack() {
        let i = 0
        const gapx = 65
        const gapy = 20
        const width = 150
        const height = 60
            // //console.log(this.terrain.pokemonA.currentMoves)
        this.terrain.pokemonA.currentMoves.forEach(move => {
            if (move != null) {
                let x = this.x + gapx + (width + gapx) * (i % 2)
                let y = this.y + gapy + (height + gapy) * Math.floor(i / 2)
                this.moves[i][0] = move
                this.moves[i][1] = new Path2D()
                this.moves[i][1].roundRect(x, y, width, height, [5])
                this.moves[i][1].closePath()
                this.ctx.fillStyle = this.moves[i][2]
                this.ctx.fill(this.moves[i][1])
                this.ctx.font = '16px arial'
                this.ctx.fillStyle = 'black'
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${util.formatMoveName(move.name)}`, x + width / 2, y + height / 2)
                i++
            }
        });
    }

    updateMoves() {
        let i = 0
        const gapx = 65
        const gapy = 20
        const width = 150
        const height = 60
        this.moves.forEach(moveInformation => {
            let x = this.x + gapx + (width + gapx) * (i % 2)
            let y = this.y + gapy + (height + gapy) * Math.floor(i / 2)
            const move = moveInformation[0]
            const path = moveInformation[1]
            let color = moveInformation[2]
            if (path == null) return
            this.ctx.fillStyle = color
            this.ctx.fill(path)
            this.ctx.font = '16px arial'
            this.ctx.fillStyle = 'black'
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${util.formatMoveName(move.name)}`, x + width / 2, y + height / 2)
            i++
        });
    }

    onMouseMove(event) {
        if (this.mousedown != -1) return;
        var pos = util.getCanvasRelative(event)
            ////console.log(`X : ${pos.x}, Y : ${pos.y}`)
        const moveIndex = this.isOnMove(pos.x, pos.y)
        if (moveIndex == -1) {
            this.mouseOverNothing()
        } else {
            this.mouseOverMove(moveIndex)
        }
    }

    onMouseRelease(event) {
        //console.log('Mouse released')
        var pos = util.getCanvasRelative(event)
        const moveIndex = this.isOnMove(pos.x, pos.y)
        if (moveIndex == -1 || this.mousedown != moveIndex) {
            this.mouseOverNothing()
        }
        if (moveIndex != -1) {
            this.mouseOverMove(moveIndex)
            if (this.mousedown == moveIndex) {
                this.battle.useMove(moveIndex)
            }
        }

        this.mousedown = -1
    }
    onMouseClick(event) {
        var pos = util.getCanvasRelative(event)
        const moveIndex = this.isOnMove(pos.x, pos.y)
        if (moveIndex == -1) return;
        this.mousedown = moveIndex
        this.clickOnMove(moveIndex)
        return
    }

    
    isOnMove(x, y) {
        for (let index = 0; index < this.moves.length; index++) {
            const moveInformation = this.moves[index]
            const path = moveInformation[1]
            if (this.ctx.isPointInPath(path, x, y)) {
                return index
            }
        }
        return -1
    }

    mouseOverNothing() {
        this.moves.forEach(moveInformation => {
            moveInformation[2] = this.moveBaseColor
        })
        this.updateMoves()
    }

    mouseOverMove(moveIndex) {
        const overColor = 'rgb(255,165,0)'
        this.moves[moveIndex][2] = overColor
        this.updateMoves()
        return
    }

    clickOnMove(moveIndex) {
        //console.log(`Move ${moveIndex} used`);
        const clickColor = 'rgb(255,140,0)'
        this.moves[moveIndex][2] = clickColor
        this.updateMoves()
    }
}