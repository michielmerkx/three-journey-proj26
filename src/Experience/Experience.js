import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import DebugUI from './Utils/DebugUI.js'
import sources from './sources.js'

// using singleton
let instance = null

export default class Experience
{
    constructor(canvas)
    {
        // Singleton
        if(instance) return instance
        instance = this
        // Global access (not always a good idea)
        window.experience = this        

        // Options
        this.canvas = canvas

        // Setup
        // debug ui at the top here, in case you need it
        this.debug = new DebugUI()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        // load resources early on in this setup block
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tickEvent', () =>
        {
            this.update()
        })
    }

    // listen to resize once, and propagate to children
    resize(){
        this.camera.resize()
        this.renderer.resize()
    }

    update(){
        this.camera.update()
        this.world.update() // will also update the Fox and its animation
        this.renderer.update()
    }

    // bruno simon advises that each class should get its own destroy method (in a bigger project)
    destroy()
    {
        // use off method from EventEmitter.js (stop listening).
        // ( does not seem to halt animation in chrome on test, )
        // ( with manually typing window.experience.destroy() in console, )
        // ( even though EventEmitter's off method is still reached. )
        // ( EventEmitter.js might be outdated in some way. )
        this.sizes.off('resize')
        this.time.off('tick')
        // possible cause: Sizes and Time classes are still listening to native events

        // traverse the whole scene
        // see also: official three.js documention on How to dispose of objects
        this.scene.traverse((child) => {
            // test for mesh
            if(child instanceof THREE.Mesh){
                // call dispose method of the geometry
                child.geometry.dispose()

                for (const key in child.material) {
                    // if (Object.hasOwnProperty.call(child.material, key)) {
                    // }
                    const value = child.material[key];
                    //console.log(value)
                    if(value && typeof value.dispose === 'function'){
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active) this.debug.ui.destroy()
    }   
}