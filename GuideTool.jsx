//@target aftereffects

function CreateDivisionGuides(division, addHorizontal, addVertical) {
    var comp = app.project.activeItem; // Get active composition

    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    if (!addHorizontal && !addVertical) {
        alert("Please select horizontal or vertical.");
        return;
    }

    if (isNaN(division) || division < 1) {
        alert("Divisions cannot be 0.");
        return;
    }

    app.beginUndoGroup("GuideDivideTool by Jonny-Havoc"); // Begin undo group

    var width = comp.width;
    var height = comp.height;

    for (var i = 1; i < division; i++) {
        var x = (width / division) * i;
        var y = (height / division) * i;
        if (addVertical) comp.addGuide(1, x); // Add vertical guide if selected
        if (addHorizontal) comp.addGuide(0, y); // Add horizontal guide if selected
    }

    app.endUndoGroup(); // End undo group
}

// UI
function showUI() {
    var win = new Window("palette", "GuideDivideTool by Jonny-Havoc", undefined, {
        closeButton: true,
        resizeable: true
    });
    win.orientation = "column";

    var divisionGroup = win.add("group", undefined);
    divisionGroup.add("statictext", undefined, "Number of divisions:");
    var divisionInput = divisionGroup.add("edittext", undefined, "");
    divisionInput.size = [100, 25];

    var directionGroup = win.add("panel", undefined, "Directions");
    directionGroup.orientation = "row";
    var horizontalCheckbox = directionGroup.add("checkbox", undefined, "Horizontal");
    var verticalCheckbox = directionGroup.add("checkbox", undefined, "Vertical");

    var buttonGroup = win.add("group", undefined);
    var okButton = buttonGroup.add("button", undefined, "OK");

    okButton.onClick = function() {
        var division = parseInt(divisionInput.text, 10);
        var addHorizontal = horizontalCheckbox.value;
        var addVertical = verticalCheckbox.value;

        CreateDivisionGuides(division, addHorizontal, addVertical);
    };

    win.onClose = function() {
        return true;
    };

    win.center();
    win.show();
}

showUI();
