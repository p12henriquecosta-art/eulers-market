console.log("Checking base64");
const mId = "merchant";
const key = "key";
console.log(Buffer.from(`${mId}:${key}`).toString('base64'));
