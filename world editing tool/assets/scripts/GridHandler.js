class GridHandler {

    constructor() {
        this.grid;
    }

    LoadUserGridData (file) {
        
        LoadUploadedFile(file, this.DisplayGridData);

    }

    DisplayGridData (loadedData, file) {

        worldGrid.grid = JSON.parse(loadedData);
        document.getElementById("InputFileName").innerHTML = file.name;
        
        alert(file.name + " has been loaded!\n\nResult:\n" + loadedData);

    }

}

var worldGrid = new GridHandler();