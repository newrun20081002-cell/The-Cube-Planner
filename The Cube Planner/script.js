let cube = document.getElementById('cube');
let isDragging = false;
let previousX, previousY;
let rotateX = -20, rotateY = 20;
let currentFace = 1;

// 마우스 드래그로 회전
cube.addEventListener('mousedown', function(e) {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
});
document.addEventListener('mouseup', function() { isDragging = false; });
document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    let deltaX = e.clientX - previousX;
    let deltaY = e.clientY - previousY;
    rotateY += deltaX * 0.5;
    rotateX -= deltaY * 0.5;
    cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    previousX = e.clientX;
    previousY = e.clientY;
});

// LocalStorage 저장/불러오기
function saveNote(face, text) {
    localStorage.setItem('cubeFace_' + face, text);
}

function loadNote(face) {
    return localStorage.getItem('cubeFace_' + face) || '';
}

function loadCurrentNote() {
    document.getElementById('note-text').value = loadNote(currentFace);
}

// 면 클릭 시 입력창으로 이동
for (let i = 1; i <= 6; i++) {
    document.getElementById('face-' + i).addEventListener('click', function() {
        currentFace = i;
        loadCurrentNote();
        document.getElementById('note-text').focus();
    });
}

// Save 버튼 클릭
document.getElementById('save-button').addEventListener('click', function() {
    let text = document.getElementById('note-text').value;
    saveNote(currentFace, text);
    alert('Saved!');
});

// 페이지 로드 시 초기화
window.onload = function() {
    cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    loadCurrentNote();
};
