import * as THREE from 'three'
import Experience from "../Experience.js";

export default class Fox{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        { 
            // use the debugObject trick.
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }            
            this.debugFolder = this.debug.ui.addFolder('fox')
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')            
        }

        // called "this.resource" in the tutorial - changed for clarity
        this.modelResource = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }

    setModel(){
        this.model = this.modelResource.scene
        this.model.scale.set(0.02,0.02,0.02)
        this.scene.add(this.model)

        this.model.traverse((child => {
            if(child instanceof THREE.Mesh){
                child.castShadow = true
            }
        }))
    }

    // remember that you need to update the mixer on every frame.
    // update hierarchy will be Experience > World > Fox
    setAnimation(){
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)        
        // this.animation.action = this.animation.mixer.clipAction(this.modelResource.animations[0])
        // this.animation.action.play()

        this.animation.actions = {} // to be used in debug menu
        this.animation.actions.idle = this.animation.mixer.clipAction(this.modelResource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.modelResource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.modelResource.animations[2])
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()   
        
        // add method
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction,1)

            this.animation.actions.current = newAction

            // can test the above by entering 
            // window.experience.world.fox.animation.play('walking')
            // into the browser console
        }
    }

    update()
    {
        // the AnimationMixer expects seconds but the delta is in milliseconds, so an adjustment is needed
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}