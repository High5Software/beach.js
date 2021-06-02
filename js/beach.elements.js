//### global properties (these apply to any element)
nest.properties.global = {
  text: function(element, property) {
    let elementText = document.createTextNode(property);
    let elementNest = element._nest;
    Object.keys(elementNest).forEach(function(attprop, attpropCount) {
      switch (attprop) {
        case "text":
          let textCount = attpropCount;
          break;

        case "nest":
          let nestCount = attpropCount;
          break;
      }
    })
    if (typeof nestCount !== 'undefined') {
      if (textCount > nestCount) {
        setTimeout(function() {
          element.inner.insertAdjacentHTML('beforeend', property);
        }, 10);
      } else {
        element.inner.insertAdjacentHTML('afterbegin', property);
      }
    } else {
      element.inner.insertAdjacentHTML('afterbegin', property);
    }
  },
  html: function(element, property) {
    let elementNest = element._nest;
    Object.keys(elementNest).forEach(function(attprop, attpropCount) {
      switch (attprop) {
        case "html":
          let htmlCount = attpropCount;
          break;

        case "nest":
          let nestCount = attpropCount;
          break;
      }
    })
    if (typeof nestCount !== 'undefined') {
      if (htmlCount > nestCount) {
        setTimeout(function() {
          element.inner.insertAdjacentHTML('beforeend', property);
        }, 10);
      } else {
        element.inner.insertAdjacentHTML('afterbegin', property);
      }
    } else {
      element.inner.insertAdjacentHTML('afterbegin', property);
    }
  },
  group: function(element, property) {
    let group = element._nest.group;
    let groupLength = document.querySelectorAll('[data-nest-group-id="' + group + '"]').length;
    if (!element.outer.hasAttribute('data-nest-group-id')) {
      if (groupLength == 0) {
        let groupWrapper = nest.create.group(element._nest, element._target);
        groupWrapper.appendChild(element.outer);
        element.outer = groupWrapper;
      } else {
        let groupWrapper = document.querySelectorAll('[data-nest-group-id="' + group + '"]')[0];
        groupWrapper.appendChild(element.outer);
        element.outer = groupWrapper;
      }
    }
  },
  fetch : function(element, property) {

  },
  comment: function(element, property) {
    console.log('----------------------------------');
    console.log(element.outer);
    console.log("Comment : " + property);
  }
};



//### collapsible defaults
nest.defaults.global = {
  fetch : undefined
}


nest.defaults.fetch = {
  method : 'GET',
  url : null
}


//### collapsible element definition
nest.element.collapsible = function() {

  //dom elements that make up the component
  let collapsibleOuter = document.createElement('x-nest-collapsible');
  collapsibleOuter.setAttribute('data-nest-collapsible-state', 'closed');
  let collapsibleTrigger = document.createElement('x-nest-collapsible-trigger');
  let collapsibleTitle = document.createElement('h2');
  let collapsibleInner = document.createElement('x-nest-collapsible-inner');
  let plusIcon = document.createTextNode('+');
  collapsibleToggleIcon = document.createElement('span');
  collapsibleToggleIcon.appendChild(plusIcon);
  let collapsibleIcon = document.createElement('x-nest-collapsible-icon');
  collapsibleTrigger.appendChild(collapsibleToggleIcon);
  collapsibleTrigger.appendChild(collapsibleTitle);
  collapsibleTrigger.appendChild(collapsibleIcon);
  collapsibleOuter.appendChild(collapsibleTrigger);
  collapsibleOuter.appendChild(collapsibleInner);
  collapsibleTrigger.addEventListener('click', function() {
    nest.actions.collapsible.toggle(element);
  }, false);

  //register the element and the components of the element
  let element = Object();
  nest.register.outer(element, collapsibleOuter);
  nest.register.inner(element, collapsibleInner);
  let components = { "trigger" : collapsibleTrigger,
                     "plusminus" : collapsibleToggleIcon,
                     "title" : collapsibleTitle,
                     "icon" : collapsibleIcon
  };

  nest.register.components(element, components);
  return element;
}


//### collapsible defaults
nest.defaults.collapsible = {
  title : "untitled collapsible"
}


//### collapsible properties
nest.properties.collapsible = {
  //display title and HTML title property for the collapsible
  title: function(element, property) {
    let titleTextContainer = document.createTextNode(property);
    element.title.appendChild(titleTextContainer);
    element.outer.setAttribute('title', property);
  },

  //active bool, if set to true, collapsible is opened on load
  active: function(element, property) {
    property ? nest.actions.collapsible.open(element) : nest.actions.collapsible.close(element);
  },
  //used to set an icon for the collapsible via font awesome or other icon library, ie : "fa fa-home"
  iconClass: function(element, property) {
    element.icon.className = property;
  }
};



//### collapsible actions
nest.actions.collapsible = {

  //action to open the collapsible, used with toggle
  open: function(element) {
    element.outer.setAttribute('data-nest-collapsible-state', 'open');
    element.inner.classList.add('collapsibleToggleAnimation');
    element.plusminus.removeChild(element.plusminus.lastChild);
    let minusIcon = document.createTextNode('-');
    element.plusminus.appendChild(minusIcon);
  },

  //action to close the collapsible, used with toggle
  close: function(element) {
    element.outer.setAttribute('data-nest-collapsible-state', 'closed');
    element.inner.classList.remove('collapsibleToggleAnimation');
    element.plusminus.removeChild(element.plusminus.lastChild);
    let plusIcon = document.createTextNode('+');
    element.plusminus.appendChild(plusIcon);
  },

  //action to toggle the collapsible open/close, attached to collapsible trigger onclick
  toggle: function(element) {
    let collapsibleState = element.outer.getAttribute("data-nest-collapsible-state");
    collapsibleState == 'open' ? nest.actions.collapsible.close(element) : nest.actions.collapsible.open(element);
  }
}


// //TODO: finish view element - uses id to reference
nest.element.panel = function(nestElement, target) {
  let viewOuter = nest.create.group(nestElement, target);
  let viewInner = document.createElement('x-nest-panel');
  viewOuter.appendChild(viewInner);

  //register the element and the components of the element
  let element = Object();
  nest.register.outer(element, viewOuter);
  nest.register.inner(element, viewInner);
  return element;
};



nest.element.fancyButton = function(nestElement, target) {
  let buttonOuter = nest.create.group(nestElement, target);
  let buttonInner = document.createElement('x-nest-fancy-button');
  let buttonTitle = document.createElement('x-nest-fancy-button-title');
  let buttonIcon = document.createElement('x-nest-fancy-button-icon');
  buttonInner.appendChild(buttonIcon);
  buttonInner.appendChild(buttonTitle);
  buttonOuter.appendChild(buttonInner);

  buttonInner.addEventListener('click', function() {
    nest.actions.fancyButton.activate(element);
  }, false);

  //registering components will go here
  let element = Object();
  nest.register.outer(element, buttonOuter);
  nest.register.inner(element, buttonInner);
  let components = { "title" : buttonTitle, "icon" : buttonIcon };
  nest.register.components(element, components);
  return element;
}


nest.properties.fancyButton = {

  //sets the display title of the button as well as a title tag
  title : function(element, property) {
    let titleTextContainer = document.createTextNode(property);
    element.title.appendChild(titleTextContainer);
    element.outer.setAttribute('title', property);
  },

  //here you can set a tab icon using font awesome or another icon library, ie : "fa fa-home"
  iconClass: function(element, property) {
    element.icon.className = property;
  },

  //you can set the ison position to be before or after the text in the tab title, accepts "left", "right"
  iconPosition: function(element, property) {
    switch (property) {
      default:
        element.icon.style.float = property;
        element.title.style['padding-' + property] = '8px';
        break;
    }
  }
}

nest.defaults.fancyButton = {
  title : 'Untitled Button'
}

nest.actions.fancyButton = {
    activate : function(element) {
        element.title.textContent = 'Processing ...';
        element.icon.className = 'fa fa-cog rotate';
    }
}


nest.render.fancyButton = function(element) {
  console.log(element);
}


//### tab definition
nest.element.tab = function(nestElement, target) {
  let tabOuter = nest.create.group(nestElement, target);
  let tabTrigger = document.createElement('x-nest-tab-trigger');
  let tabTitle = document.createElement('h2');
  tabTrigger.appendChild(tabTitle);
  tabTrigger.setAttribute('data-nest-tab-state', 'inactive');
  tabTrigger.addEventListener('click', function() {
    nest.actions.tab.select(element);
  }, false);
  let tabInner = document.createElement('x-nest-tab-inner');
  tabInner.setAttribute('data-nest-tab-state', 'inactive');
  tabOuter.insertAdjacentElement('beforeend', tabInner);
  tabOuter.querySelectorAll('x-nest-tab-inner')[0].before(tabTrigger);

  //register the element and the components of the element
  let element = Object();
  nest.register.outer(element, tabOuter);
  nest.register.inner(element, tabInner);
  let components = { "trigger" : tabTrigger,
                     "title" : tabTitle
  };
  nest.register.components(element, components);
  return element;
};

//### tab defaults
nest.defaults.tab = {
  title : ""
}

//### tab properties
nest.properties.tab = {
  //sets the display title and title property for a tab element
  title: function(element, property) {
    let titleTextContainer = document.createTextNode(property);
    element.title.appendChild(titleTextContainer)
    element.trigger.setAttribute('title', property)
    element.inner.setAttribute('title', property)
  },
  //if set to true, this tab is active/selected after render (nest.render.tab)
  active: function(element, property) {
    if (property === true) {
      nest.actions.tab.select(element);
    }
  },
  //here you can set a tab icon using font awesome or another icon library, ie : "fa fa-home"
  iconClass: function(element, property) {
    element.icon = document.createElement('x-nest-tab-icon');
    element.icon.className = property;
    element.trigger.append(element.icon);
  },
  //you can set the ison position to be before or after the text in the tab title, accepts "left", "right"
  iconPosition: function(element, property) {
    switch (property) {
      default:
        element.icon.style.float = property;
        element.trigger.prepend(element.icon);
        break;
    }
  },
  //maxHeight sets a maximum height for the tab and enables scrolling
  maxHeight : function(element, property) {
    element.inner.style.maxHeight = property;
    element.inner.style.overflowY = 'auto';
  }
}


//### tab actions
nest.actions.tab = {
  //selects a tab, and used internally by the tab trigger onclick
  select: function(element) {
    let outerChildren = element.outer.children;
    Object.keys(outerChildren).forEach(function(tabGroupChild) {
      //check to only set immediate tab group elements to inactive
      switch (outerChildren[tabGroupChild]['tagName'].toLowerCase()) {
        case 'x-nest-tab-trigger':
        case 'x-nest-tab-inner':
          outerChildren[tabGroupChild].setAttribute('data-nest-tab-state', 'inactive');
          break;
      }
    });
    element.trigger.setAttribute('data-nest-tab-state', 'active');
    element.inner.setAttribute('data-nest-tab-state', 'active');
  }
}



//### tab render events
nest.render.tab = function(element) {
  //used in collaboration with "active" propert and selects the tab after render
  let outerChildren = element.outer.children;
  let activeSet = false;
  Object.keys(outerChildren).forEach(function(tabGroupChild) {
    let tabState = outerChildren[tabGroupChild].getAttribute('data-nest-tab-state');
    if (tabState == "active") {
      activeSet = true;
    }
  });

  //if no active tab is set to default, click the first one
  if (activeSet == false) {
    element.outer.getElementsByTagName('x-nest-tab-trigger')[0].setAttribute('data-nest-tab-state', 'active');
    element.outer.getElementsByTagName('x-nest-tab-inner')[0].setAttribute('data-nest-tab-state', 'active');
  };

  //bind the tab collision behavior once
  if (typeof tabsResizeBound == 'undefined') {
    // future: add mobile support on resize
    // window.onresize = function(event) {
    //   activeTabContent = document.querySelectorAll('[data-nest-tab-state="active"]');
    //   for (let activeTab of activeTabContent) {
    //     switch (activeTab.tagName.toLowerCase()) {
    //       case 'x-nest-tab-inner':
    //         let innerOffsetLeft = activeTab.offsetLeft;
    //         let innerTotalWidth = activeTab.offsetWidth;
    //         let innerOffsetRight = innerOffsetLeft + innerTotalWidth;
    //         break;
    //     }
    //   }
    //
    //   //get the offset of the last tab
    //   triggerOffsetLeft = document.querySelectorAll('x-nest-group > x-nest-tab-trigger')[0].offsetLeft;
    //   getTabTriggersWidth = document.querySelectorAll('x-nest-group > x-nest-tab-trigger');
    //   totalWidth = 0;
    //   tabElementArray = Array();
    //   for (let tabTrigger of getTabTriggersWidth) {
    //     tabWidth = tabTrigger.offsetWidth;
    //     totalWidth = tabWidth + totalWidth;
    //     tabElementArray.push(tabTrigger);
    //   }
    //   tabTriggerOffsetRight = totalWidth + triggerOffsetLeft;
    //   tabTrigger[0].setAttribute('data-min-width', innerOffsetRight)
    //   if (innerOffsetRight < ((tabTriggerOffsetRight)+5)) {
    //     tabElementArray.forEach(function(tabTrigger) {
    //       tabTrigger.style.width = '100%';
    //     })
    //   }
    //
    // }
  }
}
