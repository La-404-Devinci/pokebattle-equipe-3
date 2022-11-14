//Info: une interface est simplement ici un objet qui à la méthode update()
import {EventListener} from "./eventListener.js"

export class Window {
    constructor(canvas) {
        this.canvas = canvas // Le canvas principal où tous les rendu auront lieux
        this.ctx = this.canvas.getContext('2d')
        this.interfaces = [] // Une liste de toutes les interfaces qui sont afficher à un temps t
        this.eventListener = new EventListener(this)
        this.initEvent()
        this.mode = "init"
        this.tick()
    }

    
    /**
     * @param  {Interface} interface
     * @return {Boolean} true si l'ajout est réussi, false sinon
     */
    addInterface(inter) {
        if (inter in this.interfaces) {
            return false
        }
        else {
            this.interfaces.push(inter)
            return true
        }
    }

    
    /**
     * @param  {Function} funct fonction qui retourne true pour toutes les interfaces que l'on souhaite get
     * @return {[Interface]} Retourne la liste des interfaces que l'on cherchait
     */
    getInterface(funct) {
        let out = []
        this.interfaces.forEach(inter => {
            if (funct(inter)) out.push(inter)
        });
        return out
    }

    /**
     * @param  {} funct
     * @return {}
     */
    removeInterface(funct){
        let out = []
        for (let index = 0; index < this.interfaces.length; index++) {
            const inter = this.interfaces[index];
            if (funct(inter)) {
                this.interfaces.splice(index, 1)
                index--
                out.push(inter)
            }
        }
        return out
    }

    // Cette fonction serra appelé à chaque update du canvas avec une fréquence max de 60Hz
    tick(){
        this.update()
        window.requestAnimationFrame(this.tick.bind(this))
    }


    //Temporaire, version avec des try a faire, mais je sais pas quelle erreur catch donc bon, si quelqu'un sais merci de le mettre :)
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.interfaces.forEach(inter => {
            inter.update()
        });
    }

    initEvent() {
        var fClick = this.eventListener.onMouseClick.bind(this.eventListener)
        this.canvas.addEventListener('mousedown', fClick)
        var fMove = this.eventListener.onMouseMove.bind(this.eventListener)
        this.canvas.addEventListener('mousemove', fMove)
        var fRelease = this.eventListener.onMouseRelease.bind(this.eventListener)
        this.canvas.addEventListener('mouseup', fRelease)
    }
}