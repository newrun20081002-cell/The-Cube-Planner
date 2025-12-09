// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cube-container').appendChild(renderer.domElement);

// Lights
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Cube
const materials = [
    new THREE.MeshStandardMaterial({ color: 0xff5555 }),
    new THREE.MeshStandardMaterial({ color: 0x55ff55 }),
    new THREE.MeshStandardMaterial({ color: 0x5555ff }),
    new THREE.MeshStandardMaterial({ color: 0xffff55 }),
    new THREE.MeshStandardMaterial({ color: 0xff55ff }),
    new THREE.MeshStandardMaterial({ color: 0x55ffff }),
];
const cube = new THREE.Mesh(new THREE.BoxGeometry(), materials);
scene.add(cube);

camera.position.z = 5;

// Mouse rotation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

renderer.domElement.addEventListener('mousedown', () => { isDragging = true; });
renderer.domElement.addEventListener('mouseup', () => { isDragging = false; });
renderer.domElement.addEventListener('mousemove', (event) => {
    if (isDragging) {
        let deltaMove = { x: event.offsetX - previousMousePosition.x, y: event.offsetY - previousMousePosition.y };
        cube.rotation.y += deltaMove.x * 0.01;
        cube.rotation.x += deltaMove.y * 0.01;
    }
    previousMousePosition = { x: event.offsetX, y: event.offsetY };
});

// Cube face click detection (Raycaster)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);
    if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2);
        openModal(faceIndex);
    }
}
window.addEventListener('click', onClick);

// Modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const noteArea = document.getElementById('note');
let currentFace = 0;

const faceNames = ["Schedule", "Habits", "Ideas", "To-Do", "Goals", "Free Notes"];

function openModal(faceIndex) {
    currentFace = faceIndex;
    modalTitle.textContent = faceNames[faceIndex];
    noteArea.value = localStorage.getItem("face" + faceIndex) || "";
    modal.classList.remove('hidden');
}

document.getElementById('save').addEventListener('click', () => {
    localStorage.setItem("face" + currentFace, noteArea.value);
    modal.classList.add('hidden');
});

document.getElementById('close').addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
