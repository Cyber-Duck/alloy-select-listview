var args = $.args,
    options = args.options || false,
    hasOther = args.hasOther || false,
    otherTitle = args.otherTitle || false,
    selectedOption = null,
    value = null,
    otherValue = null;

// Getters
$.getValue = function () {
    return value;
};
$.getOtherValue = function () {
    var otherItem = _.last($.section.getItems());
    return otherItem.properties.subtitle;
};
$.getSelectedOption = function () {
    return selectedOption;
};

// Setters
$.setOptions = function (args) {
    if (!_.isArray(args)) {
        console.error("setOptions() only accepts options as an array of strings.");
        return;
    }

    var dataItems = [];
    _.each(args, function (optionTitle) {
        var listItem = Widget.createController("item", { "title": optionTitle }).getView();
        dataItems.push({ "properties": listItem.properties });
    });

    $.section.insertItemsAt(0, dataItems);
};
$.setOtherTitle = function (title) {
    if (!hasOther) {
        console.error("Unable to call setOtherSubtitle() when the Widget doesn't have 'hasOther' set to 'true'.");
        return;
    }

    var otherItem = _.last($.section.getItems());
    var otherItemIndex = $.section.getItems().length - 1;

    otherItem.properties.title = title;
    $.section.updateItemAt(otherItemIndex, otherItem);
};
$.setOtherSubtitle = function(subtitle) {
    if (!hasOther) {
        console.error("Unable to call setOtherSubtitle() when the Widget doesn't have 'hasOther' set to 'true'.");
        return;
    }

    var otherItem = _.last($.section.getItems());
    var otherItemIndex = $.section.getItems().length - 1;

    otherItem.properties.subtitle = subtitle;
    if (subtitle) {
        otherItem.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
    } else {
        otherItem.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        value = $.listview.value = "";
    }
    $.section.updateItemAt(otherItemIndex, otherItem);
};

// Public methods
$.selectOptionAtIndex = function (selectedIndex, context) {
    _.each($.section.getItems(), function(item, itemIndex) {
        if (itemIndex === selectedIndex) {
            // Record selected ListItem
            context.selectedOption = selectedOption = item;
            // Record selected value (driven by the title of the selected ListItem)
            value = context.value = $.listview.value = item.properties.title;
            // Trigger an event once selection is made
            $.trigger("optionSelected", context);
            if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
                item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
            }
        } else {
            if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK) {
                item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
            }
        }
        item.properties.subtitle = "";
        $.section.updateItemAt(itemIndex, item);
    });
};
$.unselectAllOptions = function () {
    _.each($.section.getItems(), function(item, itemIndex) {
        if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        }
        item.properties.subtitle = "";
        $.section.updateItemAt(itemIndex, item);
    });
};

// Private Event Listener
$.listview.addEventListener("itemclick", function optionSelected(e) {
    $.selectOptionAtIndex(e.itemIndex, e);
    if (hasOther && value === $.other.properties.title) {
        e.otherTitle = $.other.properties.title;
        e.otherSubtitle = $.other.properties.subtitle;
        $.trigger("otherSelected", e);
    }
});

// Public Event Listeners
// - "onOptionSelected"
// - "onOtherSelected"

// Init of the Widget
(function init() {
    if (options && _.isString(options)) {
        $.setOptions(options.split("|"));
    }
    if (hasOther && otherTitle) {
        $.setOtherTitle(otherTitle);
    }
})();
