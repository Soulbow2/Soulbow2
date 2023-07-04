/* 
 * 이 파일은 mindsweeper2.js를 임포트하여 이를 GUI에 직접 구현할 수 있도록 한다.
 * (mindsweeper2.js는 GUI에 구현할 수 있는 라이브러리라고 했지, 구현할 수 있다고는 안했다)
 * 
 * mindsweeper2를 줄여서 md2라 한다.
 * 이것은 사실상 md2와 GUI가 분리된 것을 하나로 이어주는 것이 game.js이다.
 * 
 * 실행순서는 다음과 같다.
 * 1. 먼저 사용자가 난이도를 선택한다. (또는 직접 옵션(자기가 원하는 사이즈 및 갯수)을 실행한다.)
 * 2. md2의 생성자를 만든다.
 * 3. md2에 사용자가 선택한 사이즈와 갯수를 맞춰 생성(하면서 모든 값을 0으로 설정)한다. (아직 지뢰 배치는 이르다)
 * 4. (GUI) 사용자에게 생성된 맵을 보여준다.
 * 5. 사용자가 아무나 클릭하면 그 좌표를 알아내 md2에 좌표값을 넘긴다.
 * 6. md2는 좌표값을 받아 이 주변지역(5x5)을 배치금지구역으로 지정한다.
 * 7. 그리고 지뢰를 랜덤으로 배치한다. (지뢰가 이미 배치된 곳에 배치되지 않도록 한다.)
 * 8. 배치 완료되면 사용자가 클릭했던 좌표값의 주변지역에 배치금지구역을 해제(하고 0으로 설정)한다.
 * 9. 그리고 클릭했던 좌표값에 실행을 시작한다. (클릭한 곳이 0이 없어질 때까지, 그리고 0을 제외한 숫자가 나올 때까지 확산한다. 이에 대해 지뢰찾기 게임을 직접 하면서 생각해 보도록, 더이상 설명은 생략한다.)
 * 10. 게임을 실행하면서 지뢰가 있다고 생각해서 우클릭하면 좌표값을 깃발로 표시된다. (이때, 깃발이 지뢰위치가 저장된 맵에는 영향을 받지 않고, 이 md2의 게임실행전용 클래스에 저장된다.)
 * 11. 실행하면서 깃발을 우클릭하면 깃발이 해지되고 물음표가 표시된다. (이것 역시 지뢰맵에 영향을 주지 않고, md2의 게임실행전용 클래스에 저장된다.)
 * 12. (GUI) 사용자가 클릭한 좌표가 발생하면, 이 좌표를 md2가 받아서 판정한다. 판정 과정은 받은 좌표를 맵의 이 좌표 값을 읽어서 이 값에 따라 실행된다.
 * 13. 좌표값이 0이라면 주변 값을 읽어내서 지뢰를 제외한 0이나 숫자가 드러낼 때까지 확장한다. (지뢰게임 하면서 참고)
 * 14. 좌표값이 숫자라면 확장을 하지 않고 이 숫자를 반환하여 GUI에 표시한다.
 * 15. 좌표값이 지뢰라면 터지는 함수를 실행한다. 터지는 함수는 아래의 사용방법 설명란과 같다.
 * 16. 깃발을 제외한 모든 곳을 다 열어본다면, 성공 함수를 실행하도록 한다.
 * 17. 성공하고 나면 md2의 생성자 실행이 종료되고, 결과를 보여준뒤, 리플레이 여부를 묻는다.
 * 18. 리플레이 여부에 따라 생성하거나 종료하거나 둘중 하나.
 * 
 * 게임 실행하면서 사용하는 방법은 다음과 같다.
 * 1. 지뢰가 있다고 생각되는 곳에 마우스 우클릭을 하면 깃발이 나온다. 깃발은 우클릭이 불가능하다.
 * 2. 깃발을 한번 더 우클릭하면 물음표가 뜬다. 물음표는 클릭이 가능하다.
 * 3. 클릭한 곳이 지뢰가 없는 곳(지뢰를 제외한, 0이거나 숫자거나)이라면 0이면 확장하고, (0을 제외한)숫자면 확장하지 않고 그대로 표시한다.
 * 4. 클릭한 곳이 지뢰가 있는 곳이라면 다음 터지는 함수를 실행한다.
 * 5. 터지기 함수를 실행하기 시작하고, 터질 때 게임실행전용 클래스의 값을 읽어 지뢰와 깃발 좌표값이 일치하면 터지지 않고, 깃발이 헛발질(불일치)하면 그 자리에 X표시로 바꾸고, 지뢰가 깃발 아래에 있지 않다면(불일치) 이 지뢰는 터지게 한다.
 * 6. 터질 때, 순차적으로 한 칸씩 나아가며 표시한다.
 * 7. 지뢰를 예측하면서 깃발을 배치할 때마다 깃발의 갯수가 줄어들도록 한다. (깃발이 -1 이하로 내려가는 수가 있다.)
 * 8. 지뢰를 제외한 모든 칸을 열어본다면(클릭한다면) 성공했다는 표시가 나오도록 성공함수를 실행한다. (성공함수는 그냥 성공했다는 것을 보여주는 쇼로, 그냥 지뢰 예측이 맞았음을 지뢰 칸을 열어 지뢰를 보여주고 성공하셨습니다하고, 끝.)
 * 9. 끝나면 결과를 보여준다.
 * 10. 결과를 보여주는 동시에 클라이언트에 결과가 저장된다. (Web Storage를 이용)
 * 
 * 
 */

// *** 추가 ***
/* 추가로 개발할 내용과 기능 목록
 * 0. 게임 매뉴얼을 만들어 초보자도 쉽게 접근할 수 있도록 한다.
 * 1. 이 보드에서 게임이 종료되면 바로 오버 창으로 넘어가지만 얼마든지 보드를 다시 되돌아 볼 수 있게 한다.
 * 2. 이 보드에서 다시 게임하기를 할 수 있도록 한다.
 * 3. 오버된 보드에서 사이즈는 그대로 저장되도록 한다.
 * 4. (보드 되돌아보기에 상관없이) 새롭게 다시 시작하기를 실행할 경우 F5를 실행하지 않고 바로 시작화면으로 이동한다.
 * 5. 게임을 하면서 마우스의 우클릭이나 좌클릭, 그리고 좌표를 기록하여 저장한다.
 * 6. 5.의 기능을 통해 되돌아 보기 기능에서 히스토리 기능으로 볼 수 있게 한다.
 * 7. 스토리지에 저장되는 값이 이 보드의 사이즈에 따라 구분되어 저장되도록 한다.
 * 8. 보드를 창에 맞게 최대 사이즈로 설정하거나 창 내 보드를 (맵처럼) 이동하여 게임할 수 있도록 한다.
 * 9. 유저가 원하면 타이머 모드를 실행하여 걸린 시간을 계산하거나 정해진 시간 내 완수 하도록 한다.
 * 10. Node.js라는 서버를 도입한다. 이를 통해 랭킹 서비스를 만든다.
 * 11. 서버에서 유저가 로그인을 하면 랭킹 시스템을 사용할 수 있게 한다.
 * 12. 로그인 없이 싱글 플레이어 모드로 7.까지의 모드만 반영되도록 한다.
 * 13. 유저가 회원가입 절차를 거쳐서 이 게임의 랭킹 서비스를 사용할 수 있도록 한다.
 * 14. 랭킹 서비스에서 제각각 다른 사이즈와 지뢰 갯수에 따라 분류가 되도록 한다.
 * 15. 랭킹에서 유저의 점수와 히스토리를 볼 수 있도록 한다.
 * 16. 유저의 히스토리와 점수, 보드 완수 기록 내역을 볼 수 있도록 한다.
 * 17. 가능하면 이스터에그로 이 셀에 지뢰가 있는지 확인할 수 있는 지뢰 탐지기 아이템을 만들어 볼 것이다.
 * 18. Node.js에서 실행될 수 있도록 이 게임의 js와 주요 js를 분리하고, 서버와 클라이언트를 분리한다. 또한 클라이언트 측에서 조작이 불가능하도록 한다.
 * 
 */

//// 알고리즘에 기반이 되는 핵심 함수들

var md2 = null;	// 생성자. 비효율을 막기 위해 startApp()이 실행될 때 만 생성하도록 함. 다시 시작할 때 새로운 생성자로 덮어쓴다.
var clickFirst = false;	// 처음 클릭했었나? -> 클릭 한번 이상 했다면 true로 바뀐다.
var pointWin = false;	// 이 상태로 게임오버를 실행하면 패로 등록되지만, true로 하면 승리한다.
var flagMap = null;	// 플래그 맵 : 깃발 꽂고 빼고 물음표 배치하는 것을 저장하는 맵이다.
var flagNum = 0;	// 플래그넘 : 현재 꽂은 플래그의 갯수 현황을 저장
var mineNum = 0;	// 마인넘 : 현재 지뢰의 갯수를 기억
var history = null;	// 히스토리맵 : 보드 맵과 플래그 맵의 현황은 물론 셀 오픈 순서를 기억한다.


// onload를 통해 맨 처음 실행되는 함수
function startApp() {
	md2 = new MD();
	history = new HistoryMap();
	document.getElementById('front').style.display = 'block';
}

// 게임 맵 설정을 끝내고 Start버튼 누를 때 실행되는 함수 : 맵 생성, 플래그맵 생성
function clickStartBtn() {
	// 프론트 디스플레이를 숨기고 다음 단계인 맵 형성하는 함수에 넘긴다.
	document.getElementById('front').style.display = 'none';
	
	// 시작할 때 사용자가 지정한 속성값을 불러온다.
	var attr = setMapAttr();
	
	// 클래스에 맵을 생성한다.
	md2.start(attr.width, attr.height, attr.number);
	
	// 플래그 맵을 생성한다.
	flagMap = newTwiceArray(attr.width, attr.height);
	
	// 디스플레이에 보여줄 맵을 만들어 띄운다.
	showGameMain(attr.width, attr.height);
	
	// 디스플레이에 표시될 깃발 갯수를 설정한다.
	mineNum = attr.number;
	showFlagNum();
	
	// 모든 셀을 한꺼번에 이벤트리스너를 관리
	var allMapCell = document.querySelector("#gt");
	allMapCell.addEventListener("mousedown", cellClickActive, false);
}

// front 화면을 숨기고 메인을 보여줘야지
function showGameMain(w,h) {
	document.getElementById('game').innerHTML = setGameMapCell(w,h);	// 셀맵을 띄운다.
	document.getElementById('wrap').style.display = 'block';	// 메인을 보여준다.
}

// 게임오버 화면 실행
function showGameOver() {
	document.getElementById('wrap').style.display = 'none';	// 메인을 감춘다.
	document.getElementById('back').style.display = 'block';	// 게임오버 화면을 보여준다.
	showScore();
}

// 게임 점수 화면 보여준다.
function showScore(){
	document.getElementById('score').style.display = 'block';
	showResult();
}

// 게임오버 창에 넥스트 버튼을 클릭 시 실행하는 함수
function nextShow() {
	var code = 0 + pointWin;	// 승패여부 코드 : false면 0, true면 1
	document.getElementById('score').style.display = 'none';
	
	if (code)
		document.getElementById('win').style.display = 'block';	// 1
	else
		document.getElementById('lose').style.display = 'block';	// 0
}




// 비동기식 핵심 함수들

// 우측 클릭 방지 : 기본값 : 게임에 집중하기 위함
window.oncontextmenu = function () {
	return false;
};

// 모든 셀을 통틀어 클릭을 감지하는 함수
function cellClickActive(e) {
    if (e.target !== e.currentTarget) {
        var cell = e.target.id;
		
		// 앞에 c가 붙지 않은 아이디 값을 걸러낸다. (좌표 아이디는 c로 시작한다.)
		if (cell.charAt(0) == 'c') {
			// 아이디 값을 좌표값으로 전환.
			var at = convertCoordinateValues(cell);
			var x = at.x, y = at.y;
			
			//마우스 우클릭, 좌클릭에 따라 구분하도록 함. (여기서는 함수 써라 제발;;)
			
			if (e.button == 0) {	// 좌클릭
				// 원래 우클릭하고 disabled을 통해 좌클릭 못하게 할려고 했는데 반전, 우클릭이 안되서 이 구문을 추가.
				if (flagMap[x][y] != 1) {
					// Style Setting
					document.getElementById(cell).style.backgroundColor = 'white';
					
//					console.log("["+x+","+y+"] Left Click");
					clickLeft(x,y);
				}
			}
			else if (e.button == 2) {	//우클릭
//				console.log("["+x+","+y+"] Right Click");
				clickRight(x,y);
			}
			else {
				return;
			}
		}
    }
    e.stopPropagation();
}

// 좌클릭 시 실행되는 함수
function clickLeft(x,y) {
	// 만약 한번도 클릭한 적이 없다면 : 
	if (!clickFirst) {
		md2.clickFirst(x,y);
		nullExpansion(x,y);
		clickFirst = true;
	}
	else {	// 한번 이상 클릭했으면 : 
		var id = "c" + fitToNumUnit(x, 2) + fitToNumUnit(y, 2);
		var cell = document.getElementById(id);
		
		// 클릭한 셀의 값에 따라 표시되고 승패를 좌지우한다.
		var value = md2.click(x,y);
		
		if (value == -1) {
			// 꾹ㅡ 어..? 방금 뭐 누른..거야?
			disabledTrueAll()
			touchMine(x,y);
		}
		else if (value == 0) {
			cell.innerHTML = '';
			
			// 주변에(지뢰를 제외한)숫자가 나올 때까지 들춰내는 함수를 실행한다.
			nullExpansion(x,y);
		}
		else if (value > 0) {
			cell.innerHTML = '' + value;
			// 근데 문제는 셀 버튼의 색상이 화이트다. 즉, 안보인다. 이에 대해 클래스 이름 추가로 색상이 보이게끔 한다.
			showNumber(cell, value);
		}
		cell.disabled = true;
	}
}

// 우클릭 시 실행되는 함수
function clickRight(x,y) {
	if (clickFirst) {
		var flag = flagAt(x,y);

		var id = "c" + fitToNumUnit(x, 2) + fitToNumUnit(y, 2);
		var cell = document.getElementById(id);

		switch(flag) {
			case 0:		// 비어있다면 깃발을 배치
				flagMap[x][y]++;
				cell.innerHTML = '🚩';
				flagNum++;
				break;
			case 1:		// 깃발이 있으면 없애고 물음표 배치
				flagMap[x][y]++;
				cell.innerHTML = '?';
				flagNum--;
				break;
			case 2:		// 물음표 있으면 아예 비운다.
				flagMap[x][y] = 0;
				cell.innerHTML = '';
				break;
		}

		// 깃발 갯수를 갱신
		showFlagNum();

		// 오른쪽 버튼 클릭할 때마다 승리여부를 체크한다.
		var num = parseInt(document.getElementById('number').value);	// 심각한 버그 발견!
		if (flagNum == num) checkWin(num);
	}
}

// 깃발이 있는 위치와 지뢰가 있는 위치가 일치한지 체크한다.
function checkWin(num) {
	var matchNum = 0;
	var attr = md2.attr;
	
	for (var i = 0; i < attr.width; i++) {
		for (var j = 0; j < attr.height; j++) {
			if (md2.map[i][j] == -1 && flagMap[i][j] == 1) {
				matchNum++;
			}
		}
	}
	
	if (matchNum === num) {
		pointWin = true;
		
		for (var i = 0; i < attr.width; i++) {
			for (var j = 0; j < attr.height; j++) {
				if (md2.map[i][j] == -1) {
					showMine(i,j);
				}
			}
		}
		setTimeout(function() {
			showGameOver();
		}, 3000);
	}
	else {
		console.log("틀림"+ matchNum +" " + num);		// 심각한 버그가 있음!
	}
}

// 지뢰 공개
function showMine(x,y) {
	var id = "c" + fitToNumUnit(x, 2) + fitToNumUnit(y, 2);
	var cell = document.getElementById(id);
	
	cell.style.backgroundColor = "blue";
	setTimeout(
		function() {
			cell.style.backgroundColor = "cyan";
		}, 5000
	)
}


//// 라이브러리 함수들

// Easy, Middle, Hard 버튼을 클릭할 때마다 input에 값을 바꿔보여줌
function gameLevel(lv) {
	var attr = sizeofLevel(lv);
	
	document.getElementById('width').value = attr.w;
	document.getElementById('height').value = attr.h;
	document.getElementById('number').value = attr.n;
}

// 난이도에 따라 값을 반환해 줌
function sizeofLevel(lv) {
	var attr;
	switch(lv) {
		case 1:
			attr = {w: 9, h: 9, n:10};
			break;
		case 2:
			attr = {w: 16, h: 16, n: 40};
			break;
		case 3:
			attr = {w: 30, h: 16, n: 99};
			break;
		case 4:
			var r = maxAcceptCell(40);
			var num = recommendToMineNum(r.dx, r.dy);
			
			attr = {w: r.dx, h: r.dy, n: num};
			break;
	}
	return attr;
}

// 사용자가 임의로 지정했을수도 있으니; input값을 불러온다.
function setMapAttr() {
	var width = document.getElementById('width').value;
	var height = document.getElementById('height').value;
	var number = document.getElementById('number').value;
	
	return {width: width, height: height, number: number};
}

// 받은 인자를 통해 만들어서 생성된 지뢰 맵을 디스플레이에 표시된다.
function setGameMapCell(w,h) {
	var line = '<div class="gt" id="gt">';
	
	for (var j = 0; j < h; j++) {
		line += '<div class="gt-row">';
		for (var i = 0; i < w; i++) {
			// 만약 수가 10의 단위가 아니라면 (예를 들어 1자리수라면 앞에 0을 채움)
			var x = fitToNumUnit(i, 2);
			var y = fitToNumUnit(j, 2);
			
			line += '<button class="gt-cell" id="c' + x + y + '"></button>';
		}
		line += '</div>';
	}
	line += '</div>';
	
	return line;
}

// 좌표값을 아이디 값에 적용되도록 값을 바꾼다.
function fitToNumUnit(i,n) {
	var str = "0000000000" + i;
	return str.slice(-n);
}

// 아이디 값을 좌표값으로 바꿔준다.
function convertCoordinateValues(id) {
	var x = parseInt(id.substr(1,2));
	var y = parseInt(id.substr(3,2));
	
	return {x: x, y: y};
}

// return value that value of coordinate
function flagAt(x,y) {
	return flagMap[x][y];
}

// 숫자를 표시하기 위한 함수
function showNumber(id, value) {
	if (value >= 1 && value < 9) id.classList.add("v" + value);
}

// 클릭한 곳이 비어있을 때, 게임처럼 비어있는 곳을 들춰내는 함수
function nullExpansion(x, y) {
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (md2.indexValueValid((x + i), (y + j))) {
				if (md2.map[x+i][y+j] != -2) {
					var posX = x+i, posY = y+j;
					
					var id = "c" + fitToNumUnit(posX, 2) + fitToNumUnit(posY, 2);
					var cell = document.getElementById(id);
					
					if (flagAt(posX,posY)) {
						flagMap[posX][posY] = 0;
						cell.innerHTML = '';
						flagNum--;
						showFlagNum();
					}
					
					var value = md2.map[posX][posY];
					
					if (value > 0) {
						cell.innerHTML = '' + value;
						showNumber(cell, value);
						md2.map[posX][posY] = -2;
					}
					else {
						md2.map[posX][posY] = -2;
						nullExpansion(posX,posY);
					}
					
					cell.style.backgroundColor = 'white';
					cell.disabled = true;
				}
			}
		}
	}
}

// 어랍쇼? 지뢰를 건드렸군요!
function touchMine(x,y) {
	var id = "c" + fitToNumUnit(x, 2) + fitToNumUnit(y, 2);
	var cell = document.getElementById(id);
	
	cell.style.backgroundColor = "red";
	
	bombMine();
	
	setTimeout(function() {
		showGameOver();
	}, 3000);
}

// 지뢰가 터진다!!! 콰과광!!!
function bombMine() {
	var width = md2.attr.width, height = md2.attr.height;
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			if (md2.map[i][j] == -1) {
				bomb(i,j);
			}
		}
	}
}

// 터짐
function bomb(x,y) {
	var id = "c" + fitToNumUnit(x, 2) + fitToNumUnit(y, 2);
	var cell = document.getElementById(id);
	
	cell.style.backgroundColor = "yellow";
	
	setTimeout(function() {
		cell.style.backgroundColor = "red";
	},1000);
}

// 게임오버 창에 결과 현황을 보여준다.
function showResult() {
	var code = 0 + pointWin;	// 승패여부 코드 : false면 0, true면 1
	var result = setResultStorage(code);	// 승패여부를 저장하면서 값을 반환 받는다.
	
	var print = '승: '+result.win+', 패: '+result.lose+', 총합: '+result.total+'';
	
	document.getElementById('score_winlose').innerHTML = print;
}


// 기록을 로컬 스토리지에 저장하면서 기록을 리턴한다.
function setResultStorage(code) {
	var result = {win: 0, lose: 0, total: 0};
	
	if (localStorage.getItem('total') != undefined){
		result = getStorage();
	}
	
	switch(code) {
		case 0:
			result.lose++;
			break;
		case 1:
			result.win++;
			break;
	}
	result.total++;
	
	setStorage(result);
	
	return result;
}

// 스토리지 값 불러오기
function getStorage() {
	var total = localStorage.getItem('total');
	var win = localStorage.getItem('win');
	var lose = localStorage.getItem('lose');
	return {win: win, lose: lose, total: total};
}
// 스토리지 값 저장하기
function setStorage(v) {
	localStorage.setItem('win', v.win);
	localStorage.setItem('lose', v.lose);
	localStorage.setItem('total', v.total);
}

// 모든 셀을 클릭할 수 없도록 한다. (지뢰가 터지거나 다 찾았을 때에도 여전히 작동되는 버그를 수정)
function disabledTrueAll() {
	var attr = setMapAttr();
	for (var x = 0; x < attr.width; x++) {
		for (var y = 0; y < attr.height; y++) {
			var pop = 'c' + fitToNumUnit(x, 2) + '' + fitToNumUnit(y, 2);
			var cellId = document.getElementById(pop);
			
			cellId.disabled = true;
		}
	}
}



// 남은 깃발 갯수를 표시
function showFlagNum() {
	var flags = '🚩 ' + (mineNum - flagNum);
	var displayflagNum = document.getElementById('flagNum').innerHTML = flags;
}


// 지뢰 최소 배치 가능 갯수 설정
function setNumMin() {
	var w = getMapWidth();
	var h = getMapHeight();
	
	document.getElementById('number').value = minAcceptMine(w,h);
}

// 지뢰 최대 배치 가능 갯수 설정
function setNumMax() {
	var w = getMapWidth();
	var h = getMapHeight();
	
	document.getElementById('number').value = maxAcceptMine(w,h);
}


// 맵의 w * h를 반환 : 맵의 셀 갯수를 반환
function getMapCell() {
	return getMapWidth() * getMapHeight();
}
// 맵의 너비 값 반환
function getMapWidth() {
	return document.getElementById('width').value;
}
// 맵의 높이 값 반환
function getMapHeight() {
	return document.getElementById('height').value;
}


// 지뢰 배치할 갯수를 추천해주는 함수 : 여기서 최솟값과 최댓값의 조화 평균값으로 리턴된다.
function recommendToMineNum(w, h) {
	var min = minAcceptMine(w, h);
	var max = maxAcceptMine(w, h);
	
	return parseInt((2 * min * max) / (min + max)) + 1;
}

// 맵의 크기 내에서 배치할 수 있는 지뢰의 최소값
function minAcceptMine(w, h) {
	var min = (Math.floor(Math.sqrt(w*h)));
	return min;
}
// 맵의 크기 내에서 배치할 수 있는 지뢰의 최대값
function maxAcceptMine(w, h) {
	return (w * h) - 25;
}

// you have a check to border error debuging
function maxAcceptCell(r) {
	var maxSize = maxSizeMapInWindow();
	
	var dx = parseInt(maxSize.w / r) - 1;
	var dy = parseInt((maxSize.h - 40) / r) - 1;
	
	return {dx: dx, dy: dy};
}

function getWindowWidth() {
	return window.innerWidth;
}
function getWindowHeight() {
	return window.innerHeight;
}

function maxSizeMapInWindow() {
	var width = oneDown(getWindowWidth());
	var height = oneDown(getWindowHeight());
	return {w: width, h: height};
}

function oneDown(i) {
	return (parseInt(i/10)*10);
}




function resetGame() {
	location.reload();
}



// HistoryMap - 지뢰 보드 맵과 플래그 맵 현황, 클릭 순서 등을 저장하여 게임 오버 후 되돌아보기 기능에 쓰인다.
var HistoryMap = function() {
	var mineMap = null;
	var flagMap = null;
	var history = [];
	
	this.saveMineMap = function(mine) {
		mineMap = mine;
		flagMap = new Array(mineMap.length);
		
		for (var i = 0; i < mineMap.length; i++) {
			flagMap[i] = new Array(mineMap[i]);
		}
	};
	
	// 우클릭 시 히스토리에 
	this.updateFlag = function(x, y) {
		if (flagMap[x][y] == 2) {
			flagMap[x][y] = 0;
		}
		else {
			flagMap[x][y]++;
		}
	};
	
	// 좌클릭 또는 우클릭 시 히스토리에 좌표가 추가됨 : 좌표 x, y와 좌클릭 또는 우클릭을 구분하는 lr
	this.updateHistory = function(x, y, lr) {
		history.push({
			x: x,
			y: y,
			lr: lr
		});
	};
	
	// 게임 오버 후 처리
	this.getHistory = function() {
		return history;
	};
	
};

