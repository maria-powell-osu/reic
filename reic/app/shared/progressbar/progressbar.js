App.directive('mpProgressbar', function ($timeout) {
  return {
    scope: {
      stepViews: '=stepViews',
    },
    link: function (scope, element, attrs) {
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {
          $(element).bind("click", function (event) {
            activateStep(scope.stepViews, 'jumpTo', element[0].id, event.target);
          });
        });
      });
    }
  };
});

App.directive('prevStep', function($timeout) {
  return {
    scope: {
      stepViews: '=stepViews',
      validationFunction: '@validationFunction',
      progressbarId: '@progressbarId',
      currentStep: '=currentStep',
    },
    link: function (scope, element, attrs) {
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {
          element.bind("click", function (event) {
            activateStep(scope.stepViews, 'prev', scope.progressbarId);
            scope.currentStep--;
            scope.$apply();
          });
        });
      });
    }
  };
});
App.directive('nextStep', function($timeout) {
  return {
    scope: {
      stepViews: '=stepViews',
      validationFunction: '@validationFunction',
      progressbarId: '@progressbarId',
      currentStep: '=currentStep',
    },
    link: function (scope, element, attrs) {
      //timeout to make sure digest ends before calling scope.apply again
      $timeout(function() {
        //to make sure bindings get applied
        scope.$apply( function () {
          element.bind("click", function (event) {
            //we have multiple li.active so we have to determine the active item differently
            activateStep(scope.stepViews, 'next', scope.progressbarId);
            scope.currentStep++;
            scope.$apply();
            //compile or something needs to get called her for it to show up in UI
          });
        });
      });
    }
  };
});

/*
 * Desc:    Helper Function to activate specific steps for the progress bar
 * Params:  steps:  list of steps the user defined in controller
 *          action: next, prev, jumpTo
 *          ulElementId: id of list element holding progress bar
 *          jumpToElement: optional param to specific which step to jump to    
 */
function activateStep(steps, action, ulElementId, jumpToElement){
  var stepIndexToActivate;

  //get currently selected list item
  var activeStep = $("#" + ulElementId + ' li.selected'); 
  //get index of selected list item, else -1
  var activeStepIndex = $("#" + ulElementId + " li").index(activeStep); 
  //Remove the selected class from this list item
  activeStep.removeClass('selected');

  //Determine which step should get activated
  if(action === "next" && activeStepIndex != -1 && activeStepIndex < steps.length){
    stepIndexToActivate = activeStepIndex + 1;
  } else if (action === "prev" && activeStepIndex != -1 && activeStepIndex != 0){
    stepIndexToActivate = activeStepIndex - 1;
  } else if (action === 'jumpTo' && jumpToElement){
    stepIndexToActivate = $("#" + ulElementId + " li").index(jumpToElement);
  }

  //Iterate through the steps
  if (typeof(stepIndexToActivate) !== 'undefined' && ulElementId){
    
    //Add active classes from the steps 
    //(in the array we will take out all classes after the activated step)
    $("#" + ulElementId +' li').addClass('active');
    
    for (var i = 0; i < steps.length; i++){
      //If this is the step to activate
      if(i === stepIndexToActivate){
        //Show the step'sview
        $('#' + steps[i].view).show();

        //Add the selected class to the step Element
        var stepElement = $("#" + ulElementId + " li").get(stepIndexToActivate);
        $(stepElement).addClass('selected');
      } else {
        //make sure that the other views are hidden
        $('#' + steps[i].view).hide();

        //Remove coloring from steps after the current one
        if(i > stepIndexToActivate){
          var stepElement = $("#" + ulElementId + " li").get(i);
          $(stepElement).removeClass('active');
        }
      }        
    }
  }
}