function loadDemo(){ // loader for the demo

 	var vendor = (Browser.Engine.gecko) ? 'Moz' : ((Browser.Engine.webkit) ? 'Webkit' : ''); // Firefox or webkit
	var userString = navigator.userAgent;
	var mozzer = 0;
	
	if(vendor == "Moz"){
		mozzer = userString.split("Firefox/")[1].toInt();
		
		// extends mootools styles for Firefox < 4
		//if(mozzer >= 4){
		//	var newStyles = new Hash({
		//		'borderRadius': '@px @px @px @px',
		//		'boxShadow': '@px @px @px rgb(@, @, @)'
		//	});
		//}else{
		//	var newStyles = new Hash({
		//		'MozBorderRadius': '@px @px @px @px',
		//		'MozBoxShadow': '@px @px @px rgb(@, @, @)'
		//	});
		//}
	}

	//if(vendor == "Webkit" || vendor == "Moz"){ // set up an animation for each. Very messy
 	//	$extend(Element.Styles, newStyles);
		$("left1").set('morph', {duration: 1000, transition: 'Back:out', onComplete: function(){}});
	//}

	//if(vendor == "Moz"){ // errr hideous code, but it was late. (I'm so ashamed)
	 	if(mozzer >= 4){
			//$("left1").setStyle("boxShadow", "0px 0px 0px #43280D");
			$("left1").addEvents({
				'mouseover': function(){
					//$("left1").morph({'boxShadow': "-6px 8px 0px #43280D", 'left': '106', 'top': '22', 'background-color': '#ff7e00'});
					$("left1").morph({'left': '106', 'top': '22', 'background-color': '#ff7e00'});
				},
				'mouseout': function(){
					//$("left1").morph({'boxShadow': "0px 0px 0px #43280D", 'left': '100', 'top': '30','background-color': '#e36b00'});
					$("left1").morph({'left': '100', 'top': '30','background-color': '#e36b00'});
				}
			})
		}
	//}
}

