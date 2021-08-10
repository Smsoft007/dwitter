import dotenv from 'dotenv';

dotenv.config();

//프로젝트 값이 있는지 없는지 실시간으로 확인해서
//값이 있는지 없는 지 서버를 시작하자마자 개발하는단계에서 야 그거 설정 안했자나 라고 실시간으로 알려주는 서비스 

//key defaultValue 명시적전달 (defaultValue 기본값은 undefined) typescript 형식
function required(key, defaultValue = undefined) {
    //동적으로 object에접근 key에 대해서 환경 변수에 값이 있는지 없는지 알아볼것이다. 
    // process.env[key]지정한 키가 있다면 값을 가지고 올거고  또는 defaultValue 있다면 값을  로 덮어 쒸어 줄꺼다. 
    // process.end[key]도 없고 null 인상태고 또는 defaultValue 도 null 인상태라면 null undefined 된다.
    const value = process.env[key] || defaultValue;

    //이건 null 일때도 true
    //undefined 일때도 true
    if (value == null) {
        //키가 없어 라고 전달해준다. 
        throw new Error(`Key ${key} is undefined`);
    }
    return value;

}

//그룹별로 묶어서 정리 했다. 
export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        //숫자는 parseInt
        expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
    },
    bcrypt: {
        // 환경변수에 들어가 있지 않아도 기변 값을 넣을수 있도록 처리 (기본값으로 처리한다.)
        //숫자인 경우에는 parseInt
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
    },
    db: {
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database: required('DB_DATABASE'),
        password: required('DB_PASSWORD'),
    },
    port: parseInt(required('PORT', 8080)),
    cors: {
        allowedOrigin: required('CORS_ALLOW_ORIGIN'),
    },
};