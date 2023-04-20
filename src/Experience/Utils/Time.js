import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter{

    constructor(){
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        // wait one frame to avoid potential issue with delta value
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick(){
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        //console.log(this.delta)

        this.trigger('tickEvent')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}