
/**
 * Requires naming convention in setting fields!
 */
function addCommonArgs(args, prefix) {
    args.set("vr-controlpanel-posrot",$("#inp_ctrlPanel").val());
    // there are two different fields for offsetvr
    args.set("offsetVR",$("#inp_" + prefix + "offsetVR").val());
    args.set("devmode",$("#chk_devMode").prop("checked"));
}

function launchMazeScene(vr,boxname,theme,teamSize) {

    var args = new Map();
    addCommonArgs(args, "");
    args.set("initialMaze",$("#" + boxname).val());
    args.set("enableVR",vr);
    if (theme != null) {
        args.set("theme",theme);
    }
    if (teamSize != null) {
        args.set("teamSize",teamSize);
    }
    launchScene("MazeScene",args);
}

/**
 * Launch scene with remote grid.
 * Always sets team size 1 because it is no server to avoid (currently confusing) team bots.
 */
function launchMazeSceneFromList(vr, hrefOfGrid) {

    var args = new Map();
    addCommonArgs(args, "");
    args.set("initialMaze", hrefOfGrid);
    args.set("enableVR",vr);
    args.set("teamSize",1);
    launchScene("MazeScene",args);
}

/**
 * Launch a server for a scene with remote grid.
 */
function launchMazeSceneServerFromList(hrefOfGrid) {

    var args = new Map();
    addCommonArgs(args, "");
    args.set("initialMaze", hrefOfGrid);
    args.set("enableVR",vr);
    launchScene("MazeScene",args);
}

/**
 * Launch scene for joining a scene server.
 */
function launchMazeForJoining(vr, server) {

    var args = new Map();
    addCommonArgs(args, "");
    // No "initialMaze", grid comes from server
    args.set("server", server);
    args.set("enableVR",vr);
    launchScene("MazeScene",args);
}

function launchScene(scenename,args) {

    const params = new URLSearchParams()

    var url = host + "/webgl.html?scene="+scenename;

    args.forEach(function (value, key) {
        //console.log(`${key}: ${value}`);
        //html += '<option value="' + key + '">' + value + '</option>\n';
        url += "&" + key + "=" + value;
    });

    var win = window.open(url, '_blank');
}