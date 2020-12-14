import Phaser from 'phaser'

// var audio = new Audio(require("../assets/sound/PUNCH.mp3"))

export const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    backgroundColor: '#cdcdcd',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    }
}

function preload() {
    this.load.setPath('assets/spine/stretchyman/');
    this.load.spine('stretchyman', 'stretchyman-pro.json', ['stretchyman-pma.atlas'], true);
    // this.load.setBaseURL('http://labs.phaser.io');

    this.load.audio("punch", "../../sound/PUNCH.mp3")
}

function generateChar({ pos, scale }) {
    var char = this.add.spine(pos.x, pos.y, 'stretchyman').setScale(scale.x, scale.y).refresh();
    
    this.physics.add.existing(char)
    char.body.setCollideWorldBounds(true);
    // char.drawDebug = true
    // char.setDebugBoundingBoxes(true)
    char.refresh()
    return char
}

function assignControlToChar(char) {
    var controlBones = ["front-leg-ik-target", "hip", "back-leg-ik-target"];
    for (let i = 0; i < controlBones.length; i++) {
        let bone = char.findBone(controlBones[i]);
        let color = controlBones[i] == "hip" ? eval("0xff00000") : eval("0xff00ff")
        let control = this.add.circle(bone.worldX, 800 - (bone.worldY), 10, color).setData('bone', bone);

        control.setInteractive();

        this.input.setDraggable(control);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

            var bone = gameObject.getData('bone');

            var coords = this.spine.worldToLocal(dragX, dragY, char.skeleton, bone);

            bone.x = coords.x;
            bone.y = coords.y;

            bone.update();
            char.refresh()
        }, this);
    }
}

function create() {
    console.log(this.add, '<<<<');
    // var music = this.sound.add('punch');
    // music.play({loop: true, seek: 2.550});

    let image = this.add.image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2
    );
    let scaleX = this.cameras.main.width / image.width;
    let scaleY = this.cameras.main.height / image.height;
    let scale = Math.max(scaleX, scaleY);

    image.setScale(scale).setScrollFactor(0);

    let char = generateChar.bind(this)
    let control = assignControlToChar.bind(this)

    let char1 = char({
        pos: { x: 400, y: 500 },
        scale: { x: 0.5, y: 0.5 }
    })
    let char2 = char({
        pos: { x: 800, y: 500 },
        scale: { x: -0.5, y: 0.5 }
    })


    control(char1)
    control(char2)

    console.log('char----->', char1)
    console.log('----->', this.children)

    // this.physics.add.collider(char2, char1, (parent, key, value) => {
    //     console.log('damage hero 1', parent, key, value)
    // })

    // this.physics.add.collider(char2, char1, () => {
    //     console.log('damage hero 1')
    // })

    this.physics.add.collider(char1, char2, () => {
        console.log('kena');
    })

    // var man2 = this.add.spine(800, 550, 'stretchyman').setScale(-0.5, 0.5).refresh();
    // this.physics.add.existing(man2)
    // man2.body.setCollideWorldBounds(true);
    // man2.refresh()

    // this.physics.add.collider(logo,man2)
    // this.physics.add.collider(man, man2)





}