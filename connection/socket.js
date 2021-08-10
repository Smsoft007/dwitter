import {
  Server
} from 'socket.io';
import jwt from 'jsonwebtoken';
import {
  config
} from '../config.js';

//해당클래스는 외부에서는 사용할수없다. 
class Socket {
  constructor(server) {
    //static                    //이것을 생성할수있는 팩토리 함수를 만들면 된다. typescript
    //priviate constructor(server) { //생성자를 priviat 하게 만들고

    //서버를 만든다. 소겥을 만들 준비를 하고 있다. 
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowedOrigin,
      },
    });

    //토큰을 검증한다. 
    this.io.use((socket, next) => {
      // socket.handshake.auth.token 소겥안에 핸드쉐이크안에 auth안에 token 받아올거다. 
      //const token = socket.handshake.query && socket.handshake.query.token;
      //socket 원문 표준적으로 정해진 handshake 안에 있는 auth를 사용해야한다. 
      //브라우저 상에도 토큰이 보일수 있고 log에도 남을수 있다. 
      //이렇게 해야 조금도 보안에 강화된다고 나와있다. 
      const token = socket.handshake.auth.token;
      // 만약 토큰이 없다면 아무에게나 오픈하고싶지 않다. 
      //토큰이 없다면 
      if (!token) {
        return next(new Error('Authentication error'));
      }
      //검증된 받아온 토큰을 / 토큰키를 통하여 verify(검증)한다.
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        //검증을 할수없다면 
        if (error) {
          //에러를 리턴하고 더이상 소겥이 처리되지 않도록 만든다. 
          return next(new Error('Authentication error'));
        }
        //문제가 없으면 next();
        next();
      });
    });
    //on을 통해서 connection 연결 됐는지 안됐는지 확인 
    this.io.on('connection', (socket) => {
      console.log('Socket client connected');
    });
  }
}

//소겥을 사용하고 싶을때는 initSocket먼저한다. ==> app.js 이부부분 initSocket(server);

let socket;
export function initSocket(server) {
  // 소겥이 만들어져있지 않다면 
  // 보통 객채지향 프로그램에서 싱글톤을 구현할때는 클래스 안에서 내부적으로 할수있다. 

  if (!socket) { // 이미 만들어 졌다면 만들지 않는다. 
    //새로운 class object를 만들고  
    socket = new Socket(server);
  }
}
//사용하는 사람은getSocketIO 호출하면 가지고 있는 socket 클래스 안에 있는 io를 전달해준다. 
export function getSocketIO() {
  if (!socket) {
    throw new Error('Please call init first');
  }
  return socket.io;
}