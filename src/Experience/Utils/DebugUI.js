import * as lil from 'lil-gui'

export default class DebugUI{
    constructor(){
        //console.log(window.location.hash)
        this.active = window.location.hash === '#debug'

        if(this.active){
            this.ui = new lil.GUI()
        }
    }
}