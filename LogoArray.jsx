#target aftereffects

(function() {
    var scriptName = "Banner Script";

    // Create UI
    var mainWindow = new Window("palette", scriptName, undefined);
    mainWindow.orientation = "column";
	
	// Create a title 
	 var titleGroup = mainWindow.add("group", undefined, "Title Group");
    titleGroup.alignment = "center";
    var titleLabel = titleGroup.add("statictext", undefined, "Logo Array Tool by Jonny-Havoc");
    var arialBoldFont = ScriptUI.newFont("Arial-Bold", "BOLD", 22);
	titleLabel.graphics.font = arialBoldFont;
	
    // Logo selection
    var logoGroup = mainWindow.add("group", undefined, "Logo Group");
    logoGroup.add("statictext", undefined, "Select Logo:");
    var logoDropdown = logoGroup.add("dropdownlist", undefined, []);
    logoDropdown.size = [200, 25];

    // Number of duplications
    var numberGroup = mainWindow.add("group", undefined, "Number Group");
    numberGroup.add("statictext", undefined, "Number of Logos:");
    var numberInput = numberGroup.add("edittext", undefined, "");
    numberInput.size = [50, 25];

    // Direction selection
    var directionGroup = mainWindow.add("group", undefined, "Direction Group");
    directionGroup.add("statictext", undefined, "Direction:");
    var verticalCheckbox = directionGroup.add("checkbox", undefined, "Vertical");
    var horizontalCheckbox = directionGroup.add("checkbox", undefined, "Horizontal");

    // Margin input
    var marginGroup = mainWindow.add("group", undefined, "Margin Group");
    marginGroup.add("statictext", undefined, "Margin (px):");
    var marginInput = marginGroup.add("edittext", undefined, "");
    marginInput.size = [50, 25];

    // OK Button
    var okButton = mainWindow.add("button", undefined, "OK");

    // Populate logo dropdown with items in the project
    function populateLogoDropdown() {
        var project = app.project;
        if (!project) return;
        
        for (var i = 1; i <= project.rootFolder.numItems; i++) {
            var item = project.rootFolder.item(i);
            if (item instanceof FootageItem && item.file) {
                var listItem = logoDropdown.add("item", item.name);
                listItem.item = item;
            }
        }

        if (logoDropdown.items.length > 0) {
            logoDropdown.selection = 0;
        }
    }

    populateLogoDropdown();

    // OK Button functionality
    okButton.onClick = function() {
        var selectedLogo = logoDropdown.selection.item;
        var numCopies = parseInt(numberInput.text);
        var isVertical = verticalCheckbox.value;
        var margin = parseInt(marginInput.text);

        if (!selectedLogo || isNaN(numCopies) || isNaN(margin) || (!isVertical && !horizontalCheckbox.value)) {
            alert("Please fill out all fields correctly.");
            return;
        }

        distributeLogos(selectedLogo, numCopies, isVertical, margin);
    };

    function distributeLogos(logo, numCopies, isVertical, margin) {
        app.beginUndoGroup(scriptName);

		var comp = app.project.activeItem;
		if (!comp || !(comp instanceof CompItem)) {
			alert("Please select a composition.");
			return;
		}

    // Determine the scaling factor based on the margin and the composition size
		var scale;
		if (isVertical) {
			var maxHeight = (comp.height - margin * 2) / numCopies - margin * (numCopies - 1) / numCopies;
			scale = Math.min(100, (maxHeight / logo.height) * 100);
		} else {
			var maxWidth = (comp.width - margin * 2) / numCopies - margin * (numCopies - 1) / numCopies;
			scale = Math.min(100, (maxWidth / logo.width) * 100);
		}

		for (var i = 0; i < numCopies; i++) {
			var logoLayer = comp.layers.add(logo);
			logoLayer.scale.setValue([scale, scale]);

			if (isVertical) {
				var totalHeight = (logo.height * scale / 100 + margin) * numCopies - margin;
				var startY = margin + logo.height * scale / 100 / 2;
				logoLayer.position.setValue([comp.width / 2, startY + i * (logo.height * scale / 100 + margin)]);
			} else {
				var totalWidth = (logo.width * scale / 100 + margin) * numCopies - margin;
				var startX = margin + logo.width * scale / 100 / 2;
				logoLayer.position.setValue([startX + i * (logo.width * scale / 100 + margin), comp.height / 2]);
			}
		}

        app.endUndoGroup();
    }

    mainWindow.center();
    mainWindow.show();
})();
