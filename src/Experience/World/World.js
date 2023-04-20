import * as THREE from 'three'
import Experience from "../Experience.js"
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'

export default class World{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Test mesh
        // const testMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(1,1,1),
        //     new THREE.MeshStandardMaterial() // {wireframe: true})
        // )
        // this.scene.add(testMesh)

        this.resources.on('ready', () => {
            // now, set up environment when resources are actually available
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })

    }

    update() {
        if(this.fox) this.fox.update() // fox will update its AnimationMixer
    }
}