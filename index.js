const port = 80; //port에 80 저장
//1. 서버 사용을 위해 http 모듈을 http 변수에 담기
var http = require('http');
//ip 주소를 가져오기  위해 ip 모듈을 가져온다. 
var ip = require("ip");

//2. http 모듈로 서버를 생성
var server = http.createServer(function (req, res) {

    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.write('API 진주양 서버 <br> ip 주소:' + ip.address());
    res.end('안녕하세요:)');
});

//3.listen 함수로 80 포트를 가진 서버를 실행, 서버 실행 시 콘솔창에서 Server is running...'로그 출력
server.listen(port,function(){
    console.log('Server is running... API 서버 1' + port);
});