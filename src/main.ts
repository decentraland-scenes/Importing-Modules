// CORE DEPENDENCIES
import * as SocketIO from 'socket.io-client'

import { DecentralandSynchronizationSystem } from 'decentraland-ecs/dist/decentraland/Implementation'

// ECS INITIALIZATION
import { Engine } from 'decentraland-ecs/dist/ecs/Engine'
import { Entity } from 'decentraland-ecs/dist/ecs/Entity'

const entity = new Entity('scene')
;(entity as any).uuid = '0'

// Initialize engine
/** @public */
const engine = new Engine(entity)

import { DisposableComponent } from 'decentraland-ecs/dist/ecs/Component'
DisposableComponent.engine = engine

// Initialize Decentraland interface
/** @internal */
import { DecentralandInterface } from 'decentraland-ecs/dist/decentraland/Types'

/** @internal */
declare let dcl: DecentralandInterface | void
if (typeof dcl !== 'undefined') {
  engine.addSystem(new DecentralandSynchronizationSystem(dcl), Infinity)
}

import { uuidEventSystem, pointerEventSystem, raycastEventSystem } from 'decentraland-ecs/dist/decentraland/Systems'

// Initialize UUID Events system
engine.addSystem(uuidEventSystem)
// Initialize Pointer Events System
engine.addSystem(pointerEventSystem)

// Initialize Raycast Events System
engine.addSystem(raycastEventSystem)

// DECENTRALAND DEPENDENCIES
export * from 'decentraland-ecs/dist/decentraland/Types'
export * from 'decentraland-ecs/dist/decentraland/Components'
export * from 'decentraland-ecs/dist/decentraland/Systems'
export * from 'decentraland-ecs/dist/decentraland/Events'
export * from 'decentraland-ecs/dist/decentraland/Camera'
export * from 'decentraland-ecs/dist/decentraland/math'
export * from 'decentraland-ecs/dist/decentraland/AnimationState'
export * from 'decentraland-ecs/dist/decentraland/Input'
export * from 'decentraland-ecs/dist/decentraland/Audio'
export * from 'decentraland-ecs/dist/decentraland/Gizmos'
export * from 'decentraland-ecs/dist/decentraland/UIShapes'
export * from 'decentraland-ecs/dist/decentraland/AvatarShape'
export * from 'decentraland-ecs/dist/decentraland/UIEvents'
export * from 'decentraland-ecs/dist/decentraland/MessageBus'
export * from 'decentraland-ecs/dist/decentraland/PhysicsCast'

export { engine }

const socket = new SocketIO()

/// --- Set up a system ---

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    // iterate over the entities of the group
    for (let entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem())

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8)

cube.addComponent(
  new OnClick(() => {
    cube.getComponent(Transform).scale.z *= 1.1
    cube.getComponent(Transform).scale.x *= 0.9

    spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
  })
)
