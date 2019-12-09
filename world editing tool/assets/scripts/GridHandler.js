class GridHandler {

    constructor() {
        this.data;

        this.elementNames = {
            fileName: "InputFileName",
            gridSizeX: "GridInputSizeX",
            gridSizeY: "GridInputSizeY",
            canvas: "RenderArea"
        }
        this.defaultTile = { texture: "placeholder", type: "placeholder" };
        this.tileSize = 32;
        this.zoom = 1;

        this.placeHolderImage = new Image();
        this.placeHolderImage.src = "assets/images/placeholders/tile.png";

        this.canvas = document.getElementById(this.elementNames.canvas);
        this.canvasContext = this.canvas.getContext("2d");

        // Events
        window.addEventListener("resize", function() { worldGrid.RenderGrid(); });

        this.canvas.addEventListener("wheel", function(scrollEvent) {
            if (scrollEvent.deltaY < 0) {
                //  setZoom in
                worldGrid.setZoom(worldGrid.zoom+0.2);
            } else if (scrollEvent.deltaY > 0) {
                //  scroll setZoom
                worldGrid.setZoom(worldGrid.zoom-0.2);
            }
            worldGrid.RenderGrid();
        });
        
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
        
    }

    //  Properties
    canvasCenter() {
        return [
            worldGrid.canvas.width/2,
            worldGrid.canvas.height/2
        ];
    }

    setZoom(magnification) {
        var minMagnification = 0.5;
        var maxMagnification = worldGrid.canvas.height/worldGrid.tileSize;
        
        if (magnification < minMagnification) {

            return worldGrid.zoom = minMagnification;

        } else if (magnification > maxMagnification) {

            return worldGrid.zoom = maxMagnification;

        }

        return worldGrid.zoom = magnification;
    }

    //  Methods
    UpdateGridByInput() {
        this.x = parseInt(document.getElementById(worldGrid.elementNames.gridSizeX).value);
        this.y = parseInt(document.getElementById(worldGrid.elementNames.gridSizeY).value);
        worldGrid.ChangeGridSize(this.x, this.y);
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
                tileArray.push(worldGrid.defaultTile);
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
                tileXArray.push(worldGrid.defaultTile);
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

    }

    RenderOutline(coordinates = [{x:0, y:0}, {x:1, y:1}], hexColor = "#FFFFFF", width = 2 ) {

        worldGrid.canvasContext.fillStyle = hexColor;
        worldGrid.canvasContext.lineWidth = width;
        worldGrid.canvasContext.strokeRect(
            coordinates[0].x,
            coordinates[0].y,
            coordinates[1].x,
            coordinates[1].y
            );

    }

    GetRectPos(grisPosx = 0, gridPosY = 0, scale = 1, tilesX = 1, tilesY = 1) {

        let canvasCenter = worldGrid.canvasCenter();
        let gridSize = [worldGrid.data.grid[0].length*worldGrid.tileSize * worldGrid.zoom, worldGrid.data.grid.length*worldGrid.tileSize * worldGrid.zoom];

        let tileOffsetFromCenter = [-(gridSize[0]/2), -(gridSize[1]/2)];

        return [
            tileOffsetFromCenter[0] + (grisPosx * worldGrid.tileSize * worldGrid.zoom) + canvasCenter[0],
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
        worldGrid.RenderOutline([
            { x: gridOrigin[0], y: gridOrigin[1]},
            { x: gridOrigin[2], y: gridOrigin[3] }
        ]);
    
    }

    DisplayGridData (loadedData, file) {

        worldGrid.data = JSON.parse(loadedData);

        //  Update Tools views
        document.getElementById(worldGrid.elementNames.fileName).innerHTML = file.name;
        document.getElementById(worldGrid.elementNames.gridSizeX).value = worldGrid.data.grid[0].length;
        document.getElementById(worldGrid.elementNames.gridSizeY).value = worldGrid.data.grid.length;
        
        worldGrid.RenderGrid();
    }

}

var worldGrid;

window.addEventListener("load", function() {
    worldGrid = new GridHandler();
});