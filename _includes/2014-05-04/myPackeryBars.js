$(document).ready(function() {
console.log("Loading myPackery.js file");

var $gridp;
//PACKERY
    doPackeryBars = function(){
        $gridp = $('#vizBars').packery({
          itemSelector: '.chart',
          columnWidth: 100
        });

        // make all grid-items draggable
        $gridp.find('.chart').each( function( i, gridItem ) {
          var draggie = new Draggabilly( gridItem );
          // bind drag events to Packery
          $gridp.packery( 'bindDraggabillyEvents', draggie );
        });
    }
});
