var express = require('express');
const { routes } = require('../app');
var router = express.Router();

const fs = require('fs').promises;

//get 방식
/* localhost:3000 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//전체 경로 localhost:3000/users/join
//회원가입
router.get('/users/join', function(req, res) {
  // 회원가입 페이지를 보여준다.
  //console.log("이쪽으로 안들어오니");
  res.render('join.ejs');
});

router.get('/users/logout', (req, res) => {
  req.session.destroy(function(){
    res.render('index', { title: 'Express' });
  });
});

//회원리스트 리스트
router.get('/users/list', async (req,res) =>{

  if( req.session.user_id ){
    //로그인 된 유저
  let user_list = JSON.parse( await fs.readFile('user_list.txt'));
  res.json(user_list);
  } else {
    //로그인 되지 않은 유저.
    res.render('login.ejs');
  }
});

//회원 탈퇴
router.get('/users/leave', async (req, res) => {
res.render('leave.ejs');
});

//ejs 파일에 대한 호출, 회원 로그인
router.get('/users/login', async (req, res) =>{
  res.render('login.ejs');  
  });

//post 방식
//회원가입 및 중복체크
router.post('/users/join', async (req, res) => {

  // res.render('join-fail', {message:"아이디가 중복됩니다."}); //아이디 중복 여부 검사
  // return;

  console.log(req.body);

  const input_id = req.body.id;
  const input_password = req.body.password;

  let user_info = { id : input_id , password : input_password };

  try {
    // 유저 리스트 txt 파일이 있을때는 기존에 기록된 유저 정보를 읽어온다.
    let data = await fs.readFile('user_list.txt');
    // 유저 리스트 txt 파일을 배열로 변환
    let text_user_list = JSON.parse(data);
    let overlap_id = false;

    /**
     * 이곳에서 회원가입 중복 체크
     * 아이디가 중복 된다면 overlap_id 값을 true로 변경
     */

    if (overlap_id) {
      return [false, "아이디가 중복됩니다."];
    }

    text_user_list.push(user_info);
    fs.writeFile('user_list.txt', JSON.stringify(text_user_list, null, 2));

  } catch (e) {

    console.log(e);
    // 유저 리스트 텍스트 파일이 없어서 읽을수 없을경우 catch 로 들어옴
    // 빈 유저 리스트 배열 생성
    var user_list = [];
    // 유저 정보 추가
    user_list.push(user_info);
    // user_list 배열을 텍스트 형태로 변환해서 user_list.txt 파일에 저장
    fs.writeFile('user_list.txt', JSON.stringify(user_list, null, 2));
  }

  res.render('index.ejs', { title: 'Express'});
});

//전체 경로 localhost:3000/users/login post요청
//회원 로그인
router.post('/users/login', async (req, res) =>{
  
  let user_list = JSON.parse( await fs.readFile('user_list.txt'));
  
  for( let i = 0; i < user_list.length; i++){
    if(user_list[i].id == req.body.id){
      //아이디가 일치하면
      if(user_list[i].password == req.body.password){
        //비밀번호도 일치하면 로그인 완료
        req.session.user_id = req.body.id;
        req.session.password = req.body.password;
        res.render('login-complete', {name : user_list[i].name });
       
        return;
      }
      break;
    }
  }
  //id와 비밀번호가 일치하지 않는다면 로그인 실패
  res.render('login-fail');
});

//회원탈퇴
router.post('/users/leave', async (req, res) => {
  
  let user_list = JSON.parse( await fs.readFile('user_list.txt'));

  //로그인 여부
  if(req.session.user_id){
    //로그인 된 유저라면 해당 회원을 탈퇴한다.
    //탈퇴 전에 탈퇴하시겠습니까? 문구 추가하는 것이 좋을 듯. 
  let user_list = JSON.parse( await fs.readFile('user_list.txt'));
  res.json(user_list);
  } else {
    //로그인 되지 않은 유저.
    res.render('leave-fail.ejs');
  }

  for(let i = 0; i < user_list.length; i++) {
    if(user_list[i].id == req.session.user_id){
      //아이디가 일치하고
      if(user_list[i].password == req.session.password){
        //비밀번호도 일치하면
        //회원탈퇴 완료
        //삭제될 회원정보
        let leaveuser = user_list[i].name;
        //회원 삭제
        user_list.splice(i,1);
        //삭제된 회원을 user_list.txt 파일에 저장
        fs.writeFile('user_list.txt', JSON.stringify(user_list, null, 2));
        //탈퇴성공에 대한 문구 출력
        res.render('leave-complete', {name : leaveuser});
        return;

      }
      break;
    }
  }
    //id와 비밀번호가 일치하지 않는다면 회원탈퇴 실패, 회원탈퇴 페이지로 재진입
  res.render('leave'); 
});

module.exports = router;
