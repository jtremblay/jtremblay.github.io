$(document).ready(function() {
console.log("Loading myPackeryLines.js file");

var $gridp;
//PACKERY
    doPackeryLines = function(){
        $gridp = $('#vizLines').packery({
          itemSelector: '.chart',
          columnWidth: 10
        });

        // make all grid-items draggable
        $gridp.find('.chart').each( function( i, gridItem ) {
          var draggie = new Draggabilly( gridItem );
          // bind drag events to Packery
          $gridp.packery( 'bindDraggabillyEvents', draggie );
        });
    }
});
