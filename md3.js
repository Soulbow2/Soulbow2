// 이 파일은 기존 script.js와 md2.js의 코드를 새로운 버전으로 만들 것이다.
// 기존 스크립트의 문제는 md2.js에서 MD 클래스가 잘 작동하였으나 자료구조에 불과했고,
// script.js에서 게임 실행과 디스플레이가 혼재하여 매우 복잡한 구조를 지니게 되었다.
// 그래서 이 새로운 스크립트에서 디스플레이와 게임 실행 클래스, 자료구조 등을 명확하게 분리하여 실행할 수 있도록 개발할 것이다.
// 이 파일은 md2.js에 있는 클래스와 script.js에 있는 게임 함수를 여기에 합쳐서, html에서의 실행 코드와 명확하게 구분할 수 있도록 한다.

// [html 디스플레이] --- [디스플레이 스크립트] --- [게임 액티브 스크립트][히스토리맵] --- [보드-맵 스크립트] --- Server?


// Board-Map Script
var BoardMap = function() {
	// 보드맵이라는 이중배열을 저장하는 변수
	var map = null;
	
	// 보드맵의 속성(너비, 높이, 갯수)을 저장하는 변수
	var attr = null;
	
	// TODO : 여기서부터 아주 쉽게 이해할 수 있도록 함수가 실행되는 흐름 순서대로 함수를 작성한다.
	
	// 맨 처음 생성자를 가진 후 게임을 시작할 때 실행하는 함수
	this.start = function(width, height, number) {
		this.attr = {
			width: width,
			height: height,
			number: number
		};
		
		this.setMap();
	}
	
	// 처음 실행 후 맵을 생성하는 함수
	this.setMap = function() {
		map = new Array(attr.width);
		
		for (var i = 0; i < attr.width; i++) {
			map[i] = new Array(attr.height);
			
			for (var j = 0; j < attr.height; j++) {
				map[i][j] = 0;
			}
		}
	};
	
	// 맵 생성 후 맨처음 클릭되는 셀의 위치를 통해 이후의 함수를 한꺼번에 처리하는 함수
	this.activeFirstClick = function(x, y) {
		this.setUpNTZ(x,y);
		this.landMines();
		this.setDownNTZ(x,y);
	};
	
	// 처음 클릭한 곳의 주변에 지뢰가 배치될 수 없도록 지뢰배치금지구역을 설정하는 함수 (NTZ : No Touch Zone)
	this.setUpNTZ = function(x, y) {
		for (var i = -2; i <= 2; i++) {
			for (var j = -2; j <= 2; j++) {
				var posX = x + i;
				var posY = y + j;
				
				if (this.indexValidValue(posX, posY)) {
					map[posX][posY] = -1;
				}
			}
		}
	};
	
	// 이 좌표가 맵에 벗어나지 않는지 확인하는 함수
	this.indexValidValue = function(posX, posY) {
		return (((posX < 0 || posY < 0) || (posX >= attr.width || posY >= attr.height)) ? false : true);
	};
	
	// 지뢰를 갯수만큼 랜덤으로 중복없이 배치하는 함수 (배치 이후 주변 값을 증산하도록 한다. 또한 배치하고자 하는 셀의 값이 -1 아니면 무시하고 배치한다)
	this.landMines = function() {
		
	}
	
	// 지뢰배치금지구역을 해제하는 함수 (주변값 증산으로 인해 숫자가 NTZ에 들어와 있다면 0으로 바꾸지 않도록 한다)
	this.setDownNTZ = function(x, y) {
		for (var i = -2; i <= 2; i++) {
			for (var j = -2; j <= 2; j++) {
				var posX = x + i;
				var posY = y + j;
				
				if (this.indexValidValue(posX, posY)) {
					map[posX][posY] = 0;
				}
			}
		}
	};
	
	// 지뢰 배치 이후 클릭 시 실행되는 함수
	this.activeClick = function(x, y) {
		var value = map[x][y];
		
		if (value == 0) {
			// 주변에 숫자가 나타날 때까지 확산하는 함수를 실행
			value = 0
		}
		
		return value;
	}
}


// Game Active Script
var GameActive = function() {
	var map = null;
	
	this.newMap = function() {
		map = new BoardMap();
	}
}


// HistoryMap Script



// ???


