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

        // change is-checked class on buttons
        $('.btn-group').each( function( i, buttonGroup ) {
            var $buttonGroup = $( buttonGroup );
            $buttonGroup.on( 'click', 'button', function() {
                $buttonGroup.find('.active').removeClass('active');
                $( this ).addClass('active');
            });
        });
       
        //Filter functions 
        filterFns = {
            isVisit2: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*v2/ );
            },
            isVisit3: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*v3/ );
            },
            isVisit4: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*v4/ );
            },
            isVisit5: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*v5/ );
            },
        };

        // bind filter button click
        $('#filters').on( 'click', 'button', function() {
            var filterValue = $( this ).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[ filterValue ] || filterValue;
            $grid.isotope({ filter: filterValue });
        });
    }

});
