import bcrypt from "bcryptjs";

const SALT_ROUNDS = process.env.SALT_ROUNDS;
export async function hash(data) {
  try {
    const hash = bcrypt.hash(data, 10);
    return hash;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
export async function compare(string, hashString) {
  try {
    const isMatched = await bcrypt.compare(string, hashString);
    console.log(isMatched);
    return isMatched;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
