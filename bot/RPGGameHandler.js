const { createCanvas, loadImage, Image } = require('canvas');
const path = require('path');
const { once, EventEmitter } = require('events');
let eventEmitter = new EventEmitter();

// Settings > move to separate file later.

var viewWidth = 11;
var viewHeight = 7;
var tileSize = 32;

class Instance {

    constructor() {
        
    }

    // Methods
    async Draw(
        world = { name: "N/A", grid: [[{texture: "grass", type: "land"}, {texture: "water", type: "land"}], [{texture: "path", type: "land"}, {texture: "grass", type: "land"}]] },
        playerPos = {x: 5, y: 3} )
        {
        
        //  Clear canvas.
        let canvas = createCanvas((viewWidth*tileSize), (viewHeight*tileSize));
        
        //  Figure out view area.
        let viewTopLeftCornerTile = {x: playerPos.x - Math.floor(viewWidth/2), y: playerPos.y - Math.floor(viewHeight/2)};
        
        //  Based on view area, load assets.
        let tileAssets = new Array();
        let assetsToLoad = new Array();

        for(var y=viewTopLeftCornerTile.y; y < viewHeight; y++) {
            for(var x=viewTopLeftCornerTile.x; x < viewWidth; x++) {
                //  Nothing here?
                if (world.grid[y] == undefined) {
                    continue;
                } else if (world.grid[x] == undefined) {
                    continue;
                }
                //  Has asset already been added?
                if (assetsToLoad.includes(world.grid[y][x].texture)) {
                    continue;
                }
                //  Add asset to the tile assets list and create a promise for the asset.
                tileAssets.push( loadImage(path.join(__dirname, `../sprites/tiles/${world.grid[y][x].texture}.png`)) );
                //  Prevent asset from being loaded again;
                assetsToLoad.push(world.grid[y][x].texture);
            }
        }

        //  After all assets are loaded, render.
        return await Promise.all(tileAssets).then((results) => {
            return this.DrawPlayerView(canvas, world, results, assetsToLoad, viewTopLeftCornerTile);
        }, function (error) {
            return error;
        });
    }

    DrawPlayerView(canvas, world, assets = new Array(new Image), assetNames = new Array(""), viewTopLeftCornerTile) {
        
        let ctx = canvas.getContext('2d');
        
        var y1 = 0;
        for(var y=viewTopLeftCornerTile.y; y < viewHeight+viewTopLeftCornerTile.y; y++) {
            //  Nothing here?
            if (world.grid[y] == undefined) {
                y1++;
                continue;
            }

            var x1 = 0;
            for(var x=viewTopLeftCornerTile.x; x < viewWidth+viewTopLeftCornerTile.x; x++) {
                //  Nothing here?
                if (world.grid[y][x] == undefined) {
                    x1++;
                    continue;
                }
                
                ctx.drawImage(assets[assetNames.indexOf(world.grid[y][x].texture)], x1*32, y1*32);
                x1++;
            }

            y1++;
        }
        
        return canvas.toBuffer();

    }

    crap() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(var y=0; y < world.length; y++) {
            for(var x=0; x < world.grid[0].length; x++) {

                let currentTile = world.grid[y][x];
                let tileRectPos = this.GetRectPos(x, y, worldGrid.zoom);
                
                let image = new Image();

                switch(currentTile.texture) { // WIP
                    case "grass":
                        if (worldGrid.sprites[0] == undefined) {
                            image.src = "../assets/images/sprites/tiles/" + currentTile.texture + ".png";
                            image.onload = function() {
                                worldGrid.sprites[0] = image;
                                worldGrid.canvasContext.drawImage(image, tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);
                            }
                        } else {
                            image = worldGrid.sprites[0];
                        }
                    break;
                    case "path":
                        if (worldGrid.sprites[1] == undefined) {
                            image.src = "../assets/images/sprites/tiles/" + currentTile.texture + ".png";
                            image.onload = function() {
                                worldGrid.sprites[1] = image;
                                worldGrid.canvasContext.drawImage(image, tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);
                            }
                        } else {
                            image = worldGrid.sprites[1];
                        }
                    break;
                    case "water":
                        if (worldGrid.sprites[2] == undefined) {
                            image.src = "../assets/images/sprites/tiles/" + currentTile.texture + ".png";
                            image.onload = function() {
                                worldGrid.sprites[2] = image;
                                worldGrid.canvasContext.drawImage(image, tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);
                            }
                        } else {
                            image = worldGrid.sprites[2];
                        }
                    break;
                    default:
                        image.src = worldGrid.placeHolderImage.src;
                    break;
                }

                worldGrid.canvasContext.drawImage(image, tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);

            }

        }
        // ctx.font = '30px Impact';
        // ctx.rotate(0.1);
        // ctx.fillText('Awesome!', 50, 100);
        // return canvas.toBuffer();
    }
}

module.exports = Instance;