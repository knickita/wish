var DELAY = 400, clicks = 0, timer = null;
var isDragging = false;
var isPressed = false;
var clickMousePosition=[0,0];



$( document ).ready(function() {
	 
	draw();
	$("#root").css('left', 200);
	$("#root").css('top', 200);
	function draw() {
	  // call again next time we can draw
	  requestAnimationFrame(draw);
	  
	}

	

	$("#workspace")
	.mousedown(function(event) {
	    isDragging = false;
	    isPressed = true;
	    clickMousePosition=[
	    	event.pageX-parseInt($("#root").css('left')),
	    	event.pageY-parseInt($("#root").css('top'))
	    ]
	})
	.mousemove(function(event) {
		isDragging = isPressed;
	    if (isDragging){
	    	$("#root").css('left', event.pageX-clickMousePosition[0]);
	    	$("#root").css('top', event.pageY-clickMousePosition[1]);
	    }
	 })
	.mouseup(function() {
		if (isDragging){
			clearTimeout(timer);    //prevent single-click action
		}
	    isDragging = false;
	    isPressed = false;
	});
	
	$(".node")
	.mouseup(clickmanagement)
	.dblclick(function(event){
		event.preventDefault();  //cancel system double-click event
	});
	
});


function calculatePositions(){
	to be implemented
}



function clickmanagement(event) {
	if (!isDragging){
		clicks++;

		if(clicks === 1) {

            timer = setTimeout(function(object) {

                result = prompt("New Node","new content");
                if (result!="" && result!=null){
                	object.append('<div><p class="node">'+result+'</p></div>');
                	$(".node")
                	.unbind() //to prevent multiple listeners on already created divs
					.mouseup(clickmanagement)
					.dblclick(function(event){
						event.preventDefault();  //cancel system double-click event
					});
                }
                clicks = 0;             //after action performed, reset counter
            }, DELAY,$(this).parent());

        } else {

            clearTimeout(timer);    //prevent single-click action
            object=$(this);
            text=object.text().trim();
			object.text(prompt("Edit Node",text));
			if (object.text()===""){
				object.text(text);
			}
            clicks = 0;             //after action performed, reset counter
		
		}
	}
}