export interface reviewSubject {
  name: string;
  name_display: string;
  questions_count: number;
  incorrect_answers: number[];
  correct_answers: number[];
  half_answers: number[];
}

export interface GetTestReview {
  review: boolean;
  testId: number;
  subjects: reviewSubject[];
}
