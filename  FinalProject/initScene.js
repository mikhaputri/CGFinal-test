
    var character;
    var cactus, cactus2, cactus3; 
    var rock = null;
    var obs, obsType, obsPosition;
    var isJumping = 0;
    var isFalling = 0;
    var jump = 0;
    var score = 0;
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
    var canvas, engine, scene;
    var isObstacle = 0;
    var obstacle;
    var life = 0;

document.addEventListener("DOMContentLoaded", function(){

    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);

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
    groundMat.diffuseTexture = new BABYLON.Texture("texture/desertTex.jpg", scene);
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0);


    for(var i = 0; i < grounds.COUNT; i++){
        var tmpGround = new BABYLON.Mesh.CreateGround("ground", grounds.WIDTH, grounds.HEIGHT, grounds.SUBDIVISIONS, scene);
        tmpGround.material = groundMat;
        tmpGround.position.x = (i * grounds.WIDTH) - (Math.ceil(grounds.COUNT / 2) * grounds.WIDTH);
            
        grounds.objects.push(tmpGround);
    }
    grounds.farLeftDistance = grounds.objects[0].position.x;
    grounds.farRightDistance = grounds.objects[grounds.objects.length - 1].position.x;
  
    window.g = grounds;

    //skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("skybox/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    //insert main character
    BABYLON.SceneLoader.ImportMesh("", "", "assets/bot.babylon", scene, function (newMeshes) { 
        character = newMeshes[0]; 
        character.position.x =  0;
        character.position.y =  11;
        character.position.z =  0;
        character.rotation.y = - Math.PI / 2;
        character.scaling = new BABYLON.Vector3(3, 3, 3);
        
    
        BABYLON.SceneLoader.ImportMesh("", "", "assets/rock.babylon", scene, function (newMeshes) { 
            rock = newMeshes[0]; 
            rock.position = new BABYLON.Vector3(500,-500,500);
            rock.scaling = new BABYLON.Vector3(0.5,0.5,0.5);

            BABYLON.SceneLoader.ImportMesh("", "", "assets/cactus.babylon", scene, function (newMeshes) { 
                cactus = newMeshes[0]; 
                cactus.position = new BABYLON.Vector3(500,-500,500);
                cactus2 = newMeshes[1];
                cactus2.position = new BABYLON.Vector3(500,-500,500);
                cactus3 = newMeshes[2];
                cactus3.position = new BABYLON.Vector3(500,-500,500);
        
                scene.registerBeforeRender(function () {
                var jumping = 1;

                if (life > 3) {
                    engine.stopRenderLoop();
                    console.log("mati");
                }

                if (character.intersectsMesh(rock,false)) {
                    life = life + 1;
                    console.log("batu");
                }

                if (character.intersectsMesh(cactus,false)) {
                    life = life + 1;
                    console.log("cactus");
                }



                if (rock) {
                    rock.position.x -= 2.5;
                }

                if (cactus) {
                    cactus.position.x -= 2.5;
                }
            

                if (isJumping == 1) {
                    character.position.y += jumping;
                    if (character.position.y >=  (original_position + jump)){
                        isJumping = false;
                        isFalling = true;
                    }
                }

                if (isJumping == 2){
                    character.position.y += jumping;
                    if (character.position.y >= (original_position + 2 * jump)){
                        isJumping = false;
                        isFalling = true;
                    }
                }

                if (isFalling == true){
                    character.position.y -= jumping;
                    if (character.position.y <= original_position) {
                        character.position.y = original_position;
                        isFalling = false;
                    }
                }

                if (isObstacle == 0){
                    var pos = Math.floor((Math.random() * character.position.x+150) + character.position.x+100);
                    var obsType = Math.floor((Math.random() * 2) + 1);

                    if(obsType == 1){
                        BABYLON.SceneLoader.ImportMesh("", "", "assets/cactus.babylon", scene, function (newMeshes) { 
                            cactus = newMeshes[0]; 
                            cactus.position = new BABYLON.Vector3(pos,20,0);
                            cactus2 = newMeshes[1];
                            cactus2.position = new BABYLON.Vector3(500,-500,500);
                            cactus3 = newMeshes[2];
                            cactus3.position = new BABYLON.Vector3(500,-500,500);
                        }); 
                    }

                    if(obsType == 2){
                        BABYLON.SceneLoader.ImportMesh("", "", "assets/rock.babylon", scene, function (newMeshes) { 
                            rock = newMeshes[0]; 
                            rock.position = new BABYLON.Vector3(pos,1,0);
                            console.log(1);
                        });
                    }
                    isObstacle = 1;
                }

                else if (isObstacle == 1 && rock.position.x == -50 ){ 
                    isObstacle = 0;
                    rock.dispose();   
                }

                else if (isObstacle == 1 && cactus.position.x == -50) {
                    isObstacle = 0;
                    cactus.dispose();
                }
            

                // if (obstacle.position.x < character.position.x){
                //     isObstacle = 0;
                // }

                // if(obs.z >= 100){
                //     obs.destroy();
                //     obstaclesManager();
                // }

                window.onkeydown = function (event) {
                    switch (event.keyCode) {

                        case 32:
                            Jump();

                        break;
                    }
                };
            });

            engine.runRenderLoop(function (){
                // untuk bikin dia jalan kiri terus
                // jadi kalo count nya udah mentok, yang kiri dipindah ke kanan
                for(var i = 0; i < grounds.COUNT; i++){
                    var selected = grounds.objects[i];
                    selected.position.x -= grounds.MOVE_SPEED;
            
                    if(selected.position.x < grounds.farLeftDistance){
                        selected.position.x = grounds.farRightDistance;
                        score++;
                    }
                    document.getElementById("score").innerHTML = "Score = "+ score;
                }
                scene.render();
            });

        });
        function Jump(){
            var height = 40;
            if (isJumping == 0 && isJumping < 2) {
                isJumping++;
                jump = height;   
            } 
        }

    });
	
});

});