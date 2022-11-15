export class PokeEdit{
    constructor(window, teamselect) {
        this.window = window
        this.teamselect = teamselect
    }

    update(){
        if(this.teamselect.activewindow != this) return
    }
}