class GridHandler {

    constructor() {
        this.data;
    }

    LoadUserGridData (file) {
        
        LoadUploadedFile(file, this.DisplayGridData);

    }

    DisplayGridData (loadedData, file) {

        worldGrid.data = JSON.parse(loadedData);

        //  Update Tools views
        document.getElementById("InputFileName").innerHTML = file.name;
        document.getElementById("GridInputSizeX").value = worldGrid.data.grid[0].length;
        document.getElementById("GridInputSizeY").value = worldGrid.data.grid.length;

    }

}

var worldGrid = new GridHandler();