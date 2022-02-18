# PRIMA_WS21-22: Some_sort_of_Pinball_thing
Oliver Leisinger

Winter 2021/22

MIB 5

PRIMA

Professor: Jirka R. Dell'Oro-Friedl

link to executable: https://olileisingehfu.github.io/PRIMA-Leisinger/Pinball

source code: https://github.com/OliLeisingeHFU/PRIMA-Leisinger/tree/main/Pinball

design doc: https://github.com/OliLeisingeHFU/PRIMA-Leisinger/blob/main/Pinball/design.pdf

Interactions:
Hold Space: load spring. (only when ball is in launch tube)
release Space: release spring and launch ball (only when ball is in launch tube)
A/D: rotate left flipper counterclockwise/clockwise
Left Arrow/Right Arrow: rotate right flipper counterclockwise/clockwise

## Checklist for the final assignment
© Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
| Nr | Criterion       | Explanation                                                                                                              |
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  0 | Units and Positions | 0/0/0 is right between the flippers, as nothing below that point can be interacted with. 1 is the balls diameter, as all other sizes have to be set with the ball size in mind.|
|  1 | Hierarchy         | Most objects are categorized in parent nodes, making them easy to find and use. Since everything is inside the arena node, only it needs to be rotated after the arenas construction for the proper pinball angle. |
|  2 | Editor            | Objects of varying amount, in this case the ball, are better made using code, rather than the editor, where as the arena was much easier built using the editor. |
|  3 | Scriptcomponents  | Collisions are handled using scriptcomponents on the different objects, this was useful as i could give each object its one name, but also had the parameter "objectType" in the scriptcomponent |
|  4 | Extend            | The Ball class is a Node extension, that automatically builds a ball usable in the game. Very useful and clean as balls needed to be created not only in the main class, but also in the CollisionHandler, when the Multiball power up is used. |
|  5 | Sound             | As sound is not helping the player with orientation, after all the camera does not move, so the POV never does, either, sounds are placed where they are easy to reach, codewise. Colliding with bumper, power ups or coins has a different sound for each of them. |
|  6 | VUI               | The interface shows the player how many points he has earned, as well as how many lives he has left and how high the spring force is. |
|  7 | Event-System      | The event system triggers, when an object collides with an object that has the CollisionHandler script component. It was useful, because that is a more efficient way of checking for onetime collisions, where as continuous collision is better checked inside the update function |
|  8 | External Data     | 2 files are used for external data, one balances the point system, where it is determined how much the bumpers and the coins are worth, as well as how much the player has to collect all coins before they respawn. The other has parameters used in the physics, like the weight of the ball. |
|  9 | Light             | One ambient light for base brightness, one directional light for shadows, simply attached to the graph |
|  A | Physics           | Rigidbodies on each object. The ball's is dynamic, the rest static. launching the ball from anywhere uses forces. |

Longer explanations with reference to source code of each Criterion can be found in the design.pdf if needed.