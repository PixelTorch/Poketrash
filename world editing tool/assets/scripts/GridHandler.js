class GridHandler {

    constructor() {
        this.data;

        this.elementNames = {
            fileName: "InputFileName",
            gridSizeX: "GridInputSizeX",
            gridSizeY: "GridInputSizeY",
            canvas: "RenderArea"
        }
        this.tileSize = 32;

        this.canvas = document.getElementById(this.elementNames.canvas);
        this.canvasContext = this.canvas.getContext("2d");

        // Events
        window.addEventListener("resize", function() { worldGrid.RenderGrid(); });

    }

    //  Properties
    canvasCenter() {
        return [
            worldGrid.canvas.width/2,
            worldGrid.canvas.height/2
        ];
    }

    //  Methods

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
        let gridSize = [worldGrid.data.grid.length*worldGrid.tileSize, worldGrid.data.grid[0].length*worldGrid.tileSize];

        let tileOffsetFromCenter = [-(gridSize[0]/2), -(gridSize[1]/2)];

        return [
            tileOffsetFromCenter[0] + (grisPosx * worldGrid.tileSize) + canvasCenter[0],
            tileOffsetFromCenter[1] + (gridPosY * worldGrid.tileSize) + canvasCenter[1],
            worldGrid.tileSize * tilesX,
            worldGrid.tileSize * tilesY
        ];

    }

    RenderGrid() {
        
        worldGrid.ResetCanvasSize();
        worldGrid.canvasContext.clearRect(0, 0, worldGrid.canvas.width, worldGrid.canvas.height);

        for(var y=0; y < worldGrid.data.grid[0].length; y++) {
            for(var x=0; x < worldGrid.data.grid.length; x++) {

                let currentTile = worldGrid.data.grid[y][x];
                
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
                }

                let tileRectPos = this.GetRectPos(x, y);

                worldGrid.canvasContext.fillRect(tileRectPos[0], tileRectPos[1], tileRectPos[2], tileRectPos[3]);
            }
        }
        
        let gridOrigin = this.GetRectPos(0, 0, undefined, worldGrid.data.grid[0].length, worldGrid.data.grid.length);
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