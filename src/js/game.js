import Phaser from 'phaser'

var audio = new Audio(require("../sound/PUNCH.mp3"))
var music;
var meteor;
var meteor2;
var meteor3;
var emitter;
var emitter2;
var emitter3;
var rightGoal;
var leftGoal;
var particles
var particles2
var particles3
var goalSound;
var bgm;
var scorep1 = 0
var scorep2 = 0
var scoreText
var control1
var control1Hip1
var control2
var control1Hip2
var char1
var char2

var finish = 3
localStorage.clear()

export const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    backgroundColor: '#cdcdcd',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    },
    audio: {
        disableWebAudio: false,
        context: audio.webkitMatchesSelector(true)
    }
}

function preload() {
    this.load.setPath('assets/spine/stretchyman/');
    this.load.spine('stretchyman', 'stretchyman-pro.json', ['stretchyman-pma.atlas'], true);
    this.load.image('meteor', '../../image/meteor-min.png');
    this.load.image('particle', '../../image/api.png');
    this.load.image('background', '../../background/blackhole.jpg');
    this.load.image('pow', '../../image/hit.gif');
    this.load.image('goal', '../../image/blackhole.png')
    this.load.image('hitarea', '../../image/hitround.png')
    this.load.audio('hit', ['../../sound/PUNCH.ogg', '../../sound/PUNCH.mp3'])
    this.load.audio('goal', ['../../sound/selected.ogg', '../../sound/selected.mp3'])
    this.load.audio('bgm', ['../../sound/fightSoundtrack.ogg', '../../sound/fightSoundtrack.mp3'])
}

function generateChar({ pos, scale, flipper }) {
    var char = this.add.spine(pos.x, pos.y, 'stretchyman').setScale(scale.x, scale.y).refresh();
    this.physics.add.existing(char)
    if (flipper === true) {
        // char.body.setSize(char.width, char.height)
        char.body.setCircle(250, 450, 0)
        char.body.immovable = true
    } else {
        // char.body.setSize(char.width, char.height)
        char.body.setCircle(250, -150, 0)
        char.body.immovable = true
    }
    char.body.setCollideWorldBounds(true);
    // char.body.setBounce(0.1, 0.1)
    // char.drawDebug = true
    char.refresh()
    return char
}

// let hipX
// let hipY

function assignControlToChar(char, obj) {
    var controlBones = ["front-leg-ik-target", "hip"];

    // var controlBones = ["front-leg-ik-target", "hip", "back-leg-ik-target"];
    if (obj === "feet") {
        let bone = char.findBone(controlBones[0]);
        var control = this.physics.add.image(bone.worldX, 670 - (bone.worldY), 'hitarea').setData('bone', bone).setScale(0.3, 0.3);
        control.body.setCircle(70)
        control.body.immovable = true
        control.setBounce(3, 3)
        control.setCollideWorldBounds(true)

        control.setInteractive();

        return control
    } else if (obj === "hip") {
        let bone = char.findBone(controlBones[1]);
        var controlHip = this.add.circle(bone.worldX, 800 - (bone.worldY), 10, 0xff00000).setData('bone', bone);
        controlHip.setInteractive();

        return controlHip
    }
}

function create() {

    let image = this.add.image(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "background"
    );
    let scaleX = this.cameras.main.width / image.width;
    let scaleY = this.cameras.main.height / image.height;
    let scale = Math.max(scaleX, scaleY);

    image.setScale(scale).setScrollFactor(0);


    //SCORE
    scoreText = this.add.text(616, 310, `${scorep1}:${scorep2}`, { fontSize: '70px', fill: '#ffffff' })

    //END SCORE

    //MUSIC ASSIGN
    music = this.sound.add('hit', {
        volume: 0.09
    })

    goalSound = this.sound.add('goal', {
        volume: 1
    })
    bgm = this.sound.add('bgm', {
        volume: 0.5
    })
    //ENDMUSIC ASSIGN

    let char = generateChar.bind(this)
    let control = assignControlToChar.bind(this)

    char1 = char({
        pos: { x: 400, y: 500 },
        scale: { x: 0.3, y: 0.3 },
        flipper: false
    })
    char2 = char({
        pos: { x: 900, y: 500 },
        scale: { x: -0.3, y: 0.3 },
        flipper: true
    })

    control1 = control(char1, "feet")
    control1Hip1 = control(char1, "hip")
    control2 = control(char2, "feet")
    control1Hip2 = control(char2, "hip")

    //METEOR
    particles = this.add.particles('particle');
    particles2 = this.add.particles('particle');
    particles3 = this.add.particles('particle');
    emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 0.03, end: 0 },
        blendMode: 'NORMAL'
    });
    emitter2 = particles2.createEmitter({
        speed: 100,
        scale: { start: 0.03, end: 0 },
        blendMode: 'NORMAL'
    });
    emitter3 = particles3.createEmitter({
        speed: 100,
        scale: { start: 0.03, end: 0 },
        blendMode: 'NORMAL'
    });

    meteor = this.physics.add.image(100, 100, 'meteor').setScale(0.1, 0.1);
    meteor.body.setCircle(250)
    meteor.enableBody = true
    meteor.setVelocity(450, 50);
    meteor.setBounce(1.01, 1.01);
    meteor.setCollideWorldBounds(true);

    emitter.startFollow(meteor);

    meteor2 = this.physics.add.image(700, 600, 'meteor').setScale(0.1, 0.1);
    meteor2.body.setCircle(250)
    meteor2.enableBody = true
    meteor2.setVelocity(350, -450);
    meteor2.setBounce(1.01, 1.01);
    meteor2.setCollideWorldBounds(true);

    emitter2.startFollow(meteor2);

    meteor3 = this.physics.add.image(1200, 100, 'meteor').setScale(0.1, 0.1);
    meteor3.body.setCircle(250)
    meteor3.enableBody = true
    meteor3.setVelocity(-450, 50);
    meteor3.setBounce(1.01, 1.01);
    meteor3.setCollideWorldBounds(true);

    emitter3.startFollow(meteor3);

    //END METEOR

    //GAWANG
    leftGoal = this.physics.add.image(100, 350, 'goal').setScale(0.5, 0.5);
    leftGoal.body.setSize(100, 100)
    leftGoal.body.immovable = true
    rightGoal = this.physics.add.image(1250, 350, 'goal').setScale(0.5, 0.5);
    rightGoal.body.setSize(100, 100)
    rightGoal.body.immovable = true
    //END GAWANG

    bgm.play()

    // this.sound.setDecodedCallback(music, this);
    this.physics.add.collider(meteor, char1, () => {
        music.play();
    })
    this.physics.add.collider(meteor2, char1, () => {
        music.play();
    })
    this.physics.add.collider(meteor3, char1, () => {
        music.play();
    })
    this.physics.add.collider(meteor, char2, () => {
        music.play();
    })
    this.physics.add.collider(meteor2, char2, () => {
        music.play();
    })
    this.physics.add.collider(meteor3, char2, () => {
        music.play();
    })
    this.physics.add.collider(char1, char2, () => {
        console.log('kena');
    })
    this.physics.add.collider(meteor, control1, () => {
        music.play();
    })
    this.physics.add.collider(meteor2, control1, () => {
        music.play();
    })
    this.physics.add.collider(meteor3, control1, () => {
        music.play();
    })
    this.physics.add.collider(meteor, control2, () => {
        music.play();
    })
    this.physics.add.collider(meteor2, control2, () => {
        music.play();
    })
    this.physics.add.collider(meteor3, control2, () => {
        music.play();
    })
    this.physics.add.collider(meteor, meteor2, () => {
        music.play();
    })
    this.physics.add.collider(meteor, meteor3, () => {
        music.play();
    })
    this.physics.add.collider(meteor2, meteor3, () => {
        music.play();
    })

}

function update() {
    meteor.rotation += 0.10;
    meteor2.rotation += 0.10;
    meteor3.rotation += 0.10;
    emitter.rotation += 0.10;
    emitter2.rotation += 0.10;
    emitter3.rotation += 0.10;
    rightGoal.rotation += 0.002;
    leftGoal.rotation -= 0.002;

    this.physics.add.collider(meteor, leftGoal, goalp2, () => {
        meteor.destroy()
        particles.destroy()
        goalSound.play()
    })
    this.physics.add.collider(meteor2, leftGoal, goalp2, () => {
        meteor2.destroy()
        particles2.destroy()
        goalSound.play()
    })
    this.physics.add.collider(meteor3, leftGoal, goalp2, () => {
        meteor3.destroy()
        particles3.destroy()
        goalSound.play()
    })
    this.physics.add.collider(meteor, rightGoal, goalp1, () => {
        meteor.destroy()
        particles.destroy()
        goalSound.play()
    })
    this.physics.add.collider(meteor2, rightGoal, goalp1, () => {
        meteor2.destroy()
        particles2.destroy()
        goalSound.play()
    })
    this.physics.add.collider(meteor3, rightGoal, goalp1, () => {
        meteor3.destroy()
        particles3.destroy()
        goalSound.play()
    })

    function goalp1() {
        scorep1 += 1
        finish -= 1
        scoreText.text = `${scorep1}:${scorep2}`
    }
    function goalp2() {
        scorep2 += 1
        finish -= 1
        scoreText.text = `${scorep1}:${scorep2}`
    }

    const players = [control1, control1Hip1, control2, control1Hip2]

    players.forEach(el => {
        this.input.setDraggable(el);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
    
            var bone = gameObject.getData('bone');

            let charObj
            if (el === control1 || el === control1Hip1) {
                charObj = char1
            } else {
                charObj = char2
            }
    
            var coords = this.spine.worldToLocal(dragX, dragY, charObj.skeleton, bone);
    
            bone.x = coords.x;
            bone.y = coords.y;
    
            // hipX = bone.x
            // hipY = bone.y
    
            bone.update();
            charObj.refresh()
        }, this);
    })

    if (finish === 0) {
        console.log('selesai kampret');
        localStorage.setItem("result", "endgame")
    }
}

