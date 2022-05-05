// initialize namespaces
window.FormIt = window.FormIt || {};
FormIt.PluginUI = FormIt.PluginUI || {};

/// UI utilities ///

// converts a value to a properly-formatted FormIt dimension string
// according to the current units
FormIt.PluginUI.convertValueToDimensionString = function(value, callbackFunction)
{
    window.FormItInterface.CallMethod("FormIt.StringConversion.StringToLinearValue", value, function(result)
    {
        // parse the result
        result = JSON.parse(result);

        // if the API was able to convert the value to a dimension, return it
        if (result.first === true)
        {
            window.FormItInterface.CallMethod("FormIt.StringConversion.LinearValueToString", Number(result.second), callbackFunction);
        }
        // otherwise, the value was not a valid number or dimension
        // so return a single unit of value
        else
        {
            window.FormItInterface.CallMethod("FormIt.StringConversion.LinearValueToString", 1, callbackFunction);
        }
    });
}

/// UI classes and modules ///

// typical header - can be used at the top of a whole plugin, or at the top of a subsection
FormIt.PluginUI.HeaderModule = class HeaderModule {
    constructor(headerTitle, headerSubtitle, moduleClassName) {

        // initialize the arguments
        this.headerTitle = headerTitle;
        this.headerSubtitle = headerSubtitle;
        this.moduleClassName = moduleClassName;
        
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the header
        let headerContainer = document.createElement('div');
        headerContainer.id = 'pluginHeaderContainer';
        headerContainer.className = this.moduleClassName;

        // create the header elements
        let titleDiv = document.createElement('h1');
        titleDiv.innerHTML = this.headerTitle;
        headerContainer.appendChild(titleDiv);

        let subtitleDiv = document.createElement('p');
        subtitleDiv.innerHTML =  this.headerSubtitle;
        headerContainer.appendChild(subtitleDiv);

        return headerContainer;
    }
}

// typical subheader - can be used to define a sub-section of a multi-plugin
FormIt.PluginUI.SubheaderModule = class SubheaderModule {
    constructor(subheaderTitle) {

        // initialize the arguments
        this.subheaderTitle = subheaderTitle;
        
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the header
        let subheaderContainer = document.createElement('div');
        subheaderContainer.className = 'pluginSubheaderContainer';

        let subtitleDiv = document.createElement('p');
        subtitleDiv.className = 'pluginSubheader';
        subtitleDiv.innerHTML =  this.subheaderTitle;
        subheaderContainer.appendChild(subtitleDiv);

        return subheaderContainer;
    }
}

// info card - static - used in Properties Plus and Manage Attributes
FormIt.PluginUI.InfoCardStatic = class InfoCardStatic {
    constructor(infoCardTitle) {

        // initialize the arguments
        this.infoCardTitle = infoCardTitle;

        // build and attach events
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // info card container
        this.infoCardContainer = document.createElement('div');
        this.infoCardContainer.id = 'infoCardStatic';
        this.infoCardContainer.className = 'infoContainer';

        // info card header
        this.infoCardHeader = document.createElement('div');
        this.infoCardHeader.id = 'infoCardStaticHeader';
        this.infoCardHeader.className = 'infoHeader';
        this.infoCardHeader.innerHTML = this.infoCardTitle;
        this.infoCardContainer.appendChild(this.infoCardHeader);

        return this.infoCardContainer;
    }
}

// info card - expandable - used in Properties Plus and Manage Attributes
FormIt.PluginUI.InfoCardExpandable = class InfoCardExpandable {
    constructor(infoCardTitle, bStartExpanded) {

        // initialize the arguments
        this.infoCardTitle = infoCardTitle;
        this.bStartExpanded = bStartExpanded;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {

        // info card container
        this.infoCardContainer = document.createElement('div');
        this.infoCardContainer.id = 'infoCardStatic';
        this.infoCardContainer.className = 'infoContainer';

        // info card header
        this.infoCardHeader = document.createElement('div');
        this.infoCardHeader.id = 'infoCardStaticHeader';
        this.infoCardHeader.className = 'infoHeaderExpandable';
        this.infoCardHeader.innerHTML = this.infoCardTitle;
        this.infoCardContainer.appendChild(this.infoCardHeader);

        // expand icon
        this.infoCardHeaderExpandCollapseIcon = document.createElement('img');
        this.infoCardHeader.appendChild(this.infoCardHeaderExpandCollapseIcon);

        // expandable content
        this.infoCardExpandableContent = document.createElement('div');
        this.infoCardContainer.appendChild(this.infoCardExpandableContent);
       
        // hide the expandable content container if specified
        if (this.bStartExpanded)
        {
            this.infoCardHeader.className = 'infoHeaderExpandable';
            this.infoCardHeaderExpandCollapseIcon.className = 'infoHeaderExpandedIcon';
        }
        else 
        {
            this.infoCardHeader.className = 'infoHeaderExpandableCollapsed';
            this.infoCardExpandableContent.className = 'hide';
            this.infoCardHeaderExpandCollapseIcon.className = 'infoHeaderCollapsedIcon';
        }

        return this.infoCardContainer;
    }
  
    attachEvents() {
        this.infoCardHeader.addEventListener('click', () => {
            
            if (this.infoCardExpandableContent.className == 'hide')
            {
                this.expand();
            }
            else 
            {
                this.collapse();
            }
        });
    }

    expand()
    {
        this.infoCardHeaderExpandCollapseIcon.className = 'infoHeaderExpandedIcon';
        this.infoCardHeader.className = 'infoHeaderExpandable';
        this.infoCardExpandableContent.className = 'show';
    }

    collapse()
    {
        this.infoCardHeaderExpandCollapseIcon.className = 'infoHeaderCollapsedIcon';
        this.infoCardHeader.className = 'infoHeaderExpandableCollapsed';
        this.infoCardExpandableContent.className = 'hide';
    }

    show()
    {
        this.infoCardContainer.className = 'infoContainer';
    }

    hide()
    {
        this.infoCardContainer.className = 'hide';
    }
}

// list container - scrollable and with automatic zero-state
FormIt.PluginUI.ListContainer = class ListContainer {
    constructor(zeroStateMessageText, nListHeight) {

        // initialize the arguments
        this.zeroStateMessageText = zeroStateMessageText;
        this.nEmptyListHeight = 60;
        this.nPopulatedListHeight = nListHeight ? nListHeight : 200;

        // build and attach events
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create the list container element
        this.listContainerDiv = document.createElement('div');
        this.listContainerDiv.className = 'scrollableListContainer';

        // the zero-state message will always be the first child
        this.zeroStateMessageLabel = document.createElement('p');
        this.zeroStateMessageLabel.id = 'scrollableListContainerZeroStateLabel';
        this.zeroStateMessageLabel.innerHTML =  this.zeroStateMessageText;
        this.listContainerDiv.appendChild(this.zeroStateMessageLabel);
        
        return this.listContainerDiv;
    }

    // toggle the zero-state message depending on whether the container has children
    toggleZeroStateMessage()
    {
        // if the child count is greater than 1 (the zero-state message itself is child 0)
        // hide the message
        if (this.listContainerDiv.childElementCount > 1)
        {
            this.zeroStateMessageLabel.className = "hide";
            // set the list to the specified height if provided
            this.setListHeight(this.nPopulatedListHeight);
        }
        // otherwise, show it
        else 
        {
            this.zeroStateMessageLabel.className = "show";
            // reset the list to a height more appropriate for its empty state
            this.setListHeight(this.nEmptyListHeight);
        }
    }

    clearList()
    {
        // the first child is the zero-state label, which shouldn't be deleted
        // so save it for restoring later
        let zeroStateChild = this.listContainerDiv.firstChild;

        // remove all children
        while (this.listContainerDiv.firstChild) {
            this.listContainerDiv.removeChild(this.listContainerDiv.lastChild);
        }

        // add the zero-state label back
        this.listContainerDiv.appendChild(zeroStateChild);
    }

    // override the list height
    setListHeight(nHeight)
    {
        this.listContainerDiv.style.height = nHeight;
    }
}

// generic list item - static
FormIt.PluginUI.SimpleListItemStatic = class SimpleListItemStatic {
    constructor(listItemText) {

        // initialize the arguments
        this.listItemText = listItemText;

        // build and attach events
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // overall container
        this.itemContainer = document.createElement('div');
        this.itemContainer.textContent = this.listItemText;
        this.itemContainer.className = 'simpleListItemContainer';

        return this.itemContainer;
    }
}

// generic list item - interactive
FormIt.PluginUI.SimpleListItemInteractive = class SimpleListItemInteractive {
    constructor() {

        // initialize the arguments

        // build and attach events
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // overall container
        this.itemContainer = document.createElement('div');
        this.itemContainer.className = 'simpleListItemContainer';
        
        // button
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.listItemText;
        this.button.className = 'expandableItemButtonCollapsed';
        this.button.id = 'expandableItemButton';
        this.itemContainer.appendChild(this.button);

        // expandable content
        this.expandableContentContainer = document.createElement('div');
        this.expandableContentContainer.className = 'hide';
        this.itemContainer.appendChild(this.expandableContentContainer);

        return this.itemContainer;
    }
}

// expandable list item
FormIt.PluginUI.ExpandableListItem = class ExpandableListItem {
    constructor(buttonText) {

        // initialize the arguments
        this.buttonText = buttonText;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {

        // overall container
        this.overallContainer = document.createElement('div');
        this.overallContainer.className = 'expandableItemContainer';
        
        // button
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.buttonText;
        this.button.className = 'expandableItemButtonCollapsed';
        this.button.id = 'expandableItemButton';
        this.overallContainer.appendChild(this.button);

        // expandable content
        this.expandableContentContainer = document.createElement('div');
        this.expandableContentContainer.className = 'hide';
        this.overallContainer.appendChild(this.expandableContentContainer);

        return this.overallContainer;
    }

    attachEvents() {
        this.button.addEventListener('click', () => {
            
            if (this.expandableContentContainer.className == 'hide')
            {
                this.expandableContentContainer.className = 'expandableContentContainer';
                this.button.className = 'expandableItemButtonExpanded';
            }
            else 
            {
                this.expandableContentContainer.className = 'hide';
                this.button.className = 'expandableItemButtonCollapsed';
            }

        });
    }

    // override the list height
    setContentContainerHeight(nHeight)
    {
        this.expandableContentContainer.style.height = nHeight;
    }
}

// typical button
FormIt.PluginUI.Button = class Button {
    constructor(buttonText, onClickFunction) {

        // initialize the arguments
        this.buttonText = buttonText;
        this.onClickFunction = onClickFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.buttonText;
        
        return this.button;
    }

    attachEvents() {
        this.button.addEventListener('click', this.onClickFunction);
    }

}

// button with tooltip
FormIt.PluginUI.ButtonWithTooltip = class ButtonWithTooltip {
    constructor(buttonText, buttonTooltip, onClickFunction) {

        // initialize the arguments
        this.buttonText = buttonText;
        this.buttonTooltip = buttonTooltip;
        this.onClickFunction = onClickFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.setAttribute("title", this.buttonTooltip)
        this.button.value = this.buttonText;
        
        return this.button;
    }

    attachEvents() {
        this.button.addEventListener('click', this.onClickFunction);
    }

}

// button with description
FormIt.PluginUI.ButtonWithInfoToggleModule = class ButtonWithInfoToggleModule {
    constructor(buttonText, buttonDescription, onClickFunction) {

        // initialize the arguments
        this.buttonText = buttonText;
        this.buttonDescription = buttonDescription;
        this.onClickFunction = onClickFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the button and description
        this.moduleContainer = document.createElement("div");
        this.moduleContainer.id = "buttonWithInfoToggleModule"

        this.buttonRow = document.createElement("div");
        this.buttonRow.id = "buttonWithInfoToggleRow";

        this.moduleContainer.appendChild(this.buttonRow);

        // create the button
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.buttonText;
        this.button.id = "buttonWithInfoToggle";
        
        this.buttonRow.appendChild(this.button);

        // create the info button
        this.infoButton = document.createElement("img");
        this.infoButton.src = "https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/info_blue.png";
        this.infoButton.id = "infoToggle";

        this.buttonRow.appendChild(this.infoButton);

        // create the description div
        this.descriptionDiv = document.createElement("div");
        this.descriptionDiv.innerHTML = this.buttonDescription;
        this.descriptionDiv.id = "infoToggleDescription";
        this.descriptionDiv.className = "hide";

        this.moduleContainer.appendChild(this.descriptionDiv);

        return this.moduleContainer;
    }

    attachEvents() {
        this.button.addEventListener('click', this.onClickFunction);

        this.infoButton.addEventListener('click', () => {

                if (this.descriptionDiv.className == "hide")
                {
                    this.descriptionDiv.className = "show";
                    this.infoButton.className = 'infoToggleActive';
                }
                else
                {
                    this.descriptionDiv.className = "hide";
                    this.infoButton.className = 'infoToggleInactive';
                }

        });
    }

}

// "deselect" button - used in Properties Plus
FormIt.PluginUI.DeselectButtonModule = class DeselectButtonModule {
    constructor(onClickFunction, deselectObjectType, buttonLabelText, moduleID, buttonLabelID) {

        // initialize the arguments
        this.onClickFunction = onClickFunction;
        this.deselectObjectType = deselectObjectType;
        this.buttonLabelText = buttonLabelText;
        this.moduleID = moduleID;
        this.buttonLabelID = buttonLabelID;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the button and label
        this.moduleContainer = document.createElement("div");
        this.moduleContainer.id = this.moduleID;

        // create a row for flex styling
        this.deselectButtonRow = document.createElement("div");
        this.deselectButtonRow.id = "deselectButtonRow";
        this.moduleContainer.appendChild(this.deselectButtonRow);

        // create the deselect button
        this.deselectButton = document.createElement("img");
        this.deselectButton.src = "https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/remove_blue.png";
        this.deselectButton.id = "deselectButton";
        this.deselectButton.title = "Click to remove this object type from the current selection."
        this.deselectButtonRow.appendChild(this.deselectButton);

        // create the button label
        this.deselectButtonLabel = document.createElement("div");
        this.deselectButtonLabel.innerHTML = this.buttonLabelText;
        this.deselectButtonLabel.id = this.buttonLabelID;
        this.deselectButtonRow.appendChild(this.deselectButtonLabel);

        return this.moduleContainer;
    }

    attachEvents() {

        this.deselectButton.addEventListener("click", () => {

            this.onClickFunction(this.deselectObjectType);

        });

    }

}

// all text or number inputs
FormIt.PluginUI.AlphaNumericInput = class AlphaNumericInput {
    constructor(submitTextFunction) {
        this.existingInputValue = undefined;
        this.submitTextFunction = submitTextFunction;
    }

    // these events need to be attached to every input
    attachEvents() {
        this.input.addEventListener("focus", (event) => {
            // keep track of the existing input value - used to prevent submission if nothing changed
            this.existingInputValue = event.currentTarget.value;
        });

        this.input.addEventListener("blur", (event) => {

            if (this.submitTextFunction)
            {
                // ensure that only if the value is different than it was when we started, do we submit the function
                if (event.currentTarget.value !== this.existingInputValue)
                {
                    const resultCallback = (returnVal) => {

                        returnVal = JSON.parse(returnVal);

                        if (returnVal){
                            this.input.value = returnVal;
                        }
                    }

                    this.submitTextFunction(event.currentTarget.value, resultCallback);
                }
            }
        });

        this.input.addEventListener("keydown", (event) => {
            if (event.keyCode === 13)
            {
                event.preventDefault();
            }
        });

        this.input.addEventListener("keyup", (event) => {
            if (event.keyCode === 13)
            {
                const resultCallback = (returnVal) => {

                    returnVal = JSON.parse(returnVal);

                    if (returnVal){
                        this.input.value = returnVal;
                    }
                }
                this.submitTextFunction(event.currentTarget.value, resultCallback);
                event.preventDefault();
            }
        });
    }
}

// typical text/dimension input and a label - no button
FormIt.PluginUI.TextInputModule = class TextInputModule extends FormIt.PluginUI.AlphaNumericInput {
    constructor(moduleLabelText, moduleID, moduleClassName, inputID, submitTextFunction) {
        
        // call the super function
        super();

        // initialize the arguments
        this.moduleLabelText = moduleLabelText;
        this.moduleID = moduleID;
        this.moduleClassName = moduleClassName;
        this.inputID = inputID;
        this.submitTextFunction = submitTextFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create the container
        let container = document.createElement('form');
        container.id = this.moduleID;
        container.className = this.moduleClassName;

        // create the label
        this.textInputLabel = document.createElement('div');
        this.textInputLabel.className = 'inputLabel';
        this.textInputLabel.innerHTML = this.moduleLabelText;
        container.appendChild(this.textInputLabel);

        // create the input
        this.input = document.createElement('input');
        this.input.id = this.inputID;
        this.input.setAttribute("type", "text");
        container.appendChild(this.input);

        return container;
    }

    // get the input for get/set value operations
    getInput() {
        return this.input;
    }

    // get the label 
    getLabel() {
        return this.textInputLabel;
    }

    // set the label
    setLabel(newLabelText) {
        this.textInputLabel.innerHTML = newLabelText;
    }
}

// typical multi-line text input - no button
FormIt.PluginUI.TextAreaInputModule = class TextAreaInputModule extends FormIt.PluginUI.AlphaNumericInput {
    constructor(moduleLabelText, submitTextFunction) {

        // call the super function
        super();

        // initialize the arguments
        this.moduleLabelText = moduleLabelText;
        this.submitTextFunction = submitTextFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create the container
        this.moduleContainer = document.createElement('form');
        this.moduleContainer.className = 'inputModuleContainer';

        // create the label
        this.moduleLabel = document.createElement('div');
        this.moduleLabel.className = 'inputLabel';
        this.moduleLabel.innerHTML = this.moduleLabelText;
        this.moduleContainer.appendChild(this.moduleLabel);

        // create the input
        this.input = document.createElement('textarea');
        this.moduleContainer.appendChild(this.input);

        return this.moduleContainer;
    }

    // get the input for get/set value operations
    getInput() {
        return this.input;
    }

    // override the default input height for text that might be long
    setTextAreaRows(nNumberOfRows) {
        this.input.setAttribute("rows", String(nNumberOfRows));
        //this.input.rows = String(nNumberOfRows);
    }
}

// typical numeric input and a label
FormIt.PluginUI.NumberInputModule = class NumberInputModule extends FormIt.PluginUI.AlphaNumericInput {
    constructor(moduleLabelText, moduleID, moduleClassName, inputID, submitTextFunction) {
        
        // call the super function
        super();

        // initialize the arguments
        this.moduleLabelText = moduleLabelText;
        this.moduleID = moduleID;
        this.moduleClassName = moduleClassName;
        this.inputID = inputID;
        this.submitTextFunction = submitTextFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create the container
        let container = document.createElement('form');
        container.id = this.moduleID;
        container.className = this.moduleClassName;

        // create the label
        let textInputLabel = document.createElement('div');
        textInputLabel.className = 'inputLabel';
        textInputLabel.innerHTML = this.moduleLabelText;
        container.appendChild(textInputLabel);

        // create the input
        this.input = document.createElement('input');
        this.input.id = this.inputID;
        this.input.setAttribute("type", "number");
        container.appendChild(this.input);

        return container;
    }
}

// select input / drop-down
FormIt.PluginUI.SelectInputModule = class SelectInputModule {
    constructor(labelText, defaultOption, onChangeFunction) {
       
        // initialize the arguments
        this.labelText = labelText;
        this.defaultOption = defaultOption;
        this.onChangeFunction = onChangeFunction;

        // build
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {

        // build the container
        let container = document.createElement('div');

        // create the label
        let selectInputLabel = document.createElement('div');
        selectInputLabel.className = 'inputLabel';
        selectInputLabel.innerHTML = this.labelText;
        selectInputLabel.setAttribute('for', 'selectList');
        container.appendChild(selectInputLabel);

        // create the text input
        this.input = document.createElement('select');
        this.input.setAttribute('name', 'selectList');
        container.appendChild(this.input);

        return container;
    }

    attachEvents() {
        this.input.addEventListener("focus", (event) => {
            // keep track of the existing input value - used to prevent submission if nothing changed
            this.existingInputValue = event.currentTarget.value;
        });

        this.input.addEventListener("change", (event) => {

            if (this.onChangeFunction)
            {
                // ensure that only if the value is different than it was when we started, do we submit the function
                if (event.currentTarget.value !== this.existingInputValue)
                {
                    const resultCallback = (returnVal) => {

                        returnVal = JSON.parse(returnVal);

                        if (returnVal){
                            this.input.value = returnVal;
                        }
                    }

                    this.onChangeFunction(event.currentTarget.value, resultCallback);
                }
            }
        });

        this.input.addEventListener("keydown", (event) => {
            if (event.keyCode === 13)
            {
                event.preventDefault();
            }
        });

        this.input.addEventListener("keyup", (event) => {
            if (event.keyCode === 13)
            {
                const resultCallback = (returnVal) => {

                    returnVal = JSON.parse(returnVal);

                    if (returnVal){
                        this.input.value = returnVal;
                    }
                }
                this.submitTextFunction(event.currentTarget.value, resultCallback);
                event.preventDefault();
            }
        });
    }

    getInput() {
        return this.input;
    }

    clearSelectList() {

        this.input.length = 0;

    }

    populateSelectList(array) {

        this.clearSelectList();

        // first, populate the list with the default option
        let defaultOption = document.createElement('option');
        defaultOption.textContent = this.defaultOption;
        this.input.appendChild(defaultOption);

        // then append the options from the array
        for(let i = 0; i < array.length; i++)
        {
            let option = document.createElement('option');
            option.textContent = array[i];
            this.input.appendChild(option);
        }
    }

}

// typical checkbox input
FormIt.PluginUI.CheckboxModule = class CheckboxModule {
    constructor(labelText, moduleID, moduleClassName, inputID) {
       
        // initialize the arguments
        this.labelText = labelText;
        this.moduleID = moduleID;
        this.moduleClassName = moduleClassName;
        this.inputID = inputID;

        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // build the container
        let container = document.createElement('form');
        container.id = this.moduleID;
        container.className = this.moduleClassName;

        // create the checkbox
        this.input = document.createElement('input');
        this.input.id = this.inputID;
        this.input.setAttribute("type", "checkbox");
        container.appendChild(this.input);

        // create the label
        let checkboxLabel = document.createElement('div');
        checkboxLabel.className = 'inputLabel';
        checkboxLabel.innerHTML = this.labelText;
        container.appendChild(checkboxLabel);

        return container;
    }

    getInput() {
        return this.input;
    }
}

// typical radio button input
FormIt.PluginUI.RadioButtonModule = class RadioButtonModule {
    constructor(labelText, radioButtonName) {
       
        // initialize the arguments
        this.labelText = labelText;
        this.radioButtonName = radioButtonName;

        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // build the container
        let container = document.createElement('div');
        container.className = 'multiModuleContainer';

        // create the checkbox
        this.input = document.createElement('input');
        this.input.setAttribute("type", "radio");
        this.input.setAttribute("name", this.radioButtonname);
        container.appendChild(this.input);

        // create the label
        let checkboxLabel = document.createElement('div');
        checkboxLabel.className = 'inputLabel';
        checkboxLabel.innerHTML = this.labelText;
        container.appendChild(checkboxLabel);

        return container;
    }

    getInput() {
        return this.input;
    }
}

// info card message
// used when the selection doesn't meet the specified criteria
FormIt.PluginUI.MessageInfoCard = class MessageInfoCard {
    constructor(sMessageText) {
       
        // initialize the arguments
        this.sMessageText = sMessageText;

        // build
        this.element = this.build();
    }

    build()
    {
        this.messageContainerDiv = document.createElement('div');
        this.messageContainerDiv.id = 'messageContainer';
        this.messageContainerDiv.className = 'infoContainer';
    
        this.messageContentDiv = document.createElement('div');
        this.messageContentDiv.className = 'infoList';
        this.messageContentDiv.innerHTML = this.sMessageText;
        this.messageContainerDiv.appendChild(this.messageContentDiv);
    
        return this.messageContainerDiv;
    }

    hide()
    {
        this.messageContainerDiv.className = 'hide';
    }

    show()
    {
        this.messageContainerDiv.className = 'infoContainer';
    }
}

// context-aware and selection-aware info cards
// need to be built and updated as selection and context changes
// shared between Properties Plus and Manage Attributes

FormIt.PluginUI.EditingContextInfoCard = class EditingContextInfoCard {
    constructor() {
       
        // initialize the arguments

        // build
        this.element = this.build();
    }

    build()
    {
        let contextPropertiesInfoCard = new FormIt.PluginUI.InfoCardStatic('Currently Editing');

        this.editingHistoryNameDiv = document.createElement('div');
        this.editingHistoryNameDiv.className = 'infoList';
        this.editingHistoryNameDiv.innerHTML = "";
    
        this.editingHistoryInstancesDiv = document.createElement('div');
        this.editingHistoryInstancesDiv.className = 'infoList';
        this.editingHistoryInstancesDiv.innerHTML = "";
    
        contextPropertiesInfoCard.element.appendChild(this.editingHistoryNameDiv);
        contextPropertiesInfoCard.element.appendChild(this.editingHistoryInstancesDiv);
    
        return contextPropertiesInfoCard.element;
    }

    update(currentSelectionInfo)
    {
        // update the current editing history name
        this.editingHistoryNameDiv.innerHTML = currentSelectionInfo.sEditingHistoryName;

        // update the number of instances the current history affects
        if (currentSelectionInfo.sEditingHistoryName == "Main Sketch")
        {
            this.editingHistoryInstancesDiv.innerHTML = "";
        } 
        else 
        {
            this.editingHistoryInstancesDiv.innerHTML = "(" + currentSelectionInfo.nEditingHistoryInstances + " in model)";
        }
    }
}

FormIt.PluginUI.SelectionCountInfoCard = class SelectionCountInfoCard {
    constructor(nMaxObjectCount) {
       
        // initialize the arguments
        this.nMaxObjectCount = nMaxObjectCount;

        // build
        this.element = this.build();
    }

    build()
    {
        this.selectionCountInfoCard = new FormIt.PluginUI.InfoCardStatic('Selection Count');
    
        this.objectCountDiv = document.createElement('div');
        this.objectCountDiv.className = 'infoList';
        this.objectCountLabel = "Total objects: ";
        this.objectCountDiv.innerHTML = this.objectCountLabel + '';
        this.selectionCountInfoCard.element.appendChild(this.objectCountDiv);
    
        // horizontal line - only shows when 1 or more objects are selected
        this.objectCountHorizontalRule = document.createElement('hr'); 
        this.selectionCountInfoCard.element.appendChild(this.objectCountHorizontalRule);

        // too many objects in selection - only shows when the selection contains
        // more than nMaxObjectCount
        this.tooManyItemsContainerDiv = new FormIt.PluginUI.MessageInfoCard("Select fewer than " + this.nMaxObjectCount + " objects to see more information.");
        this.tooManyItemsContainerDiv.hide();
        // note: this gets appended later, since there's no parent yet

        // vertices
        this.vertexCountLabelPrefix = "Vertices: ";
        this.vertexCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nVertexType, this.vertexCountLabelPrefix, 'vertexCountModule', 'vertexCountLabel');
        this.vertexCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.vertexCountModule.element);

        // edges
        this.edgeCountLabelPrefix = "Edges: ";
        this.edgeCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nEdgeType, this.edgeCountLabelPrefix, 'edgeCountModule', 'edgeCountLabel');
        this.edgeCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.edgeCountModule.element);

        // faces
        this.faceCountLabelPrefix = "Faces: ";
        this.faceCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nFaceType, this.faceCountLabelPrefix, 'faceCountModule', 'faceCountLabel');
        this.faceCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.faceCountModule.element);

        // bodies
        this.bodyCountLabelPrefix = "Bodies: ";
        this.bodyCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nBodyType, this.bodyCountLabelPrefix, 'bodyCountModule', 'bodyCountLabel');
        this.bodyCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.bodyCountModule.element);

        // meshes
        this.meshCountLabelPrefix = "Meshes: ";
        this.meshCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nMeshType, this.meshCountLabelPrefix, 'meshCountModule', 'meshCountLabel');
        this.meshCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.meshCountModule.element);

        // linemeshes
        this.lineMeshCountLabelPrefix = "LineMeshes: ";
        this.lineMeshCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nLineMeshType, this.lineMeshCountLabelPrefix, 'lineMeshCountModule', 'lineMeshCountLabel');
        this.lineMeshCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.lineMeshCountModule.element);

        // pointmeshes
        this.pointMeshCountLabelPrefix = "PointMeshes: ";
        this.pointMeshCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nPointMeshType, this.pointMeshCountLabelPrefix, 'pointMeshCountModule', 'pointMeshCountLabel');
        this.pointMeshCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.pointMeshCountModule.element);

        // group instances
        this.groupInstanceCountLabelPrefix = "Groups: ";
        this.groupInstanceCountModule = new FormIt.PluginUI.DeselectButtonModule(PropertiesPlus.submitDeselectObjectsByType, WSM.nObjectType.nInstanceType, this.groupInstanceCountLabelPrefix, 'groupInstanceCountModule', 'groupInstanceCountLabel');
        this.groupInstanceCountModule.element.className = 'hide';
        this.selectionCountInfoCard.element.appendChild(this.groupInstanceCountModule.element);
    
        return this.selectionCountInfoCard.element;
    }

    // needs to be called after the module is appended as a child to the DOM
    appendTooManyObjectsMessage()
    {
        this.selectionCountInfoCard.element.parentElement.appendChild(this.tooManyItemsContainerDiv.element);
    }

    update(currentSelectionInfo)
    {
        // update the general object count div
        this.objectCountDiv.innerHTML = this.objectCountLabel + currentSelectionInfo.nSelectedTotalCount;

        // show the horizontal rule if 
        // more than 1 and less than the given max objects are selected
        currentSelectionInfo.nSelectedTotalCount > 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.objectCountHorizontalRule.className = 'show' : this.objectCountHorizontalRule.className = 'hide';

        // show the too many object selected message if
        // more than nMaxObjectCount is selected
        if (currentSelectionInfo.nSelectedTotalCount > this.nMaxObjectCount)
        {
            // show the container for the message that too many items are selected
            this.tooManyItemsContainerDiv.show();
        }
        else
        {
            this.tooManyItemsContainerDiv.hide();
        }

        // for each of the individual object counts, show and update if necessary
        currentSelectionInfo.nSelectedVertexCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.vertexCountModule, this.vertexCountLabelPrefix, currentSelectionInfo.nSelectedVertexCount, currentSelectionInfo) : this.hideObjectCountModule(this.vertexCountModule);

        currentSelectionInfo.nSelectedEdgeCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.edgeCountModule, this.edgeCountLabelPrefix, currentSelectionInfo.nSelectedEdgeCount, currentSelectionInfo) : this.hideObjectCountModule(this.edgeCountModule);

        currentSelectionInfo.nSelectedFaceCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.faceCountModule, this.faceCountLabelPrefix, currentSelectionInfo.nSelectedFaceCount, currentSelectionInfo) : this.hideObjectCountModule(this.faceCountModule);

        currentSelectionInfo.nSelectedBodyCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.bodyCountModule, this.bodyCountLabelPrefix, currentSelectionInfo.nSelectedBodyCount, currentSelectionInfo) : this.hideObjectCountModule(this.bodyCountModule);

        currentSelectionInfo.nSelectedMeshCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.meshCountModule, this.meshCountLabelPrefix, currentSelectionInfo.nSelectedMeshCount, currentSelectionInfo) : this.hideObjectCountModule(this.meshCountModule);

        currentSelectionInfo.nSelectedPointMeshCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.pointMeshCountModule, this.pointMeshCountLabelPrefix, currentSelectionInfo.nSelectedPointMeshCount, currentSelectionInfo) : this.hideObjectCountModule(this.pointMeshCountModule);

        currentSelectionInfo.nSelectedLineMeshCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.lineMeshCountModule, this.lineMeshCountLabelPrefix, currentSelectionInfo.nSelectedLineMeshCount, currentSelectionInfo) : this.hideObjectCountModule(this.lineMeshCountModule);

        currentSelectionInfo.nSelectedGroupInstanceCount != 0 && currentSelectionInfo.nSelectedTotalCount < this.nMaxObjectCount ? this.showAndUpdateObjectCountModule(this.groupInstanceCountModule, this.groupInstanceCountLabelPrefix, currentSelectionInfo.nSelectedGroupInstanceCount, currentSelectionInfo) : this.hideObjectCountModule(this.groupInstanceCountModule);
    }

    showAndUpdateObjectCountModule(objectCountModule, labelPrefix, objectCount, currentSelectionInfo)
    {
        objectCountModule.deselectButtonLabel.innerHTML = labelPrefix + objectCount;
        objectCountModule.element.className = 'show';

        // special rules for groups - show instances and histories
        if (labelPrefix.includes("Group") && currentSelectionInfo.nSelectedGroupInstanceCount == 1)
        {
            objectCountModule.deselectButtonLabel.innerHTML = labelPrefix + objectCount + " Instance (" + currentSelectionInfo.nSelectedIdenticalGroupInstanceCount + " in model)";
        }
        else if (labelPrefix.includes("Group") && currentSelectionInfo.nSelectedGroupInstanceCount > 1)
        {
            // update the group instance count to also show how many unique group histories the instances belong to
            let uniqueHistoryCount = currentSelectionInfo.nSelectedUniqueGroupHistoryCount;

            // change the wording slightly if there is more than one family
            let historyString = '';
            if (uniqueHistoryCount == 1)
            {
                historyString = " History)";
            }
            else
            {
                historyString = " Histories)";
            }
            
            objectCountModule.deselectButtonLabel.innerHTML = labelPrefix + objectCount + " Instances (" + uniqueHistoryCount + historyString;
        }
    }

    hideObjectCountModule(objectCountModule)
    {
        objectCountModule.element.className = 'hide';
    }
}

// displays the given list of string attributes - view only
// used in Properties Plus and Manage Attributes
FormIt.PluginUI.StringAttributeListViewOnly = class StringAttributeListViewOnly {
    constructor(sInfoCardLabel, bStartExpanded, nListHeight) {

            // initialize the arguments
            this.sInfoCardLabel = sInfoCardLabel;
            this.bStartExpanded = bStartExpanded;
            this.nListHeight = nListHeight;
    
            // build
            this.element = this.build();
    }

    build()
    {
        this.stringAttributeListInfoCard = new FormIt.PluginUI.InfoCardExpandable(this.sInfoCardLabel, this.bStartExpanded);

        // list of attributes
        this.stringAttributeList = new FormIt.PluginUI.ListContainer('No string attributes found.');
        this.stringAttributeList.element.className = 'scrollableListContainer';
        this.stringAttributeList.setListHeight(this.nListHeight);
        this.stringAttributeList.toggleZeroStateMessage();
        this.stringAttributeListInfoCard.infoCardExpandableContent.appendChild(this.stringAttributeList.element);

        return this.stringAttributeListInfoCard.element;
    }

    update(aStringAttributeIDs, aStringAttributes)
    {
        this.stringAttributeList.clearList();

        for (var i = 0; i < aStringAttributes.length; i++)
        {
            let attributeItem = new FormIt.PluginUI.StringAttributeListItemViewOnly(i, aStringAttributeIDs[i], aStringAttributes[i].sKey, aStringAttributes[i].sValue);
            this.stringAttributeList.element.appendChild(attributeItem.element);       
        }
        this.stringAttributeList.toggleZeroStateMessage();
    }

    show()
    {
        this.stringAttributeListInfoCard.show();
    }

    hide()
    {
        this.stringAttributeListInfoCard.hide();
    }
}

// create a string attribute list item, showing the key and value in a container
FormIt.PluginUI.StringAttributeListItemViewOnly = class StringAttributeListItemViewOnly {
    constructor(nStringAttributeCount, nStringAttributeID, stringAttributeKeyContent, stringAttributeValueContent) {

        // initialize the arguments
        this.nStringAttributeID = nStringAttributeID;
        this.nStringAttributeCount = nStringAttributeCount;
        this.stringAttributeKeyContent = stringAttributeKeyContent;
        this.stringAttributeValueContent = stringAttributeValueContent;

        // build
        this.element = this.build();

    }

    build()
    {
        // create a list item
        this.stringAttributeContainerItem = new FormIt.PluginUI.SimpleListItemStatic();
        
        // attribute key
        let attributeKeyLabelDiv = document.createElement('div');
        attributeKeyLabelDiv.textContent = 'Attribute Key ' + this.nStringAttributeCount + ':';
        attributeKeyLabelDiv.style.fontWeight = 'bold';
        attributeKeyLabelDiv.style.paddingBottom = 5;
        this.stringAttributeContainerItem.element.appendChild(attributeKeyLabelDiv);

        this.attributeKeyContentDiv = document.createElement('div');
        this.attributeKeyContentDiv.style.paddingBottom = 10;
        this.attributeKeyContentDiv.textContent = this.stringAttributeKeyContent;
        this.stringAttributeContainerItem.element.appendChild(this.attributeKeyContentDiv);

        // attribute value
        let attributeValueLabel = document.createElement('div');
        attributeValueLabel.textContent = 'Attribute Value:';
        attributeValueLabel.style.fontWeight = 'bold';
        attributeValueLabel.style.paddingBottom = 5;
        this.stringAttributeContainerItem.element.appendChild(attributeValueLabel);

        this.attributeValueContentDiv = document.createElement('div');
        this.attributeValueContentDiv.style.paddingBottom = 10;
        this.attributeValueContentDiv.textContent = this.stringAttributeValueContent;
        this.stringAttributeContainerItem.element.appendChild(this.attributeValueContentDiv);

        // attribute ID
        let attributeIDLabel = document.createElement('div');
        attributeIDLabel.textContent = 'Attribute ID:';
        attributeIDLabel.style.fontWeight = 'bold';
        attributeIDLabel.style.paddingBottom = 5;
        this.stringAttributeContainerItem.element.appendChild(attributeIDLabel);

        this.attributeIDContentDiv = document.createElement('div');
        this.attributeIDContentDiv.style.paddingBottom = 10;
        this.attributeIDContentDiv.textContent = this.nStringAttributeID;
        this.stringAttributeContainerItem.element.appendChild(this.attributeIDContentDiv);

        return this.stringAttributeContainerItem.element;
    }
}

// displays the given list of string attributes - with delete button
// used in Properties Plus and Manage Attributes
FormIt.PluginUI.StringAttributeListWithDelete = class StringAttributeListViewWithDelete {
    constructor(sInfoCardLabel, bStartExpanded, nListHeight) {

            // initialize the arguments
            this.sInfoCardLabel = sInfoCardLabel;
            this.bStartExpanded = bStartExpanded;
            this.nListHeight = nListHeight;
    
            // build
            this.element = this.build();
    }

    build()
    {
        this.stringAttributeListInfoCard = new FormIt.PluginUI.InfoCardExpandable(this.sInfoCardLabel, this.bStartExpanded);

        // list of attributes
        this.stringAttributeList = new FormIt.PluginUI.ListContainer('No string attributes found.');
        this.stringAttributeList.element.className = 'scrollableListContainer';
        this.stringAttributeList.setListHeight(this.nListHeight);
        this.stringAttributeList.toggleZeroStateMessage();
        this.stringAttributeListInfoCard.infoCardExpandableContent.appendChild(this.stringAttributeList.element);

        return this.stringAttributeListInfoCard.element;
    }

    update(aStringAttributeIDs, aStringAttributes)
    {
        this.stringAttributeList.clearList();

        for (var i = 0; i < aStringAttributes.length; i++)
        {
            let attributeItem = new FormIt.PluginUI.StringAttributeListItemWithDelete(i, aStringAttributeIDs[i], aStringAttributes[i].sKey, aStringAttributes[i].sValue, this);
            this.stringAttributeList.element.appendChild(attributeItem.element);       
        }
        this.stringAttributeList.toggleZeroStateMessage();
    }

    show()
    {
        this.stringAttributeListInfoCard.show();
    }

    hide()
    {
        this.stringAttributeListInfoCard.hide();
    }
}

// a string attribute list item with a delete button
FormIt.PluginUI.StringAttributeListItemWithDelete = class StringAttributeListItemWithDelete {
    constructor(nStringAttributeCount, nStringAttributeID, stringAttributeKeyContent, stringAttributeValueContent, stringAttributeListToUpdate) {

        // initialize the arguments
        this.nStringAttributeID = nStringAttributeID;
        this.nStringAttributeCount = nStringAttributeCount;
        this.stringAttributeKeyContent = stringAttributeKeyContent;
        this.stringAttributeValueContent = stringAttributeValueContent;
        this.stringAttributeListToUpdate = stringAttributeListToUpdate;

        // build
        this.element = this.build();
        this.attachEvents();
    }

    build()
    {
        // overall container
        this.itemAndDeleteContainer = document.createElement('div');
        this.itemAndDeleteContainer.id = 'deselectButtonRow';

        // create the delete button
        this.deleteButton = document.createElement("img");
        this.deleteButton.src = "https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/remove_blue.png";
        this.deleteButton.id = "stringAttributeDeleteButton";
        this.deleteButton.title = "Click to delete this string attribute."
        this.itemAndDeleteContainer.appendChild(this.deleteButton);

        // create the string attribute list item
        let readOnlyListItem = new FormIt.PluginUI.StringAttributeListItemViewOnly(this.nStringAttributeCount, this.nStringAttributeID, this.stringAttributeKeyContent, this.stringAttributeValueContent);
        this.itemAndDeleteContainer.appendChild(readOnlyListItem.element);

        return this.itemAndDeleteContainer;
    }

    attachEvents() {

        this.deleteButton.addEventListener("click", () => {

            var doDelete = confirm("Are you sure you want to delete this string attribute? \n\nDeleting string attributes could cause features to stop working or introduce instability. You should only delete string attributes if you made them or understand their impact.");

            if (doDelete)
            {
                // record this as a variable that can be passed into the callmethod
                var self = this;
                let args = { 
                    "nStringAttributeID" : this.nStringAttributeID
                };
    
                // delete the string attribute
                window.FormItInterface.CallMethod("ManageAttributes.deleteStringAttribute", args);
    
                // get the updated selection data from Properties Plus
                FormItInterface.CallMethod("PropertiesPlus.getAttributeInfo", self, function(result)
                {
                    var attributeInfo = JSON.parse(result);
                    // refresh the list of existing attributes
                    self.stringAttributeListToUpdate.update(attributeInfo.aSelectedObjectStringAttributeIDs, attributeInfo.aSelectedObjectStringAttributes);
                });
            }
        });

    }
}

// an info card that presents inputs to add a new string attribute by key/value pair
FormIt.PluginUI.NewStringAttributeInfoCard = class NewStringAttributeInfoCard {
    constructor(sInfoCardLabel, bStartExpanded, nListHeight) {

        // initialize the arguments
        this.sInfoCardLabel = sInfoCardLabel;
        this.bStartExpanded = bStartExpanded;
        this.nListHeight = nListHeight;

        // build
        this.element = this.build();
    }

    build()
    {
        this.newStringAttributeInfoCard = new FormIt.PluginUI.InfoCardExpandable(this.sInfoCardLabel, this.bStartExpanded);

        // text input for the string attribute key
        this.newStringAttributeKeyInput = new FormIt.PluginUI.TextInputModule('String Attribute Key', 'newStringAttributeKeyInputModule', 'inputModuleContainer', 'newStringAttributeKeyInput', function() { });
        this.newStringAttributeKeyInput.getInput().setAttribute('title', 'Enter text for the string attribute key.');
        this.newStringAttributeInfoCard.infoCardExpandableContent.appendChild(this.newStringAttributeKeyInput.element);

        // text input for the string attribute value
        this.newStringAttributeValueInput = new FormIt.PluginUI.TextAreaInputModule('String Attribute Value', function() { });
        this.newStringAttributeValueInput.element.id = 'newStringAttributeValueInputModule';
        this.newStringAttributeValueInput.getInput().setAttribute('title', 'Enter text for the string attribute value.');
        this.newStringAttributeValueInput.setTextAreaRows(5);
        //this.newStringAttributeValueInput.setInputHeight(100);
        this.newStringAttributeInfoCard.infoCardExpandableContent.appendChild(this.newStringAttributeValueInput.element);

        // submit button
        this.submitNewStringAttribute = new FormIt.PluginUI.Button('Create New Attribute');
        this.newStringAttributeInfoCard.infoCardExpandableContent.appendChild(this.submitNewStringAttribute.element);

        return this.newStringAttributeInfoCard.element;
    }

    show()
    {
        this.newStringAttributeInfoCard.show();
    }

    hide()
    {
        this.newStringAttributeInfoCard.hide();
    }

    // submit new string attributes on the selected object
    submitStringAttributeOnObject(existingAttributesListToUpdate)
    {
        // UI args
        let interfaceArgs = { 
            "sAttributeKey" : this.newStringAttributeKeyInput.getInput().value, "sAttributeValue" : this.newStringAttributeValueInput.getInput().value }

        // get the attribute info object from Properties Plus
        FormItInterface.CallMethod("PropertiesPlus.getAttributeInfo", interfaceArgs, function(result)
        {
            let attributeInfo = JSON.parse(result);

            let args = { 
                "sAttributeKey" : interfaceArgs.sAttributeKey, 
                "sAttributeValue" : interfaceArgs.sAttributeValue,
                "attributeInfo" : attributeInfo 
            };

            // set the attribute on the FormIt side
            window.FormItInterface.CallMethod("ManageAttributes.setStringAttributeOnObjectFromInput", args);

            // get the updated selection data from Properties Plus
            FormItInterface.CallMethod("PropertiesPlus.getAttributeInfo", interfaceArgs, function(result)
            {
                var attributeInfo = JSON.parse(result);
                // refresh the list of existing attributes
                existingAttributesListToUpdate.update(attributeInfo.aSelectedObjectStringAttributeIDs, attributeInfo.aSelectedObjectStringAttributes);
            });
        });

        // clear the text input values
        this.newStringAttributeKeyInput.getInput().value = '';
        this.newStringAttributeValueInput.getInput().value = '';
    }

    submitStringAttributeOnHistory(existingAttributesListToUpdate)
    {
        // UI args
        let interfaceArgs = { 
            "sAttributeKey" : this.newStringAttributeKeyInput.getInput().value, "sAttributeValue" : this.newStringAttributeValueInput.getInput().value }

        // get the attribute info object from Properties Plus
        FormItInterface.CallMethod("PropertiesPlus.getAttributeInfo", interfaceArgs, function(result)
        {
            let attributeInfo = JSON.parse(result);

            let args = { 
                "sAttributeKey" : interfaceArgs.sAttributeKey, 
                "sAttributeValue" : interfaceArgs.sAttributeValue,
                "attributeInfo" : attributeInfo 
            };

            // set the attribute on the FormIt side
            window.FormItInterface.CallMethod("ManageAttributes.setStringAttributeOnHistoryFromInput", args);

            // get the updated selection data from Properties Plus
            FormItInterface.CallMethod("PropertiesPlus.getAttributeInfo", interfaceArgs, function(result)
            {
                var attributeInfo = JSON.parse(result);

                // refresh the list of existing attributes
                existingAttributesListToUpdate.update(attributeInfo.aEditingHistoryStringAttributeIDs, attributeInfo.aEditingHistoryStringAttributes);
            });
        });

        // clear the text input values
        this.newStringAttributeKeyInput.getInput().value = '';
        this.newStringAttributeValueInput.getInput().value = '';
    }
}

// message module for unsupported version
// if a specific version is specified, the message will tell the user they need at least that version
FormIt.PluginUI.UnsupportedVersionModule = class UnsupportedVersionModule {
    constructor(versionString) {

        // initialize the arguments
        this.versionString = versionString;
        
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create a container
        let unsupportedVersionContainer = document.createElement('div');
        unsupportedVersionContainer.id = 'unsupportedVersionContainer';

        // create the icon
        let unsupportedVersionIcon = document.createElement('img');
        // https://formit3d.github.io
        unsupportedVersionIcon.src = 'https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/info_grey.png';
        unsupportedVersionIcon.id = 'unsupportedVersionIcon';
        unsupportedVersionContainer.appendChild(unsupportedVersionIcon);

        // create the message
        let unsupportedVersionMessage = document.createElement('p');
        unsupportedVersionContainer.appendChild(unsupportedVersionMessage);

        // if the version is specified, use it
        if (this.versionString)
        {
            unsupportedVersionMessage.innerHTML =  'FormIt ' + this.versionString + ' or newer is required to run this plugin.';
        }
        // otherwise, use a generic message
        else
        {
            unsupportedVersionMessage.innerHTML =  'A newer version of FormIt is required to run this plugin.';
        }

        let downloadLink = document.createElement('a');
        downloadLink.innerHTML =  'Download the latest version of FormIt.';
        unsupportedVersionContainer.appendChild(downloadLink);

        downloadLink.setAttribute("href", "javascript:void(0);");
    
        downloadLink.onclick = function() {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit.autodesk.com/page/download');
        }

        return unsupportedVersionContainer;
    }
}

// create a container to host multiple child elements, organizing them horizontally
FormIt.PluginUI.MultiModuleContainer = class MultiModuleContainer {
    constructor() {
        // build
        this.element = this.build();
    }

    build() {
        let multiModuleContainer = document.createElement('div');
        multiModuleContainer.id = 'multiModuleContainer';
        multiModuleContainer.className = 'multiModuleContainer';

        return multiModuleContainer;
    }
}

// typical footer
FormIt.PluginUI.FooterModule = class FooterModule {
    constructor() {
       
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        let footerContainer = document.createElement('div');
        footerContainer.id = 'pluginFooterContainer';
    
        let footerDiv = document.createElement('div');
        footerDiv.id = 'pluginFooterDiv';
        footerContainer.appendChild(footerDiv);

        let footerIcon = document.createElement('img');
        footerIcon.src = 'https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/plugin_manager_grey.png';
        footerIcon.id = 'pluginFooterIcon';
        footerDiv.appendChild(footerIcon);
    
        let footerDescriptionText = document.createTextNode("Powered by FormIt JavaScript plugins");
        footerDiv.appendChild(footerDescriptionText);
    
        let footerDivUL = document.createElement('ul');
        footerDiv.appendChild(footerDivUL);
    
        let footerLearnAboutPluginsLI = document.createElement('li');
        let footerLearnAboutPluginsLink = document.createElement('a');
        let footerLearnAboutPluginsText = document.createTextNode("Learn about plugins");
        footerLearnAboutPluginsLink.appendChild(footerLearnAboutPluginsText);
        footerLearnAboutPluginsLink.setAttribute("href", "javascript:void(0);");
        footerDivUL.appendChild(footerLearnAboutPluginsLI);
        footerLearnAboutPluginsLI.appendChild(footerLearnAboutPluginsLink);
    
        footerLearnAboutPluginsLink.onclick = function() {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/index.html');
        }
    
        let footerLearnToBuildLI = document.createElement('li');
        let footerLearnToBuildLink = document.createElement('a');
        let footerLearnToBuildText = document.createTextNode("Build your own");
        footerLearnToBuildLink.appendChild(footerLearnToBuildText);
        footerLearnToBuildLink.setAttribute("href", "javascript:void(0);");
        footerDivUL.appendChild(footerLearnToBuildLI);
        footerLearnToBuildLI.appendChild(footerLearnToBuildLink);
    
        footerLearnToBuildLink.onclick = function() {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/docs/HowToBuild.html');
        }

        return footerContainer;
    }
}