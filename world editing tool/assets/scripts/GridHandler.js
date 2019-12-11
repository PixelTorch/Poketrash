class GridHandler {

    constructor() {
        this.data;

        this.elementNames = {
            fileName: "InputFileName",
            gridSizeX: "GridInputSizeX",
            gridSizeY: "GridInputSizeY",
            selectedTileGridPosX: "ToolsSelectedTileGridPositionX",
            selectedTileGridPosY: "ToolsSelectedTileGridPositionY",
            selectedTileTexture: "ToolsSelectedTileTexture",
            selectedTileType: "ToolsSelectedTileType",
            canvas: "RenderArea"
        }
        this.defaultTile = { texture: "placeholder", type: "placeholder" };
        this.tileSize = 32;
        this.zoom = 1;

        this.selectedTile;

        this.placeHolderImage = new Image();
        this.placeHolderImage.src = "assets/images/placeholders/tile.png";

        this.canvas = document.getElementById(this.elementNames.canvas);
        this.canvasContext = this.canvas.getContext("2d");

        // Events
        window.addEventListener("resize", function() { worldGrid.RenderGrid(); });

        this.canvas.addEventListener("click", function(e) {
            worldGrid.SelectTile( worldGrid.clickedTilePosition(e.clientX, e.clientY) );
        });

        this.canvas.addEventListener("wheel", function(scrollEvent) {
            if (scrollEvent.deltaY < 0) {
                //  setZoom in
                worldGrid.setZoom(worldGrid.zoom+0.2);
            } else if (scrollEvent.deltaY > 0) {
                //  scroll setZoom
                worldGrid.setZoom(worldGrid.zoom-0.2);
            }
            worldGrid.RenderGrid();
        }, {passive: true});

        document.getElementById(this.elementNames.gridSizeX).addEventListener("keydown", function(e) {
            if(e.key == "Enter") {
                worldGrid.UpdateGridByInput();
            }
        });
        document.getElementById(this.elementNames.gridSizeY).addEventListener("keydown", function(e) {
            if(e.key == "Enter") {
                worldGrid.UpdateGridByInput();
            }
        });
        document.getElementById(this.elementNames.selectedTileTexture).addEventListener("keydown", function(e) {
            if(e.key == "Enter") {
                worldGrid.UpdateGridByInput();
            }
        });
        document.getElementById(this.elementNames.gridSizeX).addEventListener("blur", function(e) { worldGrid.UpdateGridByInput(); });
        document.getElementById(this.elementNames.gridSizeY).addEventListener("blur", function(e) { worldGrid.UpdateGridByInput(); });
        document.getElementById(this.elementNames.selectedTileTexture).addEventListener("blur", function(e) { worldGrid.UpdateGridByInput(); });
        document.getElementById(this.elementNames.selectedTileType).addEventListener("change", function(e) { worldGrid.UpdateGridByInput(); });
        
    }

    //  Properties
    canvasCenter() {
        return [
            worldGrid.canvas.width/2,
            worldGrid.canvas.height/2
        ];
    }

    clickedTilePosition(clickPosX = 0, clickPosY = 0) {

        //  Get click position relative to the top left of the canvas element.
        let canvasRelativeClickPosX = clickPosX - worldGrid.canvas.getBoundingClientRect().x;
        let canvasRelativeClickPosY = clickPosY - worldGrid.canvas.getBoundingClientRect().y;

        //  Get the top left location of the world grid.
        let gridTopLeftPos = [
            worldGrid.canvasCenter()[0] - worldGrid.data.grid[0].length * (worldGrid.tileSize / 2) * worldGrid.zoom,
            worldGrid.canvasCenter()[1] - worldGrid.data.grid.length * (worldGrid.tileSize / 2) * worldGrid.zoom
        ]

        //  Get the top left location of the mouse click relative to the top left location of the world grid.
        let relativeClickPosX = canvasRelativeClickPosX - gridTopLeftPos[0];
        let relativeClickPosY = canvasRelativeClickPosY - gridTopLeftPos[1];

        // Return an integer of coordinates for the tile positions through a calculation of the mouse location and the tilesizes.
        return {
            x: Math.floor(relativeClickPosX / (worldGrid.tileSize * worldGrid.zoom)),
            y: Math.floor(relativeClickPosY / (worldGrid.tileSize * worldGrid.zoom))
        }
        
    }

    setZoom(magnification = 1) {
        var minMagnification = 0.5;
        var maxMagnification = worldGrid.canvas.height/worldGrid.tileSize;
        
        worldGrid.canvasContext.imageSmoothingEnabled = (magnification > 1) ? false : true;

        if (magnification < minMagnification) {

            return worldGrid.zoom = minMagnification;

        } else if (magnification > maxMagnification) {

            return worldGrid.zoom = maxMagnification;

        }

        return worldGrid.zoom = magnification;
    }

    //  Methods
    EditSelectedTile(texture = worldGrid.defaultTile.texture, type = worldGrid.defaultTile.type) {

        worldGrid.selectedTile.tile.texture = texture;
        worldGrid.selectedTile.tile.type = type;
        
        worldGrid.UpdateToolsViewValues();
        worldGrid.RenderGrid();
        
    }

    SelectTile(tilePosition = {x: 0, y: 0}) {

        if (tilePosition.x < 0 || tilePosition.x > worldGrid.data.grid[0].length-1 || tilePosition.y < 0 || tilePosition.y > worldGrid.data.grid.length-1) {
            return false;
        }

        worldGrid.selectedTile = {
            tile: {},
            tilePosition: tilePosition
        };

        worldGrid.selectedTile.tile = worldGrid.data.grid[tilePosition.y][tilePosition.x];

        worldGrid.UpdateToolsViewValues();
        worldGrid.RenderGrid();

        return true;
    }

    UpdateGridByInput() {
        
        //  Grid size
        this.x = parseInt(document.getElementById(worldGrid.elementNames.gridSizeX).value);
        this.y = parseInt(document.getElementById(worldGrid.elementNames.gridSizeY).value);
        worldGrid.ChangeGridSize(this.x, this.y);

        //  selected tile
        worldGrid.EditSelectedTile(
            document.getElementById(worldGrid.elementNames.selectedTileTexture).value,
            document.getElementById(worldGrid.elementNames.selectedTileType).value
        );

    }

    UpdateToolsViewValues() {

        //  Update Tools views
        document.getElementById(worldGrid.elementNames.gridSizeX).value = worldGrid.data.grid[0].length;
        document.getElementById(worldGrid.elementNames.gridSizeY).value = worldGrid.data.grid.length;

        // Fallback - selectedTile information
        let selectedTileAvailable = true;
        if (worldGrid.selectedTile == undefined) { 
            if ( !worldGrid.SelectTile({x: 0, y: 0}) ) {
                selectedTileAvailable = false;
            }
        }

        if (selectedTileAvailable) {
            document.getElementById(worldGrid.elementNames.selectedTileGridPosX).value = worldGrid.selectedTile.tilePosition.x;
            document.getElementById(worldGrid.elementNames.selectedTileGridPosY).value = worldGrid.selectedTile.tilePosition.y;
            document.getElementById(worldGrid.elementNames.selectedTileTexture).value = worldGrid.selectedTile.tile.texture;
            document.getElementById(worldGrid.elementNames.selectedTileType).value = worldGrid.selectedTile.tile.type;
        }
        
        return true;

    }

    ChangeGridSize(x = 0, y = 0) {
        
        function ySizeIsBigger() { return y > worldGrid.data.grid.length }
        function ySizeIsSmaller() { return y < worldGrid.data.grid.length }

        while ( ySizeIsSmaller() ) {

            worldGrid.data.grid.pop();

        }

        while ( ySizeIsBigger() ) {
            
            let tileArray = [];

            for(var i=0; i < worldGrid.data.grid[0].length; i++) {
                tileArray.push( Object.create(worldGrid.defaultTile) );
            }

            worldGrid.data.grid.push(tileArray);

        }
        
        function xSizeIsBigger() { return x > worldGrid.data.grid[worldGrid.data.grid.length-1].length }
        function xSizeIsSmaller() { return x < worldGrid.data.grid[worldGrid.data.grid.length-1].length }

        while ( xSizeIsSmaller() ) {

            worldGrid.data.grid.forEach( function(tileXArray = []) {
                tileXArray.pop();
            });

        }

        while ( xSizeIsBigger() ) {

            worldGrid.data.grid.forEach( function(tileXArray = []) {
                tileXArray.push( Object.create(worldGrid.defaultTile) );
            })

        }

        //  Render after changes.

        worldGrid.RenderGrid();

    }

    LoadUserGridData (file) {
        
        LoadUploadedFile(file, this.DisplayGridData);

    }

    ResetCanvasSize() {
        
        worldGrid.canvas.height = worldGrid.canvas.parentElement.offsetHeight
        worldGrid.canvas.width = worldGrid.canvas.parentElement.offsetWidth;

        worldGrid.setZoom(worldGrid.zoom); //   Sets image smoothing accordingly, reseting the canvas size tends to mess with this so this is a reset for that..

    }

    RenderOutline(coordinates = [{x:0, y:0}, {x:1, y:1}], hexColor = "#000000", width = 2 ) {

        worldGrid.canvasContext.strokeStyle = hexColor;
        worldGrid.canvasContext.lineWidth = width;

        worldGrid.canvasContext.strokeRect(
            coordinates[0].x,
            coordinates[0].y,
            coordinates[1].x,
            coordinates[1].y
            );

    }

    GetRectPos(gridPosX = 0, gridPosY = 0, scale = 1, tilesX = 1, tilesY = 1) {

        let canvasCenter = worldGrid.canvasCenter();
        let gridSize = [worldGrid.data.grid[0].length*worldGrid.tileSize * worldGrid.zoom, worldGrid.data.grid.length*worldGrid.tileSize * worldGrid.zoom];

        let tileOffsetFromCenter = [-(gridSize[0]/2), -(gridSize[1]/2)];

        return [
            tileOffsetFromCenter[0] + (gridPosX * worldGrid.tileSize * worldGrid.zoom) + canvasCenter[0],
            tileOffsetFromCenter[1] + (gridPosY * worldGrid.tileSize * worldGrid.zoom) + canvasCenter[1],
            worldGrid.tileSize * tilesX * worldGrid.zoom,
            worldGrid.tileSize * tilesY * worldGrid.zoom
        ];

    }

    RenderGrid() {
        
        worldGrid.ResetCanvasSize();
        worldGrid.canvasContext.clearRect(0, 0, worldGrid.canvas.width, worldGrid.canvas.height);

        for(var y=0; y < worldGrid.data.grid.length; y++) {
            for(var x=0; x < worldGrid.data.grid[0].length; x++) {

                let currentTile = worldGrid.data.grid[y][x];
                let tileRectPos = this.GetRectPos(x, y, worldGrid.zoom);
                
                switch(currentTile.type) {
                    case "land":
                        worldGrid.canvasContext.fillStyle = "#00FF00";
                    break;
                    case "water":
                        worldGrid.canvasContext.fillStyle = "#0000FF";
                    break;
                    case "wall":
                        worldGrid.canvasContext.fillStyle = "#FF0000";
                    break;
                    default: // Set placeholder tile.
                        worldGrid.canvasContext.drawImage(worldGrid.placeHolderImage, tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);
                        continue;
                    break;
                }

                worldGrid.canvasContext.fillRect(tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);
            }
        }
        
        let gridOrigin = this.GetRectPos(0, 0, worldGrid.zoom, worldGrid.data.grid[0].length, worldGrid.data.grid.length);

        if(worldGrid.selectedTile != undefined) {
            let selectedTileRect = this.GetRectPos(
                worldGrid.selectedTile.tilePosition.x,
                worldGrid.selectedTile.tilePosition.y,
                worldGrid.zoom,
                1,
                1
            );
            worldGrid.RenderOutline([
                {x: selectedTileRect[0], y: selectedTileRect[1]},
                {x: selectedTileRect[2], y: selectedTileRect[3]}],
                "#FFA500",
                1
            );
        }
        worldGrid.RenderOutline([
            { x: gridOrigin[0], y: gridOrigin[1]},
            { x: gridOrigin[2], y: gridOrigin[3] }
        ]);
    
    }

    DisplayGridData (loadedData, file) {
        
        document.getElementById(worldGrid.elementNames.fileName).innerHTML = file.name;

        worldGrid.data = JSON.parse(loadedData);

        worldGrid.UpdateToolsViewValues();
        worldGrid.RenderGrid();

    }

}

var worldGrid;

window.addEventListener("load", function() {
    worldGrid = new GridHandler();
});