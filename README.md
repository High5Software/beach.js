# beach.js
beach is a json based html component library

Beach.js Documentation

Using the library


Create a Basic Model

To create a basic beach.js model to use in a project, start by creating a file named “my-model.js” in the “models” directory. Open the newly created file, add the following content, and save the file : 

	model.MyModel = [ 
	  { 
		       element : “collapsible”,
		       title : “My Collapsible”,
		        nest : [
			{
			  element : “span”,
			  text : “This is some text.”
			   }
		        ]
	    }
	];

You have now made your first model. The next step is to add your model to a webpage.


Adding to a Webpage

To add the beach.js library to one of your web projects, add the resources to your <head> element as is shown below : 

	<script type="text/javascript" src="js/beach.core.js"></script>
  	<script type="text/javascript" src="js/beach.elements.js"></script>
	<script type="text/javascript" src="models/my-model.js"></script>

Now that you have added the library to your web page, the next step is to instantiate the model to make it work.




Instantiate the Model

The model can be instantiated to a DOM element in one of two ways.  You can add a reference to the model name using a data tag 

<div data-nest="text/javascript" ></div>

or you can programmatically trigger the event using javascript  

  document.getElementById('my-container').nest(model.MyModel)

Using Elements

	Defaults

defaults in beach.js are used for assuming properties or values when not filled out by the user.  Here is an example default model : 

nest.defaults.collapsible = {
  title : "untitled collapsible"
}

In this example the default title of a collapsible element is set to “untitled collapsible” if there is no title set by the user. CSS, HTML attributes, properties, actions, and render actions can all be set as default values for an element.


	Css & Styling

CSS or a style attribute can be assigned directly to an element such as below :

			nest : [
			   {
			      element : “span”,
			      text : “This is some text.”
			      float : “left”,
			      background : “#000”,
			      color : “white”,
			    }
			]

When applying styling to a custom element, the styling will be applied to the outermost HTML element. Applying a “style” attribute overrides the use of individual css properties.


html attributes

Standard HTML attributes, including data- attributes can be applied to an element directly, such as is shown below: 

			nest : [
			 {
				    element : “span”,
				   'data-role' : 'itsASpan',
				   text : 'this is a span.',
				   title : 'span'
			  }
			]

When applying HTML attributes to a custom element, the styling will be applied to the outermost HTML element. 


custom properties

Elements have custom properties that can be applied the same as other HTML properties.  To find the list of available properties for an element, look in the “beach.elements.js” file under “nest.properties.element-name” (where element-name is equal to the element you are looking for the properties for). The default element properties have code comments describing what they are and what they do.


Extending Actions

Actions are primarily used for internal dynamic element changes, such as opening a collapsible, but they can also be extended so that when they are triggers the element performs a specific action unique to that instance. In the example below, the element is logged in the console when the collapsible is opened.

        {
              element : "collapsible",
              title : "collapsible 2",
              active : true,
              iconClass : "fa fa-star",
              close : function(element) {
                console.log(element);
              },
               nest : [
                 {
                   element : "span",
                   text : “some content”
                 }
               ]
            }

Extending Render

Element after render is used to apply properties or changes to an element after it has rendered to the page.  Render options can also be extended to be unique to an element, such as in the example below where an alert happens on the element render.

            {
              element : "collapsible",
              title : "collapsible 2",
              render : function(element) {
		alert('collapsible 2 rendered.');
 	    },
              active : true,
              iconClass : "fa fa-star",
              close : function(element) {
                console.log(element);
              },
               nest : [
                 {
                   element : "span",
                   text : “some content”
                 }
               ]
            }

grouping

Grouped elements are contained within a x-nest-group element.  Grouping is both used internally (such as tabs), but can also be applied to any element in the model regardless of where the element is located. To group an element, add a “group” : “group-name” property and add the property to any elements you want grouped together. In the example below, the div element proceeding the collapsible will end up being inside of the collapsible because a group is defined.

            {
              element : "collapsible",
              title : "collapsible 2",
              render : function(element) {
		alert('collapsible 2 rendered.');
 	    },
              active : true,
              iconClass : "fa fa-star",
              close : function(element) {
                console.log(element);
              },
               nest : [
                 {
                   element : "span",
                   text : “some content”
	         group : “group-1”
                 }
               ]
            },
	{
	  element : “div”,
	  text : “This will end up in the collapsible.”,
	  group : “group-1”
	}

Templates

Templates in the model are accomplished by making a deep clone of the element and applying user specified properties. You can try this by creating the following element : 

model.collapsibleContent = [
    {
     element : "collapsible",
     width : "100%",
     float : "left",
     title : "This test gets replaced by a template.",
     nest : model.bubbleItem
   }
];

Once you have done that, you can specify the template in a nest model as a function as follows : 


         nest: function(element) {
           var template = nest.return.template(model.collapsibleContent);
           template[0]['title'] = "this is a clone";
           return template;
         }

When the element renders, you'll have the collapsible, but with a custom title that was set.

Creating Elements

Creating an Element

Creating a custom element has 1 required component and 4 optional components.  The definition of the element is required for the element to be created from the model, Properties, Defaults, Actions, and Render events are optional. Open “beach.elements.js”, and add the following code :

nest.element.fancyButton = function() {
    buttonOuter = document.createElement('x-nest-fancy-button');
    buttonTitle = document.createElement('x-nest-fancy-button-title');
    buttonIcon = document.createElement('x-nest-fancy-button-icon');
    buttonOuter.appendChild(buttonIcon);
    buttonOuter.appendChild(buttonTitle);
  //registering components will go here
	
}

 First, we are defining the element in the library by making “fancyButton” an object within “nest.element”.  “function()” in this example isn't accepting any parameters, but is able to accept “function(nestElement, target)”, where “nestElement” is the model element syntax and “target” is the element that the result will be appended to. Primarily this is used when making a Group and will be explained more below, but for now we can ignore it.  Once you have saved “beach.elements.js”, let's proceed to the next step.
 

Registering Components

Now that we've created the basic outline for an element, we have to register the components of the element so the system can interact with it. Add the following code within the nest.element.fancyButton function right after the “//registering components will go here” comment.

  let element = Object();
  nest.register.outer(element, buttonOuter);
  nest.register.inner(element, buttonOuter);
  let components = { "title" : buttonTitle, "icon" : buttonIcon };
  nest.register.components(element, components);
  return element;

Your final fancyButton definition should look like this 

nest.element.fancyButton = function() {
  buttonOuter = document.createElement('x-nest-fancy-button');
  buttonTitle = document.createElement('x-nest-fancy-button-title');
  buttonIcon = document.createElement('x-nest-fancy-button-icon');
  buttonOuter.appendChild(buttonIcon);
  buttonOuter.appendChild(buttonTitle);

 //registering components will go here
  let element = Object();
  nest.register.outer(element, buttonOuter);
  nest.register.inner(element, buttonOuter);
  let components = { "title" : buttonTitle, "icon" : buttonIcon };
  nest.register.components(element, components);
  return element;
}


You've now created a definition for a nest element, let's make it have some properties next.


Creating Properties for an Element

Creating properties for a custom element is done by declaring the properties as an object instead of a function.  For the “fancyButton” element, we want to create some properties that allow us to set the title, icon, and icon position of the button.  Add the following code in to the “beach.elements.js” file.

nest.properties.fancyButton = {

  //sets the display title of the button as well as a title tag
  title : function(element, property) {
    var titleTextContainer = document.createTextNode(property);
    element.title.appendChild(titleTextContainer);
    element.outer.setAttribute('title', property);
  },

  //here you can set a tab icon using an icon library, ie:"fa fa-home"
  iconClass: function(element, property) {
    element.icon.className = property;
  },

  //you can set the icon position to be before or after the text 
  iconPosition: function(element, property) {
    switch (property) {
      default:
        element.icon.style.float = property;
        element.title.style['padding-' + property] = '8px';
        break;
    }
  }
}

So what's going on here? Let's take a look at the “iconClass” property for an explanation. We can see that “iconClass” takes in two variables : “element”, and “property”, “element” represents the entire element and components that we registered in the previous step, and “property” is the value that is passed via the model, so when “element.icon.className” is assigned a property, it means in the model you could pass a name value pair to define the class of the icon element (for example “fa fa-star”).  This is how all of the properties work, by dealing with the components of the element and the values passed when defining the model.


Creating Defaults for an Element

Defaults for an element are used to apply a default value to the element if none is defined by the user. For this example, let's create a default title for the button if one isn't defined in the model. Add the following code into the “beach.elements.js” file :

nest.defaults.fancyButton = {
  title : 'Untitled Button'
}

What this does upon the processing of the model is set the title of the “fancyButton” element to “Untitled Button”.  This is a useful feature for when things need to be customized but you'd also like default behavior or visualization in your interfaces.

Creating Actions for an Element

Actions for an element are defined for when the user interacts with an element, for example with a “fancyButton”, it might be if the user interacts with the button. Instead, let's create an action called “activate”, and add it to the “fancyButton”. Add the following code to the “beach.elements.js” file :

nest.actions.fancyButton = {
    activate : function(element) {
        element.title.textContent = 'Processing ...';
        element.icon.className = 'fa fa-cog rotate';
    }
}

We're not done here, as we have to add the action to the button element and create a class called “rotate” to apply to the button.  Add the following lines of code to your “nest.element.fancyButton” after the line “buttonOuter.appendChild(buttonTitle)” :

  buttonOuter.addEventListener('click', function() {
    nest.actions.fancyButton.activate(element);
  }, false);

Now we've attached an action that we defined to the click listener of the button's outer container. Actions can also be extended per instance of the element in the model.  You could attach an extra “activate” function to an element in the model that would on be triggered for that instance. Let's create the css for the button.  Add the following to the head of the index file.  

<style type="text/css">
  x-nest-fancy-button {
    border-radius:8px;
    float:left;
    padding:15px;
    box-sizing:border-box;
    -webkit-box-shadow: 0px 2px 2px 0px #ddd;
    -moz-box-shadow: 0px 2px 2px 0px #ddd;
    box-shadow: 0px 2px 2px 0px #ddd;
    background-image:linear-gradient(white, #f4f4f4);
    cursor:pointer;
  }

  x-nest-fancy-button-icon {
    color : #00cafc;
    position:relative;
    top:2px;
  }


  @keyframes spin {
      from {
          transform:rotate(0deg);
      }
      to {
          transform:rotate(360deg);
      }
  }

  .rotate {
    animation-name: spin;
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  </style> 

This gives us some css for the button to display properly. Let's try out the new element. Open your “my-model.js” add the following element : 
* If you are unclear how to add an element, refer to the beginning of this guide

        {
          element : "fancyButton",
          title : "Fancy Button",
          iconClass : "fa  fa-star",
          iconPosition : "right",
	activate : function(element) {
		console.log(element);
	}
        }

Now save your model changes and load the webpage.  You should see the button rendered.  If you click on it, it should change to “Processing ...” with a spinning gear, which means that our actions fired correctly. Additionally, we've added a console.log extended action to the activate action specific to this instance.










Creating Render Events for an Element

Render events for an element are the events that you'd like to happen after the element has rendered on the page or DOM. Let's create a simple render event for the button that returns us the element in the console. Add the following code to the “beach.elements.js” file : 

nest.render.fancyButton = function(element) {
  console.log(element);
}

now reload the page, and inspect the console.  You should see the element for the fancyButton along  with its sub components. This is the basis of render events.  They can be programmed to do anything you like with the element to happen after it has rendered.

Grouping an Element

Grouped elements are elements that group together when they are on the same json depth, or if the group is specified.  Any element can be grouped if the “group” property is specified.  If you want to make the default behavior of the element to be grouped, this can be done when you create the element.  Edit your “nest.element.fancyButton” definition to be the following code :

nest.element.fancyButton = function(nestElement, target) {
  buttonOuter = nest.create.group(nestElement, target);
  buttonInner = document.createElement('x-nest-fancy-button');
  buttonTitle = document.createElement('x-nest-fancy-button-title');
  buttonIcon = document.createElement('x-nest-fancy-button-icon');
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

You'll notice a few things here – first, we are passing “nestElement”, and “target” to the function, which will allow us to group it, and secondly, we are changing “buttonOuter” to be a returned element from the method “nest.create.group”.  We also changed the event trigger to take place on the inner element instead of the wrapper container. What this does is define the outer container of the button as a group, and any buttons that are assigned to the same group name in the model or on the same json level end up a part of the group. If you'd like to try this, try adding another “fancyButton” element to the model on the same json level or with the same group name.

