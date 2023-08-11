import { decodeJWTToken } from "../jwt";

describe("jwt token", () => {
  it("test valid token", () => {
    const token =
      "Bearer eyJraWQiOiIreEhuMjJTN3lPYTV1Um15K0xkSGR0STBBTTQ3UWE3R25QXC85MkJ0aUg0Yz0iLCJhbGciOiJSUzI1NiJ9.eyJjdXN0b206dHlwZSI6ImNvdW50ZXIiLCJzdWIiOiJiZDkwOTYwNy01M2FkLTQ1YjgtOTE4Ni05NjVhODdhMzJhMzUiLCJjdXN0b206YnJhbmNoX2lkIjoiMjMxNDAxMCIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTIuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0yX2lwekJCaWNERyIsImN1c3RvbTppZCI6IiMjIyNKYWlkZWVwIiwiY3VzdG9tOmJyYW5jaF9hZGRyZXNzIjoiV2hpdGxvdyBMYW5lLCBNb3VsdG9uLCBOb3J0aHdpY2gsIENoZXNoaXJlIiwiY29nbml0bzp1c2VybmFtZSI6IiMjIyNKYWlkZWVwIiwiY3VzdG9tOmJyYW5jaF9uYW1lIjoiTW91bHRvbiIsIm9yaWdpbl9qdGkiOiJlZDE0ODAwOS0yZGVkLTQyNGUtOGQwYS1mYjA1OTIyY2JkOTYiLCJhdWQiOiI3cGc3ZjB2NzI0bmdvMWE0OWRrZmg2ajhlMiIsImN1c3RvbTpub2RlX2lkIjoiNDQiLCJldmVudF9pZCI6ImIwOWFkYzk4LWNlYzEtNGNiYy1iMmViLWZlNDAwZjgzMWU0NiIsInRva2VuX3VzZSI6ImlkIiwiY3VzdG9tOmJyYW5jaF9wb3N0Y29kZSI6IkNXOSA4UU4iLCJjdXN0b206YnJhbmNoX3VuaXRfY29kZSI6IjE0NTQ2MSIsImF1dGhfdGltZSI6MTY3ODc2NzI5NSwiZXhwIjoxNjc4OTY2MDg1LCJpYXQiOjE2Nzg5NjI0ODUsImp0aSI6Ijc2ZjJmOTYxLWIxZWMtNDBiYi04NzBmLTUyYTMxNzUwMjUzMyJ9.QjHqFdRb0HN8hY5DyWMydEv6x_OTE5C9ZTPZdwudoD5xnz0huB7Ro_bv4GmHKLUtNSbOahKqnph7b1HVXWLsOQoY1IzZDyTLgAMVsNDbklF9Qru-6ktkD1hw0VofYdtjrHUZYz2adJjtDyeyqZ2ErQxcg4Ql-SCNX4cVvr6TJCvBOKK03Tf-h5ddIY2mg527hS8Od4dwWu60fgYYKMe_kLC755MT4GFbqXPWw3gRbbc4GGR2QXHOY9POln2pKcPS-VXp3IV6eiQIA8JQeDi9l5AHhHlCOGpDFh_nnZXWcK7mNwKW1dUf5pSKjsbGVQJ0wh6AXRoCZyq-ANW6Yfbs8A";
    const response = decodeJWTToken(token);
    expect(response).toEqual({
      aud: "7pg7f0v724ngo1a49dkfh6j8e2",
      auth_time: 1678767295,
      "cognito:username": "####Jaideep",
      "custom:branch_address": "Whitlow Lane, Moulton, Northwich, Cheshire",
      "custom:branch_id": "2314010",
      "custom:branch_name": "Moulton",
      "custom:branch_postcode": "CW9 8QN",
      "custom:branch_unit_code": "145461",
      "custom:id": "####Jaideep",
      "custom:node_id": "44",
      "custom:type": "counter",
      event_id: "b09adc98-cec1-4cbc-b2eb-fe400f831e46",
      exp: 1678966085,
      iat: 1678962485,
      iss: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_ipzBBicDG",
      jti: "76f2f961-b1ec-40bb-870f-52a317502533",
      origin_jti: "ed148009-2ded-424e-8d0a-fb05922cbd96",
      sub: "bd909607-53ad-45b8-9186-965a87a32a35",
      token_use: "id",
    });
  });

  it("test invalid token", () => {
    const token = null;
    const response = decodeJWTToken(token);
    expect(response).toEqual({});
  });
});
