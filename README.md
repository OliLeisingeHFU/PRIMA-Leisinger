# PRIMA_WS21-22

pages link: https://olileisingehfu.github.io/PRIMA-Leisinger/

## Checklist for the final assignment
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
| Nr | Criterion       | Explanation                                                                                                              |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  0 | Units and Positions | Where is 0, what is 1? Explain your setup of coordinate systems of the entities.                                    |
|  1 | Hierarchy         | Explain the setup of the graphs and the advantages you gain by it.                                                  |
|  2 | Editor            | Use the visual editor and explain which parts are better done by coding and why.                                    |
|  3 | Scriptcomponents  | Use scriptcomponents and explain if they were useful in your context or not and why.                                |
|  4 | Extend            | Derive classes from FudgeCore and explain if that was useful in your context or not and why.                        |
|  5 | Sound             | Use sounds and explain your choice of sounds and placement in respect to the user's perception.                     |
|  6 | VUI               | Create a virtual user interface using the interface controller and mutables. Explain the interface.                 |
|  7 | Event-System      | Use the event system to send messages through graphs and explain if that was useful in your context or not and why. |
|  8 | External Data     | Create a configuration file your application loads and adjusts to the content. Explain your choice of parameters.   |
|  9 | Light             | Explain your choice of lights in your graphs.                                                                       |
|  A | Physics           | Add rigidbody components and work with collisions (1) and/or forces and torques (1) and/or joints (1)               |
|  B | Net               | Add multiplayer functionality via network (3)                                                                       |
|  C | State Machines    | Create autonomous entities using the StateMachine (1) and/or ComponentStateMachine (1) defined in FudgeAid          |
|  D | Animation         | Animate using the animation system of FudgeCore (1) and/or Sprites (1) as defined in FudgeAid                           |

## 0. Units and Position
I have chosen the diameter of the pinball as the 1, since the ball is the object that interacts with all other objects, and the most important object when it comes to spacing, for example the spacing between the flippers.
0 is located right below the tip of the flippers in reverse flip position, as there is no way to save the ball from that point on. This makes programing easier, there is no need for a "Death Zone" that is programmed, if the ball can't be interacted with, when its Y coordinate is below 0.
The X-Axis' 0 is in the middle between the flippers, simply to make symmetry easier.

## 1. Hierarchy
Scene
  Arena
    Balls
      Ball
    Spring
    Barriers
      Case
        Top
        Bottom
        Left
        Right
        Ground
        Glass
        BallguideLeft
        BallguideRight
      Corners
        BotLeft
        BotRight
        TopLeft
        TopRight
      Pyramids
        Pyramid1-3
    Flippers
      LeftFlipper
      RightFlipper
    Bumpers
      Bumper1-5
    Pickups
      Coin
        Coin1-5
      MultiballAbility

1. Every Object, aside from the Spring are categorized and easy to find. The Spring does not necessarily need to be categorized. 
Initially it seems having a single Ball inside the Balls node seems like the Balls node is unnecessary, but doing this simplifies the work needed to implement the Multiball power up.
2. Since the Coins 1-5 are in their own node, they are easily replaced using a loop.
3. After the Arena was built upright during development, all that was needed to give it the same angle as a real Pinball machine, was to rotate the Arenas ComponentTransform. This makes proper positioning of objects easier, both before and after the Arena was rotated.

## 2. Editor
The Arena is built using the Editor. This is much easier than using code if you build something that is not symmetrical. But it's still fairly simple when making a symmetrical environment. That is why all ComponentTransforms are added in the editor by hand, as they were used to build the environment. ComponentRigidBody on the other hand is easier to use in code, because I have several of the same object in different places. That way adding colliders by code and having them be the same is easier than doing it by hand. Testing and changing values is also faster using code.
Furthermore, objects of variable number, in this case the pinballs are also better added and removed by code, rather than the editor. The coins and the Multiball pickups on the other hand don't get deleted, they are simply disabled for some time, as their position, unlike the balls, never changes when reappearing. The balls on the other hand need to be deleted, since they are affected by gravity.

## 3. Scriptcomponents
I used scriptcomponents to program the different powerups avaliable. In this project scriptcomponents where useful, because I was able to give the Bumpers, Coins and other Pickups a Scriptcomponent, rather than having to write a class for each of them, then generating them inside the code.
EXPLAIN HOW POWERUPS WHERE PROGRAMMED.

## 4. Extend
I extended the Ball class from ƒ.Node. It was in that way useful to me, as the pinballs are objects of variable number and they can be generated more easily, when they are their own class. Furthermore, multihit combos can be tracked for each ball, as they all have their own multihit-attribute.

## 5. Sound
In this project, the users perspective always stays the same, therefore sound always comes from the same direction respective to the users perception. The placement was simply done on an object that can quickly be reached codewise, when sound needs to be played.
There are 3 different sounds, a "pling" to indicate a bumper has been hit, and points are gained, a coin sound, similar to Super Mario, to indicate a coin is picked up, and one to indicate a power up has been picked up.

## 6. VUI
STILL MISSING

## 7. Event-System
STILL MISSING

## 8. External Data
The following Parameters are saved in an external file: BumperValue, CoinTime and BallWeight. BumperValue and CoinTime are "balancing parameter" that influence point gain and time needed to collect all 5 coins for the power-up respectively. BallWeight is a physics parameters that influence how actually playing feels like. The higher this value, the faster the ball will roll down the arena.

## 9. Light
Everything should be nicely visible, and importantly, not confusing, therefore only 2 lights are used. One ambient light for a basic light level, as well as one directional light to make sure shadows are visible, and the player can recognize the shape of objects.

## A. Physics
Every object has a rigidbody, aside from the ball, which is dynamic, all are static. forces are used on the ball when shooting it from the spring, as well as on the flippers, so that they are stronger (especially with extra force pickup). Colisions on Bumpers for points.

## D. Animations
STILL MISSING