/* 
        // Device supports touch events.
        if ('ontouchstart' in document.documentElement) {
          keyboard_element.addEventListener('touchstart', function (event) {
              mouseDown(event.target, that.keyDown);
          });

          keyboard_element.addEventListener('touchend', function (event) {
              mouseUp(event.target, that.keyUp);
          });

          keyboard_element.addEventListener('touchleave', function (event) {
              mouseOut(event.target, that.keyUp);
          });

          keyboard_element.addEventListener('touchcancel', function (event) {
              mouseOut(event.target, that.keyUp);
          });
      }  */