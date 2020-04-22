$(document).ready(function() {
    //########################
    //## ISOTOPE #############
    //########################
    var $grid;
    console.log("Loading myIsotope.js file");
    doIsotopeLines = function(){
        $grid = $('#vizLines').isotope({
            itemSelector: '.chart',
            layoutMode: 'fitRows',
            getSortData: {
                count: function(e) {
                    var d, sum;
                    d = d3.select(e).datum();
                    let totals = [];
                    d.values.map(function(e) {
                        e.values.map(function(f) {
                            if(e.visible){
                                e.values.map(function(f){
                                    totals.push(f.mean); 
                                });
                            }
                        }); 
                    });
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
            isControl: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Control/ );
            },
            isLb: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Lb40788/ );
            },
            isLh: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Lh4785/ );
            },
            isLbLh: function() {
                var name = $(this).find('.title').text();
                return name.match( /.*Lb_Lh/ );
            }
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
