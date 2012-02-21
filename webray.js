function init() {
	var width = 800, height = 600;
	var elem = $('#cvs')[0];
	$(elem).attr('width', width).attr('height', height);
	$(elem).css('width', width).css('height', height);
	var gl = elem.getContext('experimental-webgl') || elem.getContext('webgl');
	var verts = new Float32Array([0,0,2,0,0,2,2,0,2,2,0,2]);
	var vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
	gl.viewport(0, 0, width, height);

	var prog = gl.createProgram();
	var vs = gl.createShader(gl.VERTEX_SHADER), fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vs, vertex_shader);
	gl.compileShader(vs);
	gl.attachShader(prog, vs);
	gl.shaderSource(fs, fragment_shader);
	gl.compileShader(fs);
	if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
		console.log('Fragment shader failed: ' + gl.getShaderInfoLog(fs));
		alert('compile fail');
		return false;
	}
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.log('Link failed: ' + gl.getProgramInfoLog(prog));
		alert('link fail');
		return false;
	}
	gl.useProgram(prog);
	gl.prog = prog;
	var pos = gl.getAttribLocation(prog, 'pos');
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(pos);
	gl.time = gl.getUniformLocation(prog, 'time');
	var res = gl.getUniformLocation(prog, 'resolution');
	gl.uniform2f(res, width, height);
	gl.ltime = new Date;
	render(gl);
	return true;
}

function render(gl) {
	gl.uniform1f(gl.time, (((new Date()) - gl.ltime) % 30000) / 1e3);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
	if(window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(function() { render(gl) }, gl.elem);
	if(window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(function() { render(gl) }, gl.elem);
}

$(document).ready(function() {
	vertex_shader = $('#vertex_shader').html();
	fragment_shader = $('#fragment_shader').html();
	init()
})
