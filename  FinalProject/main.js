
    var char;
    var cactus, rock, obs, obsType, obsPosition;
    var isJumping = 0;
    var isFalling = 0;
    var jump = 0;
    var gravity = 0.015;
    var original_position = 11;
    var grounds = {
        objects: [],
        WIDTH: 100,
        HEIGHT: 100,
        SUBDIVISIONS: 30,
        COUNT: 30,
        MOVE_SPEED: 2,
        farLeftDistance: 0,
        farRightDistance: 0
    };

document.addEventListener("DOMContentLoaded", function(){

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI * 1, 1.5, 100, new BABYLON.Vector3(5, 25, 1.5), scene);
        camera.attachControl(canvas, true);
        // detach control yang bikin kamera nya fixed
        // camera.detachControl(canvas);
        camera.setTarget(BABYLON.Vector3.Zero());

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0). scene);
        light.diffuse = new BABYLON.Color3(255, 255, 255);
        light.specular = new BABYLON.Color3(255, 255, 255);
        light.groundColor = new BABYLON.Color3(255, 255, 255);

        var groundMat = new BABYLON.StandardMaterial("ground", scene);
        groundMat.diffuseTexture = new BABYLON.Texture("texture/desertTex.jpg", this.scene);
        groundMat.specularColor = new BABYLON.Color3(0, 0, 0);


        for(var i = 0; i < grounds.COUNT; i++){
            var tmpGround = new BABYLON.Mesh.CreateGround(
                "ground", grounds.WIDTH, grounds.HEIGHT, grounds.SUBDIVISIONS, scene);
            tmpGround.material = groundMat;
            tmpGround.position.x = (i * grounds.WIDTH) - (Math.ceil(grounds.COUNT / 2) * grounds.WIDTH);
            
            grounds.objects.push(tmpGround);
        }
        grounds.farLeftDistance = grounds.objects[0].position.x;
        grounds.farRightDistance = grounds.objects[grounds.objects.length - 1].position.x;
  
        window.g = grounds;

        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        BABYLON.SceneLoader.ImportMesh("", "", "assets/bot.babylon", scene, function (newMeshes) { 
            char = newMeshes[0]; 
            char.position.x =  0;
            char.position.y =  11;
            char.position.z =  0;
            char.rotation.y = - Math.PI / 2;
            char.scaling = new BABYLON.Vector3(3, 3, 3);
            // char.physicsImpostor = new BABYLON.PhysicsImpostor(char, BABYLON.PhysicsImpostor.BoxImpostor, 
            // {mass: 1, restitution: 0, friction: 0}, scene);
        }); 
        
        scene.registerBeforeRender(function () {
            var jumping = 0.5;

            if (isJumping == 1) {
                char.position.y += jumping;
                if (char.position.y >=  (original_position + jump)){
                    isJumping = false;
                    isFalling = true;
                }
            }

            if (isJumping == 2){
                char.position.y += jumping;
                if (char.position.y >= (original_position + 2 * jump)){
                    isJumping = false;
                    isFalling = true;
                }
            }

            if (isFalling == true){
                char.position.y -= jumping;
                if (char.position.y <= original_position) {
                    char.position.y = original_position;
                    isFalling = false;
                }
            }

            window.onkeydown = function (event) {
            
                switch (event.keyCode) {
                    case 32:
                        Jump();

                    break;
                }
            };
        })

        obsPosition = Math.floor((Math.random() * char.position.z+10) + char.position.z+5);
        // 1 = cactus, 2 = rock
        obsType = Math.floor((Math.random() * 2) + 1);
        if(obsType == 1){
            createCactus(obsPosition);
        }
        if(obsType == 2){
            createRock(obsPosition);
        }
        logicforObs();
        console.log(obsPosition);
	
    obstaclesManager();
    console.log(char.position.y);

    engine.runRenderLoop(function (){
        // untuk bikin dia jalan kiri terus
        // jadi kalo count nya udah mentok, yang kiri dipindah ke kanan
        for(var i = 0; i < grounds.COUNT; i++){
            var selected = grounds.objects[i];
            selected.position.x -= grounds.MOVE_SPEED;
            
            if(selected.position.x < grounds.farLeftDistance){
                selected.position.x = grounds.farRightDistance;
            }
        }



        scene.render();
    });

});

function createScene(){
		

		// var camera = new BABYLON.ArcRotateCamera("", -Math.PI / 2, 1.08, 20, new BABYLON.Vector3(0,0,6), scene);
		

    
	};

	

    
    
    function createChar() { 
        
    }

    function createRock(pos) { 
        BABYLON.SceneLoader.ImportMesh("", "", "assets/rock.babylon", scene, function (newMeshes) { 
            // rock = newMeshes[0]; 
            // rock.position = new BABYLON.Vector3(0,2,pos);
            obs = newMeshes[0]; 
            obs.position = new BABYLON.Vector3(0,2,pos);
        }); 
    }

    function createCactus(pos) { 
        BABYLON.SceneLoader.ImportMesh("", "", "assets/cactus.babylon", scene, function (newMeshes) { 
            // cactus = newMeshes[0]; 
            // cactus.position = new BABYLON.Vector3(0,10,pos);
            obs = newMeshes[0]; 
            obs.position = new BABYLON.Vector3(0,2,pos);
        }); 
    }

    function Jump(){
        var height = 20;
        if (isJumping == 0 && isJumping < 2) {
            isJumping++;
            jump = height;   
        } 
    }

    function logicforChar(){
        
    }

    function logicforObs(){
        scene.registerBeforeRender(function () {
            
            if(obs.z >= 100){
                obs.destroy();
                obstaclesManager();
            }

            
        })
    }



    function obstaclesManager(){
        
    }

	
