class VideoPlayer {
    constructor() {
    }

    createRenderContext(canvas) {
        if (!canvas) {
            /*canvas = document.getElementById('sdk_video_canvas');
            if (!canvas) {
                canvas = document.createElement("canvas");
                canvas.setAttribute('id', 'sdk_video_canvas')
            }*/
        }
        let renderContext = this.setupCanvas(canvas, {
            preserveDrawingBuffer: false
        });
        return renderContext;
    }

    // eslint-disable-next-line no-unused-vars
    setupCanvas(canvas, options) {
        let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl)
            return gl;

        let program = gl.createProgram();
        let vertexShaderSource = [
            "attribute highp vec4 aVertexPosition;",
            "attribute vec2 aTextureCoord;",
            "varying highp vec2 vTextureCoord;",
            "void main(void) {",
            " gl_Position = aVertexPosition;",
            " vTextureCoord = aTextureCoord;",
            "}"
        ].join("\n");
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        let fragmentShaderSource = [
            "precision highp float;",
            "varying lowp vec2 vTextureCoord;",
            "uniform sampler2D YTexture;",
            "uniform sampler2D UTexture;",
            "uniform sampler2D VTexture;",
            "const mat4 YUV2RGB = mat4",
            "(",
            " 1.1643828125, 0, 1.59602734375, -.87078515625,",
            " 1.1643828125, -.39176171875, -.81296875, .52959375,",
            " 1.1643828125, 2.017234375, 0, -1.081390625,",
            " 0, 0, 0, 1",
            ");",
            "void main(void) {",
            " gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB;",
            "}"
        ].join("\n");

        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log("Shader link failed.");
        }
        let vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        let textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);

        let verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]),
            gl.STATIC_DRAW);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        let texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
            gl.STATIC_DRAW);
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.y = new Texture(gl);
        gl.u = new Texture(gl);
        gl.v = new Texture(gl);
        gl.y.bind(0, program, "YTexture");
        gl.u.bind(1, program, "UTexture");
        gl.v.bind(2, program, "VTexture");

        return gl;
    }

    renderFrame(gl, videoFrame, width, height, uOffset, vOffset) {

        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // gl.clearColor(0.0, 0.0, 0.0, 0.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        gl.y.fill(width, height, videoFrame.subarray(0, uOffset));
        gl.u.fill(width >> 1, height >> 1, videoFrame.subarray((uOffset), uOffset + vOffset));
        gl.v.fill(width >> 1, height >> 1, videoFrame.subarray(uOffset + vOffset, videoFrame.length));

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }

    /* Player controls Start Here */

    fullscreen() {
        let node = document.getElementById('sdk_vidPlayerComp');
        let canvas = document.getElementById('sdk_canvas');
        // eslint-disable-next-line no-unused-vars
        let childrens = node.children;
        let fullScreen;

        if ((document.webkitIsFullScreen == false) || (document['isFullScreen'] == false) || (screen.height - 50 > window.innerHeight && screen.width == window.innerWidth)) {
            (node.webkitRequestFullScreen || node.requestFullScreen || node.mozRequestFullScreen || node.msRequestFullscreen).call(node);
            fullScreen = true;
        } else {
            //(document.webkitCancelFullScreen()||document.cancelFullScreen()||document.mozCancelFullScreen()||document.msExitFullscreen());
            (document.webkitCancelFullScreen || document['cancelFullScreen'] || document['mozCancelFullScreen'] || document['msExitFullscreen']).call(document);
            fullScreen = false;
        }

        let innerWidth = screen.width;
        let innerHeight = screen.height;
        if (fullScreen) {
            node.setAttribute('style', 'width:' + innerWidth + 'px;' + 'height:' + innerHeight + 'px;' + 'margin-top:0px;margin-left:0px;top:0px;left:0px;background-color:black;border:2px solid rgba(17, 48, 69, 0.9);max-width:' + innerWidth + 'px;');
        } else {
            node.setAttribute('style', '');
        }

        for (let i = 0, len = node.children.length; i < len; i++) {
            if (fullScreen) {
                node.children[i].setAttribute('style', 'width:' + innerWidth + 'px;' + 'height:25px;');
            } else {
                node.children[i].setAttribute('style', '');
            }

            if (i === 1) {
                if (fullScreen) {
                    node.children[i].setAttribute('style', 'height:' + (innerHeight - 54) + 'px;' + 'width:' + innerWidth + 'px');
                    canvas.style.width = (innerWidth) + 'px';
                    canvas.style.height = (innerHeight - 54) + 'px';
                } else {
                    node.children[i].setAttribute('style', '');
                    canvas.setAttribute('style', '');
                }
            }

        }

    }

    /* Player controls Ends Here */

}

class Texture {
    constructor(gl) {
        this.gl = gl;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    bind(n, program, name) {
        let gl = this.gl;
        gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n]);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(program, name), n);
    }

    fill(width, height, data) {
        let gl = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    }

}

export default VideoPlayer;