export type Review = {
  reviewId: string;
  bookingId: string;
  customerId: string;
  workerId: string;
  rating: number;
  feedback: string;
  createdAt: string;
};
export const REVIEWS_KEY='sahyogsetu_reviews';
export function readReviews(): Review[]{try{return JSON.parse(localStorage.getItem(REVIEWS_KEY)||'[]')}catch{return[]}}
export function hasReview(bookingId:string){return readReviews().some(r=>r.bookingId===bookingId)}
export function saveReview(review:Review){const bookings=(()=>{try{return JSON.parse(localStorage.getItem('sahyogsetu_bookings')||'[]')}catch{return[]}})();const b=bookings.find((x:any)=>x.id===review.bookingId);if(!b||b.status!=='COMPLETED')return false;const all=readReviews();if(all.some(r=>r.bookingId===review.bookingId))return false;const clean={...review,rating:Math.max(1,Math.min(5,Math.round(review.rating)))};all.unshift(clean);localStorage.setItem(REVIEWS_KEY,JSON.stringify(all));return true}
