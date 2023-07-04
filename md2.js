/* 
 * MindSweeper Game Framework 2.0
 * 
 * 1. 난이도를 선택하고 먼저 맵을 생성한다. -> 클래스를 이용해 새로운 생성자를 만들면 됨.
 * 2. 사용자가 좌표를 클릭한다. (테스트를 위해 랜덤으로)
 * 3. 지뢰를 배치한다. 이때 사용자가 입력한 곳에는 지뢰가 배치되지 않도록 피해가야 함.
 * 4. 지뢰를 배치 완료하면 지뢰 위치를 키값으로 이루어진 배열로 저장한다.
 * 5. 그 배열을 통해 지뢰의 위치 주변 값을 하나씩 올리도록 한다.
 * 6. 지뢰의 위치를 저장한 배열에 따라 지뢰의 위치에 지뢰값을 저장한다.
 * 7. 그리고 사용자가 클릭한 시점에서 주변이 0인 부분만 걷어내고 지뢰를 제외한 숫자를 보여준다. (참고: 지뢰 게임)
 * 8. 그리고 게임이 시작.
 * 9. 게임에서 지뢰가 터지면 즉시 게임 오버된다.
 * 
 * *** 업그레이드 내용 ***
 * 1. 게임 실행 함수를 클래스로 전환 - new를 이용해 새로 호출 가능.
 * 2. 게임 실행 순서를 바꾸어 첫 시도에 우연히 지뢰가 터지지 않도록 함.
 * 3. 기존의 버전은 CUI 한정에 한해 사용 가능했으나, CUI는 물론 TUI, GUI 환경에서도 사용할 수 있도록 업그레이드함.
 * 4. ???
 * 
 */

//Front TEST ZONE




// MD Class (Class 이놈의 클래스가 작동 안해서 포기)
var MD = function() {
	this.map = null;
	this.attr = null;
	
	// 처음 실행될 때 : 멤버변수를 받아 클래스(같은 함수)에 저장
	this.start = function(width, height, number) {
		this.attr = {width: width, height: height, number: number};
		this.setMap();
	}
	
	// 처음 클릭할 때 실행하는 함수
	this.clickFirst = function(x,y) {
		this.firstAndLand(x,y);
	}
	
	// 한번 이상 클릭 시 실행하는 함수 : 여기에 지뢰나 숫자, 비어있음을 묶어서 반환
	this.click = function(x,y) {
		var value = this.map[x][y];
		
		return value;
	}
	
	//// 클래스에 있어서 필요한 함수 라이브러리들
	
	// 지도를 생성
	this.setMap = function() {
		this.map = newTwiceArray(this.attr.width, this.attr.height);
	}
	
	// 처음 클릭한 곳의 주위를 지뢰배치금지구역으로 지정하고 지뢰를 배치한 다음 배치금지를 해제한다.
	this.firstAndLand = function(x,y) {
		this.setLocationNoTouchZone(x,y);
		this.setLandmind();
		this.unsetLocationNoTouchZone(x,y);
		this.updateCellValue();
	}
	
	// 주변 지역을 지뢰배치금지구역으로 지정한다.
	this.setLocationNoTouchZone = function(x,y) {
		for (var i = -2; i <= 2; i++) {
			for (var j = -2; j <= 2; j++) {
				if (this.indexValueValid((x + i), (y + j))) {
					this.map[x+i][y+j] = -1;
				}
			}
		}
	};
	
	// 지뢰를 갯수만큼 배치한다. (갯수만큼 반복하는 것이 아니라 겹치는 것을 피하면서 모두 배치할 때까지 반복하는 것.) 그리고 배치된 맵을 반환한다.
	this.setLandmind = function() {
		var num = this.attr.number;
		var count = 0;
		
		while (count < num) {
			//랜덤좌표를 생성한다.
			const set = this.setRandomLand({w: this.attr.width, h: this.attr.height});
			
			// 랜덤좌표값에 지뢰가 없으면 배치한다.
			if (this.atValidForMind(this.map[set.x][set.y])) {
				this.map[set.x][set.y] = -1;
				
				count++;
			}
		}
		console.log("지뢰 배치 완료!");
	};

	// 지뢰 배치를 랜덤으로 추천한다.
	this.setRandomLand = function(size) {
		const posX = Math.floor(Math.random() * size.w);
		const posY = Math.floor(Math.random() * size.h);

		return ({x: posX, y: posY});
	};

	//지뢰를 배치하는데에 있어서 유효한 값인지 확인. (지뢰가 있거나 맵 밖에 있으면 false를 반환하고 지뢰가 없으면 true 반환)
	this.atValidForMind = function(at) {
		return (!(at == -1 || at == undefined));	// 지뢰가 있거나 범위 밖이라면 false (앞에 !가 있다)
	};

	//인덱스 값 유효 확인 : 유효하지 않다면 false를 반환
	this.indexValueValid = function(posX, posY) {
		var w = this.attr.width;
		var h = this.attr.height;
		
		return ((posX < 0 || posY < 0) || (posX >= w || posY >= h)) ? false : true;
	};

	// 지뢰배치금지구역을 해지한다.
	this.unsetLocationNoTouchZone = function(x,y) {
		for (var i = -2; i <= 2; i++) {
			for (var j = -2; j <= 2; j++) {
				if (this.indexValueValid((x + i), (y + j))) {
					this.map[x+i][y+j] = 0;
				}
			}
		}
	};
	
	// 지뢰를 찾아 주변 값을 하나 더하게 하도록 하는 함수
	this.updateCellValue = function() {
		var w = this.attr.width;
		var h = this.attr.height;
		
		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				if (!this.atValidForMind(this.map[i][j])) {
					this.updateLocationCell(i,j);
				}
			}
		}
	};
	
	// 지뢰가 있는 곳의 주변 값을 증산한다.
	this.updateLocationCell = function(x,y) {
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				if (this.indexValueValid((x + i), (y + j))) {
					if (this.map[x+i][y+j] != -1) {
						this.map[x+i][y+j]++;
					}
				}
			}
		}
	};
}





// 2차원 배열 생성 : 지도를 제공하기 위함 ; All value to 0
function newTwiceArray(w,h) {
	var arr = new Array(w);

	for (var n = 0; n < w; n++) {
		arr[n] = new Array(h);
	}

	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}






