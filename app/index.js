import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function main() {
    const canvas = document.getElementById('canvas');
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    camera.position.z = 25;
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, .5);
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(0, 20, 0);
    directionalLight.target.position.set(0, 10, 0);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    
    const objectsWithAxes = [];

    const human = new THREE.Object3D();
    const humanMaterial = new THREE.MeshLambertMaterial({color: 0x44aa88, flatShading: false});
    const bodyHeight = 10;
    const body = new THREE.Object3D();

    scene.add(human);
    
    const bodyGeometry = new THREE.BoxGeometry(1, bodyHeight, 1);
    const bodyMesh = new THREE.Mesh(bodyGeometry, humanMaterial);
    body.add(bodyMesh);
    human.add(body);

    const headRadius = 3;
    const headGeometry = new THREE.SphereGeometry(headRadius, 15, 15);
    const headMesh = new THREE.Mesh(headGeometry, humanMaterial);
    headMesh.position.y = bodyHeight/2 + headRadius / 2;
    human.add(headMesh);
    
    const createLeg = () => {
        const leg = new THREE.Object3D();
        const upperLegHeight = 4;
        const lowerLegHeight = 4; 

        const upperLegGeometry = new THREE.BoxGeometry(1, upperLegHeight, 1);
        const upperLegMesh = new THREE.Mesh(upperLegGeometry, humanMaterial);
        upperLegMesh.position.y = upperLegHeight/-2;

        const lowerLeg = new THREE.Object3D();
        const lowerLegGeomerty = new THREE.BoxGeometry(1, lowerLegHeight, 1);
        const lowerLegMesh = new THREE.Mesh(lowerLegGeomerty, humanMaterial);
        lowerLeg.position.y = -upperLegHeight;
        lowerLeg.rotation.x = Math.PI * -.1;
        lowerLegMesh.position.y = lowerLegHeight/-2;

        leg.add(upperLegMesh);
        lowerLeg.add(lowerLegMesh);
        leg.add(lowerLeg);

        return leg;
    }

    const legs = new THREE.Object3D();        
    const leftLeg = createLeg();
    const rightLeg = createLeg();

    leftLeg.rotation.z = Math.PI * -.07;
    leftLeg.rotation.x = Math.PI * .05;
    rightLeg.rotation.z = Math.PI * .07;
    rightLeg.rotation.x = Math.PI * .05;
    legs.position.y = -bodyHeight/2;

    legs.add(leftLeg);
    legs.add(rightLeg);
    body.add(legs);

    const createArm = () => {
        const arm = new THREE.Object3D();
        const upperArmHeight = 4;
        const lowerArmHeight = 4;

        const upperArmGeometry = new THREE.BoxGeometry(1, upperArmHeight, 1);
        const upperArmMesh = new THREE.Mesh(upperArmGeometry, humanMaterial);
        upperArmMesh.position.y = upperArmHeight/-2;
        arm.add(upperArmMesh);

        const lowerArm = new THREE.Object3D();
        const lowerArmGeomerty = new THREE.BoxGeometry(1, lowerArmHeight, 1);
        const lowerArmMesh = new THREE.Mesh(lowerArmGeomerty, humanMaterial);
       
        lowerArm.add(lowerArmMesh);
        lowerArm.position.y = -upperArmHeight;

        lowerArmMesh.position.y = -lowerArmHeight/2;
        lowerArm.rotation.x = Math.PI * .2;

        arm.add(lowerArm);

        return arm;
    }


    const arms = new THREE.Object3D();
    const leftArm = createArm();
    const rightArm = createArm();

    leftArm.rotation.z = Math.PI * -.2;
    rightArm.rotation.z = Math.PI * .2;
    arms.position.y = bodyHeight / 4;
    arms.add(leftArm);
    arms.add(rightArm);
    body.add(arms);

    const getRotateAnimation = (object, goUp) => {
        const maxPosition = Math.PI * 0.3;
        const minPosition = Math.PI * -0.2;

        return () => {
            if (goUp) {
                object.rotation.x += Math.PI * .01;
                if (object.rotation.x >= maxPosition) {
                    goUp = !goUp;
                }
            } else {
                object.rotation.x += Math.PI * -.01;
                if (object.rotation.x <= minPosition) {
                    goUp = !goUp;
                }
            }
        }
    }

    const animateLeftLeg = getRotateAnimation(leftLeg, true);
    const animateRightLeg = getRotateAnimation(rightLeg, false);
    const animateLeftArm = getRotateAnimation(leftArm, false);
    const animateRightArm = getRotateAnimation(rightArm, true);

    const render = () => {
        animateLeftLeg();
        animateRightLeg();
        animateLeftArm();
        animateRightArm();

        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    }

    render();
};

main();