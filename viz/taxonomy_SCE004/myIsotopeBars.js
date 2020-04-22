$(document).ready(function() {
    //########################
    //## ISOTOPE #############
    //########################
    var $grid;
    console.log("Loading myIsotope.js file");
    doIsotopeBars = function(){
        $grid = $('#vizBars').isotope({
            itemSelector: '.chart',
            layoutMode: 'fitRows',
            getSortData: {
                count: function(e) {
                    var d, sum;
                    d = d3.select(e).datum();
                    var totals = d.values.map(function (el) { return el.total });
                    return d3.sum(totals); 
                },
                name: function(e) {
                    var d;
                    d = d3.select(e).datum();
                    return d.key;
                }
            }   
        });
      
        // bind sort button click
        $('#sorts').on( 'click', 'button', function() {
            var sortByValue = $(this).attr('data-sort-by');
            $grid.isotope({ sortBy: sortByValue });
        });

     
        //Checkboxes:
        // filter with selects and checkboxes
        var $checkboxes = $('#filters input');

        $checkboxes.change( function() {
            // map input values to an array
            var inclusives = [];
            // inclusive filters from checkboxes
            $checkboxes.each( function( i, elem ) {
                // if checkbox, use value if checked
                console.log(elem);
                if ( elem.checked ) {
                    inclusives.push( elem.value );
                }
            });

            // combine inclusive filters
            var filterValue = inclusives.length ? inclusives.join(', ') : '*';
            console.log("filterValue: ");console.log(filterValue);
            $grid.isotope({ filter: filterValue })
        }); 
    }
});
