	function loadDemo(){ // loader for the demo
 	 
 		    var vendor = (Browser.Engine.gecko) ? 'Moz' : ((Browser.Engine.webkit) ? 'Webkit' : ''); // Firefox or webkit
			
			var userString = navigator.userAgent;
			var mozzer = 0;
			
			
			
			if(vendor == "Moz"){
				mozzer = userString.split("Firefox/")[1].toInt();
			 
				// extends mootools styles for Firefox < 4
				if(mozzer >= 4){
					var newStyles = new Hash({
						'borderRadius': '@px @px @px @px',
						'boxShadow': '@px @px @px rgb(@, @, @)'
					});
				}
				else{
					var newStyles = new Hash({
						'MozBorderRadius': '@px @px @px @px',
						'MozBoxShadow': '@px @px @px rgb(@, @, @)'
					});
				}
			}
			
			if(vendor == "Webkit"){ // extends mootools styles for Chrome and Safari
				var newStyles = new Hash({
					'webkitBorderBottomLeftRadius': '@px @px',
					'webkitBorderBottomRightRadius': '@px @px',
					'webkitBorderTopLeftRadius': '@px @px',
					'webkitBorderTopRightRadius': '@px @px',
					'webkitBoxShadow': 'rgb(@, @, @) @px @px @px'
				});
			}
			
		 
			
			if(vendor == "Webkit" || vendor == "Moz"){ // set up an animation for each. Very messy
 				$extend(Element.Styles, newStyles);
			
				$("h31").set('morph', {duration: 300, transition: 'Sine:out', onComplete: function(){
				}});
	
				$("h32").set('morph', {duration: 300, transition: 'Sine:out', onComplete: function(){
				}});
				
				$("h33").set('morph', {duration: 300, transition: 'Bounce:out', onComplete: function(){
				}});
				
				$("h34").set('morph', {duration: 1000, transition: 'Back:out', onComplete: function(){
				}});
				
				$("h35").getElement("span").set('morph', {duration: 300, transition: 'Bounce:out', onComplete: function(){
				}});
				
				$("h36").set('morph', {duration: 300, transition: 'Sine:out', onComplete: function(){
				}});
				
 			}
 			
 			
 			
 			if(vendor == "Moz"){ // errr hideous code, but it was late. (I'm so ashamed)
 			 	if(mozzer >= 4){
 			 				
 			 					$("h31").setStyle("borderRadius", "30px 30px 8px 8px");
							 
								$("h31").addEvents({
									'mouseover': function(){
										 $("h31").morph({'borderRadius': '8px 8px 30px 30px'}); 
										 
									},
									'mouseout': function(){
										$("h31").morph({'borderRadius': '30px 30px 8px 8px'});
									 
									}
								});
								
							
								
								
								$("h32").setStyle("boxShadow", "5px 5px 0px #1e3541");
							 
								$("h32").addEvents({
									'mouseover': function(){
									 $("h32").morph({'boxShadow': "0px 0px 0px #1e3541", 'background-color' : '#67a4c3', 'color': '#fff'});
									},
									'mouseout': function(){
										
											 $("h32").morph({'boxShadow': "5px 5px 0px #1e3541", 'background-color' : '#4780a4', 'color': '#fff'});
										 
									}
								});
								
								$("h33").setStyle("borderRadius", "30px 30px 8px 8px");
								$("h33").addEvents({
									'mouseover': function(){
										 $("h33").morph({'borderRadius': '8px 8px 30px 30px'}); 
									 
									},
									'mouseout': function(){
										$("h33").morph({'borderRadius': '30px 30px 8px 8px'});
									 
									}
								});
								
								
									
								$("h34").setStyle("boxShadow", "0px 0px 0px #43280D");
							 
								$("h34").addEvents({
									'mouseover': function(){
										$("h34").morph({'boxShadow': "-6px 8px 0px #43280D", 'left': '106', 'top': '22', 'background-color': '#ff7e00'});
									},
									'mouseout': function(){
										$("h34").morph({'boxShadow': "0px 0px 0px #43280D", 'left': '100', 'top': '30','background-color': '#e36b00'});
									}
								});
								
							
								$("h35").addEvents({
									'mouseover': function(){
										$("h35").getElement("span").morph({'borderRadius': "20px 20px 20px 20px;",  'width': '40px', 'background-color': '#ff0090'});
									},
									'mouseout': function(){
									   
										$("h35").getElement("span").morph({'borderRadius': "8px 8px 8px 8px;", 'width': '245px', 'background-color': '#e1007a'});
									}
								});
								
								$("h36").setStyle("borderRadius", "25px 25px 100px 100px");
								$("h36").addEvents({
									'mouseover': function(){
										$("h36").morph({'borderRadius': "100px 100px 25px 25px"});
									},
									'mouseout': function(){
									   
										$("h36").morph({'borderRadius': "25px 25px 100px 100px"});
									}
								});
 			 				
 			 				
 			 				
 			 				
 			 				
 			 	}
 			 	else{
								$("h31").setStyle("MozBorderRadius", "30px 30px 8px 8px");
							 
								$("h31").addEvents({
									'mouseover': function(){
										 $("h31").morph({'MozBorderRadius': '8px 8px 30px 30px'}); 
										 
									},
									'mouseout': function(){
										$("h31").morph({'MozBorderRadius': '30px 30px 8px 8px'});
									 
									}
								});
								
							
								
								
								$("h32").setStyle("MozBoxShadow", "5px 5px 0px #1e3541");
							 
								$("h32").addEvents({
									'mouseover': function(){
									 $("h32").morph({'MozBoxShadow': "0px 0px 0px #1e3541", 'background-color' : '#67a4c3', 'color': '#fff'});
									},
									'mouseout': function(){
										
											 $("h32").morph({'MozBoxShadow': "5px 5px 0px #1e3541", 'background-color' : '#4780a4', 'color': '#fff'});
										 
									}
								});
								
								$("h33").setStyle("MozBorderRadius", "30px 30px 8px 8px");
								$("h33").addEvents({
									'mouseover': function(){
										 $("h33").morph({'MozBorderRadius': '8px 8px 30px 30px'}); 
									 
									},
									'mouseout': function(){
										$("h33").morph({'MozBorderRadius': '30px 30px 8px 8px'});
									 
									}
								});
								
								
									
								$("h34").setStyle("MozBoxShadow", "0px 0px 0px #43280D");
							 
								$("h34").addEvents({
									'mouseover': function(){
										$("h34").morph({'MozBoxShadow': "-6px 8px 0px #43280D", 'left': '106', 'top': '22', 'background-color': '#ff7e00'});
									},
									'mouseout': function(){
										$("h34").morph({'MozBoxShadow': "0px 0px 0px #43280D", 'left': '100', 'top': '30','background-color': '#e36b00'});
									}
								});
								
							
								$("h35").addEvents({
									'mouseover': function(){
										$("h35").getElement("span").morph({'MozBorderRadius': "20px 20px 20px 20px;",  'width': '40px', 'background-color': '#ff0090'});
									},
									'mouseout': function(){
									   
										$("h35").getElement("span").morph({'MozBorderRadius': "8px 8px 8px 8px;", 'width': '245px', 'background-color': '#e1007a'});
									}
								});
								
								$("h36").setStyle("MozBorderRadius", "25px 25px 100px 100px");
								$("h36").addEvents({
									'mouseover': function(){
										$("h36").morph({'MozBorderRadius': "100px 100px 25px 25px"});
									},
									'mouseout': function(){
									   
										$("h36").morph({'MozBorderRadius': "25px 25px 100px 100px"});
									}
								});
							
					}
			}
			
			if(vendor == "Webkit"){
				
 		 
 			$("h31").setStyles({
 				'webkitBorderTopLeftRadius': "30px 30px",
 				'webkitBorderTopRightRadius': "30px 30px",
 				'webkitBorderBottomLeftRadius': "8px 8px",
 				'webkitBorderBottomRightRadius': "8px 8px"
 			});
 			
 	 
			$("h31").addEvents({
				'mouseover': function(){
				 	$("h31").morph({
				 		'webkitBorderBottomLeftRadius': '30px 30px', 
				 		'webkitBorderBottomRightRadius': '30px 30px',
				 		'webkitBorderTopLeftRadius': "8px 8px",
 						'webkitBorderTopRightRadius': "8px 8px"
				 	});
				},
				'mouseout': function(){
				 	
				 	 $("h31").morph({
				 	 	'webkitBorderBottomLeftRadius': '8px 8px',
				 	 	'webkitBorderBottomRightRadius': '8px 8px',
				 	 	'webkitBorderTopLeftRadius': "30px 30px",
 						'webkitBorderTopRightRadius': "30px 30px"
				 	 }); 
				}
			});
			
		
			
			
			$("h32").setStyle("webkitBoxShadow", "#1e3541 5px 5px 0px");
		 
			$("h32").addEvents({
				'mouseover': function(){
				 $("h32").morph({'webkitBoxShadow': "#1e3541 0px 0px 0px", 'background-color' : '#67a4c3', 'color': '#fff'});
				},
				'mouseout': function(){
				  	
				  	  	 $("h32").morph({'webkitBoxShadow': "#1e3541 5px 5px 0px", 'background-color' : '#4780a4', 'color': '#fff'});
					 
				}
			});
			
			
				
			$("h33").setStyles({
 				'webkitBorderTopLeftRadius': "30px 30px",
 				'webkitBorderTopRightRadius': "30px 30px",
 				'webkitBorderBottomLeftRadius': "8px 8px",
 				'webkitBorderBottomRightRadius': "8px 8px"
 			});
 			
			
			
			 
			$("h33").addEvents({
				'mouseover': function(){
					$("h33").morph({
				 		'webkitBorderBottomLeftRadius': '30px 30px', 
				 		'webkitBorderBottomRightRadius': '30px 30px',
				 		'webkitBorderTopLeftRadius': "8px 8px",
 						'webkitBorderTopRightRadius': "8px 8px"
				 	});
				 	
				 
				},
				'mouseout': function(){
				  $("h33").morph({
				 	 	'webkitBorderBottomLeftRadius': '8px 8px',
				 	 	'webkitBorderBottomRightRadius': '8px 8px',
				 	 	'webkitBorderTopLeftRadius': "30px 30px",
 						'webkitBorderTopRightRadius': "30px 30px"
				 	 }); 
				 
				}
			});
			
			
			$("h34").setStyle("webkitBoxShadow", "#43280D 0px 0px 0px");
		 
			$("h34").addEvents({
				'mouseover': function(){
				 	$("h34").morph({'webkitBoxShadow': "#43280D -6px 8px 0px", 'left': '106', 'top': '22', 'background-color': '#ff7e00'});
				},
				'mouseout': function(){
				  	$("h34").morph({'webkitBoxShadow': "#43280D 0px 0px 0px", 'left': '100', 'top': '30','background-color': '#e36b00'});
				}
			});
			
			$("h35").getElement("span").setStyles({
 				'webkitBorderTopLeftRadius': "8px 8px",
 				'webkitBorderTopRightRadius': "8px 8px",
 				'webkitBorderBottomLeftRadius': "8px 8px",
 				'webkitBorderBottomRightRadius': "8px 8px"
 			});
			
			
			$("h35").addEvents({
				'mouseover': function(){
				 	$("h35").getElement("span").morph({
				 		'webkitBorderBottomLeftRadius': '20px 20px',
				 	 	'webkitBorderBottomRightRadius': '20px 20px',
				 	 	'webkitBorderTopLeftRadius': "20px 20px",
 						'webkitBorderTopRightRadius': "20px 20px",
				 		'width': '40px', 
				 		'background-color': '#ff0090'
				 	});
				},
				'mouseout': function(){
				   
				  	$("h35").getElement("span").morph({
				  		'webkitBorderBottomLeftRadius': '8px 8px',
				 	 	'webkitBorderBottomRightRadius': '8px 8px',
				 	 	'webkitBorderTopLeftRadius': "8px 8px",
 						'webkitBorderTopRightRadius': "8px 8px",
				  		'width': '245px', 
				  		'background-color': '#e1007a'
				  	});
				}
			});
			
			
			 
			
			$("h36").setStyles({
 				'webkitBorderTopLeftRadius': "25px 25px",
 				'webkitBorderTopRightRadius': "25px 25px",
 				'webkitBorderBottomLeftRadius': "100px 100px",
 				'webkitBorderBottomRightRadius': "100px 100px"
 			});
			
			
			$("h36").addEvents({
				'mouseover': function(){
				 	$("h36").morph({
				 		'webkitBorderTopLeftRadius': "100px 100px",
 						'webkitBorderTopRightRadius': "100px 100px",
 						'webkitBorderBottomLeftRadius': "25px 25px",
 						'webkitBorderBottomRightRadius': "25px 25px"
				 	});
				},
				'mouseout': function(){
				   
				  	$("h36").morph({
				  		'webkitBorderTopLeftRadius': "25px 25px",
 						'webkitBorderTopRightRadius': "25px 25px",
 						'webkitBorderBottomLeftRadius': "100px 100px",
 						'webkitBorderBottomRightRadius': "100px 100px"
				  	});
				}
			});
			
			
			
			}
		
		}
		
		
		
		
		
		
		
		
		
