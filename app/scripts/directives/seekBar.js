(function() {
  function seekBar($document) {
    /**
    @function calculatePercent
    @desc Calculates the horizontal percent along the seek bar where event occurs
    @param {object} seekBar , {event}
    */
    var calculatePercent = function(seekBar, event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var seekBarWidth = seekBar.width();
      var offsetXPercent = offsetX / seekBarWidth;
      offsetXPercent = Math.max(0, offsetXPercent);
      offsetXPercent = Math.min(1, offsetXPercent);
      return offsetXPercent;
    };

    return {
      templateUrl: '/templates/directives/seek_bar.html',
      replace: true,
      restrict: 'E',
      scope: {
        onChange: '&'
      },
      link: function(scope, element, attributes) {
        scope.value = 0;
        scope.max = 100;

        /**
        @desc Holds the element that matches the directive (<seek-bar>) as a jQuery object
        @type {object}
        */
        var seekBar = $(element);

        attributes.$observe('value', function(newValue) {
          scope.value = newValue;
        });

        attributes.$observe('max', function(newValue) {
          scope.max = newValue;
        });

        /**
        @function percentString
        @desc returns percent of seek bar filled while song is playing
        @returns {number}
        */
        var percentString = function () {
          var value = scope.value;
          var max = scope.max;
          var percent = value / max * 100;
          return percent + "%";
        };

        /**
        @function fillStyle
        @desc Returns the width of the seek bar fill element based on the calculated percent
        @returns {number}
        */
        scope.fillStyle = function() {
          return {width: percentString()};
        };

        scope.thumbStyle = function() {
          return {left: percentString()};
        };

        /**
        @function onClickSeekBar
        @desc Updates the seek bar value based on the seek bar's width and the location of the user's click on the seek bar.
        @param {event}
        */
        scope.onClickSeekBar = function(event) {
          var percent = calculatePercent(seekBar, event);
          scope.value = percent * scope.max;
          notifyOnChange(scope.value);
        };

        /**
        @function trackThumb
        @desc Constantly applies the change in value of scope.value as user drags the seek bar thumb
        @type {Object}
        */
        scope.trackThumb = function() {
          $document.bind('mousemove.thumb', function(event) {
            var percent = calculatePercent(seekBar, event);
            scope.$apply(function() {
              scope.value = percent * scope.max;
              notifyOnChange(scope.value);
            });
          });

          $document.bind('mouseup.thumb', function() {
            $document.unbind('mousemove.thumb');
            $document.unbind('mouseup.thumb');
          });
        };

        var notifyOnChange = function(newValue) {
            if (typeof scope.onChange === 'function') {
                scope.onChange({value: newValue});
            }
        };
        
      }
    };
  }

  angular
    .module('blocJams')
    .directive('seekBar', ['$document', seekBar]);
})();
