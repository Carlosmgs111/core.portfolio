import {faker} from "@faker-js/faker";

export const generateOneUser =()=>({
  password:faker.internet.password(),
  email:faker.internet.email(),
  username: faker.internet.userName(),
})

// generate many fake users
export const generateManyUsers=(size=10)=>{
  const fakeUsers: any = [];
  for(let idx:number = 0; idx<size; idx++){
    fakeUsers.push(generateOneUser())
  }
  return [...fakeUsers]
}