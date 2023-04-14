/**
 * JS related to mazegames.html
 */

//var host = "http://localhost:8080";
var host = "https://ts171.de/tcp-22";
var mazeshost = "https://ubuntu-server.udehlavj1efjeuqv.myfritz.net";
var servermanagerhost = "https://ubuntu-server.udehlavj1efjeuqv.myfritz.net";

// map of class 'Maze' instances. maze name is key.
var allMazesMap = new Map();
var mazeInEdit = null;

var nextElement = new Map();
nextElement.set(' ', '#');
nextElement.set('#', 'T');
nextElement.set('T', 'P');
nextElement.set('P', 'B');
nextElement.set('B', 'M');
nextElement.set('M', 'D');
nextElement.set('D', ' ');

// Tooltips
var elementTitle = new Map();
elementTitle.set(' ', 'empty');
elementTitle.set('W', 'Wall');
elementTitle.set('D', 'Destination');
elementTitle.set('S', 'Start');
elementTitle.set('B', 'Box');

var mazeServiceState = "unknown"
var serverManagerState = "unknown"

function switchView(view, mazeName) {
    console.log("switchView to ", view);

    // disable all
    $('#listview').removeClass('w3-show');
    $('#listview').addClass('w3-hide');
    $('#detailview').removeClass('w3-show');
    $('#detailview').addClass('w3-hide');
    $('#homeview').removeClass('w3-show');
    $('#homeview').addClass('w3-hide');
    $('#gameplayview').removeClass('w3-show');
    $('#gameplayview').addClass('w3-hide');
    $('#creditsview').removeClass('w3-show');
    $('#creditsview').addClass('w3-hide');
    $('#settingsview').removeClass('w3-show');
    $('#settingsview').addClass('w3-hide');
    $('#serverview').removeClass('w3-show');
    $('#serverview').addClass('w3-hide');

    if (view == "detailview") {
         $('#detailview').addClass('w3-show');
         $('#detailview').removeClass('w3-hide');
         mazeInEdit = allMazesMap.get(mazeName);
         initMazeEdit();
    }
    if (view == "listview") {
         $('#listview').removeClass('w3-hide');
         $('#listview').addClass('w3-show');
    }
    if (view == "homeview") {
         $('#homeview').removeClass('w3-hide');
         $('#homeview').addClass('w3-show');
    }
    if (view == "gameplayview") {
         $('#gameplayview').removeClass('w3-hide');
         $('#gameplayview').addClass('w3-show');
    }
    if (view == "creditsview") {
         $('#creditsview').removeClass('w3-hide');
         $('#creditsview').addClass('w3-show');
    }
    if (view == "settingsview") {
         $('#settingsview').removeClass('w3-hide');
         $('#settingsview').addClass('w3-show');
    }
    if (view == "serverview") {
         $('#serverview').removeClass('w3-hide');
         $('#serverview').addClass('w3-show');
    }
}

/**
 * Add a maze grid list element.
 */
function addMazeListElement(maze, contentProvider, optionalElement) {

    var table = createTable(null, "mazetable");
    var content = "<div>";
    content += "<span class='w3-large'>" + maze.name + "</span>";
    content += "<br>";
    content += "<span>" + maze.description + "</span>";
    content += "<br>" + table.html + "<br>";

    // button bar. 'lock/unlock' are just indicator without action. 'edit opens secret bar
    var iconStyle = "style='font-size:20px;color:black;'";
    content += "<div class='w3-bar w3-light-gray'>";
    var btn_lock = createButton("<i class='fa fa-lock' " + iconStyle + "></i>", "w3-bar-item w3-button ");
    content += btn_lock.html;
    var btn_unlock = createButton("<i class='fa fa-unlock' " + iconStyle + "></i>", "w3-bar-item w3-button ");
    content += btn_unlock.html;
    var btn_edit = createButton("<i class='fa fa-edit' " + iconStyle + "></i>", "w3-bar-item w3-button w3-XXgreen");
    content += btn_edit.html;
    var btn_play = createButton("<i class='fa fa-play' " + iconStyle + "></i>", "w3-bar-item w3-button w3-XXgreen");
    content += btn_play.html;
    content += "</div>"; // end of button bar

    // secret bar
    var secret_id = "inp_" + getUniqueId();
    content += "<div id='" + secret_id + "' class='w3-bar w3-white'>";
    content += "<input class='w3-bar-item' type='password' value='' id='inp_"+secret_id+"'>";
    var btn_key = createButton("<i class='fa fa-key' " + iconStyle + "></i>", "w3-bar-item w3-button w3-XXgreen");
    content += btn_key.html;
    //content += "</span>";
    content += "</div>"; // end of secret bar

    content += "</div>"; // end of content

    var listitemId = addListItem("mazelist", content, "w3-bar");
    populateHtmlTableForMaze(table.bodyid, maze, previewCellBuilder);

    $("#"+btn_edit.id).click(function() {
        //not correct? Probably the variable 'btn_edit.id' is set with a different value in the next cycle. So better use 'this'
        //$("#"+btn_unlock.id).prop("disabled", true);
        // In general its unclear for now whether to disable the button for preventing reenter because
        // who is going to enable it again when the user switches view. TODO
        //$(this).prop('disabled', true);
        //only visual, does not prevent clicking
        //$( this ).addClass('w3-disabled');

        var maze = getMazeByListItemId(this.dataset.listitemid);
        console.log("edit:mazename="+maze.name);
        switchView("detailview", maze.name);
    });
    $("#"+btn_play.id).click(function() {

        var maze = getMazeByListItemId(this.dataset.listitemid);
        console.log("play:mazename="+maze.name);
        launchMazeSceneFromList(false, maze.selfHref.replaceAll("http://","https://"));
    });

    $("#"+listitemId).attr('data-mazename', maze.name);
    $("#"+btn_lock.id).attr('data-listitemid', listitemId);
    $("#"+btn_unlock.id).attr('data-listitemid', listitemId);
    $("#"+btn_edit.id).attr('data-listitemid', listitemId);
    $("#"+btn_play.id).attr('data-listitemid', listitemId);

    if (maze.isLocked()) {
        $("#"+btn_edit.id).prop('disabled', true);
        showElement(btn_lock.id);
        hideElement(btn_unlock.id);
    } else {
        $("#"+btn_edit.id).prop('disabled', false);
        hideElement(btn_lock.id);
        showElement(btn_unlock.id);
    }
    hideElement(secret_id);
}

function getMazeByListItemId(listitemid) {
    var mazeName = $("#"+listitemid).attr('data-mazename');
    return allMazesMap.get(mazeName);
}

function refreshStates() {
    $("#serverStates").html("" + mazeServiceState + "/" + serverManagerState);
}

/**
 * Create a HTML table for a maze
 */
function populateHtmlTableForMaze(bodyid, maze, cellbuilder) {

    var i,j;
    for (i = maze.rows - 1; i >= 0; i--) {
        var rowid = addTableRow(bodyid);
        for (j = 0; j < maze.cols; j++) {
            var location = new Location(j,i);
            var mazeCell = maze.getCell(location);
            // cell won't be null because non rectangular grids are equalized
            var cell = cellbuilder(maze.name, mazeCell, location);
            var colid = addTableCol(cell.html, rowid, "mazetabletd");
        }
    }
}

function previewCellBuilder(mazeName, mazecell, location) {
    return createDiv("","cell cellsize8x8 " + mazecell.getStyle());
}

function editCellBuilder(mazeName, mazecell, location) {
    return createClickableDiv(mazecell.getContent(), "cycleCellElement(this, "+location.x+","+location.y+")",
        "cell cellsize30x30 " + mazecell.getStyle());
}

function initMazeEdit() {
    var table = createTable(null, "mazetable");
    $("#mazeeditor").html(table.html);
    populateHtmlTableForMaze(table.bodyid, mazeInEdit, editCellBuilder);
    $("#resultgrid").html("");
    $("#btn_save").prop("disabled", !mazeInEdit.dirty);
}

function cycleCellElement(cellDiv, x, y) {
    //console.log("cycleCellElement cellDiv=", cellDiv);
    var location = new Location(x,y);
    var mazeCell = mazeInEdit.getCell(location);

    mazeCell.code = nextElement.get(mazeCell.code);
    var div = $("#" + cellDiv.id);
    // console.log("cycleCellElement code=", mazeCell.code, mazeCell.getStyle());
    div.removeClass("celldestination");
    div.removeClass("cellwall");
    div.removeClass("cellstart");
    div.removeClass("cellbox");
    div.removeClass("cellmonster");
    div.removeClass("celldiamond");
    div.removeClass("cellempty");
    div.addClass(mazeCell.getStyle());
    div.html(mazeCell.getContent());
    $("#btn_save").prop("disabled", false);
    mazeInEdit.dirty = true;
}

function save() {
    var grid = mazeInEdit.getGrid();
    console.log(grid);
    $("#resultgrid").html(grid.replaceAll("\n","<br>"));
    postData(mazeInEdit.selfHref.replaceAll("http://","https://"), { grid: grid.replaceAll("\n","n") })
        .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
            mazeInEdit.dirty = false;
            $("#btn_save").prop("disabled", true);
        });
}

/**
 * From https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * Currently using PATCH!
 */
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
    //mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function addLoadedMazeGrid(m) {
    m.grid = m.grid.replaceAll("\\n","\n");
    console.log("m:",m);
    var maze = Maze.buildFromGrid(m.grid);
    maze.name = m.name;
    maze.description = m.description;
    maze.selfHref = m._links.self.href;
    maze.locked = m.locked;
    allMazesMap.set(m.name, maze);
    addMazeListElement(maze);
}

function loadMazes() {
    httpGet(mazeshost + "/mazes/mazes?sort=id", null,
        function(isJson, jsonObject) {
            console.log(jsonObject);
            jsonObject._embedded.mazes.forEach(addLoadedMazeGrid);
            mazeServiceState = "✅";
            refreshStates();
        },
        function() {
            // already logged
            mazeServiceState = "❌";
            refreshStates();
        }
    );
}

/**
 * init for mazes.html
 */
function init() {
    var url = new URL(window.location.href);
    console.log("url=" + url);
    var hostparam = url.searchParams.get("host");
    if (hostparam != null) {
        host = hostparam;
    }
    var mazeshostparam = url.searchParams.get("mazeshost");
    if (mazeshostparam != null) {
        mazeshost = mazeshostparam;
    }
    var servermanagerhostparam = url.searchParams.get("servermanagerhost");
    if (servermanagerhostparam != null) {
        servermanagerhost = servermanagerhostparam;
    }
    $("#inp_host").val(host);
    $("#inp_mazeshost").val(mazeshost);
    $("#inp_servermanagerhost").val(servermanagerhost);
    refreshStates();

    loadMazes();

    loadServerList();

    switchView("homeview");

    $("#inp_ctrlPanel").val("0,0,0,200,90,0");
    // With "ReferenceSpaceType" 'local' instead of 'local-floor' -0.1 is better than -0.9. 0.6 good for 1.80m player in maze
    // But for BasicTravelScene and VrScene 0 seem to be better. So better use a neutral value 0 here initially and let
    // application adjust it. And have a vector3 tuple now.
    $("#inp_offsetVR").val("0.0, 0.0, 0.0");
    // for some unknown reason traffic needs to be lowered
    $("#inp_tf_offsetVR").val("0.0, -1.0, 0.0");

    $.get(host + "/version.html", function(responseText) {
        var s = responseText;
        var index = s.indexOf("</div>");
        if (index != -1) {
            s = s.substring(0,index);
        }
        index = s.indexOf("<div>");
        if (index != -1) {
            s = s.substring(index+5);
        }
        $("#versionInfo").html("Latest Build: " + s);
    });
}

