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
            isFresh: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Fresh*/ );
            },
            isDay1: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.1$/ );
            },
            isDay2: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.2/ );
            },
            isDay4: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.4/ );
            },
            isDay8: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.8/ );
            },
            isDay16: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.16/ );
            },
            isDay32: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.32/ );
            },
            isDay64: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Day.64/ );
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
