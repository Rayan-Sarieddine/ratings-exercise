interface User {
  id: string;
  ratings: { [id: number]: number };
}
interface Item {
  id: string;
}
const users: User[] = [];

const quickSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }
  let pivot: number = arr[0];
  let left: number[] = [];
  let right: number[] = [];

  for (let i: number = 1; i < arr.length; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
};

const binarySearch = (arr: number[], target: number) => {
  let left: number = 0;
  let right: number = arr.length - 1;
  while (left <= right) {
    const mid: number = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return target;
    }
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
    return false;
  }
};

const averageRating = (x: User) => {
  let sum = 0;
  let counter = 0;
  for (const [key, value] of Object.entries(x.ratings)) {
    sum += value;
    counter++;
  }
  return sum / counter;
};

const summation = (user: User, arrOfCommonItems: number[]) => {
  let sum = 0;
  arrOfCommonItems.map((item) => {
    sum += user.ratings[item] - averageRating(user);
  });
  return sum;
};
const getSimilarityAlgorythm = (x: User, y: User) => {
  const commonItems: number[] = [];
  const sortedIdsForX: number[] = quickSort(
    Object.keys(x.ratings).map((key) => parseInt(key, 10))
  );
  const sortedIdsForY: number[] = quickSort(
    Object.keys(y.ratings).map((key) => parseInt(key, 10))
  );

  sortedIdsForX.map((id) => {
    const result = binarySearch(sortedIdsForY, id);
    if (result) {
      commonItems.push(result);
    }
  });
  const firstValue = summation(x, commonItems) - summation(y, commonItems);
  const secondValue =
    Math.sqrt(Math.pow(summation(x, commonItems), 2)) *
    Math.sqrt(Math.pow(summation(y, commonItems), 2));
  const result = firstValue / secondValue;
  return result;
};

const getSimilarUsers = (target: User, users: User[]) => {
  const similarUsers = users.filter((user) => {
    return Math.abs(getSimilarityAlgorythm(target, user)) > 0.5;
  });
  return similarUsers;
};

const getConstantK = (target: User, users: User[]) => {
  const similarUsers = getSimilarUsers(target, users);
  const firstValue = 1;
  let secondValue = 0;
  const sum = similarUsers.map((user) => {
    secondValue += getSimilarityAlgorythm(target, user);
  });
  return firstValue / secondValue;
};

const getExpectedRating = (users: User[], user: User, id: number) => {
  const firstValue = averageRating(user);
  const constant = getConstantK(user, users);
  let secondValue = 0;
  const sum = getSimilarUsers(user, users).map((user2) => {
    secondValue += getSimilarityAlgorythm(user2, user);
  });

  return firstValue + constant * secondValue;
};
