import * as ejs from 'ejs';

export function RenderEjsFile(filename: string, data: any) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(filename, data, {}, function (err, str) {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
}

export function calculateRating(ratings: {
  star_one: number;
  star_two: number;
  star_three: number;
  star_four: number;
  star_five: number;
}) {
  const totalRatings =
    ratings.star_one +
    ratings.star_two +
    ratings.star_three +
    ratings.star_four +
    ratings.star_five;
  if (totalRatings === 0) return 0;
  const weightedSum =
    ratings.star_one * 1 +
    ratings.star_two * 2 +
    ratings.star_three * 3 +
    ratings.star_four * 4 +
    ratings.star_five * 5;
  return Math.round(weightedSum / totalRatings);
}
