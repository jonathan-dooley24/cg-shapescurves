class Renderer {
    // canvas:  object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }
    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }
    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
    }
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }
    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
		var left_bottom = {x: 100, y: 100};
		var right_top = {x: 400, y: 400};
		var color = [65, 80, 235, 255];
        this.drawRectangle(left_bottom, right_top, color, framebuffer);
    }
    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
		var center = {x: 300, y: 300};
		var radius = 100;
		var color = [65, 80, 235, 255];
		this.drawCircle(center, radius, color, framebuffer);
    }
    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {     
		var pt0, pt1, pt2, pt3, color;
		pt0 = {x: 100, y: 100}
		pt1 = {x: 150, y: 400}
		pt2 = {x: 400, y: 350}
		pt3 = {x: 350, y: 150}
		color = [65, 80, 235, 255];
		this.drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer);
    }
	// framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
		//J
		this.drawLine({x: 200, y: 450}, {x: 200, y: 290}, [235, 80, 35, 255], framebuffer);
		this.drawBezierCurve({x: 200, y: 290}, {x: 200, y: 240},{x: 100, y: 240}, {x: 100, y: 290}, [235, 80, 35, 255], framebuffer);
		//a
		this.drawCircle({x: 350, y: 300}, 48, [235, 80, 35, 255], framebuffer);
		this.drawLine({x: 397, y: 320}, {x: 397, y: 250}, [235, 80, 35, 255], framebuffer);
		//c
		this.drawBezierCurve({x: 550, y: 255}, {x: 485, y: 230},{x: 485, y: 350}, {x: 550, y: 335}, [235, 80, 35, 255], framebuffer);
		//k
		this.drawLine({x: 650, y: 250}, {x: 650, y: 425}, [235, 80, 35, 255], framebuffer);
		this.drawLine({x: 650, y: 300}, {x: 725, y: 250}, [235, 80, 35, 255], framebuffer);
		this.drawLine({x: 650, y: 300}, {x: 725, y: 375}, [235, 80, 35, 255], framebuffer);
    }
	drawShowPoint(center, radius, color, framebuffer){
		var num_pts = 10;
		var pts_list = [];		//IS THIS THE CORRECT WAY TO INITIALIZE 
		//populate the pts_list
		for(var i = 0; i < num_pts; i++){
			var angle = (360 / num_pts) * i * (Math.PI) / 180;
			var pt_x = Math.round(center.x + (radius * Math.cos(angle))); 
			var pt_y = Math.round(center.y + (radius * Math.sin(angle)));
			pts_list.push({x: pt_x, y: pt_y});
		}
		//draw the lines between each point in the points list
		for(var i = 0; i < num_pts; i++){
			var pt1 = pts_list[i];
			var pt2;
			if(pt1 == pts_list[pts_list.length - 1]){
				pt2 = pts_list[0];
			}
			else{
				pt2 = pts_list[i + 1];
			}
			this.drawLine(pt1, pt2, color, framebuffer);
		}
	}
	// left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        var right_bottom = {x: right_top.x, y: left_bottom.y};
		var left_top = {x: left_bottom.x, y: right_top.y};
		
		this.drawLine(left_bottom, right_bottom, color, framebuffer);
		this.drawLine(left_bottom, left_top, color, framebuffer);
		this.drawLine(left_top, right_top, color, framebuffer);
		this.drawLine(right_bottom, right_top, color, framebuffer);
		if(this.show_points){
			this.drawShowPoint(left_bottom, 4, [235, 80, 35, 255], framebuffer);
			this.drawShowPoint(right_bottom, 4, [235, 80, 35, 255], framebuffer);
			this.drawShowPoint(left_top, 4, [235, 80, 35, 255], framebuffer);
			this.drawShowPoint(right_top, 4, [235, 80, 35, 255], framebuffer);
		}
		
    }
	// center:       object ({x: __, y: __})
    // radius:       int 
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, color, framebuffer) {
        var num_pts = this.num_curve_sections;
		var pts_list = [];		//IS THIS THE CORRECT WAY TO INITIALIZE 
		//populate the pts_list
		for(var i = 0; i < num_pts; i++){
			var angle = (360 / num_pts) * i * (Math.PI) / 180;
			var pt_x = Math.round(center.x + (radius * Math.cos(angle))); 
			var pt_y = Math.round(center.y + (radius * Math.sin(angle)));
			pts_list.push({x: pt_x, y: pt_y});
		}
		//draw the lines between each point in the points list
		for(var i = 0; i < num_pts; i++){
			var pt1 = pts_list[i];
			var pt2;
			if(pt1 == pts_list[pts_list.length - 1]){
				pt2 = pts_list[0];
			}
			else{
				pt2 = pts_list[i + 1];
			}
			this.drawLine(pt1, pt2, color, framebuffer);
		}
		
		if(this.show_points){
			for(var j = 0; j < num_pts; j++){
				this.drawShowPoint(pts_list[j], 4, [235, 80, 35, 255], framebuffer);
			}
		}
		
    }
	// pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
		var num_pts = this.num_curve_sections;
		var pts_list = [];		//IS THIS THE CORRECT WAY TO INITIALIZE 
		var t; //t is distance along the curve
		//populate the pts_list
		for(var i = 0; i < num_pts; i++){
			t = (1.0 / (num_pts - 1)) * i;
			var pt_x = Math.round((Math.pow(1-t, 3) * pt0.x) + (3 * Math.pow(1-t, 2) * t * pt1.x) + (3 * (1-t) * Math.pow(t, 2) * pt2.x) + ((Math.pow(t, 3) * pt3.x)));
			var pt_y = Math.round((Math.pow(1-t, 3) * pt0.y) + (3 * Math.pow(1-t, 2) * t * pt1.y) + (3 * (1-t) * Math.pow(t, 2) * pt2.y) + ((Math.pow(t, 3) * pt3.y)));
			pts_list.push({x: pt_x, y: pt_y});
		}
		console.log(pts_list);
		//draw the lines between each point in the points list
		for(var i = 0; i < (num_pts - 1); i++){
			var pt1 = pts_list[i];
			var pt2 = pts_list[i + 1];
			this.drawLine(pt1, pt2, color, framebuffer);
		}
		if(this.show_points){
			for(var j = 0; j < num_pts; j++){
				this.drawShowPoint(pts_list[j], 4, [235, 80, 35, 255], framebuffer);
			}
		}
    }
	// pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLine(pt0, pt1, color, framebuffer)
    {
		var x0, y0, x1, y1;
		x0 = pt0.x;
		y0 = pt0.y;
		x1 = pt1.x;
		y1 = pt1.y;
        if (Math.abs(y1-y0) <= Math.abs(x1-x0)){ // aka: abs value of slope (m)  <= 1
			if(x0 < x1){
				this.drawLineLow(x0, y0, x1, y1, color, framebuffer);
			}
			else{
				this.drawLineLow(x1, y1, x0, y0, color, framebuffer);
			}
		}
		else{
			if(y0 < y1){
				this.drawLineHigh(x0, y0, x1, y1, color, framebuffer);
			}
			else{
				this.drawLineHigh(x1, y1, x0, y0, color, framebuffer);
			}
		}
    }
	drawLineLow(x0, y0, x1, y1, color, framebuffer)
	{
		var A = y1 - y0;
		var B = x0 - x1;
		var iy = 1;
		if (A < 0) {
			iy = -1;
			A *= -1;
		}
		var D = 2 * A + B;
		var x = x0;
		var y = y0;
		var px;
		while (x <= x1)
		{
			px = this.pixelIndex(x, y, framebuffer);
			this.setFramebufferColor(framebuffer, px, color);
			x += 1;
			if (D <= 0)
			{
				D += 2 * A;
			}
			else
			{
				D += 2 * A + 2 * B;
				y += iy;
			}
		}
	}
	drawLineHigh(x0, y0, x1, y1, color, framebuffer)
	{	
		var A = x1 - x0;
		var B = y0 - y1;
		var ix = 1;
		if (A < 0) {
			ix = -1;
			A *= -1;
		}
		var D = 2 * A + B;
		var x = x0;
		var y = y0;
		var px;
		while (y <= y1)
		{
			px = this.pixelIndex(x, y, framebuffer);
			this.setFramebufferColor(framebuffer, px, color);
			y += 1;
			if (D <= 0)
			{
				D += 2 * A;
			}
			else
			{
				D += 2 * A + 2 * B;
				x += ix;
			}
		}
	}
	init()
	{
		console.log("Hello world!");
		var w = 600;
		var h = 600;

		// Get handle to HTML canvas element
		var mycanvas = document.getElementById("mycanvas");

		// Set canvas width and height (in pixels)
		mycanvas.width = w;
		mycanvas.height = h;

		// Get handle to 2D rendering context
		var ctx = mycanvas.getContext("2d");	
	
		// Get copy of the framebuffer
		var framebuffer = ctx.getImageData(0, 0, w, h);

	
		// Operations to edit the framebuffer ...
		// Make altered framebuffer the one to use when displaying
		ctx.putImageData(framebuffer, 0, 0);
	}
	pixelIndex(x, y, framebuffer)
	{
		return 4 * y * framebuffer.width + 4 * x;
	}
	setFramebufferColor(framebuffer, px, color)
	{
		framebuffer.data[px + 0] = color[0];
		framebuffer.data[px + 1] = color[1];
		framebuffer.data[px + 2] = color[2];
		framebuffer.data[px + 3] = color[3];
	}
};
