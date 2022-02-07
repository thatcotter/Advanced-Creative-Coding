import * as PIXI from "pixi.js"
import { Container, DRAW_MODES } from "pixi.js";
// import * as Filters from 'pixi-filters'

const load = (app: PIXI.Application) => {
    return new Promise<void>((resolve) => {
        app.loader
            .add('world', 'assets/hello-world.png')
            // .add('shader', 'assets/shader.frag')
            .load(() => {
            resolve();
        });
    });
};

const main = async () => {
    // Actual app
    let app = new PIXI.Application();

    // Display application properly
    document.body.style.margin = '0';
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';

    // View size = windows
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load assets
    await load(app);
    let sprite = new PIXI.Sprite(
        app.loader.resources.world.texture
    );

    sprite.anchor.set(0.5, 0.5)
    // sprite.scale.set(0.5, 0.5);

    sprite.x = window.innerWidth / 2 - sprite.width / 2;
    sprite.y = window.innerHeight / 2 - sprite.height / 2;
    app.stage.addChild(sprite);

    let graphics = new PIXI.Graphics();

    graphics.lineStyle(2, 0xFF0000, 1);
    graphics.beginFill(0x00FF00, 1);
    graphics.drawCircle(100, 200, 50);

    app.stage.addChild(graphics);

    const path = new PIXI.Graphics();
    
    path.lineStyle(2, 0xFFFFFF, 1);
    path.moveTo(0, 0);
    path.lineTo(100, 200);
    path.lineTo(200, 200);
    path.lineTo(240, 100);
    path.position.x = 50;
    path.position.y = 50;

    app.stage.addChild(path);



    const gridContainer = new PIXI.Container();

    app.stage.addChild(gridContainer);

    for (let i = 0; i < 100; i ++) {
        const horizontalLine = new PIXI.Graphics();
        const verticalLine = new PIXI.Graphics();

        let lineWidth = 2;
        let newX = window.innerWidth / (i + 1);
        let newY = window.innerHeight / (i + 1);

        let color = 0x000000;

        if (i % 2 == 0) {
            color = 0xFF0000;
        } else {
            color = 0x0000FF;
        }

        horizontalLine.lineStyle(lineWidth, color, 1);
        verticalLine.lineStyle(lineWidth, color, 1);


        horizontalLine.moveTo(0, newY);
        verticalLine.moveTo(newX, 0);

        horizontalLine.lineTo(window.innerWidth, newY);
        verticalLine.lineTo(newX, window.innerHeight);
        
        gridContainer.addChild(horizontalLine);
        gridContainer.addChild(verticalLine);
    }

    gridContainer.x = 0;
    gridContainer.y = 0;

    // Handle window resizing
    window.addEventListener('resize', (_e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        sprite.x = window.innerWidth / 2 - sprite.width / 2;
        sprite.y = window.innerHeight / 2 - sprite.height / 2;
    });

    document.body.appendChild(app.view);

    let context = {
        velocity: { x: 1, y: 1 },
        sprite
    };

    app.ticker.add(update, context);
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {

    const newScale = (Math.sin(Date.now() / 10000) + 1) / 2
    this.sprite.scale.set(newScale, newScale)

    if (this.sprite.x <= 0 || this.sprite.x >= window.innerWidth - this.sprite.width) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.sprite.y <= 0 || this.sprite.y >= window.innerHeight - this.sprite.height) {
        this.velocity.y = -this.velocity.y;
    }
    this.sprite.x += this.velocity.x * delta;
    this.sprite.y += this.velocity.y * delta;
};

main();

