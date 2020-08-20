//-.-. --- -.. . -.. / -... -.-- / beach.js Library -... . -. / .- .-.. - .... .- ..- ... . .-.//
//
//           First Version : Developed by Ben Althauser in October, 2015
//            Contributors : Ben Althauser
//                 Company : High 5 Software, https://high5software.com
//                 Contact : bena@h5sw.com
//                 License : MIT License
//
//########################################################################################//

//### define the arrays and object for use in element definition and core functionality
const nest = Array();
const model = Array();
let nestObjects = ["element", "defaults", "properties", "actions", "render"];
let nestArrays = ["register", "apply", "errors", "track", "wait", "return"];
nest.virtualElements = ["data"];
nestObjects.forEach(item => nest[item] = Object());
nestArrays.forEach(item => nest[item] = Array());


//### when the document loads, initialize the nests
document.addEventListener("DOMContentLoaded", function(event) {
    nestTagElements = document.querySelectorAll('[data-nest]');
    for (let tagElement of nestTagElements) {
      modelReference = tagElement.getAttribute('data-nest');
      //if the model exists, make the nest
      if (typeof model[modelReference] !== 'undefined') {
        tagElement.nest(model[modelReference]);
      }
    }
});


//### the prototype to call nest on an element - ie: document.body.nest(model)
Element.prototype.nest = function(model, sentParent) {
  if (typeof sentParent == 'undefined') {
      sentParent = this;
  }
  try {
  	model.forEach(function (element, elementCount) {
      let buildElement = nest.return.elementModel(element, sentParent);
      buildElement._model = buildElement;
      nest.apply.defaults(buildElement);
      nest.apply.css(buildElement);
      nest.apply.attributes(buildElement);
      nest.apply.properties(buildElement);
      nest.apply.actions(buildElement);

      //don't include virtual elements like the data layer objects
      //TODO: error occurring here cause by grouping an element using "group" property -- need to get fixed!
      if (!nest.virtualElements.includes(buildElement._element)) {
        try {sentParent.appendChild(buildElement.outer);} catch(err) {
          //console.log(err);
        };
      }

      nest.apply.render(buildElement);

      switch (typeof element.nest) {
        case 'undefined':
          break;

        case 'function':
          buildElement.outer.nest(element.nest(element), buildElement.inner);
          break;

        default:
          buildElement.outer.nest(element.nest, buildElement.inner);
          break;
      }
    });
  }
  catch(err) {
    console.log(err);
    throw 'The nest model is not defined properly (check for typos)'
  }
};


//### utilties for internal use throught the nest.core
nest.utilities = {

  //checks the html properties against css, globals and makes sure it's not an object or element declaration
  propertyCheck : function(nestElement, property) {
    let elementType = nestElement.element;
    checkResult = false;

    //check the actions
    if (typeof nest.actions[elementType] !== 'undefined') {
      if (typeof nest.actions[elementType][property] !== 'undefined') {
        checkResult = true;
      }
    }

    //yes yes, ors...
    let disallowed = Array("nest", "render", "element");
    if
    (
      typeof nest.properties.global[property] !== 'undefined'
      ||
        (property in document.body.style)
        &&
        property !== 'src'
        &&
        elementType !== 'img'
      ||
      typeof nestElement[property] == 'object'
      ||
      disallowed.includes(property)
    ) {
      checkResult = true;
    }

    return checkResult;
  }
};



//### returns a nest or basic dom "element model" back to the nest prototype
nest.return = {

  //returns a complex model object of the nest element with dom information
  elementModel : function(nestElement, target) {
    let elementTag = nestElement.element;
    if (typeof nest.element[elementTag] !== 'undefined') {
      elementModel = nest.element[elementTag](nestElement, target);
      elementModel.outer.setAttribute('data-element-type', 'nest');
    } else {
      elementModel = new Object();
      let DOMElement = document.createElement(elementTag);
      elementModel.outer = DOMElement;
      elementModel.inner = DOMElement;
    }
    elementModel._nest = nestElement;
    elementModel._target = target;
    elementModel._element = elementTag;
    return elementModel;
  },

  ///method for declaring a template based on a var
  template: function(nestObject) {
    let modelOut = [];
    nestObject.forEach(function(modelObject, nestCount) {
      let target = {};
      for (let prop in modelObject) {
        if (modelObject.hasOwnProperty(prop)) target[prop] = modelObject[prop];
      }
      modelOut.push(target);
    })
    return modelOut;
  }

};

//### for applying default/css/html attributes/custom nest properties/render on to the dom element
nest.apply = {

  //apply the defaults to the element if core properties missing
  defaults : function(elementModel) {
    let elementType = elementModel._element;
    let nestElement = elementModel._nest;
    if (typeof nest.defaults[elementType] !== 'undefined') {
      Object.keys(nest.defaults[elementType]).forEach(function(defaultProperty) {
        if (typeof nestElement[defaultProperty] == 'undefined') {
          nestElement[defaultProperty] = nest.defaults[elementType][defaultProperty];
        }
      });
    }
  },


  //applies css styling to the element
  css : function(elementModel) {
    DOMElement = elementModel.outer;

    //if it's a group element, target inner section
    CSSTarget = DOMElement;
    if (DOMElement.tagName == "X-NEST-GROUP") {
      CSSTarget = elementModel.inner;
    }

    nestElement = elementModel._nest;
    Object.keys(nestElement).forEach(function(cssProperty, cssPropertyCount) {
      if (cssProperty in document.body.style) {
        CSSTarget.style[cssProperty] = nestElement[cssProperty];
        if (typeof nestElement[cssProperty] == 'function') {
          CSSTarget.style[cssProperty] = nestElement[cssProperty]();
        }
      }
    })
    return DOMElement;
  },

  //applies html attributes
  attributes : function(elementModel) {
    let DOMElement = elementModel.outer;

    //if it's a group element, target inner section
    AttributeTarget = DOMElement;
    if (DOMElement.tagName == "X-NEST-GROUP") {
      AttributeTarget = elementModel.inner;
    }

    let nestElement = elementModel._nest;
    Object.keys(nestElement).forEach(function(elementAttribute, elementAttributeCount) {
      if (nest.utilities.propertyCheck(nestElement, elementAttribute) == false) {
        switch (typeof nest.properties[nestElement.element]) {
          case 'undefined':
              AttributeTarget.setAttribute(elementAttribute, nestElement[elementAttribute]);
              if (nestElement[elementAttribute] == 'function') {
                  AttributeTarget.setAttribute(elementAttribute, nestElement[elementAttribute](elementModel));
              }
            break;

          default:
            if (!Object.keys(nest.properties[nestElement.element]).includes(elementAttribute)) {
              AttributeTarget.setAttribute(elementAttribute, nestElement[elementAttribute]);
              if (nestElement[elementAttribute] == 'function') {
                  AttributeTarget.setAttribute(elementAttribute, nestElement[elementAttribute](elementModel));
              }
            }
            break;
        }
      }
    })
    return DOMElement;
  },

  //applies the properties from both global and element definitions
  properties : function(elementModel) {
      let nestElementTag = elementModel._element;
      let nestElement = elementModel._nest;
      Object.keys(nestElement).forEach(function(property, propertyCount) {
        if (typeof nest.properties[nestElementTag] !== 'undefined') {
          if (typeof nest.properties[nestElementTag][property] !== 'undefined') {
            nestProperty = nestElement[property];
            if (typeof nestElement[property] == 'function') {
              nestProperty = nestElement[property](elementModel);
            }
            nest.properties[nestElementTag][property](elementModel, nestProperty);
          }
        }
        if (typeof nest.properties.global[property] !== 'undefined') {
          nestProperty = nestElement[property];
          if (typeof nestElement[property] == 'function') {
            nestProperty = nestElement[property](elementModel);
          }
          nest.properties.global[property](elementModel, nestProperty);
        }
      })
      return DOMElement;
  },

  //extends the actions to include custom nest model additions
  actions: function(elementModel) {
    let elementType = elementModel._element;
    let nestElement = elementModel._nest;
    if (typeof nest.actions[elementType] !== 'undefined') {
      Object.keys(nest.actions[elementType]).forEach(function(actionType) {
        if (typeof nestElement[actionType] !== 'undefined') {
          let original_function = nest.actions[elementType][actionType];
          nest.actions[elementType][actionType] = function(element) {
            actionTriggered = false;
            let result = original_function.apply(this, arguments);
            if (typeof element._nest[actionType] !== 'undefined') {
              actionTriggered == false && element._nest[actionType](element);
              actionTriggered = true;
            }
            return result;
          }
        }
      })
    }
  },

  //apply things after the element has rendered
  render: function(elementModel) {
    var elementType = elementModel._element;
    typeof nest.render[elementType] !== 'undefined' && nest.render[elementType](elementModel);
    typeof nestElement.render !== 'undefined' && nestElement.render(elementModel);
  }
};

//## for creating logical linking elements such as groups
nest.create = {
  //for registering group elements - like tabs
  group: function(nestElement, target) {
      var elementType = nestElement.element;
      if (typeof nestElement.group == 'function') nestElement.group = nestElement.group(element);
      existingGroupLength = document.querySelectorAll('[data-nest-group-id="' + nestElement.group + '"]').length;
      if (typeof nestElement.group == 'undefined') existingGroupLength = target.getElementsByTagName('x-nest-group').length;
      outer = document.createElement('x-nest-group');
      if (existingGroupLength > 0) {
        if (nestElement.group !== true) {
          outer = document.querySelectorAll('[data-nest-group-id="' + nestElement.group + '"]')[0];
          if (typeof nestElement.group == 'undefined') outer = target.getElementsByTagName('x-nest-group')[0];
        }
      }
      if (typeof nestElement.group !== 'undefined' && existingGroupLength == 0 && nestElement.group !== true) {
        outer.setAttribute('data-nest-group-id', nestElement.group);
      }
      return outer;
  }
};

//### for registering the element components when creating an element
nest.register = {
  //registers the "inner" part of element, where you append to
  inner : function(element, DOMElement) {
    element.inner = DOMElement;
  },
  //registers the outer part of the element or "wrapper"
  outer : function(element, DOMElement) {
    element.outer = DOMElement;
  },
  //for registering other components for use in actions, etc..
  components : function(element, componentList) {
    Object.keys(componentList).forEach(function(componentName) {
      element[componentName] = componentList[componentName];
    })
  }
};
