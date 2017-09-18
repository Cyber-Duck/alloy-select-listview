// $.args;
var hasOther = $.args.hasOther || false,
    otherTitle = $.args.otherTitle || false,
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
$.getOptionsLength = function () {
    return $.section.getItems().length;
};

// Setters
$.setOptions = function (options) {
    var optionsArr = dataItems = [];

    if (_.isString(options)) {
        optionsArr = options.split("|");
    } else if (_.isArray(options)) {
        optionsArr = options;
    } else {
        console.error("setOptions() only accepts options as a string, an array of strings or or array of objects.");
        return;
    }

    optionsArr = _.map(optionsArr, function (option) {
        if (_.isString(option)) {
            var key, value, object = {};
            if (option.indexOf(":") >= 0) {
                key = _.first(option.split(":"));
                value = _.last(option.split(":"));
            } else {
                key = value = option;
            }

            object[key] = value;
            return object;
        } else if (!_.isObject(option) || _.keys(option).length !== 1) {
            throw new Error("Object passed to setOptions() should have only a key and a value.");
        }

        return option;
    });

    _.each(optionsArr, function (option) {
        var optionKey = _.first(_.keys(option));
        var optionTitle = _.first(_.values(option));

        var listItem = Widget.createController("item", { "key": optionKey, "title": optionTitle }).getView();
        dataItems.push({ "properties": listItem.properties });
    });

    $.section.setItems(dataItems);
    // Every time we redefine the set of options again, the selection should be lost
    $.unselectAllOptions();
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
    context = context || {};

    $.hideError();

    _.each($.section.getItems(), function(item, itemIndex) {
        if (itemIndex === selectedIndex) {
            // Record selected ListItem
            context.selectedOption = selectedOption = item;
            // Record selected value (driven by the title of the selected ListItem)
            value = context.value = $.listview.value = item.properties.itemId;
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
    value = null;
    _.each($.section.getItems(), function(item, itemIndex) {
        if (item.properties.accessoryType === Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        }
        item.properties.subtitle = "";
        $.section.updateItemAt(itemIndex, item);
    });
};
$.insertOption = function (optionTitle, optionKey) {
    optionKey = optionKey || optionTitle;
    var dataItems = $.section.getItems();
    var listItem = Widget.createController("item", { "key": optionKey, "title": optionTitle }).getView();
    dataItems.push({ "properties": listItem.properties });

    $.section.setItems(dataItems);
};
$.removeLastOption = function () {
    $.section.setItems($.section.getItems().pop());
};
$.showError = function (message) {
    $.resetClass($.caption, 'uk-co-cyber-duck-select-caption-error');
    if (message) {
        $.errorwrapper.setHeight(Ti.UI.SIZE);
        $.error.setText(message);
    }
};
$.hideError = function () {
    $.resetClass($.caption, 'uk-co-cyber-duck-select-caption');
    $.errorwrapper.setHeight(0);
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
    if ($.args.options && _.isString($.args.options)) {
        $.setOptions($.args.options);
    }
    if (hasOther && otherTitle) {
        $.setOtherTitle(otherTitle);
    }
    if ($.args.caption) {
        $.caption.setText($.args.caption);
    }
})();
