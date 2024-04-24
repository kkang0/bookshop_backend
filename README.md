# 도서 구매 사이트 API 설계 및 구현 프로젝트

C팀 강정윤

## 1️⃣ API 문서

1.  **회원 가입**

    ### 회원 API

    | HTTP Method      | POST                                      |
    | ---------------- | ----------------------------------------- |
    | URL              | users/join                                |
    | HTTP status code | 성공(201), 실패(400)                      |
    | Request Body     | { email: “이메일”, password: “비밀번호” } |
    | Response Body    |                                           |

2.  **로그인**

    | HTTP Method      | POST                                      |
    | ---------------- | ----------------------------------------- |
    | URL              | users/login                               |
    | HTTP status code | 성공(200), 실패(401)                      |
    | Request Body     | { email: “이메일”, password: “비밀번호” } |
    | Response Body    | cookie: JWT Token (문자열)                |

3.  **비밀번호 초기화 요청 ➡️** 비밀번호 까먹었을 때 사용 (로그인 전)

    | HTTP Method      | POST                 |
    | ---------------- | -------------------- |
    | URL              | users/reset          |
    | HTTP status code | 성공(200), 실패(401) |
    | Request Body     | { email: “이메일” }  |
    | Response Body    | { email: “이메일” }  |

4.  **비밀번호 초기화(수정)**

    | HTTP Method      | PUT                                                                |
    | ---------------- | ------------------------------------------------------------------ |
    | URL              | users/reset                                                        |
    | HTTP status code | 성공(200), 실패(400)                                               |
    | Request Body     | { email: “이전 페이지에서 입력했던 이메일”, password: “비밀번호” } |
    | Response Body    |                                                                    |

### 도서 API

1.  **전체 도서 조회 ➡️** 페이지네이션(8개씩) LIMIT을 req에 담아 보내기

    | HTTP Method      | GET                                                                                                                                                                                                                                                                                                              |
    | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | URI              | /books?limit={페이지에 나타낼 도서 수}&curPage={현재 페이지}                                                                                                                                                                                                                                                     |
    | HTTP status code | 성공(200), 실패(400)                                                                                                                                                                                                                                                                                             |
    | Request Body     |                                                                                                                                                                                                                                                                                                                  |
    | Response Body    | { books:[{ id: “도서 id”, title: “도서 제목”, img: “이미지 id(picsum)”, form: “종이책”, isbn: , summary: “요약 정보”, author: “작가”, pages: “페이지 수”, price: “가격”, likes: “좋아요 수”, categoryId: “카테고리 id”, pubDate: “출간일” }, ...], pagenation: { curPage:현재 페이지”,totalCount: 총 도서 수 } } |

2.  **개별 도서 조회**

    | HTTP Method      | GET                                                                                                                                                                                                                                                                                                                                                             |
    | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | URI              | /books/{bookId}                                                                                                                                                                                                                                                                                                                                                 |
    | HTTP status code | 성공(200), 실패(400)                                                                                                                                                                                                                                                                                                                                            |
    | Request Header   | “Authorization”: 로그인할 때 받은 JWT Token (문자열)                                                                                                                                                                                                                                                                                                            |
    | Request Body     |                                                                                                                                                                                                                                                                                                                                                                 |
    | Response Body    | { id: “도서 id”, title: “도서 제목”, img: “이미지 id(picsum)”, form: “포맷”, ibsn: “0”, summary: “요약 정보”, detail: “상세 설명”, author: “작가”, pages: “페이지 수”, contents: “목차”, price: “가격”, likes: “좋아요 수”, liked: “내가 좋아요 했는지 여부(boolean)”, ➡️ 로그인, categoryId: “카테고리 id”, categoryName: “카테고리 이름”, pubDate: “출간일” } |

3.  **카테고리 별 도서 목록 조회 ➡️ 페이지네이션!!**

    | HTTP Method      | GET                                                                                                                                                                                                                                                                              |
    | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | URI              | /books?limit={페이지에 나타낼 도서 수}&curPage={현재 페이지}                                                                                                                                                                                                                     |
    | HTTP status code | 성공(200), 실패(400)                                                                                                                                                                                                                                                             |
    | Request Body     |                                                                                                                                                                                                                                                                                  |
    | Response Body    | { "books": [ { "id": 3, "title": "백설공주들", "img": 60, "form": "종이책", "isbn": "2", "summary": "사과..", "detail": "빨간 사과..", "author": "김사과", "pages": 100, "contents": "목차입니다.", "price": 20000, "likes": 3, "categoryId": 1, "pubDate": "2024-04-01" }, … ]} |

    - querystring: 여러가지 값을 요청할 때 (? 사용)
    - new=true이면 신간 (기준: 출간일 30일 이내)

### 카테고리 API

1.  **카테고리 전체 조회**

    | HTTP Method      | GET                                                |
    | ---------------- | -------------------------------------------------- |
    | URI              | /category                                          |
    | HTTP status code | 성공(200), 실패(400)                               |
    | Request Body     |                                                    |
    | Response Body    | [{ "categoryID": 0, "categoryName": "소설" }, ...] |

### 좋아요 API

1. **좋아요 추가 ➡️** req.header Authorization

   | HTTP Method      | POST                                                 |
   | ---------------- | ---------------------------------------------------- |
   | URI              | /likes/{bookId}                                      |
   | HTTP status code | 성공(200), 실패(400)                                 |
   | Request Headers  | “Authorization”: 로그인할 때 받은 JWT Token (문자열) |
   | Request Body     |                                                      |
   | Response Body    | // likes에 좋아요 행 추가                            |
   | 숫자가 바로 변함 |

2. **좋아요 취소**

   | HTTP Method      | DELETE                                               |
   | ---------------- | ---------------------------------------------------- |
   | URI              | /likes/{bookId}                                      |
   | HTTP status code | 성공(200), 실패(400)                                 |
   | Request Headers  | “Authorization”: 로그인할 때 받은 JWT Token (문자열) |
   | Request Body     |                                                      |
   | Response Body    | // likes에 좋아요 행 삭제                            |
   |                  |

### 장바구니 API

1.  **장바구니 담기 ➡️** 토큰값

    | HTTP Method      | POST                                                 |
    | ---------------- | ---------------------------------------------------- |
    | URI              | /carts                                               |
    | HTTP status code | 성공(201), 실패(400)                                 |
    | Request Headers  | “Authorization”: 로그인할 때 받은 JWT Token (문자열) |
    | Request Body     | { bookId: “도서 id”, quantity: “도서 수량” }         |
    | Response Body    |                                                      |

2.  **장바구니 조회 ➡️ 토큰값/ 장바구니에서 선택한 주문 상품 목록 조회** ➡️ 주문상품

    | HTTP Method      | GET                                                                                                                               |
    | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
    | URI              | /carts                                                                                                                            |
    | HTTP status code | 성공(200), 실패(400)                                                                                                              |
    | Request Headers  | “Authorization”: 로그인할 때 받은 JWT Token (문자열)                                                                              |
    | Request Body     | optional { selected: [ cartItemId, cartItemId, … ]}                                                                               |
    | Response Body    | { [id: “장바구니 도서 id”, bookId: “도서 id”, title: “도서 제목”, summary: “요약 정보”, quantity: “도서 수량”, price: “가격”], …} |

3.  **장바구니 삭제**

    | HTTP Method      | DELETE               |
    | ---------------- | -------------------- |
    | URI              | /carts/{cartItemId}  |
    | HTTP status code | 성공(200), 실패(400) |
    | Request Body     |                      |
    | Response Body    |                      |

### 결제(주문) API

1.  **결제 요청 (주문 = DB에 주문 INSERT, 장바구니에서 주문된 상품 DELETE)**
    회원정보를 알기위해 임시로 회원정보 req.body에 넣어주기
    | HTTP Method | POST |
    | --- | --- |
    | URI | /orders |
    | HTTP status code | 성공(200), 실패(400) |
    | Request Header | “Authorization”: 로그인할 때 받은 JWT Token (문자열) |
    | Request Body | { items: [장바구니 도서 id”, … ], delivery: { address: “주소”, recipient: “수령인”, contact: “전화번호” }, totalQuantity: 총 수량, totalPrice: 총 금액, mainBookTitle: “대표 도서 제목” } |
    | Response Body | |

        delivery ➡️ delivery, totalQuantity … ➡️ orders, items ➡️ orderedBook에 각각 INSERT 해주어야 함

        장바구니에서 주문된(결제된) 상품은 DELETE

2.  **주문 목록 조회 (GET)**

    | HTTP Method      | GET                                                                                                                                                                                       |
    | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | URI              | /orders                                                                                                                                                                                   |
    | HTTP status code | 성공(200), 실패(400)                                                                                                                                                                      |
    | Request Header   | “Authorization”: 로그인할 때 받은 JWT Token (문자열)                                                                                                                                      |
    | Request Body     | JWT (어떤 회원의 주문 목록 조회인지)                                                                                                                                                      |
    | Response Body    | [{ id: “주문 id”, createdAt: “주문 일자”, address: “주소”, recipient: “수령인”, contact: “전화번호” bookTitle: “대표 책 제목”, totalQuantity: “총 수량”, totalPrice: “총 결제 금액” }, …] |

3.  **주문 상세 상품 조회 (주문 상세)**

    | HTTP Method      | GET                                                                                              |
    | ---------------- | ------------------------------------------------------------------------------------------------ |
    | URI              | /orders/{bookId}                                                                                 |
    | HTTP status code | 성공(200), 실패(400)                                                                             |
    | Request Header   | “Authorization”: 로그인할 때 받은 JWT Token (문자열)                                             |
    | Request Body     |                                                                                                  |
    | Response Body    | [{ bookId: “도서 id”, title: “도서 제목”, author: “작가”, price: “가격”, quantity: “수량” }, … ] |

## 2️⃣ 예외 처리

API문서에 HTTP staus code에 성공과 실패시 리턴할 코드들을 명시하여 코드에 구현하였다. 또한, 예외가 발생할 수 있기 때문에 try/catch문으로 코드를 감싸서 예외처리를 하였다. 특히 authorization 외부 함수에서 authorization이 undefined로 리턴되는 예외를 처리하였다.

## 3️⃣ 유효성 검사

추가적으로 상위 폴더로 validator를 만들어서 user route에서 유효성 검사를 할 수 있도록 기능을 추가하였다. 회원가입, 로그인, 비밀번호초기화요청, 비밀번호 초기화 시, 이메일과 패스워드의 형식으로 잘 입력할 수 있도록 외부 모듈화하였다.

## 4️⃣ dotenv를 통한 환경변수 관리

. .env 파일에는 DB 연결 시 사용되는 port, user, password, DB이름 등을 모두 환경변수로 설정해주었다

## 5️⃣ 변수명 설정

res로 오는 JSON 객체의 변수명을 모두 camelCase로 교체하였다.
