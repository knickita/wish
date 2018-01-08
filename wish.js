var isDragging = false;
var isPressed = false;
var clickMousePosition=[0,0];

var connections=$('connection, inner');

var key_pressed={};

$(window).keyup(function(event){
  key_pressed[String(event.which)]=false; 
});
$(window).keydown(function(event){
  key_pressed[String(event.which)]=true; 
});

$( document ).ready(function() {
	 
	draw();
	$("#root").css('left', 400);
	$("#root").css('top', 150);
	function draw() {
	  // call again next time we can draw
	  requestAnimationFrame(draw);
	}

	

	$("#workspace")
	.on("mousedown",function(event){
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
	    	connections.connections('update');
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


function calculateSubPositions(object, min_angle, max_angle){
	var nodes=object.children(".divnode");
	var number_of_nodes=nodes.length;
	if (number_of_nodes>0){
		var angle_increment=(max_angle-min_angle)/(number_of_nodes+1);

		nodes.each(function(i,obj){
			var angle=min_angle+(angle_increment*(i+1));
			var left=Math.sin(angle*Math.PI/180)*100;
			var top=Math.cos(angle*Math.PI/180)*100;
			var color=angleToColor(angle/360);
			$(obj).css('left',left);
			$(obj).css('top',top);
			$(obj).children(".node").css('border-color',color);
			addColoredLine(object.children('.node'),$(obj).children(".node"),color);
			calculateSubPositions($(obj),angle,angle+angle_increment);
		});
	}
}


function angleToColor(h,s,l){

    var hue2rgb = function hue2rgb(t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return 6 * t;
        if(t < 1/2) return 1;
        if(t < 2/3) return 6 * (2/3 - t);
        return 0;
    }

    var r = hue2rgb(h + 1/3);
    var g = hue2rgb(h);
    var b = hue2rgb(h - 1/3);


     return 'rgb('+[Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)].join(', ')+')';
}




function addColoredLine(parent,child,color){
	parent.connections({to: child, css:{color:color}});
	connections = $('connection, inner');
	connections.connections('update');
}
   


function clickmanagement(event) {
	if (!isDragging){

		if(key_pressed[65]) {

            result = prompt("New Node","new content");
            if (result!="" && result!=null){
            	$(this).parent().append('<div class="divnode"><p class="node">'+result+'</p></div>');
            	$(".node")
            	.unbind() //to prevent multiple listeners on already created divs
				.mouseup(clickmanagement)
				.dblclick(function(event){
					event.preventDefault();  //cancel system double-click event
				});

				calculateSubPositions($("#root"),0,360);

            }
            //reset all the keypressed because you have lost focus on the current window and you can no longer trust the key_pressed variable
			key_pressed={};
        

        }
        else if(key_pressed[67]){
        	if ($(this).parent().attr('id')==="root"){
        		alert("You can not collapse the Root Node");
        		return;
        	}
        	if (confirm("Do you really want to delete this node and collapse its subnodes?")){
        		
        		$(this).parent().children('.divnode').each(function(){
        			$(this).appendTo($(this).parent().parent());
        		});

            	$(this).parent().remove();

				calculateSubPositions($("#root"),0,360);
            }
            //reset all the keypressed because you have lost focus on the current window and you can no longer trust the key_pressed variable
            key_pressed={};
        } 
        else if(key_pressed[68]){
        	if ($(this).parent().attr('id')==="root"){
        		alert("You can not delete the Root Node");
        		return;
        	}
        	if (confirm("Do you really want to delete this node?")){
            	$(this).parent().remove();

				calculateSubPositions($("#root"),0,360);
            }
            //reset all the keypressed because you have lost focus on the current window and you can no longer trust the key_pressed variable
            key_pressed={};
        }
        else {

            object=$(this);
            text=object.text().trim();
			object.text(prompt("Edit Node",text));
			if (object.text()===""){
				object.text(text);
			}

		}
	}
}